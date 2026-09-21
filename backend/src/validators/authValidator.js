import Joi from "joi";

const userCreate = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required().allow(""),
    email: Joi.string().required(),
    password: Joi.string().required(),
    phone: Joi.string().optional().allow(""),
    profile_pic: Joi.string().optional().allow(""),
    role: Joi.string().optional(),
    address : Joi.string().optional().allow(""),
    city : Joi.string().optional().allow(""),
    state : Joi.string().optional().allow(""),
    country : Joi.string().optional().allow("")
}, "body");

const signIn = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
}, "body")


export { userCreate, signIn }