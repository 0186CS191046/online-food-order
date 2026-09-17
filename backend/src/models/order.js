import { Schema, model } from "mongoose";

const orderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    restaurantId: {
        type: Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true
    },
    products: [
        {
            productId:
            {
                type: Schema.Types.ObjectId,
                ref: "Product",
                required: true

            },
            quantity:
            {
                type: Number,
                required: true,
                default: 1
            }
        }
    ],
    amount: {
        type: Number,
        required: true,
        default: 0
    },
    tax: {
        type: Number,
        required: true,
        default: 0
    },
    shipping: {
        type: Number,
        required: true,
        default: 0
    },
    currency: {
        type: String,
        required: true,
        default: "INR"
    },
    status: {
        type: String,
        enum: ["Pending", "Paid", "Failed"],
        default: "Pending"
    },
    // razorpay fields
    razorpayOrderId: {
        type: String
    },
    razorpayPaymentId: {
        type: String
    },
    razorpaySignature: {
        type: String
    }
}, { timestamps: true })

const Order = model("Order", orderSchema);

export default Order;