import type { StudentReflection } from '../../types';
import PatternBadge from '../ui/PatternBadge';

interface ContributionTimelineProps {
  reflections: StudentReflection[];
}

export default function ContributionTimeline({ reflections }: ContributionTimelineProps) {
  const sorted = [...reflections].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium text-gray-500 mb-2">Your Thinking Timeline</h3>
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {sorted.map((r, i) => (
          <div key={r.id} className="flex items-center gap-2">
            <div className="group relative flex-shrink-0">
              <PatternBadge pattern={r.pattern} showLabel={false} size="md" />
              {/* Hover tooltip */}
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
              <div className="w-4 h-px bg-slate-200 flex-shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
