import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from './App.jsx';
import Home from './pages/Home.jsx';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import CheckCode from './pages/CheckCode.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import CartPage from './pages/CartPage.jsx';
import ProductPage from './pages/ProductPage.jsx';
import FavoritesPage from './pages/FavoritesPage.jsx';
import SuccessPage from './pages/SuccessPage.jsx';
import CancelPage from './pages/CancelPage.jsx';
import AccountPage from './pages/AccountPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import CalculateShipping from './ui/components/CalculateShipping.jsx';

import './scss/app.scss';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="verify" element={<CheckCode />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="shipping" element={<CalculateShipping />} />
          <Route path="product/:id" element={<ProductPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="success" element={<SuccessPage />} />
          <Route path="cancel" element={<CancelPage />} />
          <Route path="reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="account" element={<AccountPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
