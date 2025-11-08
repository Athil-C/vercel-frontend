export default function ActivityTimeline({ activities = [], onDelete }) {
  return (
    <div className="card p-4">
      <div className="font-medium mb-3">Activity Timeline</div>
      <div className="space-y-3">
        {activities.length === 0 && <div className="text-sm text-gray-500">No activities yet.</div>}
        {activities.map((a, idx) => {
          const key = a.activityId || a._id || idx;
          return (
            <div key={key} className="flex items-start gap-3">
              <div className={`w-2 h-2 mt-2 rounded-full ${a.type === 'merit' ? 'bg-merit' : 'bg-demerit'}`}></div>
              <div className="flex-1">
                <div className="text-sm flex items-start justify-between gap-3">
                  <div>
                    <span className={`font-medium ${a.type === 'merit' ? 'text-merit' : 'text-demerit'}`}>
                      {a.type === 'merit' ? '+ ' : '- '}
                      {a.points}
                    </span>
                    <span className="ml-2">{a.reason}</span>
                  </div>
                  {onDelete && (
                    <button
                      className="text-xs text-red-600 hover:underline"
                      onClick={() => onDelete({ activityId: a.activityId || a._id, index: idx })}
                    >
                      Delete
                    </button>
                  )}
                </div>
                <div className="text-xs text-gray-500">{new Date(a.date).toLocaleString()}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


