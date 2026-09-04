/**
 * Centralized API Service Helper
 */
const envBaseUrl = import.meta.env.VITE_API_BASE_URL;
const defaultBaseUrl = import.meta.env.DEV
  ? '/api'
  : 'https://power-and-water-cut-alert-and-reporting-6377.onrender.com/api';

let resolvedBaseUrl = (envBaseUrl || defaultBaseUrl).trim().replace(/\/+$/, '');
// Ensure `/api` path is appended if an absolute origin URL without `/api` is supplied
if (resolvedBaseUrl.startsWith('http') && !resolvedBaseUrl.endsWith('/api')) {
  resolvedBaseUrl = `${resolvedBaseUrl}/api`;
}

const BASE_URL = resolvedBaseUrl;


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

    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      try {
        data = await response.json();
      } catch {
        data = { message: `Malformed JSON response (status ${response.status})` };
      }
    } else {
      const text = await response.text();
      data = { message: text || `Request failed with status ${response.status}` };
    }

    if (!response.ok) {
      // If unauthorized, ensure corrupted or expired token is cleared
      if (response.status === 401 && token) {
        localStorage.removeItem('token');
      }
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

export const getMyReportsApi = () => apiRequest('/reports/user/me');

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
