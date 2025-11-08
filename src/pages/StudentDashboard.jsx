import { useEffect, useMemo, useState } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import StatsCard from '../components/StatsCard.jsx';
import ActivityTimeline from '../components/ActivityTimeline.jsx';
import GoodBadPieChart from '../components/charts/GoodBadPieChart.jsx';
import ProgressLineChart from '../components/charts/ProgressLineChart.jsx';
import api from '../api.js';

export default function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const id = localStorage.getItem('studentId');
      const res = await api.get(`/students/${id}`);
      setStudent(res.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const finalScore = useMemo(() => {
    if (!student) return 0;
    return (student.totalMerit || 0) - (student.totalDemerit || 0);
  }, [student]);

  const progressData = useMemo(() => {
    if (!student) return [];
    // accumulate score over time
    const sorted = [...student.activities].sort((a, b) => new Date(a.date) - new Date(b.date));
    let score = 0;
    return sorted.map((a) => {
      score += a.type === 'merit' ? a.points : -a.points;
      return { date: new Date(a.date).toLocaleDateString(), score };
    });
  }, [student]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-[240px_1fr] gap-6">
      <Sidebar role="student" />
      <div className="space-y-6">
        {loading || !student ? (
          <div className="text-sm text-gray-500">Loading...</div>
        ) : (
          <>
            <div className="card p-4">
              <div className="font-medium">{student.name}</div>
              <div className="text-sm text-gray-500">{student.department} • {student.rollNumber}</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatsCard title="Total Merits" value={student.totalMerit} color="green" />
              <StatsCard title="Total Demerits" value={student.totalDemerit} color="red" />
              <StatsCard title="Final Score" value={finalScore} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GoodBadPieChart merit={student.totalMerit} demerit={student.totalDemerit} />
              <ProgressLineChart data={progressData} />
            </div>

            <ActivityTimeline activities={student.activities} />
          </>
        )}
      </div>
    </div>
  );
}


