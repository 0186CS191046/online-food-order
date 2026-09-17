import { Schema, model } from "mongoose";

const productSchema = new Schema({
    owner : { type: Schema.Types.ObjectId, ref:"User" ,required:true},
    restaurantId: { type: Schema.Types.ObjectId, ref:"Restaurant" ,required:true},
    productName: { type: String, required: true },
    productDesc: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    productImg: [
       {type :String, required:true}
    ],
    category: {  
        type: String
    }
}, { timestamps: true })

const Product = model("Product",productSchema);

export default Product;