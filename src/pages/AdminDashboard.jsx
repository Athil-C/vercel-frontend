import { useEffect, useMemo, useState } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import StatsCard from '../components/StatsCard.jsx';
import MeritDemeritBarChart from '../components/charts/MeritDemeritBarChart.jsx';
import ActivityTimeline from '../components/ActivityTimeline.jsx';
import api from '../api.js';

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ department: '', batch: '', q: '' });
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedLoading, setSelectedLoading] = useState(false);
  const [addStatus, setAddStatus] = useState({ type: '', message: '' });
  const [assignStatus, setAssignStatus] = useState({ type: '', message: '' });

  async function load() {
    setLoading(true); setError('');
    try {
      const res = await api.get('/admin/leaderboard', { params: filters });
      setStudents(res.data);
      if (selectedStudent) {
        const stillExists = res.data.find((s) => s._id === selectedStudent._id);
        if (!stillExists) setSelectedStudent(null);
      }
    } catch (err) {
      setError('Failed to load');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const totals = useMemo(() => {
    let tm = 0, td = 0;
    for (const s of students) { tm += s.totalMerit || 0; td += s.totalDemerit || 0; }
    return { tm, td };
  }, [students]);

  async function fetchStudent(id) {
    if (!id) return;
    setSelectedLoading(true);
    try {
      const res = await api.get(`/students/${id}`);
      setSelectedStudent(res.data);
    } catch (_) {
      setSelectedStudent(null);
    } finally {
      setSelectedLoading(false);
    }
  }

  async function handleAddStudent(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      await api.post('/admin/add-student', payload);
      e.currentTarget.reset();
      await load();
      setAddStatus({ type: 'success', message: 'Student added successfully.' });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add student';
      setAddStatus({ type: 'error', message: msg });
    } finally {
      setTimeout(() => setAddStatus({ type: '', message: '' }), 3500);
    }
  }

  async function handleAssignPoints(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    const identifier = payload.identifier?.trim();
    delete payload.identifier;
    payload.points = Number(payload.points);
    if (identifier) {
      if (identifier.length === 24) payload.studentId = identifier;
      else payload.rollNumber = identifier;
    }
    try {
      await api.post('/admin/assign-points', payload);
      e.currentTarget.reset();
      await load();
      if (
        selectedStudent &&
        (selectedStudent._id === payload.studentId ||
          selectedStudent.rollNumber === payload.rollNumber)
      ) {
        await fetchStudent(selectedStudent._id);
      }
      setAssignStatus({ type: 'success', message: 'Points assigned successfully.' });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to assign points';
      setAssignStatus({ type: 'error', message: msg });
    } finally {
      setTimeout(() => setAssignStatus({ type: '', message: '' }), 3500);
    }
  }

  async function handleDeleteStudent(student) {
    if (!confirm(`Delete ${student.name}? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/students/${student._id}`);
      await load();
      if (selectedStudent?._id === student._id) setSelectedStudent(null);
    } catch (_) {}
  }

  async function handleDeleteActivity({ activityId, index }) {
    if (!selectedStudent) return;
    if (!confirm('Delete this activity?')) return;
    try {
      await api.delete(`/admin/students/${selectedStudent._id}/activities/${activityId}`, {
        params: { index }
      });
      await fetchStudent(selectedStudent._id);
      await load();
    } catch (_) {}
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-[240px_1fr] gap-6">
      <Sidebar role="admin" />
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatsCard title="Total Merits" value={totals.tm} color="green" />
          <StatsCard title="Total Demerits" value={totals.td} color="red" />
          <StatsCard title="Students" value={students.length} />
        </div>

        <div className="card p-4">
          <div className="font-medium mb-3">Filters</div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            <input placeholder="Department" className="border rounded-lg px-3 py-2" value={filters.department} onChange={(e) => setFilters(v => ({ ...v, department: e.target.value }))} />
            <input placeholder="Batch" className="border rounded-lg px-3 py-2" value={filters.batch} onChange={(e) => setFilters(v => ({ ...v, batch: e.target.value }))} />
            <input placeholder="Search name or roll" className="border rounded-lg px-3 py-2" value={filters.q} onChange={(e) => setFilters(v => ({ ...v, q: e.target.value }))} />
            <button className="btn btn-primary" onClick={load}>Apply</button>
          </div>
        </div>

        <MeritDemeritBarChart data={students.map(s => ({ name: s.name.split(' ')[0], totalMerit: s.totalMerit, totalDemerit: s.totalDemerit }))} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <form onSubmit={handleAddStudent} className="card p-4 space-y-3">
            <div className="font-medium">Add Student</div>
            <input name="name" placeholder="Name" className="border rounded-lg px-3 py-2" required />
            <input name="rollNumber" placeholder="Roll Number" className="border rounded-lg px-3 py-2" required />
            <input name="department" placeholder="Department" className="border rounded-lg px-3 py-2" required />
            <input name="batch" placeholder="Batch" className="border rounded-lg px-3 py-2" />
            <input name="password" placeholder="Temp Password" className="border rounded-lg px-3 py-2" required />
            <button className="btn btn-primary w-full">Add</button>
          </form>

          <form onSubmit={handleAssignPoints} className="card p-4 space-y-3">
            <div className="font-medium">Assign Merit/Demerit</div>
            <select name="type" className="border rounded-lg px-3 py-2" required>
              <option value="merit">Merit</option>
              <option value="demerit">Demerit</option>
            </select>
            <input name="identifier" placeholder="Student ID or Roll Number" className="border rounded-lg px-3 py-2" required />
            <input name="points" type="number" placeholder="Points" className="border rounded-lg px-3 py-2" required />
            <input name="reason" placeholder="Reason" className="border rounded-lg px-3 py-2" required />
            <button className="btn btn-primary w-full">Assign</button>
          </form>
        </div>

        <div className="card p-4">
          <div className="font-medium mb-3">Leaderboard</div>
          {loading ? (
            <div className="text-sm text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-sm text-red-600">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="py-2">Name</th>
                    <th className="py-2">Roll</th>
                    <th className="py-2">Dept</th>
                    <th className="py-2">Merit</th>
                    <th className="py-2">Demerit</th>
                    <th className="py-2">Final</th>
                    <th className="py-2">ID</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s._id} className="border-t">
                      <td className="py-2">{s.name}</td>
                      <td className="py-2">{s.rollNumber}</td>
                      <td className="py-2">{s.department}</td>
                      <td className="py-2 text-merit font-medium">{s.totalMerit}</td>
                      <td className="py-2 text-demerit font-medium">{s.totalDemerit}</td>
                      <td className="py-2 font-semibold">{(s.totalMerit || 0) - (s.totalDemerit || 0)}</td>
                      <td className="py-2 text-xs text-gray-500">{s._id}</td>
                      <td className="py-2 space-x-3">
                        <button
                          className="text-blue-600 hover:underline"
                          onClick={() => fetchStudent(s._id)}
                        >
                          View
                        </button>
                        <button
                          className="text-red-600 hover:underline"
                          onClick={() => handleDeleteStudent(s)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {selectedStudent && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{selectedStudent.name}</div>
                  <div className="text-sm text-gray-500">
                    {selectedStudent.department} • {selectedStudent.rollNumber}
                  </div>
                </div>
                <button className="text-xs text-gray-500 hover:underline" onClick={() => setSelectedStudent(null)}>
                  Close
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4 text-center text-sm">
                <div className="card p-3">
                  <div className="text-gray-500">Merit</div>
                  <div className="text-lg font-semibold text-merit">{selectedStudent.totalMerit}</div>
                </div>
                <div className="card p-3">
                  <div className="text-gray-500">Demerit</div>
                  <div className="text-lg font-semibold text-demerit">{selectedStudent.totalDemerit}</div>
                </div>
                <div className="card p-3">
                  <div className="text-gray-500">Final</div>
                  <div className="text-lg font-semibold">{(selectedStudent.totalMerit || 0) - (selectedStudent.totalDemerit || 0)}</div>
                </div>
              </div>
            </div>

            {selectedLoading ? (
              <div className="card p-4 text-sm text-gray-500">Loading activities...</div>
            ) : (
              <ActivityTimeline
                activities={selectedStudent.activities || []}
                onDelete={handleDeleteActivity}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}


