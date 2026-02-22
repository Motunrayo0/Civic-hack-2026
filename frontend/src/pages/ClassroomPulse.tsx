import { useState, useEffect } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LivePulseCanvas from '../components/teacher/LivePulseCanvas';
import LiveReflectionFeed from '../components/teacher/LiveReflectionFeed';
import AnalyticsSidebar from '../components/teacher/AnalyticsSidebar';
import TopicClusterModal from '../components/modals/TopicClusterModal';
import type { TopicCluster, StudentReflection } from '../types';
import { getClassroomHeatmap } from '../services/api';

export default function ClassroomPulse() {
  const navigate = useNavigate();
  const [selectedCluster, setSelectedCluster] = useState<TopicCluster | null>(null);

  const [reflections, setReflections] = useState<StudentReflection[]>([]);
  const [clusters, setClusters] = useState<TopicCluster[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // We are hardcoding the course and date for the hackathon demo
  const courseCode = 'Shakespeare_ENG302';
  const todayDate = new Date().toISOString().split('T')[0];

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const data = await getClassroomHeatmap(courseCode, todayDate);

        const newReflections: StudentReflection[] = [];
        const clusterMap = new Map<number, any>();

        data.forEach((studentNode: any) => {
          // 1. Map to reflection
          const patternMap: Record<string, any> = {
            'CONFUSION': 'confusion',
            'UNANSWERED_QUESTION': 'curiosity',
            'UNDERSTOOD': 'clarity'
          };

          // Try to extract a topic string or fallback
          const mainTopic = studentNode.confusion_topics && studentNode.confusion_topics.length > 0
            ? studentNode.confusion_topics[0].topic
            : 'General Discussion';

          newReflections.push({
            id: `r_${studentNode.student_id}`,
            studentId: studentNode.student_id,
            studentName: studentNode.name,
            content: mainTopic, // Or actual notes if your backend returned them
            pattern: patternMap[studentNode.sentiment] || 'wonder',
            timestamp: new Date().toISOString(),
            topic: mainTopic
          });

          // 2. Aggregate clusters
          const cid = studentNode.cluster;
          if (cid !== -1) { // Ignore noise
            if (!clusterMap.has(cid)) {
              clusterMap.set(cid, {
                id: `tc_${cid}`,
                label: mainTopic,
                pattern: patternMap[studentNode.sentiment] || 'confusion',
                count: 0,
                xSum: 0,
                ySum: 0
              });
            }
            const c = clusterMap.get(cid);
            c.count += 1;
            c.xSum += studentNode.x;
            c.ySum += studentNode.y;
          }
        });

        const newClusters: TopicCluster[] = Array.from(clusterMap.values()).map(c => {
          // Normalize X and Y from PCA space (-1 to 1 perhaps?) to 0-100% for canvas
          // This is a naive clamp/scale for the demo
          const boundedX = Math.min(Math.max((c.xSum / c.count) * 30 + 50, 10), 90);
          const boundedY = Math.min(Math.max((c.ySum / c.count) * 30 + 50, 10), 90);

          return {
            id: c.id,
            label: c.label,
            pattern: c.pattern,
            count: c.count,
            x: boundedX,
            y: boundedY,
            size: Math.min(40 + (c.count * 10), 120) // min size 50, scales up
          };
        });

        setReflections(newReflections);
        setClusters(newClusters);
      } catch (e) {
        console.error("Failed to load heatmap", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSelectStudentId = () => {
    // Disabled manual student lookup mapping for time constraints
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

        {/* Live Pulse Canvas - full width */}
        <div className="mb-8 md:mb-12">
          {!isLoading && clusters.length === 0 ? (
            <div className="w-full h-[400px] flex items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl text-gray-400">
              Awaiting student reflections...
            </div>
          ) : (
            <LivePulseCanvas clusters={clusters} onSelectCluster={setSelectedCluster} />
          )}
        </div>

        {/* Feed + Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
          <div className="lg:col-span-2">
            <LiveReflectionFeed
              reflections={reflections}
              onSelectStudent={handleSelectStudentId}
            />
          </div>
          <div>
            <AnalyticsSidebar reflections={reflections} />
          </div>
        </div>
      </main>

      {/* Student Journey Modal (Disabled for hackathon) */}

      {/* Topic Cluster Modal */}
      {selectedCluster && (
        <TopicClusterModal
          cluster={selectedCluster}
          reflections={reflections}
          onClose={() => setSelectedCluster(null)}
        />
      )}
    </div>
  );
}
