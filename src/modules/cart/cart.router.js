import { Router } from "express";
import auth  from "../../middleware/auth.js";
import * as cartController from "./cart.controller.js"
import { cartRoles } from "./cart.endPoint.js";
import { asyncHandler } from "../../utils/errorHandling.js";
const router = Router()


router.get("/",asyncHandler(cartController.getCart))
router.post("/",auth(cartRoles.isUser),asyncHandler(cartController.addProductToCart))
router.patch("/:id",auth(cartRoles.isUser),asyncHandler(cartController.removeItem))
router.patch("/:id/removeitems",auth(cartRoles.isUser),asyncHandler(cartController.deleteCart))
router.patch("/:id/ChangeQty",auth(cartRoles.isUser),asyncHandler(cartController.ChangeQuantity))


export default router