import { cartModel } from "../../../DB/model/Cart.model.js"
import { productModel } from "../../../DB/model/Product.model.js";
import { ResError } from "../../utils/errorHandling.js"

// getCart
export const getCart = async (req, res, next) => {
    let Cart = await cartModel.findOne({})
    return res.status(201).json({ message: "Success", Cart })
}

// addProductToCart
export const addProductToCart = async (req, res, next) => {
    let { productId, color, size, quantity } = req.body
    let product = await productModel.findOne({ _id: req.body.productId }).populate("variants")
    if (!product) {
        return next(new ResError("Product Not Found", 404))
    }
    let { _id } = req.user
    let checkAvalabilty = product?.variants?.find((ele => {
        return (ele.colorName == color && ele.size == size && (ele.stock >= quantity || 1))
    }))
    console.log({checkAvalabilty});
    if (!checkAvalabilty) {
        return next(new ResError("Product Not Avalible", 400))
    }
    req.body.variantId = checkAvalabilty._id
    req.body.price = product.price
    req.body.allPrice = product.price
    let cart = await cartModel.findOne({ userId: _id })
    if (!cart) {
        req.body.finalPrice = product.price
        let createCart = await cartModel.create({
            userId: _id,
            cartItems: [
                req.body
            ],
            finalPrice: product.price
        })
        return res.status(201).json({ message: "Success", createCart })
    }
    cart.cartItem = []
    let cartItem = cart.cartItems.find((ele) => ele.productId == req.body.productId)
    // console.log(cartItem.quantity);
    // console.log((checkAvalabilty.stock > checkQuantity));
    if (cartItem) {
        let checkQuantity = cartItem.quantity
        if (checkAvalabilty.stock > checkQuantity) {
            cartItem.quantity += 1
            cartItem.price = product.price
            cartItem.allPrice = cartItem.quantity * product.price
        } else {
            return next(new ResError("quantity not avalible"))
        }
    } else {
        // req.body.cartItems.finalPrice = 
        cart.cartItems.push(req.body)
    }
    console.log(cart.cartItems[0].finalPrice);
    let finalPrice = cart?.cartItems?.reduce((accumulator, currentElement) => {
        return accumulator + currentElement.allPrice;
    }, 0);
    console.log(finalPrice);
    cart.finalPrice = finalPrice
    // cart.cartItems = req.body
    await cart.save()
    return res.status(201).json({ message: "Success", cart })
}

// ChangeQuantity
export const ChangeQuantity = async (req, res, next) => {
    let { quantity } = req.body
    let product = await productModel.findOne({ _id: req.body.productId })
    if (!product) {
        return next(new ResError("Product Not Found", 404))
    }
    let cart = await cartModel.findOne({ _id: req.params.id })
    if (!cart) {
        return next(new ResError("cart Not Found", 404))
    }
    let cartItem = cart.cartItems.find((ele) => ele.productId == req.body.productId)
    // console.log({cartItem});
    let checkAvalabilty = product?.variants?.find((ele => {
        return (ele.colorName == cartItem.color && ele.size == cartItem.size && ele.stock >= quantity)
    }))
    if (!checkAvalabilty) {
        return next(new ResError("Product Not Avalible", 404))
    }
    if (cartItem) {
        cartItem.quantity = quantity
        cartItem.price = product.price
        cartItem.allPrice = cartItem.quantity * cartItem.price
    }
    cart.finalPrice = cart?.cartItems?.reduce((accumulator, currentElement) => {
        return accumulator + currentElement.allPrice;
    }, 0);
    await cart.save()
    return res.status(201).json({ message: "Success", cart })
}

// remove item
export const removeItem = async (req, res, next) => {
    let { productId } = req.body
    let cart = await cartModel.findOneAndUpdate({ _id: req.params.id }, { $pull: { cartItems: { productId } } }, { new: true })
    console.log(cart);
    if (!cart) {
        return next(new ResError("Cart Not Found", 404))
    }
    return res.status(201).json({ message: "Success", cart })
}


// delete
export const deleteCart = async (req, res, next) => {
    let cart = await cartModel.findOneAndUpdate({ _id: req.params.id }, { $unset: { cartItems: [] } }, { new: true })
    console.log(cart);
    if (!cart) {
        return next(new ResError("Cart Not Found", 404))
    }
    return res.status(201).json({ message: "Success", cart })
}

