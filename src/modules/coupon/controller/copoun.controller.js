import { copounModel } from "../../../../DB/model/copoun.model.js"

export let createCopoun = async (req, res, next) => {
    let { days, copounName, copounAmount } = req.body
    const threeDaysInSeconds = days * 24 * 60 * 60; // 3 days in seconds
    const expirationDate = new Date();
    expirationDate.setSeconds(expirationDate.getSeconds() + threeDaysInSeconds);
    let data = await copounModel.create({
        copounName,
        copounAmount,
        expirationTime: expirationDate
    });
    return res.status(201).json({ message: "Success", data })
}

export let updateCopoun = async (req, res, next) => {
    let data = await copounModel.findOneAndUpdate({ copounName: req.body.copounName }, req.body, { new: true });
    return res.status(200).json({ message: "Success", data })
}

export let deleteCopoun = async (req, res, next) => {
    let data = await copounModel.findOneAndUpdate({ copounName: req.body.copounName }, { isDeleted: true }, { new: true });
    return res.status(200).json({ message: "Success", data })
}

export let getAllCopoun = async (req, res, next) => {
    let data = await copounModel.find();
    return res.status(200).json({ message: "Success", data })
}