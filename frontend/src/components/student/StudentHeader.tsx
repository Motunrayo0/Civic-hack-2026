import { Upload } from 'lucide-react';
import type { StudentInsights, StudentReflection } from '../../types';
import PatternBadge from '../ui/PatternBadge';

interface StudentHeaderProps {
  greeting: string;
  insights: StudentInsights;
  reflections: StudentReflection[];
}

export default function StudentHeader({ greeting, insights, reflections }: StudentHeaderProps) {
  const sorted = [...reflections].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
      <div>
        <p className="text-sm text-gray-400 mb-1">Welcome back,</p>
        <h1 className="font-serif text-4xl text-gray-900">{greeting}</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Thinking Timeline */}
        <div className="glass rounded-2xl px-4 py-2 flex items-center gap-2 border border-slate-100">
          <span className="text-xs text-gray-500">Recent timeline</span>
          <div className="flex items-center gap-1.5">
            {sorted.map((r, i) => (
              <div key={r.id} className="flex items-center gap-1.5">
                <div className="group relative flex-shrink-0">
                  <PatternBadge pattern={r.pattern} showLabel={false} size="sm" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                    <div className="glass rounded-xl px-3 py-2 border border-slate-100 shadow-md whitespace-nowrap text-xs">
                      <p className="font-medium text-gray-700">{r.topic}</p>
                      <p className="text-gray-400 mt-0.5">
                        {new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
                {i < sorted.length - 1 && (
                  <div className="w-3 h-px bg-slate-200 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recent patterns */}
        <div className="glass rounded-2xl px-4 py-2 flex items-center gap-2 border border-slate-100">
          <span className="text-xs text-gray-500">Recent patterns</span>
          <div className="flex gap-1">
            {insights.recentPatterns.slice(0, 5).map((p, i) => (
              <PatternBadge key={i} pattern={p} showLabel={false} size="sm" />
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl px-4 py-2 border border-slate-100">
          <span className="text-xs text-gray-500">Convergence</span>
          <span className="ml-2 text-sm font-semibold text-indigo-primary">
            {Math.round(insights.semanticConvergence * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}
