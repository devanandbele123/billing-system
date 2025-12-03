// This function calculates:
//  - Item total after applying offer
//  - Savings amount
//  - Offer text message

import { BasketProduct, OfferResult } from "../types";

export const applyOffer = (
  productId: string,
  qty: number,
  price: number,
  basketProducts: BasketProduct[]
): OfferResult => {
  
  // Default values (no offer applied)
  let finalPrice = qty * price;
  let savings = 0;
  let offer = "No offer";

  // Helper: get quantity of another product from basket
  const getQty = (id: string) =>
    basketProducts.find((p) => p.id === id)?.qty ?? 0;

  // OFFER RULES FOR EACH PRODUCT
  switch (productId) {

    // SOUP → Buy 2 Get 1 Free
    // For every 3 soups → 1 soup is free
    case "Soup": {
      const freeSoups = Math.floor(qty / 3); // 1 free per group of 3
      savings = freeSoups * price;
      finalPrice = qty * price - savings;

      offer =
        freeSoups > 0
          ? `Buy 2 Get 1 Free (Free ${freeSoups})`
          : "Buy 2 Get 1 Free";

      break;
    }

    // MILK → Combo offer with Bread
    // (Discount is applied on Bread, not on Milk)
    case "Milk": {
      const milkQty = getQty("Milk");
      const breadQty = getQty("Bread");
      const combos = Math.min(milkQty, breadQty); // Number of valid combos

      offer =
        combos > 0
          ? `Combo: Milk + Bread (${combos})`
          : "Buy Bread to unlock combo discount";

      // Milk price doesn't change; discount applies on Bread side
      finalPrice = qty * price;
      savings = 0;
      break;
    }

    // BREAD → £0.10 off for each Milk + Bread combo
    // Example:
    //   Milk: 2  & Bread: 3  → combos = 2 → save 20p
    case "Bread": {
      const milkQty = getQty("Milk");
      const breadQty = getQty("Bread");
      const combos = Math.min(milkQty, breadQty);

      savings = combos * 0.1; // £0.10 per combo
      finalPrice = qty * price - savings;

      offer =
        combos > 0
          ? `Combo: Milk + Bread (${combos})`
          : "Buy Milk to unlock combo discount";

      break;
    }

    // BUTTER → Flat 5% discount
    case "Butter": {
      savings = qty * price * 0.05; // 5% off
      finalPrice = qty * price - savings;
      offer = "5% off Butter";
      break;
    }

    // Other products → No offer
    default:
      offer = "No offer";
      savings = 0;
      finalPrice = qty * price;
  }

  // Round values safely to 2 decimals (important for money)
  const round = (n: number) =>
    Math.round((n + Number.EPSILON) * 100) / 100;

  return {
    itemCost: round(finalPrice),
    savings: round(savings),
    offer,
  };
};
