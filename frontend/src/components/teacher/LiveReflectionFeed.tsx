import { MessageSquare, Trash2 } from 'lucide-react';
import Card from '../ui/Card';
import PatternBadge from '../ui/PatternBadge';
import type { StudentReflection } from '../../types';

interface LiveReflectionFeedProps {
  reflections: StudentReflection[];
  onSelectStudent?: (studentId: string) => void;
  onDeleteNote?: (reflection: StudentReflection) => void;
}

export default function LiveReflectionFeed({ reflections, onSelectStudent, onDeleteNote }: LiveReflectionFeedProps) {
  const sorted = [...reflections].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare size={16} className="text-indigo-primary" />
        <h3 className="text-sm font-semibold text-gray-900">Live Reflections</h3>
        <span className="text-xs text-gray-400 ml-auto">{reflections.length} total</span>
      </div>

      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
        {sorted.map((r, i) => (
          <Card
            key={r.id}
            className="animate-fade-in-up cursor-pointer hover:shadow-md transition-all duration-300"
            style={{ animationDelay: `${i * 0.05}s` }}
            onClick={() => onSelectStudent?.(r.studentId)}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-indigo-primary/10 flex items-center justify-center text-xs font-semibold text-indigo-primary">
                  {r.studentName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{r.studentName}</p>
                  <p className="text-[10px] text-gray-400">{r.topic}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {r.className && (
                  <span className="text-xs font-medium text-gray-500">{r.className}</span>
                )}
                <PatternBadge pattern={r.pattern} size="sm" />
                {onDeleteNote && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteNote(r);
                    }}
                    className="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors"
                    title="Delete Note"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
              "{r.content}"
            </p>
            <p className="text-[10px] text-gray-300 mt-2">
              {new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
