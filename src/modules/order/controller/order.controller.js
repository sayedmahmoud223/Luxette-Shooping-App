import Stripe from "stripe"
import { cartModel } from "../../../../DB/model/Cart.model.js"
import { varinatModel } from "../../../../DB/model/Variants.model.js"
import { copounModel } from "../../../../DB/model/copoun.model.js"
import { orderModel } from "../../../../DB/model/order.model.js"
import { ResError } from "../../../utils/errorHandling.js"




export let createCashOrder = async (req, res, next) => {
    let { copounName, orderPrice } = req.body
    let cart = await cartModel.findOne({ _id: req.params.id })
    if (!cart) {
        return next(new ResError("cart not found"))
    }
    !cart.cartItems.length && next(new ResError("cart is empty"))
    console.log(cart.cartItems);
    let copoun;
    if (copounName) {
        copoun = await copounModel.findOne({ copounName })
        if (!copoun) {
            return next(new ResError("copoun not found"))
        }
    }
    console.log(copoun);
    orderPrice = cart?.finalPrice - (((copoun?.copounAmount || 0) / 100) * cart?.finalPrice)
    console.log(orderPrice);
    // console.log(orderPrice);
    await orderModel.create({
        userId: req.user._id,
        cartItems: cart.cartItems,
        finalPrice: cart.finalPrice,
        orderPrice,
        status: "placed",
        address: req.body
    })
    let extractVariantIds = cart.cartItems.map((ele) => {
        return ({
            updateOne: {
                filter: { _id: ele?.variantId },
                update: { $inc: { stock: -(ele.quantity) } }
            }
        })
    })
    await varinatModel.bulkWrite(extractVariantIds)
    cart.cartItems = []
    cart.save()
    return res.status(200).json({ message: "Success" })
}


export let sessionUrl = async (req, res, next) => {
    let { street, city, phone, copounName } = req.body
    let stripe = new Stripe(process.env.Secret_key)
    let cart = await cartModel.findOne({ _id: req.params.id }).populate("cartItems.productId")
    let copoun;
    if (copounName) {
        let findcopoun = await copounModel.findOne({ copounName })
        if (!findcopoun) {
            return next(new ResError("copoun not found"))
        }
        copoun = await stripe.coupons.create({ percent_off: findcopoun.copounAmount, duration: "once" })
        req.body.copounId = copoun.id
    }
    let session = await stripe.checkout.sessions.create({
        line_items: cart.cartItems.map((ele) => {
            return {
                price_data: {
                    unit_amount: ele.price * 100,
                    currency: "egp",
                    product_data: {
                        name: ele.productId.ProductName
                    }
                },
                quantity: ele.quantity
            }
        }),
        success_url: "https://paymob.com/en/about-us",
        cancel_url: "https://www.youtube.com/results?search_query=paymob+integration+in+node+js",
        mode: "payment",
        customer_email: req.user.email,
        metadata: { street, city, phone, cartId: req.params.id },
        discounts: req.body.copounId ? [{ coupon: req.body.copounId }] : []
    })
    res.json({ session })
}

export let webhook = async (req, res) => {
    const sig = req.headers['stripe-signature'].toString();

    let event;
    let stripe = new Stripe(process.env.Secret_key)
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.webhook_secret);
    } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }
    // Handle the event
    if (event.type == "checkout.session.completed") {
        return res.status(200).json({ message: "Success" })
    } else {
        console.log(`Unhandled event type ${event.type}`);
    }
    
    // Return a 200 res to acknowledge receipt of the event
    return res.status(200).json({ message: "Success" })

}
