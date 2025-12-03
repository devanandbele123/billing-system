import { CartState } from "../types";

// A fixed key used to store cart data
const CART_KEY = "cart_v1";

/**
 * Load cart data from localStorage.
 * Returns:
 *  - Parsed cart state if found
 *  - undefined if nothing stored or error occurs
 */
export const loadCart = (): CartState | undefined => {
  try {
    const savedCart = localStorage.getItem(CART_KEY);

    // If nothing stored yet → return undefined
    if (!savedCart) return undefined;

    // Convert JSON string → JS object
    return JSON.parse(savedCart) as CartState;
  } catch (error) {
    // If any error happens (invalid JSON, etc.) → ignore
    return undefined;
  }
};

/**
 * Save the current cart state into localStorage.
 */
export const saveCart = (state: CartState) => {
  try {
    const json = JSON.stringify(state); // Convert to string
    localStorage.setItem(CART_KEY, json); // Save it
  } catch (error) {
    // Ignore errors (e.g., storage full)
  }
};

/**
 * Remove all saved cart data from localStorage.
 */
export const clearCartStorage = () => {
  localStorage.removeItem(CART_KEY);
};
