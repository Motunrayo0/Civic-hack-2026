import { useState, useEffect } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LiveReflectionFeed from '../components/teacher/LiveReflectionFeed';
import AnalyticsSidebar from '../components/teacher/AnalyticsSidebar';
import StudentJourneyModal from '../components/teacher/StudentJourneyModal';
import LivePulseCanvas from '../components/teacher/LivePulseCanvas';
import ClusterOverlay from '../components/teacher/ClusterOverlay';
import type { StudentReflection, TopicCluster } from '../types';
import { getStudents, getClassroomHeatmap } from '../services/api';

export default function ClassroomPulse() {
  const navigate = useNavigate();

  const [reflections, setReflections] = useState<StudentReflection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [heatmapClusters, setHeatmapClusters] = useState<TopicCluster[]>([]);
  const [selectedCluster, setSelectedCluster] = useState<TopicCluster | null>(null);

  // We are hardcoding the course and date for the hackathon demo
  const courseCode = 'Shakespeare_ENG302';

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const studentsData = await getStudents();

        // For the hackathon demo, we check 2026-02-21
        const targetDate = '2026-02-21';
        let heatmapData: any[] = [];
        let parsedClusters: TopicCluster[] = [];

        try {
          heatmapData = await getClassroomHeatmap(courseCode, targetDate);

          // Group students by (cluster + sentiment) so each sentiment gets its own orb
          const SENTIMENT_OFFSETS: Record<string, { dx: number; dy: number }> = {
            confusion: { dx: -8, dy: -5 },
            curiosity: { dx: 8, dy: -5 },
            clarity: { dx: -8, dy: 8 }
          };

          const clusterMap = new Map<string, {
            label: string,
            count: number,
            xSum: number,
            ySum: number,
            basePattern: string,
            spatialCluster: number,
            studentIds: string[]
          }>();

          heatmapData.forEach((node: any) => {
            let sentiment = node.sentiment?.toLowerCase() || 'curiosity';
            if (sentiment === 'unanswered_question') sentiment = 'confusion';
            const compositeKey = `${node.cluster}_${sentiment}`;

            if (!clusterMap.has(compositeKey)) {
              clusterMap.set(compositeKey, {
                label: node.confusion_topics?.[0]?.topic || node.topic || 'General',
                count: 0,
                xSum: 0,
                ySum: 0,
                basePattern: sentiment,
                spatialCluster: node.cluster,
                studentIds: []
              });
            }
            const c = clusterMap.get(compositeKey)!;
            c.count++;
            c.studentIds.push(node.student_id);
            // Keep coordinates between 10-90 for canvas bounds
            c.xSum += Math.max(10, Math.min(90, (node.x * 50) + 50));
            c.ySum += Math.max(10, Math.min(90, (node.y * 50) + 50));
          });

          parsedClusters = Array.from(clusterMap.entries()).map(([key, stats]) => {
            const offset = SENTIMENT_OFFSETS[stats.basePattern] || { dx: 0, dy: 0 };
            const avgX = stats.xSum / stats.count;
            const avgY = stats.ySum / stats.count;

            return {
              id: `cluster_${key}`,
              label: stats.label,
              count: stats.count,
              pattern: stats.basePattern as any,
              x: Math.max(5, Math.min(95, avgX + offset.dx)),
              y: Math.max(5, Math.min(95, avgY + offset.dy)),
              size: Math.min(100, Math.max(40, stats.count * 15)),
              studentIds: stats.studentIds
            };
          });

          setHeatmapClusters(parsedClusters);

        } catch (e) {
          console.warn("Could not load heatmap data for reflection cards", e);
        }

        const newReflections: StudentReflection[] = [];

        studentsData.forEach(student => {
          if (student.classes && student.classes[courseCode]) {
            const classData = student.classes[courseCode];
            Object.entries(classData).forEach(([date, noteData]) => {

              let pattern = 'curiosity';
              const hNode = heatmapData.find((n: any) => n.student_id === student._id);

              if (hNode && date === targetDate) {
                pattern = hNode.sentiment.toLowerCase();
              }

              newReflections.push({
                id: `r_${student._id}_${date}`,
                studentId: student._id,
                studentName: student.name,
                content: noteData.notes,
                pattern: pattern as any,
                timestamp: new Date(date).toISOString(),
                topic: noteData.topic || 'General Discussion',
                className: courseCode
              });
            });
          }
        });

        setReflections(newReflections);
      } catch (e: any) {
        console.error("Failed to load students data", e);
        setError(e.message || "Failed to connect to the backend API.");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSelectStudentId = (studentId: string) => {
    setSelectedStudentId(studentId);
  };

  const handleDeleteNote = async (reflection: StudentReflection) => {
    try {
      if (!reflection.className) {
        throw new Error("Cannot delete note without a valid class name.");
      }

      // Parse out the date from the ID (format: r_{studentId}_{date})
      const parts = reflection.id.split('_');
      // Reconstruct the date part, joining remaining parts in case the date contains underscores
      const dateStr = parts.slice(2).join('_');

      await import('../services/api').then(m => m.deleteNote(reflection.studentId, reflection.className!, dateStr));

      // Remove from UI state to update optimistically
      setReflections(prev => prev.filter(r => r.id !== reflection.id));
    } catch (e: any) {
      console.error("Failed to delete note", e);
      alert(`Error deleting note: ${e.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Top bar */}
      <nav className="sticky top-0 z-30 glass border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors cursor-pointer">
            <ArrowLeft size={16} />
            <span className="font-serif text-lg text-gray-900">Surfaced</span>
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-8 md:py-12">
        <div className="mb-8 md:mb-10">
          <h1 className="font-serif text-3xl text-gray-900 flex items-center gap-3">
            Classroom Pulse
            {isLoading && <Loader2 size={24} className="animate-spin text-indigo-primary" />}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time view of student thinking across your classes
          </p>
        </div>

        {error && (
          <div className="mb-8 md:mb-12">
            <div className="w-full py-8 flex flex-col items-center justify-center border-2 border-dashed border-rose-200 bg-rose-50/50 rounded-3xl text-rose-500">
              <span className="font-semibold mb-2">Error Loading Data</span>
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Feed + Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
          <div className="lg:col-span-2 space-y-6">
            <LivePulseCanvas clusters={heatmapClusters} onSelectCluster={setSelectedCluster} />
            <LiveReflectionFeed
              reflections={reflections}
              onSelectStudent={handleSelectStudentId}
              onDeleteNote={handleDeleteNote}
            />
          </div>
          <div>
            <AnalyticsSidebar reflections={reflections} />
          </div>
        </div>
      </main>

      {/* Cluster Overlay */}
      {selectedCluster && (
        <ClusterOverlay
          cluster={selectedCluster}
          reflections={reflections.filter(r =>
            selectedCluster.studentIds?.includes(r.studentId)
          )}
          onClose={() => setSelectedCluster(null)}
          onSelectStudent={(studentId) => {
            setSelectedCluster(null);
            setSelectedStudentId(studentId);
          }}
        />
      )}

      {/* Student Journey Modal */}
      {selectedStudentId && (
        <StudentJourneyModal
          studentName={reflections.find(r => r.studentId === selectedStudentId)?.studentName || 'Student'}
          reflections={reflections.filter(r => r.studentId === selectedStudentId)}
          onClose={() => setSelectedStudentId(null)}
        />
      )}
    </div>
  );
}
