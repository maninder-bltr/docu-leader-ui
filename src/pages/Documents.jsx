import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import ConfirmDialog from '../components/ConfirmDialog';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  
  const navigate = useNavigate();

  // Fetch documents on component mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  // Fetch all documents for the user
  const fetchDocuments = async () => {
    try {
      const response = await api.get('/documents');
      setDocuments(response.data);
    } catch (error) {
      let errorMessage = 'Failed to fetch documents';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 401) {
        errorMessage = 'Please login to view your documents';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      setError('File size must be less than 50MB');
      event.target.value = '';
      return;
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only PDF, JPEG, PNG, and TXT files are allowed');
      event.target.value = '';
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // Add the new document to the list
      const newDoc = {
        id: response.data.documentId,
        fileName: response.data.fileName,
        status: response.data.status,
        documentType: 'PROCESSING',
        createdAt: Date.now()
      };
      
      setDocuments([newDoc, ...documents]);
      setSuccess('Document uploaded successfully');
      
    } catch (error) {
      let errorMessage = 'Upload failed';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data) {
        errorMessage = typeof error.response.data === 'string' 
          ? error.response.data 
          : 'Server error';
      } else if (error.message) {
        errorMessage = error.message;
      }
      setError(errorMessage);
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  // Handle delete button click
  const handleDeleteClick = (docId) => {
    setDocumentToDelete(docId);
    setShowConfirm(true);
  };

  // Handle confirmed delete
  const handleConfirmDelete = async () => {
    if (!documentToDelete) return;

    setDeleting(documentToDelete);
    setError('');
    setSuccess('');

    try {
      await api.delete(`/documents/${documentToDelete}`);
      
      // Remove the document from the list
      setDocuments(documents.filter(doc => doc.id !== documentToDelete));
      setSuccess('Document deleted successfully');
      
    } catch (error) {
      let errorMessage = 'Delete failed';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 404) {
        errorMessage = 'Document not found';
      } else if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to delete this document';
      }
      setError(errorMessage);
    } finally {
      setDeleting(null);
      setDocumentToDelete(null);
    }
  };

  // Cancel delete
  const handleCancelDelete = () => {
    setShowConfirm(false);
    setDocumentToDelete(null);
  };

  // Navigate to query page with document context
  const askAboutDocument = (docId) => {
    sessionStorage.setItem('lastDocumentId', docId);
    navigate('/query');
  };

  // Get status badge color and style
  const getStatusBadge = (status) => {
    const statusConfig = {
      'UPLOADED': { bg: '#f3f4f6', color: '#4b5563', text: 'Uploaded' },
      'PROCESSING': { bg: '#fef3c7', color: '#92400e', text: 'Processing' },
      'COMPLETED': { bg: '#d1fae5', color: '#065f46', text: 'Completed' },
      'FAILED': { bg: '#fee2e2', color: '#991b1b', text: 'Failed' }
    };

    const config = statusConfig[status] || statusConfig['UPLOADED'];
    
    return (
      <span style={{
        display: 'inline-block',
        padding: '4px 8px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: '500',
        backgroundColor: config.bg,
        color: config.color
      }}>
        {config.text}
      </span>
    );
  };

  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get file icon based on file name
  const getFileIcon = (fileName) => {
    const extension = fileName?.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return '📕';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return '🖼️';
      case 'txt': return '📝';
      default: return '📄';
    }
  };

  if (loading) return <Loader />;

  return (
    <div style={{ padding: '32px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '4px' }}>
            Documents
          </h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            {documents.length === 0 
              ? 'Upload your first document to start using AI features' 
              : `You have ${documents.length} document${documents.length > 1 ? 's' : ''}`
            }
          </p>
        </div>
        
        <div>
          <input
            type="file"
            id="file-upload"
            style={{ display: 'none' }}
            onChange={handleFileUpload}
            disabled={uploading}
            accept=".pdf,.jpg,.jpeg,.png,.txt"
          />
          <label
            htmlFor="file-upload"
            className="btn btn-primary"
            style={{ 
              cursor: uploading ? 'not-allowed' : 'pointer',
              opacity: uploading ? 0.7 : 1,
              padding: '10px 20px',
              fontSize: '14px'
            }}
          >
            {uploading ? '⏳ Uploading...' : '+ Upload Document'}
          </label>
        </div>
      </div>

      {/* Messages */}
      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}
      
      {success && (
        <div style={{
          backgroundColor: '#d1fae5',
          border: '1px solid #a7f3d0',
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '20px',
          color: '#065f46',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span>✅ {success}</span>
          <button
            onClick={() => setSuccess('')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#065f46' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Documents List */}
      {documents.length === 0 ? (
        <div className="card" style={{ 
          textAlign: 'center', 
          padding: '48px',
          border: '2px dashed #e5e7eb',
          backgroundColor: '#f9fafb'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>📄</div>
          <h3 style={{ marginBottom: '8px', fontSize: '18px', color: '#1f2937' }}>
            No documents yet
          </h3>
          <p style={{ color: '#6b7280', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
            Upload your first document to start using AI-powered search and invoice extraction.
          </p>
          <label
            htmlFor="file-upload"
            className="btn btn-primary"
            style={{ 
              cursor: 'pointer',
              padding: '12px 24px',
              fontSize: '16px'
            }}
          >
            Upload Your First Document
          </label>
        </div>
      ) : (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #f3f4f6',
          overflow: 'hidden'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              minWidth: '800px'
            }}>
              <thead>
                <tr style={{
                  backgroundColor: '#f9fafb',
                  borderBottom: '1px solid #e5e7eb'
                }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#4b5563' }}>
                    Document
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#4b5563' }}>
                    Type
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#4b5563' }}>
                    Status
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#4b5563' }}>
                    Uploaded
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#4b5563' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc, index) => (
                  <tr 
                    key={doc.id}
                    style={{
                      borderBottom: index < documents.length - 1 ? '1px solid #f3f4f6' : 'none',
                      backgroundColor: deleting === doc.id ? '#fef2f2' : 'white',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (deleting !== doc.id) {
                        e.currentTarget.style.backgroundColor = '#f9fafb';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (deleting !== doc.id) {
                        e.currentTarget.style.backgroundColor = 'white';
                      }
                    }}
                  >
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '24px' }}>{getFileIcon(doc.fileName)}</span>
                        <div>
                          <div style={{ fontWeight: '500', color: '#1f2937', marginBottom: '4px' }}>
                            {doc.fileName}
                          </div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>
                            ID: {doc.id.slice(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px', color: '#4b5563' }}>
                      {doc.documentType || '—'}
                    </td>
                    <td style={{ padding: '16px' }}>
                      {getStatusBadge(doc.status)}
                    </td>
                    <td style={{ padding: '16px', color: '#6b7280', fontSize: '14px' }}>
                      {formatDate(doc.createdAt)}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button
                          className="btn btn-secondary"
                          style={{ 
                            padding: '6px 12px', 
                            fontSize: '13px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb'
                          }}
                          onClick={() => askAboutDocument(doc.id)}
                          title="Ask AI about this document"
                        >
                          <span style={{ fontSize: '14px' }}>🔍</span>
                          Ask AI
                        </button>
                        <button
                          className="btn btn-danger"
                          style={{ 
                            padding: '6px 12px', 
                            fontSize: '13px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            backgroundColor: '#fee2e2',
                            color: '#991b1b',
                            border: '1px solid #fecaca',
                            opacity: deleting === doc.id ? 0.6 : 1,
                            cursor: deleting === doc.id ? 'not-allowed' : 'pointer'
                          }}
                          onClick={() => handleDeleteClick(doc.id)}
                          disabled={deleting === doc.id}
                        >
                          {deleting === doc.id ? (
                            '⏳ Deleting...'
                          ) : (
                            <>
                              <span style={{ fontSize: '14px' }}>🗑️</span>
                              Delete
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer with summary */}
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#f9fafb',
            borderTop: '1px solid #e5e7eb',
            fontSize: '13px',
            color: '#4b5563',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>Total documents: {documents.length}</span>
            <span>
              {documents.filter(d => d.status === 'COMPLETED').length} processed • 
              {documents.filter(d => d.status === 'PROCESSING').length} processing
            </span>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showConfirm}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Document"
        message="Are you sure you want to delete this document? This action cannot be undone. The file will be permanently removed from your storage."
      />

      {/* Quick Tips */}
      {documents.length > 0 && (
        <div style={{
          marginTop: '24px',
          padding: '16px',
          backgroundColor: '#eef2ff',
          borderRadius: '8px',
          border: '1px solid #c7d2fe',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{ fontSize: '20px' }}>💡</span>
          <div style={{ fontSize: '14px', color: '#1e40af' }}>
            <strong>Pro tip:</strong> Click "Ask AI" on any document to ask questions about its content. 
            You can also upload invoices to automatically track payments.
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;