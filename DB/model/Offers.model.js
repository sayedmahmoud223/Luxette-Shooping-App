import mongoose, { Schema, Types, model } from "mongoose"

export let offersSchema = new Schema({
    offer:{
        type:String,
    },
    isDeleted:{type:Boolean, default:false}
}, {
    timestamps: true,
})


offersSchema.pre(['find', 'findOne', 'findOneAndDelete', 'findOneAndUpdate', 'updateOne'],function(){
    this.where({isDeleted: false})
})

export let offersModel = mongoose.model.Offers || model("Offers", offersSchema) 