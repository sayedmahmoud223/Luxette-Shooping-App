
import { customAlphabet } from "nanoid"
import userModel from "../../../../DB/model/User.model.js"
import { generateToken, verifyToken } from "../../../utils/GenerateAndVerifyToken.js"
import { compare, hash } from "../../../utils/HashAndCompare.js"
import sendEmail from "../../../utils/email.js"
import { ResError } from "../../../utils/errorHandling.js"
import template_Email from "../../../utils/templateEmail.js"
import  {OAuth2Client}  from 'google-auth-library';

export const signUp =async(req,res,next)=>{
  const {userName , email , age , password}= req.body
    let checkUser = await userModel.findOne({email})
    if(checkUser) return next (new ResError("Email already exist",409))

    let token = generateToken({ payload:{email} ,signature:process.env.TOKEN_SIGNATURE ,expiresIn:60*30})
    let reftoken = generateToken({ payload:{email} ,signature:process.env.TOKEN_SIGNATURE ,expiresIn:60*60*24*30})
    let subject = "Confirm Eamil ... "
    let link  = `http://localhost:5000/auth/confirmEmail/${token}`
    let reflink  = `http://localhost:5000/auth/newConfirmEmail/${reftoken}`
    let html = template_Email(link , reflink)
    let info = await sendEmail({to:email ,subject ,html })
    if(!info)  return next (new ResError("Rejected Email " ,400))
  

    let result = new userModel({userName, email , age , password})
    await result.save();
    return res.status(201).json({message:"Done",result}) 
}


export const confirmEmail =async(req,res,next)=>{
    const token = req.params.token;
  
    const {email} = verifyToken({token:token ,signature:process.env.TOKEN_SIGNATURE});
  
    const user = await userModel.updateOne({email:email ,confirmEmail:false },{confirmEmail:true},{new:true});
    return user.modifiedCount? res.status(200).send('Go to login  ') : 
                                                                                          next (ResError("not register account",400)) 
   
  }


  export const newConfirmEmail = async (req,res,next)=>{
    const token = req.params.token;
    const{ email} = verifyToken({token:token ,signature:process.env.TOKEN_SIGNATURE})
    const newToken= generateToken({payload:{email} , signature:process.env.TOKEN_SIGNATURE ,expiresIn:60*1})
    const link= `${process.env.URL}/auth/confirmEmail/${newToken}`
    const refeshlink= `${process.env.URL}/auth/confirmEmail/${token}`
    const html= template_Email(link,refeshlink)
    // `<a href=${link}>click here to new confirm email</a> 
    // <br><br><br><br>  
    // <a href=${refeshlink}>click here to refresh confirm email</a>`
    const info= await sendEmail({to:email ,subject:"New Confirm Email" ,html})
    if(!info)
    {
      return next (new Error("Rejected Email ..." ,{cause:400}))
  
    }
    return res.status(200).send("Done please check your email ...")
  }
  

  export const login = async (req,res,next)=>{
    const {email,password}= req.body;
  const user =await userModel.findOne({email})
  if(!user )  
  {
    return next (new Error(' Not register account',{cause:404}))
  }
  if( !user.confirmEmail )   
 
  {
    return next (new Error('please confirm email first..',{cause:400}))
  }

 
  const match = compare({plaintext:password ,hashValue:user.password })
 
  if(!match )
  {
    return next(new ResError("in-valid password",400))
  }
  user.status="active"
  await user.save();

  const token= generateToken({payload:{id:user._id , email:user.email ,role:user.role },expiresIn:60*30})
  const refresh_Token= generateToken({payload:{id:user._id , email:user.email ,role:user.role},expiresIn:60*60*24*365})
  return res.status(202).json({ message: "Logged in successfully" , access_token : token ,access_refresh_Token:refresh_Token }); 
}

export const loginWithGamil = async(req,res,next)=>{
   const {idToken} = req.body
const client = new OAuth2Client(process.env.CLIENT_ID); // new OAuth2Client(CLIENT_ID)
async function verify() {
  const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
    return payload
  
} 
    const {email,email_verified,family_name,given_name,name,picture} = await verify()
    if(!email_verified)
    {
        return next(new ResError("Rejected Email",400))
    }

    const user= await userModel.findOne({email})
    if(user)
    {
        //login
        if(user.provider != "GOOGLE")
        {
        return next(new ResError("in-vaild provider",400))

        }
        const token= generateToken({payload:{id:user._id , email:user.email ,role:user.role },expiresIn:60*30})
        const refresh_Token= generateToken({payload:{id:user._id , email:user.email ,role:user.role},expiresIn:60*60*24*365})
        user.status="active"
         await user.save();
        return res.status(202).json({ message: "Logged in successfully" ,type:"Login" ,access_token : token ,access_refresh_Token:refresh_Token });

    }
    //signUp
    const customPassword =customAlphabet("qwertyiokgdafscvnop01235587946mnbvcxz",9)
    const hashPassword = hash({plaintext:customPassword()})
    const newUser = await userModel.create({
        firstName:given_name,
        lastName:family_name,
        image:{secure_url:picture},
        userName,
        email,
        password:hashPassword,
        provider:"GOOGLE",
        status:"active",
        confirmEmail:true
    })
    const token= generateToken({payload:{id:newUser._id , email:newUser.email ,role:newUser.role },expiresIn:60*30})
    const refresh_Token= generateToken({payload:{id:newUser._id , email:newUser.email ,role:newUser.role},expiresIn:60*60*24*365})
   
    return res.status(201).json({message:"Done",type:"signUp",access_token:token , refresh_Token})

     return res.status(200).json({message:"Done", payload})
}