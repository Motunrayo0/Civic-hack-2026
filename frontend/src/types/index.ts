export type ThinkingPattern = 'confusion' | 'curiosity' | 'clarity';

export interface StudentReflection {
  id: string;
  studentId: string;
  studentName: string;
  content: string;
  pattern: ThinkingPattern;
  timestamp: string;
  topic: string;
  className?: string;
}

export interface StudentInsights {
  semanticConvergence: number;
  recentPatterns: ThinkingPattern[];
  pedagogicalAdvice: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  teacher: string;
  totalStudents: number;
  recentTopic: string;
}

export interface Student {
  id: string;
  name: string;
  isAnonymous?: boolean;
  courses: string[];
  reflections: StudentReflection[];
  overallPattern: ThinkingPattern;
}

export interface Teacher {
  id: string;
  name: string;
  classesTaught: string[];
}

export interface TopicCluster {
  id: string;
  label: string;
  pattern: ThinkingPattern;
  count: number;
  x: number;
  y: number;
  size: number;
  studentIds?: string[];
}

export const PATTERN_COLORS: Record<ThinkingPattern, string> = {
  confusion: 'var(--color-confusion)',
  curiosity: 'var(--color-curiosity)',
  clarity: 'var(--color-clarity)',
};

export const PATTERN_BG_COLORS: Record<ThinkingPattern, string> = {
  confusion: 'var(--color-confusion-light)',
  curiosity: 'var(--color-curiosity-light)',
  clarity: 'var(--color-clarity-light)',
};

export const PATTERN_LABELS: Record<ThinkingPattern, string> = {
  confusion: 'Confused',
  curiosity: 'Curious',
  clarity: 'Clear',
};
