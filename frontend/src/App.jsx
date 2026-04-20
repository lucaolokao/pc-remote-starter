import { Navigate, Route, Routes } from 'react-router-dom';
import { useMemo, useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');

  const isAuthenticated = useMemo(() => Boolean(token), [token]);

  const handleLogin = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login onLogin={handleLogin} />
          )
        }
      />
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? (
            <Dashboard token={token} onLogout={handleLogout} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
    </Routes>
  );
}
