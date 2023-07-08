import { Router } from "express";
import { asyncHandler } from "../../utils/errorHandling.js";
import * as productController from "../product/controller/product.controller.js"
import { fileUpload } from "../../utils/multer.js";
const router = Router()

router.get('/',asyncHandler(productController.getAllProduct))
router.post("/",fileUpload(5).fields([
    {name:"mainImage",maxCount:1},
    { name:"subImages",maxCount:5},

]),asyncHandler(productController.addProduct))


export default router