import Joi from "joi";

const createRestaurant = Joi.object({
    restaurantName: Joi.string().required(),
    category:Joi.string().optional(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    zipCode : Joi.string().required(),
    state: Joi.string().required(),
    country : Joi.string().required(),
    phone : Joi.string().required(),
    email : Joi.string().optional(),
    startTime : Joi.string().optional(),
    endTime : Joi.string().optional(),
    description : Joi.string().optional(),
    images : Joi.array().items(Joi.string())
}, "body");



const putRestaurant = Joi.object({
    restaurantName: Joi.string().optional(),
    category:Joi.string().optional(),
    address: Joi.string().optional(),
    city: Joi.string().optional(),
    zipCode : Joi.string().optional(),
    state: Joi.string().optional(),
    country : Joi.string().optional(),
    phone : Joi.string().optional(),
    email : Joi.string().optional(),
    startTime : Joi.string().optional(),
    endTime : Joi.string().optional(),
    description : Joi.string().optional(),
    images : Joi.array().items(Joi.string())
}, "body");



export {createRestaurant, putRestaurant}
