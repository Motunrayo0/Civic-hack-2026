import { TrendingUp, Clock } from 'lucide-react';
import Card from '../ui/Card';
import PatternBadge from '../ui/PatternBadge';
import type { StudentInsights, StudentReflection, ThinkingPattern } from '../../types';
import { getPatternDistribution } from '../../data/mockData';

interface InsightsSidebarProps {
  insights: StudentInsights;
  reflections: StudentReflection[];
}

export default function InsightsSidebar({ reflections }: InsightsSidebarProps) {
  const distribution = getPatternDistribution(reflections);
  const total = reflections.length || 1;

  const patterns: ThinkingPattern[] = ['clarity', 'curiosity', 'confusion'];

  const BAR_COLORS: Record<ThinkingPattern, string> = {
    confusion: 'bg-confusion',
    curiosity: 'bg-curiosity',
    clarity: 'bg-clarity',
  };

  const sorted = [...reflections].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const fmtDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-4">
      {/* Pattern distribution */}
      <Card className="mt-8">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={16} className="text-indigo-primary" />
          <h3 className="text-sm font-semibold text-gray-900">Learning Patterns</h3>
        </div>

        <div className="space-y-3">
          {patterns.map(pattern => (
            <div key={pattern}>
              <div className="flex items-center justify-between mb-1">
                <PatternBadge pattern={pattern} size="sm" />
                <span className="text-xs text-gray-400">{distribution[pattern]}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${BAR_COLORS[pattern]}`}
                  style={{ width: `${(distribution[pattern] / total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Notes history */}
      {reflections.length > 0 && (
        <Card>
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
      )}
    </div>
  );
}
