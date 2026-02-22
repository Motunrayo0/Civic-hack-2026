import { useState, useEffect } from 'react';
import { X, Users, Sparkles } from 'lucide-react';
import PatternBadge from '../ui/PatternBadge';
import type { TopicCluster, StudentReflection } from '../../types';
import { getClusterSummary } from '../../services/api';

interface ClusterOverlayProps {
  cluster: TopicCluster;
  reflections: StudentReflection[];
  onClose: () => void;
  onSelectStudent: (studentId: string) => void;
}

export default function ClusterOverlay({ cluster, reflections, onClose, onSelectStudent }: ClusterOverlayProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(true);

  // De-duplicate reflections per student, keeping the most recent one
  const byStudent = new Map<string, StudentReflection>();
  reflections.forEach(r => {
    const existing = byStudent.get(r.studentId);
    if (!existing || new Date(r.timestamp) > new Date(existing.timestamp)) {
      byStudent.set(r.studentId, r);
    }
  });
  const studentReflections = Array.from(byStudent.values());

  // Fetch AI cluster summary on mount
  useEffect(() => {
    const notes = studentReflections.map(r => r.content);
    if (notes.length === 0) {
      setIsSummarizing(false);
      return;
    }

    let cancelled = false;
    setIsSummarizing(true);

    getClusterSummary(notes, cluster.pattern)
      .then(text => {
        if (!cancelled) setSummary(text);
      })
      .catch(err => {
        console.warn('Could not fetch cluster summary', err);
        if (!cancelled) setSummary(null);
      })
      .finally(() => {
        if (!cancelled) setIsSummarizing(false);
      });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cluster.id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in-up flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-primary/10 flex items-center justify-center">
              <Users size={18} className="text-indigo-primary" />
            </div>
            <div>
              <h2 className="text-lg font-serif text-gray-900">{cluster.label}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <PatternBadge pattern={cluster.pattern} size="sm" />
                <span className="text-xs text-gray-400">{cluster.count} student{cluster.count !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cluster Summary */}
        <div className="px-5 pt-4 pb-2">
          <div className="glass rounded-2xl p-3 border border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-indigo-primary" />
              <span className="text-xs font-medium text-indigo-primary">Cluster Insight</span>
            </div>

            {isSummarizing ? (
              /* Loading skeleton — 2 pulsing lines */
              <div className="space-y-2 pt-1">
                <div className="h-3 bg-slate-100 rounded-full w-full animate-pulse" />
                <div className="h-3 bg-slate-100 rounded-full w-3/4 animate-pulse" style={{ animationDelay: '150ms' }} />
              </div>
            ) : summary ? (
              <p className="text-sm text-gray-600 leading-relaxed">{summary}</p>
            ) : (
              <p className="text-sm text-gray-400 italic">Could not generate a summary for this cluster.</p>
            )}
          </div>
        </div>

        {/* Student Reflections */}
        <div className="p-5 overflow-y-auto space-y-3">
          {studentReflections.length === 0 ? (
            <p className="text-center py-8 text-gray-400 text-sm">No reflections found for this cluster.</p>
          ) : (
            studentReflections.map(r => (
              <button
                key={r.id}
                onClick={() => onSelectStudent(r.studentId)}
                className="w-full text-left p-4 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-semibold text-gray-900">{r.studentName}</span>
                  <span className="text-[10px] text-gray-400">
                    {new Date(r.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">"{r.content}"</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] text-gray-400 bg-slate-50 px-2 py-0.5 rounded-full">{r.topic}</span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
