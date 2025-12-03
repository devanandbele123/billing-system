import { createSlice } from "@reduxjs/toolkit";
import { Products } from "./ProductsData"; // Import all products

// productsSlice
// - name: "products" → identifies the slice
// - initialState: Products (static product list)
// - reducers: {} → no actions needed because products never change
const productsSlice = createSlice({
  name: "products",
  initialState: Products,
  reducers: {}, // No reducers needed (read-only product list)
});

export default productsSlice.reducer;
