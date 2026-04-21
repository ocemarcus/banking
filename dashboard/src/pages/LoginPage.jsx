import React from 'react';
import Login from '../components/Login';

export default function LoginPage({ onLogin }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#f6f4ff,_#ffffff_52%)] p-4">
      <Login onLogin={onLogin} />
    </div>
  );
}

