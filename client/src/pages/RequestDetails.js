import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { requestService } from '../services/api';

const VALID_STATUSES = ['New', 'In Progress', 'Waiting for Response', 'Completed', 'Rejected'];

function RequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchRequest();
  }, [id]);

  const fetchRequest = async () => {
    try {
      setLoading(true);
      const response = await requestService.getOne(id);
      setRequest(response.data);
      setNewStatus(response.data.status);
      setError(null);
    } catch (err) {
      setError('Failed to load request details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (newStatus === request.status) return;

    try {
      setUpdating(true);
      const response = await requestService.updateStatus(id, newStatus);
      setRequest(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusClass = (status) => {
    const statusClasses = {
      'New': 'status-new',
      'In Progress': 'status-progress',
      'Waiting for Response': 'status-waiting',
      'Completed': 'status-completed',
      'Rejected': 'status-rejected'
    };
    return statusClasses[status] || 'status-default';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading request details...</p>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="empty-state">
        <h3>Request not found</h3>
        <button className="btn-primary" onClick={() => navigate('/')}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="request-details">
      <div className="page-header">
        <h1>Request Details</h1>
        <button className="btn-secondary" onClick={() => navigate('/')}>
          Back to Dashboard
        </button>
      </div>

      {error && (
        <div className="error-message">{error}</div>
      )}

      <div className="details-card">
        <div className="detail-row">
          <label>Title:</label>
          <span className="detail-value">{request.title}</span>
        </div>

        <div className="detail-row">
          <label>Client Name:</label>
          <span className="detail-value">{request.clientName}</span>
        </div>

        <div className="detail-row">
          <label>Email:</label>
          <span className="detail-value">{request.email || '-'}</span>
        </div>

        <div className="detail-row">
          <label>Description:</label>
          <span className="detail-value">{request.description || '-'}</span>
        </div>

        <div className="detail-row">
          <label>Status:</label>
          <span className={`status-badge ${getStatusClass(request.status)}`}>
            {request.status}
          </span>
        </div>

        <div className="detail-row">
          <label>Created:</label>
          <span className="detail-value">
            {new Date(request.createdAt).toLocaleString()}
          </span>
        </div>

        <div className="status-update-section">
          <h3>Update Status</h3>
          <div className="status-update-row">
            <select 
              value={newStatus} 
              onChange={(e) => setNewStatus(e.target.value)}
            >
              {VALID_STATUSES.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <button 
              className="btn-primary"
              onClick={handleStatusUpdate}
              disabled={updating || newStatus === request.status}
            >
              {updating ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequestDetails;
