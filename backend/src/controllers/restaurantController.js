import Restaurant from "../models/restaurants.js";
import cloudinary from "../utils/cloudinary.js";
import { staticMessages, STATUS_CODE } from "../utils/constant.js";
import getdataUri from "../utils/datauri.js";
import { errorResponse, successResponse } from "../utils/response.js";

export const addRestaurant = async (req, res) => {
    try {
        const { restaurantName, address, city, zipcode, state, country, phone } = req.body;
        const userId = req.authUser.id

        if (!restaurantName || !address || !city || !zipcode || !state || !country || !phone) {
            return res.status(STATUS_CODE.BAD_REQUEST).json(errorResponse(STATUS_CODE.BAD_REQUEST, staticMessages.MISSING_REQUIRED_FIELDS))
        }

        const newrestaurant = await Restaurant.create({
            restaurantName, address, city, zipcode, state, owner: userId, country, phone
        });

        return res.status(STATUS_CODE.CREATED).json(successResponse(STATUS_CODE.CREATED, staticMessages.RESTAURANT_CREATE))
    } catch (error) {
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json(errorResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, staticMessages.INTERNAL_SERVER_ERROR));
    }
}

export const getRestaurants = async (req, res) => {
    try {
        const userId = req.authUser.id
        const restaurants = await Restaurant.find({owner : userId});
        return res.status(STATUS_CODE.SUCCESS).json(successResponse(STATUS_CODE.SUCCESS, staticMessages.FOUND, {restaurants}))
    } catch (error) {
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json(errorResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, staticMessages.INTERNAL_SERVER_ERROR));
    }
};

export const updateRestaurant = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const {id} = req.authUser;
        const { restaurantName, address, city, zipcode, state } = req.body;
        const restaurant = await Restaurant.findOne({_id : restaurantId, owner : id});
        if (!restaurant) {
            return res.status(STATUS_CODE.NOT_FOUND).json(errorResponse(STATUS_CODE.NOT_FOUND, staticMessages.NOT_FOUND));
        };

        //update restaurant
        restaurant.restaurantName = restaurantName || restaurant?.restaurantName;
        restaurant.address = address || restaurant?.address;
        restaurant.city = city || restaurant?.city;
        restaurant.state = state || restaurant?.state;
        restaurant.zipcode = zipcode || restaurant?.category;


        await restaurant.save();
        return res.status(STATUS_CODE.SUCCESS).json(successResponse(STATUS_CODE.SUCCESS, staticMessages.RESTAURANT_UPDATE, {restaurant}));
    } catch (error) {
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json(errorResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, staticMessages.INTERNAL_SERVER_ERROR));
    }
};

export const deleteRestaurant = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const {id} = req.authUser;
        const checkRestaurant = await Restaurant.findOne({_id : restaurantId, owner:id});
        if (!checkRestaurant) {
            return res.status(STATUS_CODE.NOT_FOUND).json(errorResponse(STATUS_CODE.NOT_FOUND, staticMessages.NOT_FOUND));
        }

        if (checkRestaurant.RestaurantImg && checkRestaurant.RestaurantImg.length > 0) {
            for (let img of checkRestaurant.RestaurantImg) {
                await cloudinary.uploader.destroy(img.publicId)
            }
        }
        await Restaurant.findByIdAndDelete(restaurantId)
        return res.status(STATUS_CODE.SUCCESS).json(successResponse(STATUS_CODE.SUCCESS, staticMessages.DELETED));
    } catch (error) {
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json(errorResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, staticMessages.INTERNAL_SERVER_ERROR));
    }
};

export const getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find(); 
        return res.status(STATUS_CODE.SUCCESS).json(successResponse(STATUS_CODE.SUCCESS, staticMessages.FOUND, {restaurants}))
    } catch (error) {
        console.log("erro",error);
        
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json(errorResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, staticMessages.INTERNAL_SERVER_ERROR));
    }
};

export const getRestaurantById = async (req, res) => {
    try {
        const {restaurantId} = req.params;
        const restaurants = await Restaurant.findOne({_id : restaurantId});
        return res.status(STATUS_CODE.SUCCESS).json(successResponse(STATUS_CODE.SUCCESS, staticMessages.FOUND, {restaurants}))
    } catch (error) {
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json(errorResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, staticMessages.INTERNAL_SERVER_ERROR));
    }
};