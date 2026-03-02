import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, getGreetingName } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{
      padding: '16px 32px',
      borderBottom: '1px solid #f3f4f6',
      backgroundColor: 'white',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          textDecoration: 'none'
        }}>
          <img 
            src="/DoculeaderLogo.png" 
            alt="DocuLeader Logo" 
            style={{
              width: '32px',
              height: '32px',
              objectFit: 'contain'
            }}
          />
          <span style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#2563eb'
          }}>
            Docu-Leader
          </span>
        </Link>

        {user && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#4b5563',
            }}>
              <span style={{ fontSize: '16px' }}>👤</span>
              <span style={{ fontSize: '14px' }}>{getGreetingName()}</span>
            </div>
            <button
              onClick={handleLogout}
              style={{
                background: 'none',
                border: '1px solid #e5e7eb',
                padding: '8px 16px',
                borderRadius: '6px',
                color: '#4b5563',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f3f4f6';
                e.target.style.borderColor = '#d1d5db';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.borderColor = '#e5e7eb';
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;