// Sidebar.jsx:
import { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/DoculeaderLogo.png';

const Sidebar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const hoverTimeoutRef = useRef(null);

  const handleMouseEnter = () => {
    // Clear any pending hide timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsHovering(true);
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    // Delay hiding to allow smooth transition and prevent flickering
    hoverTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 200);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/documents', label: 'Documents', icon: '📄' },
    { path: '/query', label: 'Ask AI', icon: '🤖' },
    { path: '/invoices', label: 'Invoices', icon: '💰' },
  ];

  return (
    <>
      {/* Hamburger Button */}
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          position: 'fixed',
          left: '24px',
          top: '88px',
          zIndex: 1001,
        }}
      >
        <button
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            transition: 'all 0.2s ease',
            outline: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(37, 99, 235, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
          }}
          aria-label="Toggle Menu"
        >
          ☰
        </button>
      </div>

      {/* Sidebar */}
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          width: '280px',
          backgroundColor: '#ffffff',
          borderRight: '1px solid #e5e7eb',
          boxShadow: isVisible ? '4px 0 24px rgba(0,0,0,0.08)' : 'none',
          transform: isVisible ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Logo Section */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #f3f4f6',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: '#2563eb',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
          }}>
            <img
              src={logo}
              alt="DocuLeader Logo"
              style={{
                width: '32px',
                height: '32px',
                objectFit: 'contain'
              }}
            />
          </div>

          <span style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#1f2937',
            letterSpacing: '-0.5px',
          }}>
            Docu-Leader
          </span>
        </div>

        {/* Navigation Menu */}
        <nav style={{
          flex: 1,
          padding: '24px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                color: isActive ? '#2563eb' : '#4b5563',
                backgroundColor: isActive ? '#eff6ff' : 'transparent',
                textDecoration: 'none',
                fontSize: '15px',
                fontWeight: isActive ? '600' : '500',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                border: isActive ? '1px solid #dbeafe' : '1px solid transparent',
              })}
              onMouseEnter={(e) => {
                if (!e.currentTarget.classList.contains('active')) {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.classList.contains('active')) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span style={{
                fontSize: '18px',
                filter: 'grayscale(0.2)',
              }}>
                {item.icon}
              </span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div style={{
          padding: '20px 24px',
          borderTop: '1px solid #f3f4f6',
          backgroundColor: '#f9fafb',
        }}>
          <div style={{
            fontSize: '13px',
            color: '#6b7280',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span style={{ fontSize: '14px' }}>💡</span>
            <span>Hover menu to navigate</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;