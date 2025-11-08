import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';

 

export default function Login() {
  const [mode, setMode] = useState('admin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const body = mode === 'admin'
        ? { username, password, role: 'admin' }
        : { username, password, role: 'student' };
      const res = await api.post('/auth/login', body);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      if (res.data.studentId) localStorage.setItem('studentId', res.data.studentId);
      navigate(res.data.role === 'admin' ? '/admin' : '/student');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card w-full max-w-md p-6">
        <div className="text-xl font-semibold mb-1 text-center">College Merit–Demerit</div>
        <div className="text-sm text-gray-500 mb-6 text-center">Sign in</div>
        <div className="flex gap-2 mb-4">
          <button className={`btn flex-1 ${mode === 'admin' ? 'btn-primary' : 'bg-gray-100'}`} onClick={() => setMode('admin')}>Admin</button>
          <button className={`btn flex-1 ${mode === 'student' ? 'btn-primary' : 'bg-gray-100'}`} onClick={() => setMode('student')}>Student</button>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-sm text-gray-600">{mode === 'admin' ? 'Username' : 'Roll Number or Student ID'}</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" />
          </div>
          <div>
            <label className="text-sm text-gray-600">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" />
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <button className="btn btn-primary w-full" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>
       </div>
    </div>
  );
}


