import mongoose, { Schema, Types, model } from "mongoose";


export let variantSchema = new Schema({
    colorName: { type: String },
    subImages: [Object],
    size: String,
    stock: Number
})

export let varinatModel = model("Variant", variantSchema) || mongoose.models.Variant  
