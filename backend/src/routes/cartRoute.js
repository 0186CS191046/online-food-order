import express from "express";
import { isAdmin, isAuthenticate, isUser } from "../middlewares/auth.js";
import { multipleUpload } from "../middlewares/multer.js";
import { addToCart,getAllCarts,updateCartQuantity,removeFromCart} from "../controllers/cartController.js";
import {cartProductId, updateCartItem} from "../validators/cartValidator.js"
import { validate } from "../middlewares/validate.js";
const router = express.Router();

router.get("/",isAuthenticate, isUser, getAllCarts);
router.post("/",isAuthenticate, validate(cartProductId), isUser, addToCart)
router.put("/update-item",isAuthenticate, isUser,validate(updateCartItem),  updateCartQuantity);
router.put("/remove-item",isAuthenticate, isUser, validate(cartProductId) ,removeFromCart);

export default router;