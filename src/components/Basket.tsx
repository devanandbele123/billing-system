import React, { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../app/store";
import { decrease, increase, clearCart, setQty } from "../features/cart/cartSlice";
import { applyOffer } from "../offers/applyOffers"; 
import { BasketProduct } from "../types";
import { Link } from "react-router-dom";
import '../styles/Basket.css'

const Basket: React.FC = () => {

  // Fetch products & cart data from Redux store
  const products = useSelector((s: RootState) => s.products);
  const cart = useSelector((s: RootState) => s.cart.items);
  const dispatch = useDispatch<AppDispatch>();

  // Convert cart object { id: qty } → array of full items
  // This array helps in offer calculations
  const basketProducts: BasketProduct[] = useMemo(
    () =>
      Object.entries(cart).map(([id, qty]) => {
        const prod = products.find((p) => p.id === id)!;
        return { id, name: prod.name, price: prod.price, qty };
      }),
    [cart, products]
  );

  // Subtotal before offers (simple price × qty total)
  const subtotalBeforeOffers = useMemo(
    () => basketProducts.reduce((acc, p) => acc + p.price * p.qty, 0),
    [basketProducts]
  );

  // For each line item, apply offer logic:
  // Returns:
  //   - offer: text (or "No offer")
  //   - savings: money saved
  //   - itemCost: cost after savings
  const itemized = useMemo(() => {
    return basketProducts.map((p) => {
      const res = applyOffer(p.id, p.qty, p.price, basketProducts);
      return { ...p, ...res };
    });
  }, [basketProducts]);

  // Total savings from all items
  const totalSavings = useMemo(
    () => itemized.reduce((acc, it) => acc + it.savings, 0),
    [itemized]
  );

  // Final total after subtracting savings
  const finalTotal = useMemo(
    () => Math.round((subtotalBeforeOffers - totalSavings + Number.EPSILON) * 100) / 100,
    [subtotalBeforeOffers, totalSavings]
  );

  // Checkout — simple simulation
  // Clears cart + success message
  const handleCheckout = () => {
    dispatch(clearCart());
    alert("Order placed — cart cleared.");
  };

  // If basket is empty → show empty page message
  if (basketProducts.length === 0) {
    return (
      <div className="container my-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h2 className="fw-bold text-primary mb-0">🛒 Your Basket</h2>
          <Link className="btn btn-outline-danger fw-bold" to="/">Add</Link>
        </div>

        <p className="text-muted mb-4">Review your items & savings</p>

        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "45vh" }}>
          <div className="empty-box text-center p-5 rounded-4 shadow-sm bg-white">
            <h4 className="fw-bold mb-3 text-secondary">Your basket is empty</h4>
            <Link className="btn btn-outline-primary btn-lg shadow-sm px-4" to="/">
              🛒 Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Main basket view (when items exist)
  return (
    <div className="container my-3 basket-page">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h2 className="fw-bold text-primary mb-0">🛒 Your Basket</h2>
        <Link className="btn btn-outline-danger fw-bold" to="/">🛒 Add</Link>
      </div>

      <p className="text-muted mb-4">Review your items & savings</p>
      <hr />

      <div className="basket-card shadow-lg rounded-4 p-4">

        {/* Item List */}
        {itemized.map((it) => (
          <div key={it.id} className="basket-item border-bottom pb-3 mb-3">

            <div className="d-flex justify-content-between align-items-center">
              {/* Item name + offer badge */}
              <div>
                <h5 className="fw-bold mb-1">{it.name}</h5>
                <p className="text-muted small mb-0">
                  {it.offer !== "No offer" && (
                    <span className="badge bg-warning text-dark">{it.offer}</span>
                  )}
                </p>
              </div>

              {/* Quantity controls */}
              <div className="qty-controller d-flex align-items-center">
                <button className="btn btn-outline-secondary btn-sm"
                  onClick={() => {
                    if (it.qty > 1) dispatch(decrease({ id: it.id, by: 1 }));
                    else dispatch(setQty({ id: it.id, qty: 0 }));
                  }}
                >
                  −
                </button>

                <span className="mx-3 fw-bold fs-5">{it.qty}</span>

                <button className="btn btn-outline-secondary btn-sm" onClick={() => dispatch(increase({ id: it.id }))}>
                  +
                </button>
              </div>
            </div>

            {/* Item price summary */}
            <p className="text-muted mt-2 mb-1">
              Price: £{it.price.toFixed(2)} × {it.qty} ={" "}
              <strong>£{(it.price * it.qty).toFixed(2)}</strong>
            </p>

            {/* Savings message */}
            {it.savings > 0 && (
              <p className="text-success fw-semibold mb-0">
                You saved £{it.savings.toFixed(2)} 🎉
              </p>
            )}

            {/* Final item cost after applying offer */}
            <p className="fw-bold mt-1">
              Item Total: <span className="text-success">£{it.itemCost.toFixed(2)}</span>
            </p>
          </div>
        ))}

        {/* Bill Summary */}
        <div className="summary-box bg-light p-4 rounded-4 shadow-sm mt-4">
          <h5 className="fw-bold mb-3">Bill Summary</h5>

          <div className="d-flex justify-content-between mb-2">
            <span className="fw-semibold">Subtotal (before offers):</span>
            <span>£{subtotalBeforeOffers.toFixed(2)}</span>
          </div>

          <div className="d-flex justify-content-between mb-2">
            <span className="fw-semibold">Total Savings:</span>
            <span className="text-danger">-£{totalSavings.toFixed(2)}</span>
          </div>

          <hr />

          <div className="d-flex justify-content-between fs-4 fw-bold">
            <span>Total:</span>
            <span className="text-success">£{finalTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Footer buttons */}
        <div className="mt-4 d-flex flex-column flex-md-row gap-3">
          <button className="btn btn-danger w-100" onClick={() => dispatch(clearCart())}>
            Empty Basket
          </button>

          <button className="btn btn-success w-100" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Basket;
