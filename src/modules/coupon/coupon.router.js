import { Router } from "express";
import * as copounController from "./controller/copoun.controller.js"
import { asyncHandler } from "../../utils/errorHandling.js";
const router = Router()

router.post("/", asyncHandler(copounController.createCopoun))
router.put("/", asyncHandler(copounController.updateCopoun))
router.patch("/", asyncHandler(copounController.deleteCopoun))
router.get("/", asyncHandler(copounController.getAllCopoun))

export default router