import mongoose, { Schema, model } from "mongoose";
import { hash } from "../../src/utils/HashAndCompare.js";


const userSchema = new Schema({

    userName: {
        type: String,
        required: [true, 'userName is required'],
        min: [2, 'minimum length 2 char'],
        max: [20, 'max length 2 char']

    },
    email: {
        type: String,
        unique: [true, 'email must be unique value'],
        required: [true, 'userName is required'],
    },
    password: {
        type: String,
        required: [true, 'password is required'],
    },
    phone: {
        type: String,
    },
    role: {
        type: String,
        default: 'User',
        enum: ['User', 'Admin']
    },
    provider: {
        type: String,
        default: 'SYSTEM',
        enum: ['SYSTEM', 'FACEBOOK','GOOGLE']
    },

    age: {
        type:Number
    },
    active: {
        type: Boolean,
        default: false,
    },
    confirmEmail: {
        type: Boolean,
        default: false,
    },
    blocked: {
        type: Boolean,
        default: false,
    },
    image: String,
    DOB: String,
}, {
    timestamps: true
})

userSchema.pre('save',function () {
    
    this.password =hash({plaintext:this.password})
    // console.log(this);

    
})
userSchema.pre("findOneAndUpdate",function () {
    
    this._update.password = hash({plaintext:this._update.password})
    // console.log(this);
})
const userModel = model('User', userSchema)
export default userModel