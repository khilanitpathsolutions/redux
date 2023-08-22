import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../container/home";
import Cart from "../container/cart";
import WishList from "../container/wishList";
import LoginPage from "../container/login";
import ProtectedRoute from "../utils/protectedRoutes";
import RegistrationPage from "../container/registration";
import PublicRoutes from "../utils/publicRoutes";
import ErrorPage from "../error";
import Product from "../container/product";

const Routing = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login/*" element={<PublicRoutes />}>
          <Route index element={<LoginPage />} />
        </Route>

        <Route path="/register/*" element={<PublicRoutes />}>
          <Route index element={<RegistrationPage />} />
        </Route>

        <Route path="/cart/*" element={<ProtectedRoute />}>
          <Route index element={<Cart />} />
        </Route>
        
        <Route path="/wishlist/*" element={<ProtectedRoute />}>
          <Route index element={<WishList />} />
        </Route>
        
        <Route path="/product/:item_id" element={<Product />} />

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Routing;
