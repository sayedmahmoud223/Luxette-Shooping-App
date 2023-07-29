import mongoose, { Schema, Types, model } from "mongoose";


export let variantSchema = new Schema({
    colorName: { type: String, enum: ['Black', 'Gray', 'White', 'Brown', 'Beige', 'Red', 'Pink', 'Orange', 'Yellow', 'Ivory', 'Green', 'Blue', 'Purple', 'Gold', 'Silver', 'Multi'], required: true },
    size: { type: String, enum: [ 'XS', 'S', 'M', 'L', 'XL', '2XL'], required: true },
    subImages: [Object],
    stock: Number
})

export let varinatModel = model("Variant", variantSchema) || mongoose.models.Variant  
