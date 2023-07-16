import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export let addOfferSchema = joi.object({
    offer: joi.string().min(3).max(75).required()
})
export let updateOfferSchema = joi.object({
    offer: joi.string().min(3).max(75).required(),
    id: generalFields.id
})
export let deleteOfferSchema = joi.object({
    id: generalFields.id
})