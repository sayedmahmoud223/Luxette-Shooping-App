import mongoose, { Schema, Types, model } from "mongoose";

const orderSchema = new Schema({
    userId: { type: Types.ObjectId, ref: "User" },
    cartItems: [
        {
            productId: { type: Types.ObjectId, ref: "Product" },
            quantity: { type: Number, default: 1 },
            color: String,
            size: String,
            price: Number
        }
    ],
    finalPrice: Number,
    orderPrice: Number,
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        phone: { type: String, required: true }
    },
    isPaid: { type: Boolean, required: false },
    status: { type: String, default: "pending", enum: ["pending", "placed"] },
    paymentMethod: { type: String, default: "Cash", enum: ["Cash", "Payment"] }
}, {
    timestamps: true
})

const orderModel = mongoose.model.Order || model("Order", orderSchema)

export {
    orderModel
}
