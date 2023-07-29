import { nanoid } from "nanoid"
import cloudinary from "../../../utils/cloudinary.js"
import categoryModel from "../../../../DB/model/Category.model.js"
import { ResError } from "../../../utils/errorHandling.js"
import { ApiFeature } from "../../../utils/ApiFeatures.js"



export const categoryList = async (req, res, next) => {

   const mongooseQuery = new ApiFeature(categoryModel.find({}), req.query).paginate().filter().search().sort()
   const data = await mongooseQuery.mongooseQuery

   return res.status(200).json({ message: "Done", data })


}
export const createCategory = async (req, res, next) => {

   const { name } = req.body
   req.body.customId = nanoid(6)
   let { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, { folder: `luxxete/category/${req.body.customId}` })
   const data = await categoryModel.create(
      {
         name,
         customId: req.body.customId,
         image: { secure_url, public_id }
         // createdBy:req.user._id
      })
   return res.status(201).json({ message: "Success", data })

}
export const updateCategory = async (req, res, next) => {

   const { categoryId } = req.params
   const { name } = req.body
   console.log({ name });
   const data = await categoryModel.findById(categoryId)
   if (!data) {
      return next(new ResError("in-vaild category id ..", 400))
   }

   if (req.body.name) {
      data.name = req.body.name
   }
   if (req.file) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `luxxete/category/${data.customId}` })
      await cloudinary.uploader.destroy(data.image.public_id)
      data.image = { secure_url, public_id }
   }
   await data.save()
   return res.status(200).json({ message: "Success", data })

}