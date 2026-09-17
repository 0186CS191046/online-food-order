import Joi from "joi";

const putUser = Joi.object({
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    email: Joi.string().optional(),
    phone : Joi.string().optional().allow(""),
    profile_pic: Joi.string().optional()
}, "req.body");



export {putUser}