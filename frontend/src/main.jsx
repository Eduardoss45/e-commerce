import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from './App.jsx';
import Home from './pages/Home.jsx';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import CheckCode from './pages/CheckCode.jsx';
import Dashboard from './pages/Dashboard.jsx'; // exemplo
import { ProtectedRoute } from './ui/components/ProtectedRoute.jsx';

import './scss/app.scss';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          {/* Páginas públicas */}
          <Route index element={<Home />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="verify" element={<CheckCode />} />

          {/* Rotas protegidas (exemplo) */}
          <Route element={<ProtectedRoute requireVerification={true} />}>
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
