import Joi from "joi";

const createRestaurant = Joi.object({
    restaurantName: Joi.string().required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    zipcode : Joi.string().required(),
    state: Joi.string().required(),
    country : Joi.required(),
    phone : Joi.required()
}, "body");



const putRestaurant = Joi.object({
    restaurantName: Joi.string().optional(),
    address: Joi.string().optional(),
    city: Joi.string().optional(),
    zipcode : Joi.string().optional(),
    state: Joi.string().optional(),
    country : Joi.optional(),
    phone : Joi.optional()
}, "body");



export {createRestaurant, putRestaurant}
