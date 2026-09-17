import mongoose from "mongoose";
import config from "./index.js";

export const connectDB = async(req,res) =>{
    try {
        await mongoose.connect(config.mongodb_url);
        console.log("DB Connected successfully!");
        
    } catch (error) {
        console.error("Error connecting to DB :",error.message);
    }
};