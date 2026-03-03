import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/DoculeaderLogo.png';

const Landing = () => {
  const { user } = useAuth();

  const useCases = [
    {
      title: 'Lawyers & Paralegals',
      description: 'Find specific liabilities across hundreds of contracts in seconds.',
      icon: '⚖️'
    },
    {
      title: 'Medical Researchers',
      description: 'Track health metrics changes across years of patient records.',
      icon: '🔬'
    },
    {
      title: 'Project Managers',
      description: 'Extract safety requirements across multiple technical manuals.',
      icon: '📋'
    },
    {
      title: 'Students',
      description: 'Compare conflicting theories across 50+ research papers.',
      icon: '🎓'
    },
    {
      title: 'Finance Teams',
      description: 'Identify frequently overdue vendors automatically.',
      icon: '💰'
    },
    {
      title: 'HR Teams',
      description: 'Summarize compliance clauses across employee contracts.',
      icon: '👥'
    }
  ];

  const steps = [
    { number: '01', title: 'Upload', description: 'Upload PDFs, images, or spreadsheets' },
    { number: '02', title: 'AI Extracts', description: 'System reads and structures data automatically' },
    { number: '03', title: 'Ask or Track', description: 'Query documents or manage invoices' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        padding: '80px 0',
        textAlign: 'center',
        backgroundColor: 'white'
      }}>
        <div className="container">
          {/* Logo and Title */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            gap: '12px'
          }}>
            <img
              src={logo}
              alt="DocuLeader Logo"
              style={{
                width: '48px',
                height: '48px',
                objectFit: 'contain'
              }}
            />
            <h1 style={{
              fontSize: '48px',
              fontWeight: '700',
              color: '#1a1a1a',
              margin: 0
            }}>
              Docu-Leader
            </h1>
          </div>

          <p style={{
            fontSize: '18px',
            color: '#4b5563',
            maxWidth: '600px',
            margin: '0 auto 32px',
            lineHeight: '1.6'
          }}>
            Upload documents or invoices. Docu-Leader AI reads, extracts, summarizes,
            and tracks everything for you.
          </p>

          {/* Conditional CTA Button */}
          {!user ? (
            <Link to="/signup" className="btn btn-primary" style={{ fontSize: '16px', padding: '12px 32px' }}>
              Get Started Free
            </Link>
          ) : (
            <Link to="/dashboard" className="btn btn-primary" style={{ fontSize: '16px', padding: '12px 32px' }}>
              Go to Dashboard
            </Link>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section style={{
        padding: '60px 0',
        backgroundColor: '#f9fafb'
      }}>
        <div className="container">
          <h2 style={{
            fontSize: '32px',
            fontWeight: '600',
            textAlign: 'center',
            marginBottom: '48px'
          }}>
            How It Works
          </h2>
          <div className="grid grid-3">
            {steps.map((step) => (
              <div key={step.number} style={{
                textAlign: 'center',
                padding: '24px'
              }}>
                <div style={{
                  fontSize: '48px',
                  fontWeight: '700',
                  color: '#2563eb',
                  opacity: '0.3',
                  marginBottom: '16px'
                }}>
                  {step.number}
                </div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  {step.title}
                </h3>
                <p style={{ color: '#6b7280' }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <h2 style={{
            fontSize: '32px',
            fontWeight: '600',
            textAlign: 'center',
            marginBottom: '48px'
          }}>
            Built for Real Teams
          </h2>
          <div className="grid grid-3">
            {useCases.map((useCase) => (
              <div
                key={useCase.title}
                className="card"
                style={{
                  transition: 'transform 0.2s',
                  cursor: 'default'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ fontSize: '32px', marginBottom: '16px' }}>
                  {useCase.icon}
                </div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  {useCase.title}
                </h3>
                <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.5' }}>
                  {useCase.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Optional: Add a secondary CTA at the bottom for non-logged-in users */}
      {!user && (
        <section style={{
          padding: '60px 0',
          backgroundColor: '#f9fafb',
          textAlign: 'center'
        }}>
          <div className="container">
            <h2 style={{
              fontSize: '28px',
              fontWeight: '600',
              marginBottom: '16px'
            }}>
              Ready to get started?
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#4b5563',
              marginBottom: '24px',
              maxWidth: '500px',
              margin: '0 auto 24px'
            }}>
              Join thousands of professionals who are already saving time with Docu-Leader.
            </p>
            <Link to="/signup" className="btn btn-primary" style={{ fontSize: '16px', padding: '12px 32px' }}>
              Create Free Account
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Landing;