import Joi from "joi";

const putUser = Joi.object({
    userId : Joi.string().required(),
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    email: Joi.string().optional(),
    phone: Joi.string().optional().allow(""),
    profilePic: Joi.string().optional().allow(""),
    address: Joi.string().optional().allow(""),
    city: Joi.string().optional().allow(""),
    zipCode: Joi.number().optional().allow("")
}, "req.body");



export { putUser }