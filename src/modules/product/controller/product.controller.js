import categoryModel from "../../../../DB/model/Category.model.js";
import { ResError } from "../../../utils/errorHandling.js";
import cloudinary from "../../../utils/cloudinary.js"
import { nanoid } from "nanoid";
import { productModel } from "../../../../DB/model/Product.model.js";
import slugify from "slugify";
import { varinatModel } from "../../../../DB/model/Variants.model.js";

import { ApiFeature } from "../../../utils/ApiFeatures.js";



export const getAllProduct = async (req, res, next) => {
    const mongooseQuery = new ApiFeature(productModel.find({}).populate('category'), req.query).paginate().filter().search().sort()
    const data = await mongooseQuery.mongooseQuery.populate('category');
    return res.status(200).json({ message: "Success", data })
}




export let addProduct = async (req, res, next) => {
    let { ProductName, price } = req.body;
    req.body.slug = slugify(ProductName)
    req.body.finalPrice = Number.parseFloat(price - ((req.body.discount || 0) / 100) * price).toFixed(2);
    req.body.customId = nanoid(6)
    let { public_id, secure_url } = await cloudinary.uploader.upload(req.files.mainImage[0].path, { folder: `luxxete/products/mainImage/${req.body.customId}` })
    req.body.mainImage = { public_id, secure_url };
    if (req.files?.subImages?.length) {
        for (const image of req.files.subImages) {
            let { secure_url, public_id } = await cloudinary.uploader.upload(image.path, { folder: `luxxete/products/subImages/${req.body.customId}` })
            req.body.Colors.subImages.push({ secure_url, public_id })
        }
    }
    let product = await productModel.create(req.body)
    return res.status(201).json({ message: "Success", data: product })
}



export let addProductVariants = async (req, res, next) => {
    let { id } = req.params
    let product = await productModel.findOne({ _id: id })
    if (!product) {
        return next(new ResError("Product not found", 404))
    }
    if (req.files?.subImages?.length) {
        req.body.subImages = []
        for (const image of req.files.subImages) {
            let { secure_url, public_id } = await cloudinary.uploader.upload(image.path, { folder: `luxxete/products/subImages/${product.customId}/${req.body.colorName}` })
            req.body.subImages.push({ secure_url, public_id })
            console.log("Hello Mr Zaloma");
        }
    }
    console.log(req.body);
    let variant = await varinatModel.create(req.body)
    product.variants.push(variant._id);
    await product.save()
    return res.status(200).json({ message: "Success", data:product })
}

export let updateProductVariants = async (req, res, next) => {
    let { id, variantId } = req.params
    console.log(req.files);
    let product = await productModel.findOne({ _id: id })
    if (!product) {
        return next(new ResError("Product not found", 404))
    }

    let variant = await varinatModel.findOne({ _id: variantId })
    if (!variant) {
        return next(new ResError("variant not found", 404))
    }

    if (req.files?.subImages?.length) {
        if (variant?.subImages?.length) {
            console.log("hello3");
            await cloudinary.uploader.destroy(variant?.subImages?.map(ele => ele?.public_id))
        }
        variant.subImages = []
        console.log("hello1");
        for (const image of req.files.subImages) {
            let { secure_url, public_id } = await cloudinary.uploader.upload(image.path, { folder: `luxxete/products/subImages/${product.customId}` })
            console.log("hello2");
            console.log("hello4");
            variant.subImages.push({ secure_url, public_id })
        }
    }
    console.log("hello");
    await varinatModel.updateOne({ _id: variantId }, req.body)
    await variant.save()
    return res.status(200).json({ message: "Success" })
}


// export let updateProduct = async (req, res, next) => {

//     let { price, discount } = req.body
//     let { id } = req.params
//     let product = await productModel.findOne({ _id: id })
//     if (req.body.ProductName) {
//         req.body.slug = slugify(req.body.ProductName)
//     }
//     req.body.finalPrice = (price || discount) ? Number.parseFloat((price || product.price) - (((discount || product.discount) / 100) * (price || product.price))).toFixed(2) : product.finalPrice
//     if (req.files.mainImage) {
//         const mainImageProcess = await sharp(req.files.mainImage[0].buffer)
//             .resize(2000, 1333, {
//                 fit: "contain"
//             })
//             .jpeg()
//             .toBuffer()
//         const tempFilePath = `temp_mainImage`;
//         fs.writeFileSync(tempFilePath, mainImageProcess);
//         let { public_id, secure_url } = await cloudinary.uploader.upload(tempFilePath, { folder: `luxxete/products/mainImage/${product.customId}` })
//         await cloudinary.uploader.destroy(product.mainImage.public_id)
//         req.files.mainImage = { public_id, secure_url }
//         fs.unlinkSync(tempFilePath)
//         console.log(req.files.mainImage);
//     }
//     if (req.files?.subImages?.length) {
//         const subImagesIds = await Promise.all(
//             product.subImages.map(async (ele) => {
//                 return ele.public_id;
//             })
//         );
//         console.log(subImagesIds);
//         await cloudinary.api.delete_resources(subImagesIds, (err, res) => {
//             if (err) {
//                 console.log(err);
//             } else {
//                 console.log(res);
//             }
//         })
//         req.body.subImages = []
//         for (const image of req.files.subImages) {
//             const subImagesProcess = await sharp(image.buffer)
//                 .resize(1333, 1333, {
//                     fit: "contain"
//                 })
//                 .jpeg()
//                 .toBuffer()
//             const tempFilePath2 = `temp_subImages`;
//             fs.writeFileSync(tempFilePath2, subImagesProcess);
//             let { public_id, secure_url } = await cloudinary.uploader.upload(tempFilePath2, { folder: `luxxete/products/subImages/${product.customId}` })
//             req.body.subImages.push({ public_id, secure_url })
//             fs.unlinkSync(tempFilePath2)
//         }
//     }
//     let updatedProduct = await productModel.updateOne({ _id: id }, req.body, { new: true })
//     return res.status(200).json({ message: "success", updatedProduct })
// }
