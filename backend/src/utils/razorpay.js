import Razorpay from "razorpay";
import config from "../config/index.js";

const razorpayInstance = new Razorpay({
    key_id : config.razorpay_api_key,
    key_secret:config.razorpay_api_secret
});

export default razorpayInstance;