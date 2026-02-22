import { Clock } from 'lucide-react';
import Card from '../ui/Card';
import PatternBadge from '../ui/PatternBadge';
import type { StudentReflection } from '../../types';

interface InsightsSidebarProps {
  reflections: StudentReflection[];
}

export default function InsightsSidebar({ reflections }: InsightsSidebarProps) {
  if (reflections.length === 0) return null;

  const sorted = [...reflections].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const fmtDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-4">
      <Card className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={16} className="text-indigo-primary" />
          <h3 className="text-sm font-semibold text-gray-900">Notes History</h3>
        </div>

        <div className="space-y-3">
          {sorted.map(r => (
            <div key={r.id} className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400">{fmtDate(r.timestamp)}</span>
                <PatternBadge pattern={r.pattern} size="sm" />
              </div>
              <p className="text-xs font-medium text-gray-700 mb-1">{r.topic}</p>
              <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{r.content}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
