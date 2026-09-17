import express from "express";
import { isAdmin, isAuthenticate, isRestaurantUser } from "../middlewares/auth.js";
import { multipleUpload } from "../middlewares/multer.js";
import { createProduct, putProduct } from "../validators/productValidator.js";
import { addProduct, deleteProduct, getAllProducts, getAllProductsByRestaurantId, updateProduct } from "../controllers/productController.js";
import { validate } from "../middlewares/validate.js";
const router = express.Router();

// For admin
router.get("/all", getAllProducts);


router.post("/",isAuthenticate, isRestaurantUser , validate(createProduct), addProduct);
router.get("/:restaurantId", isAuthenticate, getAllProductsByRestaurantId)
router.put("/:productId",isAuthenticate, isRestaurantUser, validate(putProduct), updateProduct);
router.delete("/:productId", isAuthenticate, isRestaurantUser,deleteProduct);

export default router;