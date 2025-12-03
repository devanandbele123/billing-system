// products here (Soup, Milk, Bread...)
export type ProductId =
  | "Soup"
  | "Milk"
  | "Bread"
  | "Butter"
  | "Cheese"
  | string;

// Product — basic product details
// This represents ONE item in the shop.
export interface Product {
  id: ProductId;      // unique identifier for each item
  name: string;       // product name (Bread, Milk, etc.)
  price: number;      // numeric price (e.g., 1.1 = £1.10)
  description?: string; // optional short text
  image?: string;       // optional product image
}

// CartState — data structure for items in the cart
// It stores product IDs and their quantities.
// Example: { items: { "Milk": 2, "Bread": 1 } }
export interface CartState {
  items: Record<string, number>;
}

// BasketProduct — product details after the user adds to basket
// This includes: name, price, and quantity selected.
export interface BasketProduct {
  id: string;     // product ID
  name: string;   // product name
  price: number;  // single-unit price
  qty: number;    // how many user added
}


// OfferResult — the output after applying an offer/discount
// This tells us:
// - final price after discount
// - how much was saved
// - which offer was applied
export interface OfferResult {
  itemCost: number; // total cost after offer
  savings: number;  // total savings
  offer: string;    // name/description of the offer
}
