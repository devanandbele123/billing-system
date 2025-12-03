import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartState } from "../../types";
import { loadCart, saveCart, clearCartStorage } from "../../app/localStorage";

// Load saved cart from localStorage, or create empty cart
const initialState: CartState = loadCart() ?? { items: {} };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {

    // Set quantity for a specific product
    setQty(state, action: PayloadAction<{ id: string; qty: number }>) {
      const { id, qty } = action.payload;

      // If qty is 0 or below → remove item from cart
      if (qty <= 0) {
        delete state.items[id];
      } else {
        state.items[id] = qty;
      }

      // Save updated cart to localStorage
      saveCart(state);
    },

    // Increase quantity of a product (default increase = 1)
    increase(state, action: PayloadAction<{ id: string; by?: number }>) {
      const { id, by = 1 } = action.payload;

      const currentQty = state.items[id] ?? 0;
      state.items[id] = currentQty + by; // Add quantity

      saveCart(state);
    },

    // Decrease quantity (remove item if qty goes to 0)
    decrease(state, action: PayloadAction<{ id: string; by?: number }>) {
      const { id, by = 1 } = action.payload;

      const currentQty = state.items[id] ?? 0;
      const newQty = currentQty - by;

      if (newQty <= 0) {
        delete state.items[id]; // remove item if qty is 0 or below
      } else {
        state.items[id] = newQty;
      }

      saveCart(state);
    },

    // 4️⃣ Clear the entire cart (used in Basket Page)
    clearCart(state) {
      state.items = {}; // empty all cart items
      clearCartStorage(); // clear localStorage
    },
  }, 
});

// Export actions so components can use them
export const { setQty, increase, decrease, clearCart } = cartSlice.actions;

// Export the reducer to add it inside the Redux store
export default cartSlice.reducer;
