import User from "../models/user.js";
import config from "../config/index.js";
import cloudinary from "../utils/cloudinary.js";
import { errorResponse, successResponse } from "../utils/response.js";
import { staticMessages, STATUS_CODE, USERTYPE } from "../utils/constant.js"


export const getAllUsers = async (req, res) => {
    try {
        const allusers = await User.find();
        return res.status(STATUS_CODE.SUCCESS).json(successResponse(STATUS_CODE.SUCCESS, staticMessages.FOUND, { users: allusers }))
    } catch (error) {
        console.log("Error getting all users :", error.message);
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json(errorResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, staticMessages.INTERNAL_SERVER_ERROR));
    }
}

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(id).select("-password -token -otp -otpExpiry ");
        if (!user) {
            return res.status(400).json({ success: false, message: "User not exists!" })
        }
        return res.status(STATUS_CODE.SUCCESS).json(successResponse(STATUS_CODE.SUCCESS, staticMessages.FOUND, {user : user}));
    } catch (error) {
        console.log("Error getting userById :", error.message);
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json(errorResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, staticMessages.INTERNAL_SERVER_ERROR));
    }
};

export const getSelfUser = async (req, res) => {
    try {
        const { id } = req.authUser;
        const user = await User.findById(id).select("-password -token -otp -otpExpiry ");
        if (!user) {
            return res.status(400).json({ success: false, message: "User not exists!" })
        }
        return res.status(STATUS_CODE.SUCCESS).json(successResponse(STATUS_CODE.SUCCESS, staticMessages.FOUND, {user : user}));
    } catch (error) {
        console.log("Error getting userById :", error.message);
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json(errorResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, staticMessages.INTERNAL_SERVER_ERROR));
    }
};

export const updateUser = async (req, res) => {
    try {
        const { firstName, lastName, phone, address, city, zipcode, role } = req.body;

        let user = await User.findById(req.authUser.id);
        if (!user) {
            return res.status(STATUS_CODE.BAD_REQUEST).json(errorResponse(STATUS_CODE.BAD_REQUEST, staticMessages.NOT_FOUND));
        }

        let profilePicUrl = user.profilePic;
        let profilePicPublicId = user.profilePicPublicId;

        if (req.file) {
            if (profilePicPublicId) {
                await cloudinary.uploader.destroy(profilePicPublicId)
            }

            const uploadResult = await new Promise((res, rej) => {
                const stream = cloudinary.uploader.upload_stream({
                    folder: "profiles"
                },
                    (error, result) => {
                        if (error) rej(error);
                        else { res(result) }
                    }
                );

                stream.end(req.file.buffer);
            })
            profilePicUrl = uploadResult.secure_url;
            profilePicPublicId = uploadResult.public_id

        }

        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.phone = phone || user.phone;
        user.address = address || user.address;
        user.city = city || user.city;
        user.zipcode = zipcode || user.zipcode;
        user.profilePic = profilePicUrl;
        user.profilePicPublicId = profilePicPublicId;
        user.role = role

        const updatedUser = await user.save();
        return res.status(STATUS_CODE.SUCCESS).json(successResponse(STATUS_CODE.SUCCESS, staticMessages.USER_UPDATE, updateUser));
    } catch (error) {
        console.log("Error updating user :", error.message);
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json(errorResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, staticMessages.INTERNAL_SERVER_ERROR));
    }
};
