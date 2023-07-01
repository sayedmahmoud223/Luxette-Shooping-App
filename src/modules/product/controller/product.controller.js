import categoryModel from "../../../../DB/model/Category.model.js";
import { ResError } from "../../../utils/errorHandling.js";
import cloudinary from "../../../utils/cloudinary.js"
import { nanoid } from "nanoid";
import { productModel } from "../../../../DB/model/Product.model.js";
import slugify from "slugify";





export let addProduct = async (req, res, next) => {
    let { ProductName, price } = req.body;
    // if (!await categoryModel.findOne({_id: categoryId})){
    //     return next(new ResError("Category not found", 404))
    // }
    req.body.slug = slugify(ProductName)
    req.body.finalPrice = Number.parseFloat(price - ((req.body.discount || 0) / 100) * price).toFixed(2);
    req.body.customId = nanoid(6)
    let { public_id, secure_url } = await cloudinary.uploader.upload(req.files.mainImage[0].path, { folder: `luxxete/products/mainImage/${req.body.customId}` }, (err,res)=>{
        if (err) {
            console.log(err);
        }
    })
    56
    req.body.mainImage = { public_id, secure_url };
    req.body.subImages = [];
    if (req.files?.subImages?.length) {
        for (const image of req.files.subImages) {
            let { secure_url, public_id } = await cloudinary.uploader.upload(image.path, { folder: `luxxete/products/subImages/${req.body.customId}` })
            console.log("hello");
            req.body.subImages.push({ secure_url, public_id })
        }        
    }
    let product = await productModel.create(req.body)
    return res.status(201).json({ message: "Success", product })
}