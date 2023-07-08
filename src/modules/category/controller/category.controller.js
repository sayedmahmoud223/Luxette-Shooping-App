import { nanoid } from "nanoid"
import cloudinary from "../../../utils/cloudinary.js"
import categoryModel from "../../../../DB/model/Category.model.js"
import { ResError } from "../../../utils/errorHandling.js"
import { ApiFeature } from "../../../utils/ApiFeatures.js"



export const categoryList = async(req,res,next)=>{
  
  const mongooseQuery = new ApiFeature(categoryModel.find({}),req.query).paginate().filter().search().sort()
  const categories = await mongooseQuery.mongooseQuery
 
 return res.status(200).json({message:"Done" , categories})


}
export const createCategory= async(req,res,next)=>{

    const {name} = req.body
    
    // if(!req.file)
    // {
    //       return next( new ResError("File is Required..",400)) 
    //     //  return next(new Error("File is Required.."),{cause:400}) 
    // }
    req.body.customId = nanoid(6) 
   let { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, { folder:`luxxete/category/${req.body.customId}` })
   const category = await categoryModel.create(
    {
    name, 
    customId:req.body.customId,
    image:{secure_url,public_id}
    // createdBy:req.user._id
   })
   return res.status(201).json({message:"Done", category})
    
}
export const updateCategory = async(req,res,next)=>{
 
    const {categoryId} = req.params
    const {name} = req.body
    console.log({name}); 
 const category = await categoryModel.findById(categoryId)
        if(!category)
        {
            return next (new ResError("in-vaild category id .." ,400))
        }
      
 if(req.body.name)
 {
    category.name = req.body.name
 }
 if(req.file)
 {
    const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{folder:`luxxete/category/${category.customId}`})
    await cloudinary.uploader.destroy(category.image.public_id)
    category.image = {secure_url,public_id}
 }
 await category.save()
 return res.status(200).json({message:"Done",category})

}