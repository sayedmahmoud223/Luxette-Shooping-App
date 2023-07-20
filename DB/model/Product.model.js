import mongoose, { Schema, Types, model } from "mongoose"
import { variantSchema } from "./Variants.model.js"
let productSchema = new Schema({
    ProductName: {
        type: String,
        trim: true,
        required: [true, 'ProductName is required'],
        min: [2, 'minimum length 2 char'],
        max: [20, 'max length 2 char']
    },
    description: {
        type: String,
        trim: true,
        required: [true, 'ProductName is required'],
        min: [2, 'minimum length 2 char']
    },
    slug: { type: String, required: false },
    price: {
        type: Number,
        required: [true, 'price is required'],
        default: 0
    },
    productSeasonType: {
        type: String,
        required: [true, 'productSeasonType is required'],
        default: "SUMMER",
        enum: ["WINTER", "FALL", "SUMMER", "SPRING"]
    },
    productType: {
        type: String,
        required: [true, 'productSeasonType is required'],
        default: "Long sleeve",
        enum: [
            'Long sleeve',
            '3/4 sleeve',
            'Half sleeve',
            'Short sleeve',
            'Sleeveless',
            "Maxi dresses"
        ]
    },
    mainImage: { type: Object, required: true },
    mainColor: { type: String },
    variants: [{ type: Types.ObjectId, ref:"Variant"}],
    discount: { type: Number, default: 0 },
    finalPrice: { type: Number, required: true, default: 0 },
    // colors: {
    //     type: [String],
    //     required: true
    // },
    // createdBy: { type: Types.ObjectId, ref: "User", required: true },
    // updatedBy: { type: Types.ObjectId, ref: "User" },
    // wishList: [{ type: Types.ObjectId, ref: "User" }],
    isDeleted: { type: Boolean, default: false },
    customId: { type: String, required: true },

}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

productSchema.pre(['find', 'findOne', 'findOneAndDelete', 'findOneAndUpdate', 'updateOne'], function () {
    this.where({ isDeleted: false })
})

productSchema.pre(['find', 'findOne', 'findOneAndDelete', 'findOneAndUpdate', 'updateOne'], function (next) {
    this.populate("variants")
    next()
})

productSchema.virtual('stock').get(function () {
    let totalStock = 0;
    if (this.variants) {
        this.variants.forEach(variant => {
            if (variant.stock) {
                totalStock += variant.stock;
                console.log(variant.stock);
            }
        });
    }
    return totalStock;
});

productSchema.virtual("colors").get(function(){
    let colors = []
    if (this.variants) {
        this.variants.forEach(variant => {
            if (variant?.colorName? !colors.includes(variant.colorName): null) {
                colors.push(variant.colorName);
            }
        });
    }
    return colors
});

productSchema.virtual("sizes").get(function(){
    let sizes = []
    if (this.variants) {
        this.variants.forEach(variant => {
            if (variant?.size? !sizes.includes(variant.size): null) {
                sizes.push(variant.size);
            }
        });
    }
    return sizes
})


export let productModel = model("Product", productSchema) ||  mongoose.model.Product