import { createSlice } from "@reduxjs/toolkit";

const restaurantSlice = createSlice({
    name: "restaurant",

    initialState: {
        restaurants: [],
        products: [],
        cart: null,
        orders: [],
        addresses: [],
        selectedAddress: null
    },

    reducers: {

        setRestaurants: (state, action) => {
            state.restaurants = action.payload;
        },

        setProducts: (state, action) => {
            state.products = action.payload;
        },

        setCart: (state, action) => {
            state.cart = action.payload;
        },

        clearCart: (state) => {
            state.cart = null;
        },

        setOrders: (state, action) => {
            state.orders = action.payload;
        },

        addOrder: (state, action) => {
            state.orders.push(action.payload);
        },

        addAddress: (state, action) => {
            state.addresses.push(action.payload);
        },

        deleteAddress: (state, action) => {
            state.addresses = state.addresses.filter(
                (_, index) => index !== action.payload
            );

            if (state.selectedAddress === action.payload) {
                state.selectedAddress = null;
            }
        },

        setSelectedAddress: (state, action) => {
            state.selectedAddress = action.payload;
        }
    }
});

export const {
    setRestaurants,
    setProducts,
    setCart,
    clearCart,

    setOrders,
    addOrder,

    addAddress,
    deleteAddress,
    setSelectedAddress
} = restaurantSlice.actions;

// reducer export
export default restaurantSlice.reducer;