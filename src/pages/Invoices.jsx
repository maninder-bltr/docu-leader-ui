import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import ConfirmDialog from '../components/ConfirmDialog';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [reminder, setReminder] = useState('');
  const [showReminder, setShowReminder] = useState(false);
  const [hasDocuments, setHasDocuments] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    checkDocuments();
    fetchInvoices();
  }, []);

  const checkDocuments = async () => {
    try {
      const response = await api.get('/documents');
      setHasDocuments(response.data.length > 0);
    } catch (error) {
      console.error('Failed to check documents:', error);
      setHasDocuments(false);
    }
  };

  const fetchInvoices = async () => {
    try {
      const response = await api.get('/invoices');
      setInvoices(response.data);
    } catch (error) {
      let errorMessage = 'Failed to fetch invoices';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only PDF, JPEG, and PNG files are allowed for invoices');
      event.target.value = '';
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/invoices/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setSuccess('Invoice uploaded and processed successfully');
      fetchInvoices(); // Refresh the list
      
    } catch (error) {
      let errorMessage = 'Upload failed';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data) {
        errorMessage = typeof error.response.data === 'string' 
          ? error.response.data 
          : 'Server error';
      }
      setError(errorMessage);
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const markAsPaid = async (id) => {
    setProcessingId(id);
    try {
      await api.put(`/invoices/${id}/mark-paid`);
      setSuccess('Invoice marked as paid');
      fetchInvoices();
    } catch (error) {
      let errorMessage = 'Failed to mark invoice as paid';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      setError(errorMessage);
    } finally {
      setProcessingId(null);
    }
  };

  const generateReminder = async (invoice) => {
    setProcessingId(invoice.id);
    try {
      const response = await api.post(`/invoices/${invoice.id}/remind`);
      setReminder(response.data.reminder);
      setSelectedInvoice(invoice);
      setShowReminder(true);
    } catch (error) {
      let errorMessage = 'Failed to generate reminder';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      setError(errorMessage);
    } finally {
      setProcessingId(null);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setSuccess('Copied to clipboard!');
    setTimeout(() => setSuccess(''), 2000);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'PAID': { bg: '#d1fae5', color: '#065f46', text: 'Paid' },
      'UNPAID': { bg: '#fee2e2', color: '#991b1b', text: 'Unpaid' },
      'OVERDUE': { bg: '#ffedd5', color: '#9a3412', text: 'Overdue' },
      'DRAFT': { bg: '#f3f4f6', color: '#4b5563', text: 'Draft' }
    };

    const config = statusConfig[status] || statusConfig['DRAFT'];
    
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

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const goToDocuments = () => {
    navigate('/documents');
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
            Invoices
          </h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            {invoices.length === 0 
              ? 'Upload your first invoice to start tracking payments' 
              : `You have ${invoices.length} invoice${invoices.length > 1 ? 's' : ''}`
            }
          </p>
        </div>
        
        {hasDocuments && (
          <div>
            <input
              type="file"
              id="invoice-upload"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
              disabled={uploading}
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <label
              htmlFor="invoice-upload"
              className="btn btn-primary"
              style={{ 
                cursor: uploading ? 'not-allowed' : 'pointer',
                opacity: uploading ? 0.7 : 1,
                padding: '10px 20px',
                fontSize: '14px'
              }}
            >
              {uploading ? '⏳ Processing...' : '+ Upload Invoice'}
            </label>
          </div>
        )}
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

      {/* No Documents Warning */}
      {!hasDocuments && (
        <div style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeeba',
          borderRadius: '8px',
          padding: '32px',
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '64px', display: 'block', marginBottom: '16px' }}>📄</span>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: '#856404' }}>
            No Documents Found
          </h3>
          <p style={{ color: '#856404', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
            You need to upload documents before you can extract invoices from them. 
            Invoices are automatically detected and extracted from your uploaded documents.
          </p>
          <button
            onClick={goToDocuments}
            className="btn btn-primary"
            style={{ padding: '12px 24px', fontSize: '16px' }}
          >
            Go to Documents
          </button>
        </div>
      )}

      {/* Reminder Modal */}
      {showReminder && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ maxWidth: '500px', width: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600' }}>
                Reminder for {selectedInvoice?.vendorName}
              </h3>
              <button
                onClick={() => setShowReminder(false)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#9ca3af' }}
              >
                ✕
              </button>
            </div>
            <div style={{
              backgroundColor: '#f9fafb',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '20px',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap',
              fontSize: '14px',
              border: '1px solid #e5e7eb'
            }}>
              {reminder}
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                className="btn btn-secondary"
                onClick={() => copyToClipboard(reminder)}
                style={{ padding: '8px 16px' }}
              >
                Copy to Clipboard
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setShowReminder(false)}
                style={{ padding: '8px 16px' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoices List */}
      {invoices.length === 0 ? (
        hasDocuments && (
          <div className="card" style={{ 
            textAlign: 'center', 
            padding: '48px',
            border: '2px dashed #e5e7eb',
            backgroundColor: '#f9fafb'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>💰</div>
            <h3 style={{ marginBottom: '8px', fontSize: '18px', color: '#1f2937' }}>
              No invoices yet
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
              Upload a document containing an invoice, and our AI will automatically extract all the details.
            </p>
            <label
              htmlFor="invoice-upload"
              className="btn btn-primary"
              style={{ 
                cursor: 'pointer',
                padding: '12px 24px',
                fontSize: '16px'
              }}
            >
              Upload Your First Invoice
            </label>
          </div>
        )
      ) : (
        <>
          {/* Overdue Invoices Section */}
          {invoices.some(inv => inv.status === 'UNPAID' && isOverdue(inv.dueDate)) && (
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '16px',
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>⚠️</span> Overdue Invoices
              </h3>
              <div className="grid grid-3">
                {invoices
                  .filter(inv => inv.status === 'UNPAID' && isOverdue(inv.dueDate))
                  .map(invoice => (
                    <div key={invoice.id} className="card" style={{ 
                      borderColor: '#fee2e2',
                      borderWidth: '1px',
                      borderStyle: 'solid'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                        <div>
                          <div style={{ fontWeight: '600', marginBottom: '4px' }}>{invoice.vendorName}</div>
                          <div style={{ fontSize: '13px', color: '#6b7280' }}>{invoice.invoiceNumber}</div>
                        </div>
                        {getStatusBadge('OVERDUE')}
                      </div>
                      <div style={{ fontSize: '14px', color: '#4b5563', marginBottom: '12px' }}>
                        <div>Due: {formatDate(invoice.dueDate)}</div>
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>
                        {formatCurrency(invoice.totalAmount)}
                      </div>
                      <button
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '8px' }}
                        onClick={() => markAsPaid(invoice.id)}
                        disabled={processingId === invoice.id}
                      >
                        {processingId === invoice.id ? 'Processing...' : 'Mark as Paid'}
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* All Invoices Table */}
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
                minWidth: '900px'
              }}>
                <thead>
                  <tr style={{
                    backgroundColor: '#f9fafb',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#4b5563' }}>
                      Vendor
                    </th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#4b5563' }}>
                      Invoice #
                    </th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#4b5563' }}>
                      Issue Date
                    </th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#4b5563' }}>
                      Due Date
                    </th>
                    <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#4b5563' }}>
                      Amount
                    </th>
                    <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#4b5563' }}>
                      Status
                    </th>
                    <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#4b5563' }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice, index) => {
                    const overdue = invoice.status === 'UNPAID' && isOverdue(invoice.dueDate);
                    const status = overdue ? 'OVERDUE' : invoice.status;
                    
                    return (
                      <tr 
                        key={invoice.id}
                        style={{
                          borderBottom: index < invoices.length - 1 ? '1px solid #f3f4f6' : 'none',
                          backgroundColor: overdue ? '#fff3cd' : 'white'
                        }}
                      >
                        <td style={{ padding: '16px', fontWeight: '500' }}>
                          {invoice.vendorName || '—'}
                        </td>
                        <td style={{ padding: '16px', color: '#4b5563' }}>
                          {invoice.invoiceNumber || '—'}
                        </td>
                        <td style={{ padding: '16px', color: '#6b7280' }}>
                          {formatDate(invoice.issueDate)}
                        </td>
                        <td style={{ 
                          padding: '16px', 
                          color: overdue ? '#b45309' : '#6b7280',
                          fontWeight: overdue ? '500' : 'normal'
                        }}>
                          {formatDate(invoice.dueDate)}
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right', fontWeight: '500' }}>
                          {formatCurrency(invoice.totalAmount)}
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          {getStatusBadge(status)}
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            {invoice.status !== 'PAID' && (
                              <button
                                className="btn btn-primary"
                                style={{ 
                                  padding: '6px 12px', 
                                  fontSize: '12px',
                                  backgroundColor: '#10b981',
                                  border: 'none'
                                }}
                                onClick={() => markAsPaid(invoice.id)}
                                disabled={processingId === invoice.id}
                              >
                                {processingId === invoice.id ? '...' : '✓ Paid'}
                              </button>
                            )}
                            <button
                              className="btn btn-secondary"
                              style={{ 
                                padding: '6px 12px', 
                                fontSize: '12px',
                                backgroundColor: 'white',
                                border: '1px solid #e5e7eb'
                              }}
                              onClick={() => generateReminder(invoice)}
                              disabled={processingId === invoice.id}
                            >
                              {processingId === invoice.id ? '...' : '🔔 Remind'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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
              <span>Total invoices: {invoices.length}</span>
              <span>
                Paid: {invoices.filter(i => i.status === 'PAID').length} • 
                Unpaid: {invoices.filter(i => i.status === 'UNPAID' && !isOverdue(i.dueDate)).length} • 
                Overdue: {invoices.filter(i => i.status === 'UNPAID' && isOverdue(i.dueDate)).length}
              </span>
            </div>
          </div>

          {/* Total Summary Card */}
          <div style={{
            marginTop: '24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            <div className="card">
              <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Total Outstanding</div>
              <div style={{ fontSize: '24px', fontWeight: '600', color: '#ef4444' }}>
                {formatCurrency(
                  invoices
                    .filter(i => i.status === 'UNPAID')
                    .reduce((sum, i) => sum + (i.totalAmount || 0), 0)
                )}
              </div>
            </div>
            <div className="card">
              <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Total Paid</div>
              <div style={{ fontSize: '24px', fontWeight: '600', color: '#10b981' }}>
                {formatCurrency(
                  invoices
                    .filter(i => i.status === 'PAID')
                    .reduce((sum, i) => sum + (i.totalAmount || 0), 0)
                )}
              </div>
            </div>
            <div className="card">
              <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Average Invoice</div>
              <div style={{ fontSize: '24px', fontWeight: '600', color: '#2563eb' }}>
                {invoices.length > 0 
                  ? formatCurrency(invoices.reduce((sum, i) => sum + (i.totalAmount || 0), 0) / invoices.length)
                  : '$0.00'
                }
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Invoices;