import { TrendingUp, MessageCircle } from 'lucide-react';
import Card from '../ui/Card';
import PatternBadge from '../ui/PatternBadge';
import type { StudentInsights, StudentReflection, ThinkingPattern } from '../../types';
import { getPatternDistribution } from '../../data/mockData';

interface InsightsSidebarProps {
  insights: StudentInsights;
  reflections: StudentReflection[];
}

export default function InsightsSidebar({ insights, reflections }: InsightsSidebarProps) {
  const distribution = getPatternDistribution(reflections);
  const total = reflections.length || 1;

  const patterns: ThinkingPattern[] = ['clarity', 'curiosity', 'wonder', 'confusion'];

  const BAR_COLORS: Record<ThinkingPattern, string> = {
    confusion: 'bg-confusion',
    curiosity: 'bg-curiosity',
    clarity: 'bg-clarity',
    wonder: 'bg-wonder',
  };

  return (
    <div className="space-y-4">
      {/* Pattern distribution */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
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

      {/* Pedagogical advice */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <MessageCircle size={16} className="text-indigo-primary" />
          <h3 className="text-sm font-semibold text-gray-900">Insight</h3>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          {insights.pedagogicalAdvice}
        </p>
      </Card>
    </div>
  );
}
