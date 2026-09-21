import { Schema, model } from "mongoose";
import { USERTYPE } from "../utils/constant.js";
import { type } from "os";

const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        default: ""
    },
    profilePicPublicId: {  //for delete image from cloudinary
        type: String
    },
    role: {
        type: String,
        enum: [USERTYPE.USER, USERTYPE.RESTAURANT, USERTYPE.ADMIN],
        default: USERTYPE.USER
    },
    phone: {
        type: String
    },
    address: {
        type: String
    },
    city: {
        type: String
    },
    zipCode: {
        type: Number
    },
    state: {
        type: String
    },
    country: {
        type: String
    },
    resetPasswordToken : {
        type:String
    },
    resetPasswordExpires : {
        type:Date
    }
}, { timestamps: true })

const User = model("User",userSchema);

export default User;