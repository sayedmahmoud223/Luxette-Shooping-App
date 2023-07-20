import { Router } from "express";
import * as orderController from "./controller/order.controller.js"
import {asyncHandler} from "../../utils/errorHandling.js"
import auth from "../../middleware/auth.js"
import { orderRoles } from "./order.endPoint.js";
const router = Router()




router.post("/:id", auth(orderRoles.isUser),asyncHandler(orderController.createCashOrder))
router.post("/:id/sessionUrl", auth(orderRoles.isUser),asyncHandler(orderController.sessionUrl))


export default router