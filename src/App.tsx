import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "./pages/home/Home"
import ProductsPage from "./pages/products/ProductsPage"
import ProductPage from "./pages/products/ProductPage"
import CartPage from "./pages/cart/CartPage"
import WishlistPage from "./pages/wishlist/WishlistPage"
import ProfilePage from "./pages/profile/ProfilePage"
import LoginPage from "./pages/auth/LoginPage"
import RegisterPage from "./pages/auth/RegisterPage"

import CheckoutPage from "./pages/checkout/CheckoutPage"
import OrdersPage from "./pages/orders/OrdersPage"

import MainLayout from "./layouts/MainLayout"

export default function App(){

  return(

    <BrowserRouter>

      <MainLayout>

        <Routes>

          <Route path="/" element={<Home />} />

          <Route path="/products" element={<ProductsPage />} />

          <Route path="/product/:id" element={<ProductPage />} />

          <Route path="/cart" element={<CartPage />} />

          <Route path="/checkout" element={<CheckoutPage />} />

          <Route path="/orders" element={<OrdersPage />} />

          <Route path="/wishlist" element={<WishlistPage />} />

          <Route path="/profile" element={<ProfilePage />} />

          <Route path="/login" element={<LoginPage />} />

          <Route path="/register" element={<RegisterPage />} />

          

        </Routes>

      </MainLayout>

    </BrowserRouter>

  )

}
