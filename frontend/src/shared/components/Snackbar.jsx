import React from 'react';

import { useEffect } from 'react';

const Snackbar = ({ message, color = 'red', open, onClose, duration = 2500 }) => {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [open, duration, onClose]);

  if (!open) return null;
  return (
    <div
      style={{
        position: 'fixed',
        top: '2rem',
        right: '2rem',
        background: color,
        color: 'white',
        padding: '1rem 2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        zIndex: 9999,
        fontWeight: 600,
        fontSize: '1rem',
        minWidth: '250px',
        textAlign: 'center',
        cursor: 'pointer',
      }}
      onClick={onClose}
    >
      {message}
    </div>
  );
};

export default Snackbar;
