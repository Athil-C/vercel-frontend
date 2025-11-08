import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import StudentDashboard from './pages/StudentDashboard.jsx';
import Reports from './pages/Reports.jsx';

function useAuth() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  return { token, role };
}

function Protected({ children, roles }) {
  const { token, role } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(role)) return <Navigate to="/login" replace />;
  return children;
}

function NavBar() {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  function logout() {
    localStorage.clear();
    navigate('/login');
  }
  return (
    <div className="w-full bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold">College Merit–Demerit</Link>
        <div className="flex items-center gap-3">
          {role === 'admin' && <Link className="text-sm" to="/admin">Dashboard</Link>}
          {role === 'student' && <Link className="text-sm" to="/student">My Dashboard</Link>}
          <button className="btn" onClick={logout}>Logout</button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <Protected roles={[ 'admin' ]}>
              <NavBar />
              <AdminDashboard />
            </Protected>
          }
        />
        <Route
          path="/student"
          element={
            <Protected roles={[ 'student' ]}>
              <NavBar />
              <StudentDashboard />
            </Protected>
          }
        />
        <Route
          path="/reports"
          element={
            <Protected roles={[ 'admin' ]}>
              <NavBar />
              <Reports />
            </Protected>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}


