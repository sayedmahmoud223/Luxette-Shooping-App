import { Router } from "express";
import { asyncHandler } from "../../utils/errorHandling.js";
import * as productController from "../product/controller/product.controller.js"
import { fileUpload } from "../../utils/multer.js";
const router = Router()


router.post("/",fileUpload(5).fields([
    {name:"mainImage",maxCount:1},
    { name:"subImages",maxCount:5},

]),asyncHandler(productController.addProduct))

router.get("/:id/variants", fileUpload(5).fields([
    { name: "mainImage", maxCount: 1 },
    { name: "subImages", maxCount: 5 },
]),
    asyncHandler(productController.addProductVariants)
)

router.patch("/:id/variants/:variantId", fileUpload(5).fields([
    { name: "mainImage", maxCount: 1 },
    { name: "subImages", maxCount: 5 },
]),productController.updateProductVariants)


router.put("/:id", fileUpload(5).fields([
    { name: "mainImage", maxCount: 1 },
    { name: "subImages", maxCount: 5 },
]),
    productController.updateProduct
)


export default router