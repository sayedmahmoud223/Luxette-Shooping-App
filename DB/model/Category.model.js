import mongoose, { Schema, Types, model } from "mongoose";

const categorySchema = new Schema({
    name:{type:String , required:true },
    // slug:{type:String , required:true },
    image:{type:Object , required:true},
    createdBy:{type:Types.ObjectId ,ref:'User' ,required:false},
    updatedBy:{type:Types.ObjectId ,ref:'User' , required:false},
    customId: { type: String },
    isDeleted:{type:Boolean , default:false}
},{
    timestamps:true
})


const categoryModel = mongoose.model.Category || model("Category",categorySchema)

export default categoryModel