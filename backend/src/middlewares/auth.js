import config from "../config/index.js";
import jwt from "jsonwebtoken"
import User from "../models/user.js";
import { STATUS_CODE, USERTYPE, staticMessages } from "../utils/constant.js";
import {errorResponse } from "../utils/response.js";

export const isAuthenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(STATUS_CODE.BAD_REQUEST).json(errorResponse(STATUS_CODE.BAD_REQUEST, staticMessages.TOKEN_MISSING));
        }

        const token = authHeader.split(" ")[1];
        let decode;
        try {
            decode = jwt.verify(token, config.jwt_secret_key);
        } catch (error) {
            console.log("error",error);
            
            if (error.name == "TokenExpiredError") {
                return res.status(STATUS_CODE.BAD_REQUEST).json(errorResponse(STATUS_CODE.BAD_REQUEST, staticMessages.TOKEN_EXPIRED));
            }
            return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json(errorResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, staticMessages.TOKEN_VERIFICATION_FAILED));
        }
        const user = await User.findById(decode.id);
        if (!user) {
            return res.status(STATUS_CODE.BAD_REQUEST).json(errorResponse(STATUS_CODE.BAD_REQUEST, staticMessages.NOT_FOUND));
        }
        console.log("_______________");
        
        req.authUser = user;
        next()
    } catch (error) {
        console.log("Error in isAuthenticate middleware:", error.message);
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json(errorResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, staticMessages.INTERNAL_SERVER_ERROR));
    }
}

export const isAdmin = async (req, res, next) => {
    const user = req.authUser ;
    if (user.role !== USERTYPE.ADMIN) {
        return res.status(STATUS_CODE.FORBIDDEN).json(errorResponse(STATUS_CODE.FORBIDDEN, staticMessages.FORBIDDEN));
    }
    console.log("+++++++++++++++++++++++", user);
    
    next() ;
}

export const isUser = async (req, res, next) => {
    const user = req.authUser;
    if (user.role !== USERTYPE.USER) {
        return res.status(STATUS_CODE.FORBIDDEN).json(errorResponse(STATUS_CODE.FORBIDDEN, staticMessages.FORBIDDEN));
    }
    next();
}
export const isRestaurantUser = async (req, res, next) => {
    const user = req.authUser;
    console.log("++++++++++",user);
    

    if (user.role !== USERTYPE.RESTAURANT) {
        return res.status(STATUS_CODE.FORBIDDEN).json(errorResponse(STATUS_CODE.FORBIDDEN, staticMessages.FORBIDDEN));
    }
    next();
}

export const validateRefreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            return res.status(STATUS_CODE.BAD_REQUEST).json(errorResponse(STATUS_CODE.BAD_REQUEST, staticMessages.TOKEN_MISSING));
        }

        let decode;
        try {
            decode = jwt.verify(refreshToken, config.refresh_secret_key);
        } catch (error) {
            console.log("Error in validateRefreshToken middleware :", error.message);
            if (error.name == "TokenExpiredError") {
                return res.status(STATUS_CODE.BAD_REQUEST).json(errorResponse(STATUS_CODE.BAD_REQUEST, staticMessages.TOKEN_EXPIRED));
            }
            return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json(errorResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, staticMessages.TOKEN_VERIFICATION_FAILED));
        }
        const user = await User.findById(decode.id);
        if (!user) {
            return res.status(STATUS_CODE.BAD_REQUEST).json(errorResponse(STATUS_CODE.BAD_REQUEST, staticMessages.NOT_FOUND));
        }
        req.authUser = user
        next()
    } catch (error) {
        console.log("Error in validateRefreshToken :", error.message);
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json(errorResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, staticMessages.INTERNAL_SERVER_ERROR));
    }
}
