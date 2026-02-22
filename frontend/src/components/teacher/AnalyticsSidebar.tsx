import { BarChart3, Hash } from 'lucide-react';
import Card from '../ui/Card';
import PatternBadge from '../ui/PatternBadge';
import type { StudentReflection, ThinkingPattern } from '../../types';
import { getPatternDistribution, TOPIC_CLUSTERS } from '../../data/mockData';

interface AnalyticsSidebarProps {
  reflections: StudentReflection[];
}

const BAR_COLORS: Record<ThinkingPattern, string> = {
  confusion: 'bg-confusion',
  curiosity: 'bg-curiosity',
  clarity: 'bg-clarity',
  wonder: 'bg-wonder',
};

export default function AnalyticsSidebar({ reflections }: AnalyticsSidebarProps) {
  const distribution = getPatternDistribution(reflections);
  const total = reflections.length || 1;
  const patterns: ThinkingPattern[] = ['confusion', 'curiosity', 'clarity', 'wonder'];

  // Compute top topics by frequency
  const topicCounts: Record<string, number> = {};
  reflections.forEach(r => {
    topicCounts[r.topic] = (topicCounts[r.topic] || 0) + 1;
  });
  const topTopics = Object.entries(topicCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Aggregate patterns */}
      <Card>
        <div className="flex items-center gap-3 mb-5">
          <BarChart3 size={16} className="text-indigo-primary" />
          <h3 className="text-sm font-semibold text-gray-900">Class Patterns</h3>
        </div>

        <div className="space-y-3">
          {patterns.map(pattern => {
            const pct = Math.round((distribution[pattern] / total) * 100);
            return (
              <div key={pattern}>
                <div className="flex items-center justify-between mb-1">
                  <PatternBadge pattern={pattern} size="sm" />
                  <span className="text-xs font-medium text-gray-500">{pct}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${BAR_COLORS[pattern]}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100">
          <p className="text-xs text-gray-500">
            <span className="font-semibold text-gray-700">{total}</span> reflections analyzed
          </p>
        </div>
      </Card>

      {/* Top topics */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Hash size={16} className="text-indigo-primary" />
          <h3 className="text-sm font-semibold text-gray-900">Top Topics</h3>
        </div>

        <div className="space-y-2">
          {topTopics.map(([topic, count], i) => {
            const cluster = TOPIC_CLUSTERS.find(c => c.label === topic);
            return (
              <div key={topic} className="flex items-center justify-between py-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-300 w-4">{i + 1}.</span>
                  <span className="text-sm text-gray-700">{topic}</span>
                </div>
                <div className="flex items-center gap-2">
                  {cluster && <PatternBadge pattern={cluster.pattern} showLabel={false} size="sm" />}
                  <span className="text-xs text-gray-400">{count}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
