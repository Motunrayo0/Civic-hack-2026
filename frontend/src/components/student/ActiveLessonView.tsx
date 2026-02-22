import { Lightbulb, Sparkles } from 'lucide-react';
import Card from '../ui/Card';
import type { Course, StudentReflection } from '../../types';
import PatternBadge from '../ui/PatternBadge';

interface ActiveLessonViewProps {
  course: Course;
  reflections: StudentReflection[];
}

export default function ActiveLessonView({ course, reflections }: ActiveLessonViewProps) {
  const topicReflections = reflections.filter(r => r.topic === course.recentTopic);
  console.log(topicReflections);
  const latestNote = topicReflections[topicReflections.length - 1];

  return (
    <Card className="mb-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs text-gray-400 font-mono">{course.code}</p>
          <h2 className="font-serif text-2xl text-gray-900 mt-1">{course.recentTopic}</h2>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Lightbulb size={14} className="text-curiosity" />
          Active lesson
        </div>
      </div>

      {/* AI Summary */}
      <div className="glass rounded-2xl p-3 border border-slate-100 mb-3">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={14} className="text-indigo-primary" />
          <span className="text-xs font-medium text-indigo-primary">AI Synthesis</span>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed pt-4">
          The class is exploring themes of <strong>gravitational collapse, spacetime curvature, and the nature of singularities</strong> in this topic.
          Key tensions have surfaced around whether information is truly destroyed at the event horizon or preserved in some form.
        </p>
      </div>

      {/* Latest Note */}
      {latestNote && (
        <div className="border-t border-slate-100 pt-4">
          <p className="text-xs text-gray-400 mb-2">Your latest note</p>
          <div className="flex items-start gap-3">
            <PatternBadge pattern={latestNote.pattern} size="sm" />
            <p className="text-sm text-gray-700 leading-relaxed italic">
              "{latestNote.content}"
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}
