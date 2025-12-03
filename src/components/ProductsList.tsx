import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../app/store";
import { increase, setQty } from "../features/cart/cartSlice";
import { Link } from "react-router-dom";
import { Product, BasketProduct } from "../types";
import { applyOffer } from "../offers/applyOffers";
import "../styles/ProductsList.css";

const ProductsList: React.FC = () => {
  // Fetch products from Redux store
  const products = useSelector((s: RootState) => s.products) as Product[];

  // Get cart items → { productId: quantity }
  const cartItems = useSelector((s: RootState) => s.cart.items);

  const dispatch = useDispatch<AppDispatch>();

  // Add product with quantity = 1
  const addToBasket = (id: string) => dispatch(setQty({ id, qty: 1 }));

  // Increase product quantity
  const increaseQty = (id: string) => dispatch(increase({ id, by: 1 }));

  // Decrease product quantity (never below 0)
  const decreaseQty = (id: string) => {
    const current = cartItems[id] ?? 0;
    dispatch(setQty({ id, qty: Math.max(0, current - 1) }));
  };

  // Convert products + cart quantities → Used for offer calculation
  const basketProducts: BasketProduct[] = products.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    qty: cartItems[p.id] ?? 0,
  }));

  return (
    <div className="container my-3">

      {/* PAGE HEADER */}
      <h2 className="fw-bold mb-4 products-header">PRODUCTS</h2>

      <hr className="mb-4" />

      <div className="row g-4">

        {/* LOOP THROUGH PRODUCTS */}
        {products.map((p) => {
          const qty = cartItems[p.id] ?? 0;

          // Calculate offers for the product
          const { offer, savings } = applyOffer(
            p.id,
            qty,
            p.price,
            basketProducts
          );

          // Show offer text if product has a valid offer
          const showOffer = offer && offer !== "No offer";

          // Show "Offer Applied" only when user adds the product
          const showAppliedOffer = qty > 0 && savings > 0;

          return (
            <div key={p.id} className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center">
              <div className="card shadow-lg product-card">

                {/* PRODUCT IMAGE */}
                {p.image && (
                  <img src={p.image} className="card-img-top product-card-img" alt={p.name}/>
                )}

                <div className="card-body p-3">

                  {/* PRICE + QTY BOX */}
                  <div className="d-flex justify-content-between align-items-center mb-2">

                    {/* PRODUCT PRICE */}
                    <h5 className="product-price">£{p.price.toFixed(2)}</h5>

                    {/* ADD BUTTON OR QTY CHANGER */}
                    {qty === 0 ? (
                      <button className="btn btn-danger fw-bold btn-add" onClick={() => addToBasket(p.id)}>
                        Add +
                      </button>
                    ) : (
                      <div className="qty-box border border-danger">

                        {/* Decrease */}
                        <button className="btn btn-light btn-sm qty-btn border-0 bg-transparent" onClick={() => decreaseQty(p.id)}>
                          −
                        </button>

                        {/* Quantity */}
                        <span className="mx-2 fw-bold">{qty}</span>

                        {/* Increase */}
                        <button className="btn btn-light btn-sm qty-btn border-0 bg-transparent" onClick={() => increaseQty(p.id)}>
                          +
                        </button>
                      </div>
                    )}
                  </div>

                  {/* STATIC OFFER (Shown even before adding product) */}
                  {showOffer && (
                    <div className="offer-tag">
                      🎁 {offer}
                    </div>
                  )}

                  {/* APPLIED OFFER (Shown only after adding product) */}
                  {showAppliedOffer && (
                    <div className="applied-offer-box">
                      <strong>✔ Offer Applied!</strong>
                      <br />
                      <span className="text-success">
                        You saved £{savings.toFixed(2)}
                      </span>
                    </div>
                  )}

                  {/* PRODUCT DETAILS */}
                  <h5 className="product-title mt-2">{p.name}</h5>
                  <p className="product-desc">{p.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* VIEW BASKET BUTTON */}
      <div className="d-grid gap-2 mt-4">
        <Link className="btn btn-primary shadow view-basket-btn" to={"/basket"}>
          View Basket 🛒
        </Link>
      </div>
    </div>
  );
};

export default ProductsList;
