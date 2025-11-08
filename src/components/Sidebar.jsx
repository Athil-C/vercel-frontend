import { Link, useLocation } from 'react-router-dom';

export default function Sidebar({ role = 'admin' }) {
  const { pathname } = useLocation();
  const nav = role === 'admin'
    ? [
        { to: '/admin', label: 'Dashboard' },
        { to: '/reports', label: 'Reports' }
      ]
    : [ { to: '/student', label: 'My Dashboard' } ];
  return (
    <div className="w-60 h-full border-r border-gray-200 bg-white p-4 sticky top-[57px]">
      <div className="text-sm text-gray-500 mb-3">Navigation</div>
      <nav className="flex flex-col gap-1">
        {nav.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            className={`px-3 py-2 rounded-lg ${pathname === n.to ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'}`}
          >
            {n.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}


