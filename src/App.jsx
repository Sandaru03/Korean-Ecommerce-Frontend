import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AdminPage from "./pages/AdminPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import CartPage from "./pages/CartPage";
import ProfilePage from "./pages/ProfilePage";
import CategoryPage from "./pages/CategoryPage";
import SuperCategoryPage from "./pages/SuperCategoryPage";
import ProductPage from "./pages/ProductPage";
import BannerPage1 from "./pages/banners/BannerPage1";
import BannerPage2 from "./pages/banners/BannerPage2";
import BannerPage3 from "./pages/banners/BannerPage3";
import BannerPage4 from "./pages/banners/BannerPage4";
import BannerPage5 from "./pages/banners/BannerPage5";
import { ScrollToTop } from "./components/ScrollToTop";
import Loader from "./components/common/Loader";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  // You can also add logic here to hide the loader once specific data is fetched
  // For now, it's handled by the Loader's internal timer and this state.

  return (
    <>
      {isLoading && <Loader onFinished={() => setIsLoading(false)} />}
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/super-category/:slug" element={<SuperCategoryPage />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/banner/1" element={<BannerPage1 />} />
        <Route path="/banner/2" element={<BannerPage2 />} />
        <Route path="/banner/3" element={<BannerPage3 />} />
        <Route path="/banner/4" element={<BannerPage4 />} />
        <Route path="/banner/5" element={<BannerPage5 />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/admin/*" element={<AdminPage />} />
      </Routes>
    </>
  );
}
