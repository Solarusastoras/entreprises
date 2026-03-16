import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Utils/hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { estConnecte, chargement } = useAuth();

  if (chargement) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '60vh', color: 'var(--c-ink3)', fontSize: '0.95rem'
      }}>
        Chargement…
      </div>
    );
  }

  if (!estConnecte) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
