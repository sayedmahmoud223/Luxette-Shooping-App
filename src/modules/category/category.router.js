import { Router } from "express";
import { fileUpload } from "../../utils/multer.js";
import * as categoryController from "./controller/category.controller.js"
import { asyncHandler } from "../../utils/errorHandling.js";
const router = Router()




router.get('/',asyncHandler(categoryController.categoryList))

router.post("/",fileUpload(5).single('image'),asyncHandler(categoryController.createCategory))
router.patch("/:categoryId",fileUpload(5).single('image'),asyncHandler(categoryController.updateCategory))




export default router