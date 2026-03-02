import React from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const { user } = useAuth();

  return (
    <div style={{ 
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#ffffff',
    }}>
      {user && <Sidebar />}
      <main style={{ 
        flex: 1,
        padding: user ? '24px 32px 24px 80px' : '24px 32px',
        transition: 'padding 0.3s ease',
        maxWidth: '1400px',
        margin: '0 auto',
        width: '100%',
      }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;