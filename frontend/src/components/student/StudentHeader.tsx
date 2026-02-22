import type { StudentInsights } from '../../types';
import PatternBadge from '../ui/PatternBadge';

interface StudentHeaderProps {
  greeting: string;
  insights: StudentInsights;
}

export default function StudentHeader({ greeting, insights }: StudentHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
      <div>
        <p className="text-sm text-gray-400 mb-1">Welcome back,</p>
        <h1 className="font-serif text-4xl text-gray-900">{greeting}</h1>
      </div>

      <div className="flex items-center gap-3">
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
