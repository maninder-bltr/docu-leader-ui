import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Loader from '../components/Loader';

const Dashboard = () => {
  const { user, getGreetingName } = useAuth();
  const [stats, setStats] = useState({
    documents: 0,
    invoices: 0,
    overdue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Note: You'll need to implement these endpoints
        const [docsRes, invoicesRes] = await Promise.all([
          api.get('/documents').catch(() => ({ data: [] })),
          api.get('/invoices').catch(() => ({ data: [] }))
        ]);
        
        const overdue = invoicesRes.data.filter(
          inv => inv.status === 'UNPAID' && new Date(inv.dueDate) < new Date()
        ).length;

        setStats({
          documents: docsRes.data.length,
          invoices: invoicesRes.data.length,
          overdue
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const quickActions = [
    {
      title: 'Upload Document',
      description: 'Add a new document to your library',
      link: '/documents',
      icon: '📄',
      color: '#2563eb'
    },
    {
      title: 'Ask AI',
      description: 'Query your documents with AI',
      link: '/query',
      icon: '🤖',
      color: '#7c3aed'
    },
    {
      title: 'Upload Invoice',
      description: 'Extract invoice data automatically',
      link: '/invoices',
      icon: '💰',
      color: '#059669'
    }
  ];

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      {/* Welcome Section */}
      <div style={{ 
        marginBottom: '32px',
      }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '600',
          marginBottom: '8px',
          color: '#1a1a1a'
        }}>
          {getTimeOfDay()}, {getGreetingName()}! 👋
        </h1>
        <p style={{ color: '#6b7280', fontSize: '16px' }}>
          Here's what's happening with your documents and invoices.
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px',
        marginBottom: '40px',
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #f3f4f6',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>Total Documents</span>
            <span style={{ fontSize: '24px' }}>📄</span>
          </div>
          <div style={{ fontSize: '36px', fontWeight: '600', color: '#2563eb' }}>
            {stats.documents}
          </div>
        </div>
        
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #f3f4f6',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>Total Invoices</span>
            <span style={{ fontSize: '24px' }}>💰</span>
          </div>
          <div style={{ fontSize: '36px', fontWeight: '600', color: '#2563eb' }}>
            {stats.invoices}
          </div>
        </div>
        
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #f3f4f6',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>Overdue Invoices</span>
            <span style={{ fontSize: '24px' }}>⚠️</span>
          </div>
          <div style={{ fontSize: '36px', fontWeight: '600', color: stats.overdue > 0 ? '#ef4444' : '#10b981' }}>
            {stats.overdue}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <h2 style={{
        fontSize: '20px',
        fontWeight: '600',
        marginBottom: '20px',
        color: '#374151'
      }}>
        Quick Actions
      </h2>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px',
      }}>
        {quickActions.map((action) => (
          <Link
            key={action.title}
            to={action.link}
            style={{
              textDecoration: 'none',
              color: 'inherit',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #f3f4f6',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              display: 'block',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0,0,0,0.1)';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
              e.currentTarget.style.borderColor = '#f3f4f6';
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>
              {action.icon}
            </div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '8px',
              color: action.color
            }}>
              {action.title}
            </h3>
            <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.5' }}>
              {action.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;