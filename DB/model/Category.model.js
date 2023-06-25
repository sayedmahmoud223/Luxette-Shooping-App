import mongoose, { Schema, Types, model } from "mongoose";

const categorySchema = new Schema({
    name:{type:String ,trim:true , required:true, min :2 , max:150 },
    slug:{type:String , required:true },
    image:{type:Object , required:true},
    createdBy:{type:Types.ObjectId ,ref:'User' ,required:true},
    updatedBy:{type:Types.ObjectId ,ref:'User' , required:true},
    isDeleted:{type:Boolean , default:false}
},{
    timestamps:true
})


const categoryModel = mongoose.model.Category || model("Category",categorySchema)

export default categoryModel