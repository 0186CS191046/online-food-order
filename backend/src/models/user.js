import { Schema, model } from "mongoose";
import { USERTYPE } from "../utils/constant.js";

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
    zipcode: {
        type: Number
    },
    state: {
        type: String
    },
    country: {
        type: String
    }
}, { timestamps: true })

const User = model("User",userSchema);

export default User;