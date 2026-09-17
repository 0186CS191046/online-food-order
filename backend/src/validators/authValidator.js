import Joi from "joi";

const userCreate = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    phone: Joi.string().optional().allow(""),
    profile_pic: Joi.string().optional(),
    role: Joi.string().optional(),
}, "body");

const signIn = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
}, "body")


export { userCreate, signIn }