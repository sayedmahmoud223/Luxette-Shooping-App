import { Router } from "express";
import { usualFileUpload, usualFileValidation , } from "../../utils/multer.js";
import * as categoryController from "./controller/category.controller.js"
import { asyncHandler } from "../../utils/errorHandling.js";
const router = Router()




router.get('/',asyncHandler(categoryController.categoryList))

router.post("/",usualFileUpload(usualFileValidation.image).single('image'),asyncHandler(categoryController.createCategory))
router.patch("/:categoryId",usualFileUpload(usualFileValidation.image).single('image'),asyncHandler(categoryController.updateCategory))




export default router