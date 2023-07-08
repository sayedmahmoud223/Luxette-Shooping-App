import categoryModel from "../../../../DB/model/Category.model.js";
import { ResError } from "../../../utils/errorHandling.js";
import cloudinary from "../../../utils/cloudinary.js"
import { nanoid } from "nanoid";
import { productModel } from "../../../../DB/model/Product.model.js";
import slugify from "slugify";
import { paginate } from "../../../utils/Paginate.js";
import { ApiFeature } from "../../../utils/ApiFeatures.js";



export const  getAllProduct = async (req,res,next)=>{

    const mongooseQuery = new ApiFeature(productModel.find({}),req.query).paginate().filter().search().select().sort()
     const products = await mongooseQuery.mongooseQuery
    
    return res.status(200).json({message:"Done" , products})

    // let {limit,skip}=  paginate(req.query.page,req.query.size)

    // let filterQuery={...req.query}
    // console.log(filterQuery);
    // let  dataInUrlNotNeeded= ['page','size','sort','search','fields','limit']
    // dataInUrlNotNeeded.forEach((key)=>{
    //     if(filterQuery[key])
    //     {
    //          delete filterQuery[key]
    //     }
    // })
    // console.log(filterQuery);

    // filterQuery = JSON.parse( JSON.stringify(filterQuery).replace(/(gt|gte|lte|lt|eq|in|nin)/g , match=>`$${match}` ))
    // console.log(filterQuery);
   

    // const mongooseQuery = productModel.find(filterQuery).limit(limit).skip(skip)
    // if(req.query.sort )
    // {
    //     mongooseQuery.sort(req.query.sort.replaceAll("," ," "))
    // }
    // if(req.query.search )
    // {
    //     mongooseQuery.find({
    //         $or:[
    //             {
    //                 ProductName:{$regex:req.query.search , $options:"i"}
    //             },
    //             {
    //                 description:{$regex:req.query.search , $options:"i"}
    //             },
    //             {
    //                 productType:{$regex:req.query.search , $options:"i"}
    //             },
    //             {
    //                 size:{$regex:req.query.search , $options:"i"}
    //             },
    //             {
    //                 productSeasonType:{$regex:req.query.search , $options:"i"}
    //             }
    //         ]
    //     })
    // }
    // if(req.query.fields)
    // {
    //     mongooseQuery.select(req.query.fields.replaceAll("," ," "))
    // }
    // const products = await mongooseQuery
    // console.log(req.query.sort);
    // return res.status(200).json({message:"Done" , products})
}


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