import Joi from "joi";

const cartProductId = Joi.object({
    productId: Joi.string().required()
}, "body");

const updateCartItem = Joi.object({
    productId: Joi.string().required(),
    type : Joi.string().required()
}, "body");


export {cartProductId, updateCartItem}
