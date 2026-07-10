import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import ActivityDetailPage from './pages/ActivityDetailPage';
import SavedPage from './pages/SavedPage';
import ProfilePage from './pages/ProfilePage';
import QuizPage from './pages/QuizPage';

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuthStore();
  return user ? children : <Navigate to="/login" replace />;
}

function Layout({ children }: { children: JSX.Element }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FDF0EE' }}>
      <Navbar />
      <main>{children}</main>
    </div>
  );
}

export default function App() {
  const { initialize: initAuth,initialized } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, []);

   if (!initialized) return null;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<PrivateRoute><Layout><HomePage /></Layout></PrivateRoute>} />
        <Route path="/search" element={<PrivateRoute><Layout><SearchPage /></Layout></PrivateRoute>} />
        <Route path="/activity/:id" element={<PrivateRoute><Layout><ActivityDetailPage /></Layout></PrivateRoute>} />
        <Route path="/saved" element={<PrivateRoute><Layout><SavedPage /></Layout></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Layout><ProfilePage /></Layout></PrivateRoute>} />
        <Route path="/quiz" element={<PrivateRoute><Layout><QuizPage /></Layout></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}