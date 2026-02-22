import { useState } from 'react';
import { ChevronDown, Users } from 'lucide-react';
import Card from '../ui/Card';
import type { Course } from '../../types';

interface CourseCardsProps {
  courses: Course[];
  onSelectCourse: (courseCode: string) => void;
  activeCourse: string;
}

export default function CourseCards({ courses, onSelectCourse, activeCourse }: CourseCardsProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="mb-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-3 cursor-pointer hover:text-gray-700 transition-colors"
      >
        <ChevronDown size={16} className={`transition-transform duration-300 ${expanded ? '' : '-rotate-90'}`} />
        My Courses
      </button>

      {expanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {courses.map(course => (
            <Card
              key={course.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-md ${
                activeCourse === course.code ? 'ring-2 ring-indigo-primary/30 border-indigo-primary/20' : ''
              }`}
              onClick={() => onSelectCourse(course.code)}
            >
              <p className="text-xs text-gray-400 font-mono mb-0.5">{course.code}</p>
              <h3 className="font-semibold text-gray-900 mb-1">{course.name}</h3>
              <p className="text-sm text-gray-500 mb-2">
                Recent: <span className="text-gray-700">{course.recentTopic}</span>
              </p>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Users size={12} />
                {course.totalStudents} students
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
