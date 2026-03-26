import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { requestService } from '../services/api';

const VALID_STATUSES = ['New', 'In Progress', 'Waiting for Response', 'Completed', 'Rejected'];

function Dashboard() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await requestService.getAll(filter || undefined);
      setRequests(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load requests');
    } finally {
      setLoading(false);
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
        <p>Loading requests...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Requests Dashboard</h1>
        <div className="filter-section">
          <label>Filter by status:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">All</option>
            {VALID_STATUSES.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="error-message">{error}</div>
      )}

      {requests.length === 0 ? (
        <div className="empty-state">
          <h3>No requests found</h3>
          <p>Create your first request to get started</p>
          <Link to="/create" className="btn-primary">Create Request</Link>
        </div>
      ) : (
        <div className="table-container">
          <table className="requests-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Client</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(request => (
                <tr key={request.id} className="request-row">
                  <td>
                    <Link to={`/requests/${request.id}`} className="request-link">
                      {request.title}
                    </Link>
                  </td>
                  <td>{request.clientName}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
