import express from "express";
import { isAdmin, isAuthenticate, isRestaurantUser } from "../middlewares/auth.js";
import { addRestaurant, deleteRestaurant, getRestaurants, updateRestaurant, getRestaurantById, getAllRestaurants } from "../controllers/restaurantController.js";
import { createRestaurant, putRestaurant } from "../validators/restaurantValidator.js";
import { validate } from "../middlewares/validate.js"
const router = express.Router();

// For Admin
router.get("/all", isAuthenticate, getAllRestaurants);

// For Restaurant
router.post("/", isAuthenticate, isRestaurantUser, validate(createRestaurant), addRestaurant);
router.get("/", isAuthenticate, isRestaurantUser, getRestaurants);
router.get("/:restaurantId", isAuthenticate, getRestaurantById);
router.put("/:restaurantId", isAuthenticate, isRestaurantUser, validate(putRestaurant), updateRestaurant);
router.delete("/:restaurantId", isAuthenticate, isRestaurantUser, deleteRestaurant);




export default router;