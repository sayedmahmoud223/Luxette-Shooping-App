import { Router } from "express";
import { fileUpload , fileValidation} from "../../utils/multer.js";
import * as categoryController from "./controller/category.controller.js"
import { asyncHandler } from "../../utils/errorHandling.js";
const router = Router()




router.get('/', (req ,res)=>{
    res.status(200).json({message:"Category Module"})
})

router.post("/",fileUpload(fileValidation.image).single('image'),asyncHandler(categoryController.createCategory))
router.patch("/:categoryId",fileUpload(fileValidation.image).single('image'),asyncHandler(categoryController.updateCategory))




export default router