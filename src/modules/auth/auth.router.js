import { Router } from "express";
import * as authController from  "./controller/auth.controller.js"
import { asyncHandler } from "../../utils/errorHandling.js";
const router = Router()


router.post("/signup",asyncHandler(authController.signUp))
router.post("/login",asyncHandler(authController.login))
router.post("/loginWithGmail",asyncHandler(authController.loginWithGmail))
router.get("/confirmEmail/:token",asyncHandler(authController.confirmEmail))
router.get("/newConfirmEmail/:token",asyncHandler(authController.newConfirmEmail))



export default router