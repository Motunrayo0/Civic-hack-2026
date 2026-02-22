import { useState, useEffect } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StudentHeader from '../components/student/StudentHeader';
import CourseCards from '../components/student/CourseCards';
import ActiveLessonView from '../components/student/ActiveLessonView';
import InsightsSidebar from '../components/student/InsightsSidebar';
import FileUpload from '../components/student/FileUpload';
import { COURSES, getInsightsForCourse } from '../data/mockData';
import { getStudents, getAnalyzedStudentReflections } from '../services/api';
import type { Student, StudentReflection } from '../types';

export default function EduPulse() {
  const navigate = useNavigate();
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [activeCourse, setActiveCourse] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStudentData() {
      try {
        setIsLoading(true);
        const studentsData = await getStudents();

        // Always pick the first student we get back from MongoDB (for hackathon)
        let targetStudent = studentsData.length > 0 ? studentsData[0] : null;

        if (!targetStudent) {
          throw new Error("No students found in the database.");
        }

        // Map MongoStudent to the local Student interface expected by UI
        const mappedCourses = targetStudent.classes ? Object.keys(targetStudent.classes) : [];
        const mappedReflections: StudentReflection[] = [];

        if (targetStudent.classes) {
          for (const [cName, classData] of Object.entries(targetStudent.classes)) {
            let classEvaluations: any = {};
            try {
              classEvaluations = await getAnalyzedStudentReflections(targetStudent._id, cName);
            } catch (e) {
              console.warn("Could not fetch student analysis for", cName, e);
            }

            for (const [date, noteData] of Object.entries(classData)) {
              let pattern = 'curiosity';

              if (classEvaluations[date]) {
                pattern = classEvaluations[date].sentiment.toLowerCase();
              }

              mappedReflections.push({
                id: `ref_${targetStudent!._id}_${date}`,
                studentId: targetStudent!._id,
                studentName: targetStudent!.name,
                content: noteData.notes,
                pattern: pattern as any,
                timestamp: new Date(date).toISOString(),
                topic: noteData.topic || 'General Discussion',
                className: cName
              });
            }
          }
        }

        const standardStudent: Student = {
          id: targetStudent._id,
          name: targetStudent.name,
          courses: mappedCourses,
          reflections: mappedReflections,
          overallPattern: 'curiosity' // default
        };

        setCurrentStudent(standardStudent);
        if (mappedCourses.length > 0) {
          setActiveCourse(mappedCourses[0]);
        }
      } catch (err: any) {
        console.error("Failed to fetch student data:", err);
        setError(err.message || "Failed to load academic profile");
      } finally {
        setIsLoading(false);
      }
    }

    fetchStudentData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center">
        <Loader2 size={40} className="animate-spin text-indigo-primary mb-4" />
        <p className="text-gray-500 font-medium">Loading your academic profile...</p>
      </div>
    );
  }

  if (error || !currentStudent) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center">
        <p className="text-rose-600 font-medium mb-4">{error || "Could not load student data"}</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-indigo-primary text-white rounded-lg">Retry</button>
      </div>
    );
  }

  const studentCourses = COURSES.filter(c => currentStudent.courses.includes(c.code));
  const currentCourseData = COURSES.find(c => c.code === activeCourse);

  const courseReflections = currentStudent.reflections.filter(
    r => r.className === activeCourse
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
        <StudentHeader greeting={currentStudent.name} insights={insights} reflections={courseReflections} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Main content */}
          <div className="lg:col-span-2">
            {studentCourses.length > 0 && (
              <CourseCards
                courses={studentCourses}
                onSelectCourse={setActiveCourse}
                activeCourse={activeCourse}
              />
            )}

            {currentCourseData && (
              <>
                <ActiveLessonView course={currentCourseData} reflections={courseReflections} />
                <FileUpload
                  studentName={currentStudent.name}
                  className={currentCourseData.code}
                  courseName={currentCourseData.name}
                  topic={currentCourseData.recentTopic}
                />
              </>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <InsightsSidebar reflections={courseReflections} />
          </div>
        </div>
      </main>
    </div>
  );
}
