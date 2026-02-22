import type { StudentReflection, Student, Course, Teacher, TopicCluster, StudentInsights } from '../types';

export const COURSES: Course[] = [
  {
    id: 'c1',
    code: 'Astrophysics_AST301',
    name: 'Introductory Astrophysics',
    teacher: 'Dr. Eleanor Vance',
    totalStudents: 14,
    recentTopic: "Event Horizon Mechanics",
  },
  {
    id: 'c2',
    code: 'Statistics_MATH201',
    name: 'Intro to Statistics',
    teacher: 'Prof. Marcus Halloway',
    totalStudents: 3,
    recentTopic: 'Central Limit Theorem',
  },
  {
    id: 'c3',
    code: 'ObservationalAstronomy_AST101',
    name: 'Observational Astronomy',
    teacher: 'Dr. Eleanor Vance',
    totalStudents: 0,
    recentTopic: 'Telescope Optics',
  },
];

export const TEACHERS: Teacher[] = [
  { id: 't1', name: 'Dr. Eleanor Vance', classesTaught: ['Astrophysics_AST301', 'ObservationalAstronomy_AST101'] },
  { id: 't2', name: 'Prof. Marcus Halloway', classesTaught: ['Statistics_MATH201'] },
];

export const REFLECTIONS: StudentReflection[] = [
  {
    id: 'r1',
    studentId: 's1',
    studentName: 'Elena Hews',
    content: "I'm confused about the event horizon. If nothing escapes, then how does Hawking radiation work? Doesn't that violate the boundary?",
    pattern: 'confusion',
    timestamp: '2026-02-21T09:15:00Z',
    topic: "Event Horizon Mechanics",
  },
  {
    id: 'r2',
    studentId: 's2',
    studentName: 'Aria V.',
    content: "I'm lost on time dilation near the black hole. Why does time stop for an outside observer but proceed normally for someone falling in?",
    pattern: 'confusion',
    timestamp: '2026-02-21T09:18:00Z',
    topic: "Time Dilation",
  },
  {
    id: 'r3',
    studentId: 's3',
    studentName: 'Blake S.',
    content: "The concept of spaghettification makes total sense now! Because gravity follows an inverse-square law, the tidal forces stretch an object out.",
    pattern: 'clarity',
    timestamp: '2026-02-21T09:20:00Z',
    topic: "Tidal Forces",
  },
  {
    id: 'r4',
    studentId: 's4',
    studentName: 'Charlie D.',
    content: "What exactly happens at the singularity? Do the laws of physics just stop acting entirely, or is there a unified theory we just haven't found?",
    pattern: 'curiosity',
    timestamp: '2026-02-21T09:22:00Z',
    topic: "The Singularity",
  },
  {
    id: 'r5',
    studentId: 's5',
    studentName: 'Dani L.',
    content: "Understanding General Relativity really helped clarify how mass curves spacetime. The geometry of the universe is fascinating.",
    pattern: 'clarity',
    timestamp: '2026-02-21T09:25:00Z',
    topic: "General Relativity",
  },
  {
    id: 'r6',
    studentId: 's6',
    studentName: 'Emerson J.',
    content: "I'm confused about the information paradox. If black holes evaporate completely, where does all the quantum information of what fell in go?",
    pattern: 'confusion',
    timestamp: '2026-02-21T09:28:00Z',
    topic: "Information Paradox",
  },
  {
    id: 'r7',
    studentId: 's7',
    studentName: 'Finn K.',
    content: "Hawking radiation is brilliant. Virtual particle pairs forming at the horizon, one falls in, the other escapes, effectively draining mass. Wow.",
    pattern: 'clarity',
    timestamp: '2026-02-21T09:30:00Z',
    topic: "Hawking Radiation",
  },
  {
    id: 'r8',
    studentId: 's8',
    studentName: 'Gale M.',
    content: "Why can't light escape? I thought photons didn't have mass. How can gravity pull on something that is massless?",
    pattern: 'confusion',
    timestamp: '2026-02-21T09:33:00Z',
    topic: "Event Horizon Mechanics",
  },
  {
    id: 'r9',
    studentId: 's9',
    studentName: 'Hollis R.',
    content: "The escape velocity equation makes it perfectly clear. When the required velocity exceeds c, not even light can get out. Simple math, wild concept.",
    pattern: 'clarity',
    timestamp: '2026-02-21T09:35:00Z',
    topic: "Event Horizon Mechanics",
  },
  {
    id: 'r10',
    studentId: 's10',
    studentName: 'Indi P.',
    content: "I want to know more about the photon sphere. If you stood there, could you literally see the back of your own head?",
    pattern: 'curiosity',
    timestamp: '2026-02-21T09:38:00Z',
    topic: "Photon Sphere",
  },
  {
    id: 'r11',
    studentId: 's11',
    studentName: 'Jordan T.',
    content: "Is it possible for a wormhole to exist inside a rotating Kerr black hole? Could the ring singularity act as a bridge?",
    pattern: 'curiosity',
    timestamp: '2026-02-21T09:40:00Z',
    topic: "The Singularity",
  },
  {
    id: 'r12',
    studentId: 's12',
    studentName: 'Kai B.',
    content: "I read that supermassive black holes might actually be less dense than water. How does that volume-to-mass ratio even work?",
    pattern: 'curiosity',
    timestamp: '2026-02-21T09:42:00Z',
    topic: "Supermassive Black Holes",
  },
  {
    id: 'r13',
    studentId: 's13',
    studentName: 'Lennon W.',
    content: "If gravitational waves propagate at the speed of light, what happens to them extremely close to the event horizon?",
    pattern: 'curiosity',
    timestamp: '2026-02-21T09:45:00Z',
    topic: "Event Horizon Mechanics",
  },
  {
    id: 'r14',
    studentId: 's1',
    studentName: 'Elena Hews',
    content: "I'm really struggling to visualize the bending of spacetime in 3D. The rubber sheet analogy just isn't cutting it for me anymore.",
    pattern: 'confusion',
    timestamp: '2026-02-21T10:00:00Z',
    topic: "General Relativity",
  },
  {
    id: 'r15',
    studentId: 's14',
    studentName: 'Casey Rivera',
    content: "Understanding the Schwarzschild radius helped pull everything together. It defines exactly where that point of no return is.",
    pattern: 'clarity',
    timestamp: '2026-02-21T10:05:00Z',
    topic: "Event Horizon Mechanics",
  },
  {
    id: 'r16',
    studentId: 's15',
    studentName: 'Sam Taylor',
    content: "Wait, so if a star collapses, does the gravity actually increase, or does it just get more concentrated? I don't follow.",
    pattern: 'confusion',
    timestamp: '2026-02-21T10:10:00Z',
    topic: "Stellar Collapse",
  },
  // Statistics reflections
  {
    id: 'r17',
    studentId: 's1',
    studentName: 'Elena Hews',
    content: "I don't get why the distribution becomes normal as the sample size increases. Why 30? Is that a magic number?",
    pattern: 'confusion',
    timestamp: '2026-02-21T11:00:00Z',
    topic: 'Central Limit Theorem',
  },
  {
    id: 'r18',
    studentId: 's14',
    studentName: 'Casey Rivera',
    content: "The CLT is fascinating because it allows us to make inferences about a population even if the population isn't normal.",
    pattern: 'curiosity',
    timestamp: '2026-02-21T11:05:00Z',
    topic: 'Central Limit Theorem',
  },
  {
    id: 'r19',
    studentId: 's15',
    studentName: 'Sam Taylor',
    content: "I'm totally stuck. How do we calculate the standard error again? The formula is confusing me.",
    pattern: 'confusion',
    timestamp: '2026-02-21T11:10:00Z',
    topic: 'Central Limit Theorem',
  },
];

export const STUDENTS: Student[] = [
  { id: 's1', name: 'Elena Hews', courses: ['Astrophysics_AST301', 'Statistics_MATH201'], reflections: REFLECTIONS.filter(r => r.studentId === 's1'), overallPattern: 'confusion' },
  { id: 's2', name: 'Aria V.', courses: ['Astrophysics_AST301'], reflections: REFLECTIONS.filter(r => r.studentId === 's2'), overallPattern: 'confusion' },
  { id: 's3', name: 'Blake S.', courses: ['Astrophysics_AST301'], reflections: REFLECTIONS.filter(r => r.studentId === 's3'), overallPattern: 'clarity' },
  { id: 's4', name: 'Charlie D.', courses: ['Astrophysics_AST301'], reflections: REFLECTIONS.filter(r => r.studentId === 's4'), overallPattern: 'curiosity' },
  { id: 's5', name: 'Dani L.', courses: ['Astrophysics_AST301'], reflections: REFLECTIONS.filter(r => r.studentId === 's5'), overallPattern: 'clarity' },
  { id: 's6', name: 'Emerson J.', courses: ['Astrophysics_AST301'], reflections: REFLECTIONS.filter(r => r.studentId === 's6'), overallPattern: 'confusion' },
  { id: 's7', name: 'Finn K.', courses: ['Astrophysics_AST301'], reflections: REFLECTIONS.filter(r => r.studentId === 's7'), overallPattern: 'clarity' },
  { id: 's8', name: 'Gale M.', courses: ['Astrophysics_AST301'], reflections: REFLECTIONS.filter(r => r.studentId === 's8'), overallPattern: 'confusion' },
  { id: 's9', name: 'Hollis R.', courses: ['Astrophysics_AST301'], reflections: REFLECTIONS.filter(r => r.studentId === 's9'), overallPattern: 'clarity' },
  { id: 's10', name: 'Indi P.', courses: ['Astrophysics_AST301'], reflections: REFLECTIONS.filter(r => r.studentId === 's10'), overallPattern: 'curiosity' },
  { id: 's11', name: 'Jordan T.', courses: ['Astrophysics_AST301'], reflections: REFLECTIONS.filter(r => r.studentId === 's11'), overallPattern: 'curiosity' },
  { id: 's12', name: 'Kai B.', courses: ['Astrophysics_AST301'], reflections: REFLECTIONS.filter(r => r.studentId === 's12'), overallPattern: 'curiosity' },
  { id: 's13', name: 'Lennon W.', courses: ['Astrophysics_AST301'], reflections: REFLECTIONS.filter(r => r.studentId === 's13'), overallPattern: 'curiosity' },
  { id: 's14', name: 'Casey Rivera', courses: ['Astrophysics_AST301', 'Statistics_MATH201'], reflections: REFLECTIONS.filter(r => r.studentId === 's14'), overallPattern: 'clarity' },
  { id: 's15', name: 'Sam Taylor', courses: ['Astrophysics_AST301', 'Statistics_MATH201'], reflections: REFLECTIONS.filter(r => r.studentId === 's15'), overallPattern: 'confusion' },
];

export const TOPIC_CLUSTERS: TopicCluster[] = [
  { id: 'tc1', label: "Event Horizon Mechanics", pattern: 'confusion', count: 6, x: 30, y: 35, size: 90 },
  { id: 'tc2', label: 'The Singularity', pattern: 'curiosity', count: 6, x: 65, y: 40, size: 85 },
  { id: 'tc3', label: 'Information Paradox', pattern: 'curiosity', count: 3, x: 45, y: 65, size: 60 },
  { id: 'tc4', label: 'Central Limit Theorem', pattern: 'confusion', count: 3, x: 75, y: 70, size: 55 },
  { id: 'tc5', label: "Hawking Radiation", pattern: 'clarity', count: 3, x: 20, y: 60, size: 50 },
  { id: 'tc6', label: 'Dark Matter vs Energy', pattern: 'curiosity', count: 2, x: 50, y: 25, size: 45 },
];

export function getInsightsForCourse(courseCode: string): StudentInsights {
  const courseReflections = REFLECTIONS.filter(r => {
    const course = COURSES.find(c => c.code === courseCode);
    return course && r.topic === course.recentTopic;
  });

  const patterns = courseReflections.map(r => r.pattern);
  const confusionCount = patterns.filter(p => p === 'confusion').length;
  const total = patterns.length || 1;

  return {
    semanticConvergence: 1 - confusionCount / total,
    recentPatterns: patterns,
    pedagogicalAdvice:
      confusionCount / total > 0.4
        ? 'High confusion detected. Consider revisiting foundational concepts before advancing.'
        : 'Students are engaging well. Consider deepening the discussion with analytical prompts.',
  };
}

export function getPatternDistribution(reflections: StudentReflection[]) {
  const distribution = { confusion: 0, curiosity: 0, clarity: 0 };
  reflections.forEach(r => distribution[r.pattern]++);
  return distribution;
}
