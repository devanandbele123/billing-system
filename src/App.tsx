// App.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import ProductsList from "./components/ProductsList";
import Basket from "./components/Basket";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ProductsList />} />
      <Route path="/basket" element={<Basket />} />
    </Routes>
  );
};

export default App;
