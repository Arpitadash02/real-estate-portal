import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import PropertyListPage from './pages/customer/PropertyListPage';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import BrokerDashboard from './pages/broker/BrokerDashboard';
import BookingRequestsPage from './pages/broker/BookingRequestsPage';

import './index.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Customer routes */}
          <Route
            path="/customer/properties"
            element={
              <ProtectedRoute requiredRole="customer">
                <PropertyListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/dashboard"
            element={
              <ProtectedRoute requiredRole="customer">
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Broker routes */}
          <Route
            path="/broker/dashboard"
            element={
              <ProtectedRoute requiredRole="broker">
                <BrokerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/broker/requests"
            element={
              <ProtectedRoute requiredRole="broker">
                <BookingRequestsPage />
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
