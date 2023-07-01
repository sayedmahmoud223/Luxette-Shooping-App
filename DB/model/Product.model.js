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
    size: {
        type: String,
        required: [true, 'size is required'],
        enum: ["sm", "lg", "xl"],
        default:"sm"
    },
    stock: {
        type: Number,
        default: 0,
        required: [true, "stock is required"],
        validate: {
            validator: function (value) {
                return value >= 0;
            },
            message: 'The field must be a positive Number.'
        }
    },
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
    // CategoryId: {
    //     type: Types.ObjectId,
    //     ref: "Category",
    //     required: [true, "productCategory is required"]
    // },
    mainImage: { type: Object, required: true },
    subImages: { type: [Object] },
    discount: { type: Number, default: 0 },
    finalPrice: { type: Number, required: true, default: 0 },
    colors: {
        type: [String],
        required: true
    },
    // createdBy: { type: Types.ObjectId, ref: "User", required: true },
    // updatedBy: { type: Types.ObjectId, ref: "User" },
    // wishList: [{ type: Types.ObjectId, ref: "User" }],
    isDeleted: { type: Boolean, default: false },
    customId: { type: String, required: true },

}, {
    timestamps:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})

export let productModel = mongoose.model.Product || model("Product", productSchema) 