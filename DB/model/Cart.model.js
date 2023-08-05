import mongoose, { Schema, Types, model } from "mongoose";

const cartSchema = new Schema({
    userId: { type: Types.ObjectId, ref: "User" },
    cartItems: [
        {
            productId: { type: Types.ObjectId, ref: "Product" },
            variantId: { type: Types.ObjectId, ref: "Variant" },
            quantity: { type: Number, default: 1 },
            color: String,
            size: String,
            price:Number,
            allPrice:Number
        }
    ],
    finalPrice: Number,
    allQuantity: { type: Number, default: 1 },
}, {
    timestamps: true
})

// cartSchema.pre(['find', 'findOne', 'findOneAndDelete', 'findOneAndUpdate', 'updateOne'], function (next) {
//     this.populate("cartItems.productId")
//     next()
// })

const cartModel = mongoose.model.Cart || model("Cart", cartSchema)

export {
    cartModel
}
