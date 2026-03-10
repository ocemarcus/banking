import React, { useState } from 'react';
import LoginPage from './pages/LoginPage';
import { DashboardLayout } from './pages/dashboard/DashboardLayout';

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [sessionUser, setSessionUser] = useState(() => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  });

  React.useEffect(() => {
    if (!token) return;
    const _fetch = window.fetch;
    window.fetch = async (input, init = {}) => {
      if (typeof input === 'string' && !input.startsWith('/api/')) {
        return _fetch(input, init);
      }
      const headers = new Headers(init.headers || {});
      headers.set('Authorization', `Bearer ${token}`);
      return _fetch(input, { ...init, headers });
    };
    return () => {
      window.fetch = _fetch;
    };
  }, [token]);

  function handleLogin(data) {
    setToken(data.token);
    setSessionUser(data);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
  }

  function handleLogout() {
    setToken(null);
    setSessionUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  if (!sessionUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return <DashboardLayout user={sessionUser} onLogout={handleLogout} />;
}

