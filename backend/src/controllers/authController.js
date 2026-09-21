import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import config from "../config/index.js";
import { errorResponse, successResponse } from "../utils/response.js";
import { staticMessages, STATUS_CODE, USERTYPE } from "../utils/constant.js"
import Restaurant from "../models/restaurants.js";
import { sendForgotPasswordEmail } from "../utils/sendMail.js";
import { generateRandomPassword } from "../utils/orderId.js";
import crypto from "crypto";

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
            return res.status(STATUS_CODE.BAD_REQUEST).json(errorResponse(STATUS_CODE.BAD_REQUEST, staticMessages.INCORRECT_PASSWORD))
        }

        const accessToken = jwt.sign({ id: user._id, firstName: user.firstName, email, role: user.role }, config.jwt_secret_key, { expiresIn: "1d" });
        const refreshToken = jwt.sign({ id: user._id, firstName: user.firstName, email, role: user.role }, config.refresh_secret_key, { expiresIn: "7d" });

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

export const changedPassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;
        const { email } = req.authUser;
        if (!oldPassword || !newPassword || !confirmPassword) {
            return res.status(STATUS_CODE.BAD_REQUEST).json(errorResponse(STATUS_CODE.BAD_REQUEST, staticMessages.MISSING_REQUIRED_FIELDS))
        };

        const checkUser = await User.findOne({ email });
        if (!checkUser) {
            return res.status(STATUS_CODE.NOT_FOUND).json(errorResponse(STATUS_CODE.NOT_FOUND, staticMessages.NOT_FOUND))
        }

        const isCorrect = await bcrypt.compare(oldPassword, checkUser.password);
        if (!isCorrect) {
            return res.status(STATUS_CODE.BAD_REQUEST).json(errorResponse(STATUS_CODE.BAD_REQUEST, staticMessages.INCORRECT_PASSWORD))
        }
        if (newPassword !== confirmPassword) {
            return res.status(STATUS_CODE.BAD_REQUEST).json(errorResponse(STATUS_CODE.BAD_REQUEST, staticMessages.PASSWORD_NOT_MATCHED))
        }
        checkUser.password = await bcrypt.hash(newPassword, 10);

        await checkUser.save();
        return res.status(STATUS_CODE.SUCCESS).json(successResponse(STATUS_CODE.SUCCESS, staticMessages.PASSWORD_CHANGED_SUCCESS))

    } catch (error) {
        console.log("Error logging user :", error.message);
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json(errorResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, staticMessages.INTERNAL_SERVER_ERROR));

    }
}

export const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(STATUS_CODE.BAD_REQUEST).json(errorResponse(STATUS_CODE.BAD_REQUEST, staticMessages.MISSING_REQUIRED_FIELDS))
        };

        const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

const user = await User.findOne({
    resetPasswordToken: hashedToken,
});

console.log("Incoming token:", token);
console.log("Hashed token:", hashedToken);
console.log("User by token:", user);

if (user) {
    console.log("Stored token:", user.resetPasswordToken);
    console.log("Expiry:", user.resetPasswordExpires);
    console.log("Current time:", new Date());
    console.log(
        "Is expired:",
        user.resetPasswordExpires <= new Date()
    );
}

        if (!user) {
            return res.status(STATUS_CODE.NOT_FOUND).json(errorResponse(STATUS_CODE.NOT_FOUND, staticMessages.INVALID_OR_EXPIRED))
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;

        await user.save();
        return res.status(STATUS_CODE.SUCCESS).json(successResponse(STATUS_CODE.SUCCESS, staticMessages.RESET_SUCCESS))

    } catch (error) {
        console.log("Error logging user :", error.message);
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json(errorResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, staticMessages.INTERNAL_SERVER_ERROR));

    }
}

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(STATUS_CODE.BAD_REQUEST).json(errorResponse(STATUS_CODE.BAD_REQUEST, staticMessages.MISSING_REQUIRED_FIELDS))
        };

        const checkUser = await User.findOne({ email });
        if (!checkUser) {
            return res.status(STATUS_CODE.NOT_FOUND).json(errorResponse(STATUS_CODE.NOT_FOUND, staticMessages.NOT_FOUND))
        }
        const resetToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");


        checkUser.resetPasswordToken = hashedToken;
        checkUser.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
        await checkUser.save();
        console.log("resetToken", resetToken);

        await sendForgotPasswordEmail(email, resetToken);

        return res.status(STATUS_CODE.SUCCESS).json(successResponse(STATUS_CODE.SUCCESS, staticMessages.PASSWORD_RESET_LINK))

    } catch (error) {
        console.log("Error logging user :", error.message);
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json(errorResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, staticMessages.INTERNAL_SERVER_ERROR));

    }
}