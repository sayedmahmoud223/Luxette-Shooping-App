import userModel from "../../../../DB/model/User.model.js"
import {  ApiFeature } from "../../../utils/ApiFeatures.js"
import { ResError } from "../../../utils/errorHandling.js"

// for Admin

// export const createUser = async(req,res,next)=>{

//     let checkUser = await userModel.findOne({email:req.body.email})

//     if(checkUser){return next (new ResError("email already exist",409))}

//     let user = await userModel.create({
//         userName,
//         email,
//         password,

//     })
// }



export const getAllUsers = async(req,res,next)=>{
    let ApiFeature= new ApiFeature(userModel.find(),req.query).paginate().filter().search().select().sort()

    let results = await ApiFeature.mongooseQuery
    return res.status(200).json({message:"Done" , results})
}

export const getuser =async(req,res,next)=>{
    let result = await userModel.findById(req.params.id)
    if(!result) {res.next (new ResError("User Not Found",400))}
    return res.status(200).json({message:"Done", result})
}

export const updateUser = async(req,res,next)=>{
    
 

    let result = await userModel.findByIdAndUpdate({_id:req.params.id} , req.body,{new:true}) 

    if(!result)
    {
         return next(new ResError("User Not Found",400))
    }

    return res.status(200).json({message:"Done",result})
} 