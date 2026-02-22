import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StudentHeader from '../components/student/StudentHeader';
import CourseCards from '../components/student/CourseCards';
import ContributionTimeline from '../components/student/ContributionTimeline';
import ActiveLessonView from '../components/student/ActiveLessonView';
import InsightsSidebar from '../components/student/InsightsSidebar';
import { COURSES, REFLECTIONS, STUDENTS, getInsightsForCourse } from '../data/mockData';

// Simulate a logged-in student
const CURRENT_STUDENT = STUDENTS[0];

export default function EduPulse() {
  const navigate = useNavigate();
  const [activeCourse, setActiveCourse] = useState(CURRENT_STUDENT.courses[0]);

  const studentCourses = COURSES.filter(c => CURRENT_STUDENT.courses.includes(c.code));
  const currentCourseData = COURSES.find(c => c.code === activeCourse)!;
  const courseReflections = REFLECTIONS.filter(
    r => r.studentId === CURRENT_STUDENT.id
  );
  const insights = getInsightsForCourse(activeCourse);

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

      <main className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-4 md:py-6">
        <StudentHeader greeting={CURRENT_STUDENT.name} insights={insights} reflections={courseReflections} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Main content */}
          <div className="lg:col-span-2">
            <CourseCards
              courses={studentCourses}
              onSelectCourse={setActiveCourse}
              activeCourse={activeCourse}
            />
            <ActiveLessonView course={currentCourseData} reflections={courseReflections} />
          </div>

          {/* Sidebar */}
          <div>
            <InsightsSidebar insights={insights} reflections={courseReflections} />
          </div>
        </div>
      </main>
    </div>
  );
}
