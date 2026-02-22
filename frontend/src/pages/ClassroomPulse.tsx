import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LivePulseCanvas from '../components/teacher/LivePulseCanvas';
import LiveReflectionFeed from '../components/teacher/LiveReflectionFeed';
import AnalyticsSidebar from '../components/teacher/AnalyticsSidebar';
import StudentJourneyModal from '../components/modals/StudentJourneyModal';
import TopicClusterModal from '../components/modals/TopicClusterModal';
import type { TopicCluster } from '../types';
import { REFLECTIONS, STUDENTS } from '../data/mockData';

export default function ClassroomPulse() {
  const navigate = useNavigate();
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedCluster, setSelectedCluster] = useState<TopicCluster | null>(null);

  const selectedStudent = selectedStudentId
    ? STUDENTS.find(s => s.id === selectedStudentId)
    : null;

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
          <h1 className="font-serif text-3xl text-gray-900">Classroom Pulse</h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time view of student thinking across your classes
          </p>
        </div>

        {/* Live Pulse Canvas - full width */}
        <div className="mb-8 md:mb-12">
          <LivePulseCanvas onSelectCluster={setSelectedCluster} />
        </div>

        {/* Feed + Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
          <div className="lg:col-span-2">
            <LiveReflectionFeed
              reflections={REFLECTIONS}
              onSelectStudent={setSelectedStudentId}
            />
          </div>
          <div>
            <AnalyticsSidebar reflections={REFLECTIONS} />
          </div>
        </div>
      </main>

      {/* Student Journey Modal */}
      {selectedStudent && (
        <StudentJourneyModal
          student={selectedStudent}
          onClose={() => setSelectedStudentId(null)}
        />
      )}

      {/* Topic Cluster Modal */}
      {selectedCluster && (
        <TopicClusterModal
          cluster={selectedCluster}
          reflections={REFLECTIONS}
          onClose={() => setSelectedCluster(null)}
        />
      )}
    </div>
  );
}
