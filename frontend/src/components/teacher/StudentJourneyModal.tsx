import { X, BookOpen } from 'lucide-react';
import Card from '../ui/Card';
import PatternBadge from '../ui/PatternBadge';
import type { StudentReflection } from '../../types';

interface StudentJourneyModalProps {
    studentName: string;
    reflections: StudentReflection[];
    onClose: () => void;
}

export default function StudentJourneyModal({ studentName, reflections, onClose }: StudentJourneyModalProps) {
    // Sort reflections chronologically (oldest first) to show a "journey"
    const sorted = [...reflections].sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-primary/10 flex items-center justify-center text-indigo-primary font-semibold">
                            {studentName.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-lg font-serif text-gray-900">{studentName}'s Journey</h2>
                            <p className="text-sm text-gray-500">{reflections.length} total reflections</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content - Scrollable list of past notes */}
                <div className="p-6 overflow-y-auto overflow-x-hidden space-y-6">
                    {sorted.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 flex flex-col items-center">
                            <BookOpen size={48} className="text-slate-200 mb-4" />
                            <p>No reflections recorded yet.</p>
                        </div>
                    ) : (
                        <div className="relative">
                            {/* Timeline line in background */}
                            <div className="absolute left-[15px] top-4 bottom-4 w-px bg-slate-200" />

                            <div className="space-y-8 relative">
                                {sorted.map((r) => (
                                    <div key={r.id} className="relative flex gap-6">
                                        {/* Timeline Node */}
                                        <div className="relative flex flex-col items-center mt-1.5">
                                            <div className="w-8 h-8 rounded-full bg-white border-2 border-indigo-100 flex items-center justify-center shadow-sm z-10">
                                                <div className="w-2.5 h-2.5 rounded-full bg-indigo-primary" />
                                            </div>
                                        </div>

                                        {/* Card Content */}
                                        <Card className="flex-1 hover:border-indigo-100 transition-colors">
                                            <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-2">
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900">{r.topic}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-xs text-gray-400">
                                                            {new Date(r.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                                        </span>
                                                        <span className="text-xs text-gray-300">•</span>
                                                        <span className="text-xs text-gray-400">
                                                            {new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {r.className && (
                                                        <span className="text-[10px] font-medium text-gray-400 bg-slate-50 px-2 py-0.5 rounded-full">
                                                            {r.className}
                                                        </span>
                                                    )}
                                                    <PatternBadge pattern={r.pattern} size="sm" />
                                                </div>
                                            </div>
                                            <p className="text-gray-700 text-sm leading-relaxed">
                                                "{r.content}"
                                            </p>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
