import Product from "../models/product.js";
import cloudinary from "../utils/cloudinary.js";
import { staticMessages, STATUS_CODE } from "../utils/constant.js";
import getdataUri from "../utils/datauri.js";
import { errorResponse, successResponse } from "../utils/response.js";

export const addProduct = async (req, res) => {
    try {
        const { restaurantId, productName, productDesc, price, category, productImg } = req.body;
        const userId = req.authUser.id

        if (!restaurantId || !productName || !productDesc || !price || !category || !productImg) {
            return res.status(STATUS_CODE.BAD_REQUEST).json(errorResponse(STATUS_CODE.BAD_REQUEST, staticMessages.MISSING_REQUIRED_FIELDS));
        }

        const newproduct = await Product.create({
            restaurantId, productName, productDesc, price:Number(price), category,
            productImg,
            owner: userId
        });
        return res.status(STATUS_CODE.CREATED).json(successResponse(STATUS_CODE.CREATED, staticMessages.PRODUCT_CREATED, { product: newproduct }))
    } catch (error) {
        console.log("err",error);
        
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json(errorResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, staticMessages.INTERNAL_SERVER_ERROR))
    }
}

export const getAllProductsByRestaurantId = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const products = await Product.find({ restaurantId });
        return res.status(STATUS_CODE.SUCCESS).json(successResponse(STATUS_CODE.SUCCESS, staticMessages.FOUND, {products}))
    } catch (error) {
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json(errorResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, staticMessages.INTERNAL_SERVER_ERROR))
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.authUser.id;
        const { productName, productDesc, price, category, existingImages, productImg } = req.body;
        const product = await Product.findOne({owner:userId,_id:productId});
        if (!product) {
            return res.status(STATUS_CODE.NOT_FOUND).json(errorResponse(STATUS_CODE.NOT_FOUND, staticMessages.NOT_FOUND))
        };

        //update product
        product.productName = productName || product?.productName;
        product.productDesc = productDesc || product?.productDesc;
        product.price = price || product?.price;
        product.category = category || product?.category;
        product.productImg = productImg;

        await product.save();
        return res.status(STATUS_CODE.SUCCESS).json(successResponse(STATUS_CODE.SUCCESS, staticMessages.PRODUCT_UPDATED, {product}))
    } catch (error) {
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json(errorResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, staticMessages.INTERNAL_SERVER_ERROR))
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.authUser.id
        const checkProduct = await Product.findOne({owner:userId , _id:productId});
        if (!checkProduct) {
            return res.status(STATUS_CODE.NOT_FOUND).json(errorResponse(STATUS_CODE.NOT_FOUND, staticMessages.NOT_FOUND))
        }

        await Product.findByIdAndDelete(productId)
        return res.status(STATUS_CODE.SUCCESS).json(errorResponse(STATUS_CODE.SUCCESS, staticMessages.PRODUCT_DELETED))
    } catch (error) {
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json(errorResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, staticMessages.INTERNAL_SERVER_ERROR))
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        return res.status(STATUS_CODE.SUCCESS).json(successResponse(STATUS_CODE.SUCCESS, staticMessages.FOUND, {products}))
    } catch (error) {
        console.log(error);
        
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json(errorResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, staticMessages.INTERNAL_SERVER_ERROR))
    }
};


export const getProductById = async(req,res) => {
    try {
        const {productId} = req.params;
        if(!productId){
            return res.status(STATUS_CODE.BAD_REQUEST).json(errorResponse(STATUS_CODE.BAD_REQUEST, staticMessages.MISSING_REQUIRED_FIELDS))
        }
         const product = await Product.findOne({_id:productId});
        return res.status(STATUS_CODE.SUCCESS).json(successResponse(STATUS_CODE.SUCCESS, staticMessages.FOUND, {product}))
    } catch (error) {
        console.log(error);
        
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json(errorResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, staticMessages.INTERNAL_SERVER_ERROR))

    }
}