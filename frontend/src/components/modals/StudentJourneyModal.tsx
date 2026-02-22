import { X, TrendingDown, TrendingUp } from 'lucide-react';
import type { Student, ThinkingPattern } from '../../types';
import PatternBadge from '../ui/PatternBadge';
import Card from '../ui/Card';

interface StudentJourneyModalProps {
  student: Student;
  onClose: () => void;
}

const PATTERN_SCORE: Record<ThinkingPattern, number> = {
  confusion: 1,
  curiosity: 2,
  wonder: 3,
  clarity: 4,
};

export default function StudentJourneyModal({ student, onClose }: StudentJourneyModalProps) {
  const sorted = [...student.reflections].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // Build sparkline data from pattern scores
  const sparklineData = sorted.map(r => PATTERN_SCORE[r.pattern]);
  const maxScore = 4;
  const svgWidth = 280;
  const svgHeight = 60;
  const points = sparklineData
    .map((score, i) => {
      const x = (i / Math.max(sparklineData.length - 1, 1)) * svgWidth;
      const y = svgHeight - (score / maxScore) * svgHeight;
      return `${x},${y}`;
    })
    .join(' ');

  // Identify "drops" — transitions into confusion
  const confusionMoments = sorted.filter(r => r.pattern === 'confusion');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-xl max-w-lg w-full max-h-[85vh] overflow-y-auto animate-fade-in-up border border-slate-100">
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-3xl border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-primary/10 flex items-center justify-center text-sm font-bold text-indigo-primary">
              {student.name.charAt(0)}
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{student.name}</h2>
              <p className="text-xs text-gray-400">
                {student.reflections.length} reflections &middot; {student.courses.length} course{student.courses.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        <div className="px-6 py-5 md:px-8 md:py-6 space-y-6">
          {/* Engagement Sparkline */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">Engagement Sparkline</h3>
              <div className="flex items-center gap-3 text-[10px] text-gray-400">
                <span className="flex items-center gap-1"><TrendingDown size={10} className="text-confusion" /> Confusion</span>
                <span className="flex items-center gap-1"><TrendingUp size={10} className="text-clarity" /> Clarity</span>
              </div>
            </div>

            {sparklineData.length > 1 ? (
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-16"
                preserveAspectRatio="none"
              >
                {/* Gradient fill */}
                <defs>
                  <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5D3FD3" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#5D3FD3" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polygon
                  points={`0,${svgHeight} ${points} ${svgWidth},${svgHeight}`}
                  fill="url(#sparkGrad)"
                />
                <polyline
                  points={points}
                  fill="none"
                  stroke="#5D3FD3"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                {/* Dots */}
                {sparklineData.map((score, i) => {
                  const x = (i / Math.max(sparklineData.length - 1, 1)) * svgWidth;
                  const y = svgHeight - (score / maxScore) * svgHeight;
                  const pattern = sorted[i].pattern;
                  const fills: Record<ThinkingPattern, string> = {
                    confusion: '#E85D5D',
                    curiosity: '#DAA520',
                    clarity: '#34C759',
                    wonder: '#7C5CBF',
                  };
                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r="4"
                      fill={fills[pattern]}
                      stroke="white"
                      strokeWidth="2"
                    />
                  );
                })}
              </svg>
            ) : (
              <p className="text-xs text-gray-400">Not enough data for sparkline.</p>
            )}
          </Card>

          {/* Origins of Confusion */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <TrendingDown size={14} className="text-confusion" />
              Origins of Confusion
            </h3>

            {confusionMoments.length === 0 ? (
              <p className="text-sm text-gray-400">No confusion signals detected.</p>
            ) : (
              <div className="space-y-3">
                {confusionMoments.map(r => (
                  <div key={r.id} className="flex gap-3 items-start">
                    <div className="flex-shrink-0 mt-1">
                      <PatternBadge pattern="confusion" showLabel={false} size="sm" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-700 leading-relaxed italic">"{r.content}"</p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {r.topic} &middot; {new Date(r.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Full timeline */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Full Timeline</h3>
            <div className="space-y-2">
              {sorted.map(r => (
                <div key={r.id} className="flex items-start gap-3 py-2 border-b border-slate-50 last:border-0">
                  <PatternBadge pattern={r.pattern} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 truncate">{r.topic}</p>
                    <p className="text-sm text-gray-700 line-clamp-1">"{r.content}"</p>
                  </div>
                  <span className="text-[10px] text-gray-300 flex-shrink-0">
                    {new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
