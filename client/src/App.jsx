import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedWrapper from './components/ProtectedWrapper';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DiscoverPage from './pages/DiscoverPage';
import ProfileDetailPage from './pages/ProfileDetailPage';
import OwnProfilePage from './pages/OwnProfilePage';
import BookingPage from './pages/BookingPage';
import PaymentPage from './pages/PaymentPage';
import BookingSuccessPage from './pages/BookingSuccessPage';
import MyBookingsPage from './pages/MyBookingsPage';
import SafetyPage from './pages/SafetyPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col justify-between bg-[#0d0e15] text-gray-100 selection:bg-rose-500 selection:text-white">
          <Navbar />
          
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/safety" element={<SafetyPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />

              {/* Protected Member Routes */}
              <Route
                path="/discover"
                element={
                  <ProtectedWrapper>
                    <DiscoverPage />
                  </ProtectedWrapper>
                }
              />
              <Route
                path="/profile/:id"
                element={
                  <ProtectedWrapper>
                    <ProfileDetailPage />
                  </ProtectedWrapper>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedWrapper>
                    <OwnProfilePage />
                  </ProtectedWrapper>
                }
              />
              <Route
                path="/book/:profileId"
                element={
                  <ProtectedWrapper>
                    <BookingPage />
                  </ProtectedWrapper>
                }
              />
              <Route
                path="/payment/:bookingId"
                element={
                  <ProtectedWrapper>
                    <PaymentPage />
                  </ProtectedWrapper>
                }
              />
              <Route
                path="/booking-success/:bookingId"
                element={
                  <ProtectedWrapper>
                    <BookingSuccessPage />
                  </ProtectedWrapper>
                }
              />
              <Route
                path="/my-bookings"
                element={
                  <ProtectedWrapper>
                    <MyBookingsPage />
                  </ProtectedWrapper>
                }
              />

              {/* Catch-all fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
