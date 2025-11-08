export default function StatsCard({ title, value, color = 'gray' }) {
  const colorClass = color === 'green' ? 'text-merit' : color === 'red' ? 'text-demerit' : 'text-gray-700';
  return (
    <div className="card p-4">
      <div className="text-sm text-gray-500">{title}</div>
      <div className={`mt-2 text-2xl font-semibold ${colorClass}`}>{value}</div>
    </div>
  );
}


