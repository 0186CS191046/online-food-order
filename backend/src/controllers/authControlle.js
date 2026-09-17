import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import config from "../config/index.js";
import { errorResponse, successResponse } from "../utils/response.js";
import { staticMessages, STATUS_CODE, USERTYPE } from "../utils/constant.js"

export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role } = req.body;
        const allowedRoles = [USERTYPE.USER, USERTYPE.RESTAURANT];

        const userRole = allowedRoles.includes(role) ? role : USERTYPE.USER;
        if (!firstName || !lastName || !password || !email) {
            return res.status(STATUS_CODE.BAD_REQUEST).json(errorResponse(STATUS_CODE.BAD_REQUEST, staticMessages.MISSING_REQUIRED_FIELDS))
        };

        const checkUser = await User.findOne({ email });
        if (checkUser) {
            return res.status(STATUS_CODE.BAD_REQUEST).json(errorResponse(STATUS_CODE.BAD_REQUEST, staticMessages.ALREADY_EXISTS))
        }

        const hashPass = await bcrypt.hash(password, 10);
        const newUser = await User.create({ firstName, lastName, email, password: hashPass, role: userRole });

        await newUser.save();
        return res.status(STATUS_CODE.CREATED).json(successResponse(STATUS_CODE.CREATED, staticMessages.USER_CREATE))
    } catch (error) {
        console.log("Error registering user", error.message);
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json(errorResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, staticMessages.INTERNAL_SERVER_ERROR))
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(STATUS_CODE.BAD_REQUEST).json(errorResponse(STATUS_CODE.BAD_REQUEST, staticMessages.MISSING_REQUIRED_FIELDS))
        };

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(STATUS_CODE.BAD_REQUEST).json(errorResponse(STATUS_CODE.BAD_REQUEST, staticMessages.NOT_FOUND))
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(STATUS_CODE.BAD_REQUEST).json(errorResponse(STATUS_CODE.BAD_REQUEST, staticMessages.PASSWORD_DID_NOT_MATCH))
        }

        const accessToken = jwt.sign( { id: user._id, email, role:user.role }, config.jwt_secret_key, { expiresIn: "1d" });
        const refreshToken = jwt.sign( { id: user._id, email, role:user.role }, config.refresh_secret_key, { expiresIn: "7d" });

        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: false, sameSite: "Lax" });
        return res.status(STATUS_CODE.SUCCESS).json(successResponse(STATUS_CODE.SUCCESS, staticMessages.LOGIN_SUCCESS, { accessToken, refreshToken }))
    } catch (error) {
        console.log("Error logging user :", error.message);
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json(errorResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, staticMessages.INTERNAL_SERVER_ERROR))
    }
}

export const logout = async (req, res) => {
    try {
        const { id } = req.authUser;

        const checkuser = await User.findById(id);
        if (!checkuser) {
            return res.status(STATUS_CODE.BAD_REQUEST).json(errorResponse(STATUS_CODE.BAD_REQUEST, staticMessages.NOT_FOUND))
        };

        checkuser.token = "";
        await checkuser.save()
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });

        return res.status(STATUS_CODE.SUCCESS).json(successResponse(STATUS_CODE.SUCCESS, staticMessages.LOGOUT_SUCCESS))
    } catch (error) {
        console.log("Error in logout user :", error.message);
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json(errorResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, staticMessages.INTERNAL_SERVER_ERROR))
    }
};

export const getAccessToken = async (req, res) => {
    try {
        const userId = req.authUser.id;
        const findUser = await User.findOne({ _id: userId })
        if (!findUser) {
            return res.status(STATUS_CODE.BAD_REQUEST).json(errorResponse(STATUS_CODE.BAD_REQUEST, staticMessages.NOT_FOUND));
        };

        const accessToken = jwt.sign({ id: findUser._id }, config.jwt_secret_key, { expiresIn: "15m" });
        const refreshToken = jwt.sign({ id: findUser._id }, config.refresh_secret_key, { expiresIn: "7d" });

        findUser.isLoggedIn = true;
        await findUser.save();
        res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: "Lax", secure: false });
        return res.status(STATUS_CODE.SUCCESS).json(successResponse(STATUS_CODE.SUCCESS, "", { accessToken: accessToken, refreshToken: refreshToken }));
    } catch (error) {
        console.log("Error getting accessToken :", error.message);
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json(errorResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, staticMessages.INTERNAL_SERVER_ERROR));

    }
}

export const adminCreate = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body
        if (!firstName || !lastName || !email || !password) {
            return res.status(STATUS_CODE.BAD_REQUEST).json(errorResponse(STATUS_CODE.BAD_REQUEST, staticMessages.MISSING_REQUIRED_FIELDS))
        };

        const checkUser = await User.findOne({ email });
        if (checkUser) {
            return res.status(STATUS_CODE.BAD_REQUEST).json(errorResponse(STATUS_CODE.BAD_REQUEST, staticMessages.ALREADY_EXISTS))
        }

        const hashPass = await bcrypt.hash(password, 10);
        const newUser = await User.create({ firstName, lastName, email, password: hashPass, role: USERTYPE.ADMIN });

        await newUser.save();
        return res.status(STATUS_CODE.CREATED).json(successResponse(STATUS_CODE.CREATED, staticMessages.USER_CREATE))

    } catch (error) {
        console.log("Error logging user :", error.message);
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json(errorResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, staticMessages.INTERNAL_SERVER_ERROR));

    }
}