import { Schema, model } from "mongoose";

const restaurantSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref:"User" ,required:true},
    restaurantName: { type: String, required: true },
    phone : {
        type: String,
        required:true
    },
    address: {
        type: String,
        required:true
    },
    city: {
        type: String,
        required:true
    },
    zipcode: {
        type: Number,
        required:true
    },
    state: {
        type: String,
        required:true
    },
    country: {
        type: String,
        required:true
    },
    status:{
        type: Boolean,
        default:true
    }
}, { timestamps: true })

const Restaurant = model("Restaurant",restaurantSchema);

export default Restaurant;