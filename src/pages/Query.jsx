import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import ErrorMessage from '../components/ErrorMessage';
import Loader from '../components/Loader';

const Query = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasDocuments, setHasDocuments] = useState(true);
  const [checkingDocs, setCheckingDocs] = useState(true);

  const navigate = useNavigate();

  // Check if user has any documents
  useEffect(() => {
    checkDocuments();
  }, []);

  const checkDocuments = async () => {
    try {
      const response = await api.get('/documents');
      setHasDocuments(response.data.length > 0);
    } catch (error) {
      console.error('Failed to check documents:', error);
      setHasDocuments(false);
    } finally {
      setCheckingDocs(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setError('');
    setAnswer(null);

    try {
      const response = await api.post('/documents/query', question, {
        headers: { 'Content-Type': 'text/plain' }
      });
      setAnswer(response.data);
    } catch (error) {
      let errorMessage = 'Failed to get answer';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data) {
        errorMessage = typeof error.response.data === 'string' 
          ? error.response.data 
          : 'Server error';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadClick = () => {
    navigate('/documents');
  };

  if (checkingDocs) {
    return <Loader />;
  }

  return (
    <div style={{ padding: '32px', maxWidth: '800px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>
        Ask AI About Your Documents
      </h1>
      <p style={{ color: '#6b7280', marginBottom: '24px' }}>
        Get answers based on your uploaded documents
      </p>

      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

      {/* No Documents Warning */}
      {!hasDocuments && (
        <div style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeeba',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>📄</span>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#856404' }}>
            No Documents Found
          </h3>
          <p style={{ color: '#856404', marginBottom: '16px' }}>
            You need to upload at least one document before you can ask questions.
          </p>
          <button
            onClick={handleUploadClick}
            className="btn btn-primary"
            style={{ padding: '10px 20px' }}
          >
            Upload Your First Document
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ marginBottom: '24px' }}>
        <div className="form-group">
          <textarea
            className="form-control"
            rows="4"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={hasDocuments 
              ? "E.g., What are the electrical safety requirements? or Show me all invoices from Acme Corp"
              : "Upload documents first to start asking questions"}
            style={{ 
              fontSize: '16px',
              backgroundColor: !hasDocuments ? '#f9fafb' : 'white'
            }}
            disabled={loading || !hasDocuments}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !question.trim() || !hasDocuments}
            style={{ 
              minWidth: '120px',
              opacity: (!hasDocuments || loading || !question.trim()) ? 0.6 : 1,
              cursor: (!hasDocuments || loading || !question.trim()) ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Asking...' : 'Ask AI'}
          </button>
          
          {!hasDocuments && (
            <span style={{ color: '#6b7280', fontSize: '14px' }}>
              ⚠️ You need documents to ask questions
            </span>
          )}
        </div>
      </form>

      {/* Quick Examples - Only show if has documents */}
      {hasDocuments && (
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#4b5563', marginBottom: '8px' }}>
            Try asking:
          </h4>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              'What documents do I have?',
              'Summarize my latest invoice',
              'Find all contracts from last month',
              'What are my payment terms?'
            ].map((example) => (
              <button
                key={example}
                onClick={() => setQuestion(example)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#f3f4f6',
                  border: '1px solid #e5e7eb',
                  borderRadius: '9999px',
                  fontSize: '13px',
                  color: '#4b5563',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Answer Section */}
      {answer && (
        <div className="card" style={{ animation: 'fadeIn 0.3s ease' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#374151'
            }}>
              Answer
            </h3>
            <button
              onClick={() => setAnswer(null)}
              style={{
                background: 'none',
                border: 'none',
                color: '#9ca3af',
                cursor: 'pointer',
                fontSize: '18px'
              }}
            >
              ✕
            </button>
          </div>
          
          <p style={{
            lineHeight: '1.6',
            marginBottom: '16px',
            whiteSpace: 'pre-wrap',
            color: '#1f2937'
          }}>
            {answer.answer}
          </p>
          
          {answer.sources && answer.sources.length > 0 && (
            <>
              <h4 style={{
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px',
                color: '#6b7280'
              }}>
                Sources:
              </h4>
              <ul style={{ color: '#4b5563', fontSize: '14px' }}>
                {answer.sources.map((source, index) => (
                  <li key={index} style={{ 
                    marginBottom: '4px',
                    padding: '4px 8px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '4px'
                  }}>
                    📄 {source}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      {/* Add animation keyframes */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Query;