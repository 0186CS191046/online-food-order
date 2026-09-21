import Joi from "joi";

const createProduct = Joi.object({
    restaurantId: Joi.string().required(),
    productName: Joi.string().required(),
    category: Joi.string().optional(),
    price : Joi.number().required(),
    productDesc: Joi.string().required(),
    productImg: Joi.array().items(Joi.string()).min(1).required()
}, "body");



const putProduct = Joi.object({
    restaurantName: Joi.string().optional(),
    productName: Joi.string().optional(),
    category: Joi.string().optional(),
    price : Joi.number().optional(),
    productDesc: Joi.string().optional(),
    productImg: Joi.array().items(Joi.string()).min(1).optional()
}, "body");



export {createProduct, putProduct}
