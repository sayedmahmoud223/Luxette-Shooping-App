import mongoose, { Schema, Types, model } from "mongoose";

const copounSchema = new Schema({
    copounName: { type: String, required: true },
    copounAmount: { type: Number, required: true, default: 1 },
    expirationTime: { type: Date, index: { expireAfterSeconds: 0 } }, // TTL index on 'expirationTime'
    usedBy: [{type:Types.ObjectId, ref:"User"}],
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true
})

const copounModel = mongoose.model.Copoun || model("Copoun", copounSchema)

export {
    copounModel
}
