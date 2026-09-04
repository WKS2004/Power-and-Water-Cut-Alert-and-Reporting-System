/**
 * Centralized API Service Helper
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Universal request wrapper with token authorization & error handling
 */
export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`[API Error] ${endpoint}:`, error.message);
    throw error;
  }
}

// System Health
export const checkHealth = () => apiRequest('/health');

// Authentication API
export const loginApi = (credentials) =>
  apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

export const registerApi = (userData) =>
  apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });

export const getMeApi = () => apiRequest('/auth/me');

// Public & User Outage Reports API
export const getReportsApi = (area = 'all') => {
  const query = area && area !== 'all' ? `?area=${encodeURIComponent(area)}` : '';
  return apiRequest(`/reports${query}`);
};

export const submitReportApi = (reportData) =>
  apiRequest('/reports', {
    method: 'POST',
    body: JSON.stringify(reportData),
  });

// Admin API
export const getAdminReportsApi = () => apiRequest('/admin/reports');

export const createOfficialAlertApi = (alertData) =>
  apiRequest('/admin/alerts', {
    method: 'POST',
    body: JSON.stringify(alertData),
  });

export const approveReportApi = (reportId) =>
  apiRequest(`/admin/reports/${reportId}/approve`, {
    method: 'PUT',
  });

export const rejectReportApi = (reportId) =>
  apiRequest(`/admin/reports/${reportId}`, {
    method: 'DELETE',
  });

export const getTimeSkipApi = () => apiRequest('/admin/time-skip');

export const setTimeSkipApi = (payload) =>
  apiRequest('/admin/time-skip', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
