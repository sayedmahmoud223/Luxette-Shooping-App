import mongoose, { Schema, Types, model } from "mongoose"
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
    category: {
        type: Types.ObjectId,
        ref: "Category",
        required: true
    },
    mainImage: { type: Object, required: true },
    mainColor: { type: String },
    variants: [{ type: Types.ObjectId, ref: "Variant" }],
    discount: { type: Number, default: 0 },
    finalPrice: { type: Number, required: true, default: 0 },
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
    this.populate([
        {
            path: "variants",
        },
        {
            path: "category",
        }
    ])
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


productSchema.virtual("colors").get(function () {
    let colors = []
    if (this.variants) {
        this.variants.forEach(variant => {
            if (variant?.colorName ? !colors.includes(variant.colorName) : null) {
                colors.push(variant.colorName);
            }
        });
    }
    return colors
});


productSchema.virtual("sizes").get(function () {
    let sizes = []
    if (this.variants) {
        this.variants.forEach(variant => {
            if (variant?.size ? !sizes.includes(variant.size) : null) {
                sizes.push(variant.size);
            }
        });
    }
    return sizes
})


export let productModel = model("Product", productSchema) || mongoose.model.Product











// // const variantSchema = new Schema({
// //     color: { type: String, enum: ['Black', 'Gray', 'White', 'Brown', 'Beige', 'Red', 'Pink', 'Orange', 'Yellow', 'Ivory', 'Green', 'Blue', 'Purple', 'Gold', 'Silver', 'Multi'], required: true },
// //     size: { type: String, enum: ['XXS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL'], required: true },
// //     image: String,
// //     sku: String,
// //     stock: { type: Number, required: true }
// // });

// // const variantsSchema = new Schema(
// //                 {
// //                     productId: { type: Types.ObjectId, ref: "Product", required: true },
// //                     variants: [variantSchema]
// //                 },
// //                 {
// //                     timestamps: true
// //                 }
// //             )