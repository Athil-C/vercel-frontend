import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ...existing code...
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function fetchStudents() {
    const res = await fetch(`${API_BASE}/api/students`);
    return res.json();
}
// ...existing code...
export default api;


