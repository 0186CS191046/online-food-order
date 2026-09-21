import Cart from "../models/cart.js";
import Product from "../models/product.js";
import { staticMessages, STATUS_CODE } from "../utils/constant.js";
import { errorResponse, successResponse } from "../utils/response.js";

export const getAllCarts = async (req, res) => {
    try {
        const userId = req.authUser.id;

        const cart = await Cart.findOne({ userId })
            .populate("items.productId")
            .populate("restaurantId");

        if (!cart) {
            return res.status(STATUS_CODE.SUCCESS).json(successResponse(STATUS_CODE.NOT_FOUND, staticMessages.FOUND, []));
        }
        return res.status(STATUS_CODE.SUCCESS).json(successResponse(STATUS_CODE.SUCCESS, staticMessages.FOUND, { cart }));
    } catch (error) {
        console.log("Error in getAllCarts:", error.message);
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json(errorResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, staticMessages.INTERNAL_SERVER_ERROR));
    }
};

export const addToCart = async (req, res) => {
    try {
        const userId = req.authUser.id;
        const { productId } = req.body;

        if (!productId) {
            return res.status(STATUS_CODE.BAD_REQUEST).json(errorResponse(STATUS_CODE.BAD_REQUEST, staticMessages.MISSING_REQUIRED_FIELDS));
        }
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(STATUS_CODE.NOT_FOUND).json(errorResponse(STATUS_CODE.NOT_FOUND, staticMessages.NOT_FOUND));
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = await Cart.create({
                userId,
                restaurantId: product.restaurantId,
                items: [
                    {
                        productId: product._id,
                        price: product.price,
                        quantity: 1,
                    },
                ],
                totalPrice: product.price,
            });
        } else {
            if (String(cart.restaurantId) !== String(product.restaurantId)) {
                return res.status(STATUS_CODE.BAD_REQUEST).json(errorResponse(STATUS_CODE.BAD_REQUEST, "You can add items from only one restaurant at a time!"));
            }

            const itemIndex = cart.items.findIndex(
                (item) => String(item.productId) === String(productId)
            );

            if (itemIndex !== -1) {
                cart.items[itemIndex].quantity += 1;
            } else {
                cart.items.push({
                    productId: product._id,
                    price: product.price,
                    quantity: 1,
                });
            }
            cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
            await cart.save();
        }

        const populatedCart = await Cart.findById(cart._id)
            .populate("items.productId")
            .populate("restaurantId");

        return res.status(STATUS_CODE.SUCCESS).json(successResponse(STATUS_CODE.SUCCESS, staticMessages.CART_ADD, {cart : populatedCart}))
    } catch (error) {
        console.log("Error in addToCart:", error.message);
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json(errorResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, staticMessages.INTERNAL_SERVER_ERROR));
    }
};

export const updateCartQuantity = async (req, res) => {
    try {
        const userId = req.authUser.id;
        const { productId, type } = req.body;

        if (!productId) {
            return res.status(STATUS_CODE.BAD_REQUEST).json(errorResponse(STATUS_CODE.BAD_REQUEST, staticMessages.MISSING_REQUIRED_FIELDS));
        }

        if (!["increase", "decrease"].includes(type)) {
            return res.status(STATUS_CODE.BAD_REQUEST).json(errorResponse(STATUS_CODE.BAD_REQUEST, staticMessages.CART_TYPE));
        }
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(STATUS_CODE.NOT_FOUND).json(errorResponse(STATUS_CODE.NOT_FOUND, staticMessages.NOT_FOUND));
        }

        const itemIndex = cart.items.findIndex((item) => String(item.productId) === String(productId));

        if (itemIndex === -1) {
            return res.status(STATUS_CODE.NOT_FOUND).json(errorResponse(STATUS_CODE.NOT_FOUND, staticMessages.ITEM_NOT_FOUND));
        }
        if (type === "increase") {
            cart.items[itemIndex].quantity += 1;
        }
        if (type === "decrease") {
            cart.items[itemIndex].quantity -= 1;
            if (cart.items[itemIndex].quantity <= 0) {
                cart.items.splice(itemIndex, 1);
            }
        }
        cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
        await cart.save();
        const populatedCart = await Cart.findById(cart._id)
            .populate("items.productId")
            .populate("restaurantId");

        return res.status(STATUS_CODE.SUCCESS).json(successResponse(STATUS_CODE.SUCCESS, staticMessages.CART_UPDATE, {cart : populatedCart}))
    } catch (error) {
        console.log("Error in updateCartQuantity:", error.message);
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json(errorResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, staticMessages.INTERNAL_SERVER_ERROR));
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const userId = req.authUser.id;
        const { productId } = req.body;

        if (!productId) {
            return res.status(STATUS_CODE.BAD_REQUEST).json(errorResponse(STATUS_CODE.BAD_REQUEST, staticMessages.MISSING_REQUIRED_FIELDS));
        }
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(STATUS_CODE.NOT_FOUND).json(errorResponse(STATUS_CODE.NOT_FOUND, staticMessages.NOT_FOUND));
        }
        const itemExists = cart.items.some((item) => String(item.productId) === String(productId));

        if (!itemExists) {
            return res.status(STATUS_CODE.NOT_FOUND).json(errorResponse(STATUS_CODE.NOT_FOUND, staticMessages.NOT_FOUND));
        }

        cart.items = cart.items.filter((item) => String(item.productId) !== String(productId));

        cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
        await cart.save();
        const populatedCart = await Cart.findById(cart._id)
            .populate("items.productId")
            .populate("restaurantId");

        return res.status(STATUS_CODE.SUCCESS).json((successResponse(STATUS_CODE.SUCCESS, staticMessages.PRODUCT_REMOVED, { cart: populatedCart })))
    } catch (error) {
        console.log("Error in removeFromCart:", error.message);
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json(errorResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, staticMessages.INTERNAL_SERVER_ERROR)
        );
    }
};