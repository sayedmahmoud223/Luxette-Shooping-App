import { offersModel } from "../../../../DB/model/Offers.model.js";
import { ResError } from "../../../utils/errorHandling.js";


export let getOffers = async (req, res, next) => {
    let Offers = await offersModel.find()
    return res.status(200).json({ message: "Success", Offers })
}

export let addOffer = async (req, res, next) => {
    let { offer } = req.body;
    let newOffer = await offersModel.create({
        offer
    })
    return res.status(201).json({ message: "Success", newOffer })
}

export let updateOffer = async (req, res, next) => {
    let { offer } = req.body;
    let { id } = req.params;
    let newOffer = await offersModel.findOneAndUpdate({ _id: id }, { offer }, { new: true })
    if (!newOffer) {
        return next(new ResError("not found to update", 404))
    }
    return res.status(200).json({ message: "Success", newOffer })
}

export let deleteOffer = async (req, res, next) => {
    let { id } = req.params;
    let deletedOffer = await offersModel.findOneAndUpdate({ _id: id }, { isDeleted: true }, { new: true })
    if (!deletedOffer) {
        return next(new ResError("not found to update", 404))
    }
    return res.status(200).json({ message: "Success", deletedOffer })
}