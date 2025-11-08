import { useState } from 'react';
import Sidebar from '../components/Sidebar.jsx';

export default function Reports() {
  const [downloading, setDownloading] = useState(false);

  async function downloadCsv() {
    try {
      setDownloading(true);
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/export/csv', { headers: { Authorization: `Bearer ${token}` } });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'report.csv';
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-[240px_1fr] gap-6">
      <Sidebar role="admin" />
      <div className="space-y-6">
        <div className="card p-4">
          <div className="font-medium mb-2">Reports</div>
          <div className="text-sm text-gray-500 mb-4">Export leaderboard and summary analytics.</div>
          <button className="btn btn-primary" onClick={downloadCsv} disabled={downloading}>{downloading ? 'Preparing...' : 'Export CSV'}</button>
        </div>
      </div>
    </div>
  );
}


