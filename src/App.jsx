import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AdminPage from "./pages/AdminPage";
import CartPage from "./pages/CartPage";
import ProfilePage from "./pages/ProfilePage";
import CategoryPage from "./pages/CategoryPage";
import SuperCategoryPage from "./pages/SuperCategoryPage";
import ProductPage from "./pages/ProductPage";
import BannerPage from "./pages/banners/BannerPage";
import SearchPage from "./pages/SearchPage";
import { ScrollToTop } from "./components/ScrollToTop";
import Loader from "./components/common/Loader";
import QuizPage from "./pages/QuizPage";
import AboutPage from "./pages/AboutPage";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Force ALL theme-color metas to white immediately on mount
    // to prevent Safari/Brave on iOS from sampling the red loader background
    const allThemeMetas = document.querySelectorAll('meta[name="theme-color"]');
    allThemeMetas.forEach((meta) => {
      meta.setAttribute("content", "#ffffff");
    });
  }, []);

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
        <Route path="/banner/:id" element={<BannerPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/admin/*" element={<AdminPage />} />
      </Routes>
    </>
  );
}
