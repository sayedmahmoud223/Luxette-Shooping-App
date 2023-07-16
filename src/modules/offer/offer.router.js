import { Router } from "express";
import * as offerController from "./controller/offer.controller.js"
import { addOfferSchema, deleteOfferSchema, updateOfferSchema } from "./offer.validation.js";
import { validation } from "../../middleware/validation.js";
const router = Router()




router.get('/', (req ,res)=>{
    res.status(200).json({message:"offer Module"})
})

router.get('/alloffers' ,offerController.getOffers)
router.post('/', validation(addOfferSchema),offerController.addOffer)
router.put('/:id',validation(updateOfferSchema) , offerController.updateOffer)
router.patch('/:id', validation(deleteOfferSchema),offerController.deleteOffer)


export default router