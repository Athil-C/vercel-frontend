import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function MeritDemeritBarChart({ data = [] }) {
  return (
    <div className="card p-4">
      <div className="font-medium mb-3">Merits vs Demerits</div>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalMerit" fill="#22c55e" name="Merit" />
            <Bar dataKey="totalDemerit" fill="#ef4444" name="Demerit" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}


