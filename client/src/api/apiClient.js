const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '') + '/api/v1';

export const apiClient = async (endpoint, options = {}) => {
  const token = localStorage.getItem('farmora_token') || localStorage.getItem('token');
  const headers = { ...options.headers };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Only set Content-Type to JSON if body is not FormData
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  let response;
  try {
    response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (networkError) {
    // Server is not running or network is unavailable
    const error = new Error('Unable to connect to the server. Please ensure the backend is running and try again.');
    error.status = 0;
    error.code = 'NETWORK_ERROR';
    throw error;
  }

  const rawData = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(rawData?.error?.message || rawData?.message || 'Request failed');
    error.status = response.status;
    error.response = { data: rawData, status: response.status };
    error.code = rawData?.error?.code;
    error.details = rawData?.error?.details;
    throw error;
  }

  // Return a proxy/merged object so both `res.data.x` (Axios style) and `res.x` (Fetch style) work
  const result = {
    ...rawData,
    data: rawData,
    status: response.status,
    headers: response.headers
  };

  if (rawData && typeof rawData === 'object') {
    if (Array.isArray(rawData.data)) {
      result.problems = result.problems || rawData.data;
      result.users = result.users || rawData.data;
      result.responses = result.responses || rawData.data;
      result.statusHistory = result.statusHistory || rawData.data;
      if (typeof result.data === 'object' && result.data !== null) {
        if (!result.data.problems) result.data.problems = rawData.data;
        if (!result.data.users) result.data.users = rawData.data;
        if (!result.data.responses) result.data.responses = rawData.data;
        if (!result.data.statusHistory) result.data.statusHistory = rawData.data;
      }
    }
    if (rawData.data && typeof rawData.data === 'object' && rawData.data.problem) {
      result.problem = result.problem || rawData.data.problem;
      if (typeof result.data === 'object' && result.data !== null && !result.data.problem) {
        result.data.problem = rawData.data.problem;
      }
    }
    if (rawData.responses) {
      result.responses = rawData.responses;
    }
    if (rawData.statusHistory) {
      result.statusHistory = rawData.statusHistory;
    }
  }

  return result;
};

// Convenience methods
apiClient.get = (endpoint, options = {}) => {
  return apiClient(endpoint, { ...options, method: 'GET' });
};

apiClient.post = (endpoint, data, options = {}) => {
  const isFormData = data instanceof FormData;
  return apiClient(endpoint, {
    ...options,
    method: 'POST',
    body: isFormData ? data : JSON.stringify(data),
  });
};

apiClient.put = (endpoint, data, options = {}) => {
  const isFormData = data instanceof FormData;
  return apiClient(endpoint, {
    ...options,
    method: 'PUT',
    body: isFormData ? data : JSON.stringify(data),
  });
};

apiClient.patch = (endpoint, data, options = {}) => {
  const isFormData = data instanceof FormData;
  return apiClient(endpoint, {
    ...options,
    method: 'PATCH',
    body: isFormData ? data : JSON.stringify(data),
  });
};

apiClient.delete = (endpoint, options = {}) => {
  return apiClient(endpoint, { ...options, method: 'DELETE' });
};

export default apiClient;
