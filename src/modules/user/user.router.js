import { Router } from "express";
import * as  userController from "./controller/user.controller.js"
import { asyncHandler } from "../../utils/errorHandling.js";
const router = Router()

router.get("/",asyncHandler(userController.getAllUsers))
router.get("/:id",asyncHandler(userController.getuser))
router.patch("/:id",asyncHandler(userController.updateUser))






export default router