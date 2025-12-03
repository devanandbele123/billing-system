// This file creates the main Redux store.
// It combines all reducers and makes them available to the app.

import { configureStore } from "@reduxjs/toolkit";

// Your feature reducers
import cartReducer from "../features/cart/cartSlice";
import productsReducer from "../features/products/productsSlice";

// Create the Redux store
// All slices are added inside `reducer: { }`
export const store = configureStore({
  reducer: {
    cart: cartReducer,       // Handles everything related to cart
    products: productsReducer // Handles products list
  },
});


// RootState = entire Redux state structure
export type RootState = ReturnType<typeof store.getState>;

// AppDispatch = type for dispatch() function
export type AppDispatch = typeof store.dispatch;
