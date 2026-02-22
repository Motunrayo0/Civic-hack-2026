import { X } from 'lucide-react';
import type { TopicCluster, StudentReflection, ThinkingPattern } from '../../types';
import PatternBadge from '../ui/PatternBadge';

interface TopicClusterModalProps {
  cluster: TopicCluster;
  reflections: StudentReflection[];
  onClose: () => void;
}

const PATTERN_ORDER: ThinkingPattern[] = ['confusion', 'curiosity', 'wonder', 'clarity'];

export default function TopicClusterModal({ cluster, reflections, onClose }: TopicClusterModalProps) {
  const topicReflections = reflections.filter(r => r.topic === cluster.label);

  const grouped = PATTERN_ORDER.reduce((acc, pattern) => {
    acc[pattern] = topicReflections.filter(r => r.pattern === pattern);
    return acc;
  }, {} as Record<ThinkingPattern, StudentReflection[]>);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto animate-fade-in-up border border-slate-100">
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-3xl border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <PatternBadge pattern={cluster.pattern} size="md" />
            <div>
              <h2 className="font-semibold text-gray-900">{cluster.label}</h2>
              <p className="text-xs text-gray-400">
                {topicReflections.length} reflection{topicReflections.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          {PATTERN_ORDER.map(pattern => {
            const items = grouped[pattern];
            if (items.length === 0) return null;

            return (
              <div key={pattern}>
                <div className="flex items-center gap-2 mb-3">
                  <PatternBadge pattern={pattern} size="sm" />
                  <span className="text-xs text-gray-400">
                    {items.length} {items.length === 1 ? 'response' : 'responses'}
                  </span>
                </div>

                <div className="space-y-2">
                  {items.map(r => (
                    <div
                      key={r.id}
                      className="rounded-xl bg-slate-50 px-4 py-3 flex items-start gap-3"
                    >
                      <div className="w-7 h-7 rounded-full bg-indigo-primary/10 flex items-center justify-center text-[11px] font-bold text-indigo-primary flex-shrink-0 mt-0.5">
                        {r.studentName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <span className="text-xs font-medium text-gray-700">{r.studentName}</span>
                          <span className="text-[10px] text-gray-300 flex-shrink-0">
                            {new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">"{r.content}"</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {topicReflections.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">No reflections for this topic yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
