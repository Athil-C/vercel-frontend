import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#22c55e', '#ef4444'];

export default function GoodBadPieChart({ merit = 0, demerit = 0 }) {
  const data = [
    { name: 'Merit', value: merit },
    { name: 'Demerit', value: demerit }
  ];
  return (
    <div className="card p-4">
      <div className="font-medium mb-3">Good vs Bad Points</div>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" outerRadius={80} label>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}


