import type { StudentReflection, Student, Course, Teacher, TopicCluster, StudentInsights } from '../types';

export const COURSES: Course[] = [
  {
    id: 'c1',
    code: 'Shakespeare_ENG302',
    name: 'Shakespeare Studies',
    teacher: 'Dr. Aris Thorne',
    totalStudents: 14,
    recentTopic: "Hamlet's Hesitation",
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
    code: 'CreativeWriting_ENG101',
    name: 'Creative Writing',
    teacher: 'Dr. Aris Thorne',
    totalStudents: 0,
    recentTopic: 'Narrative Voice',
  },
];

export const TEACHERS: Teacher[] = [
  { id: 't1', name: 'Dr. Aris Thorne', classesTaught: ['Shakespeare_ENG302', 'CreativeWriting_ENG101'] },
  { id: 't2', name: 'Prof. Marcus Halloway', classesTaught: ['Statistics_MATH201'] },
];

export const REFLECTIONS: StudentReflection[] = [
  {
    id: 'r1',
    studentId: 's1',
    studentName: 'Jordan Smith',
    content: "I'm confused about Iago's 'motive-hunting.' Why does he need a reason to be evil?",
    pattern: 'confusion',
    timestamp: '2026-02-21T09:15:00Z',
    topic: "Iago's Manipulations",
  },
  {
    id: 'r2',
    studentId: 's2',
    studentName: 'Aria V.',
    content: "I'm lost. Why does Hamlet wait so long to kill Claudius? Is he actually scared or just overthinking the morality of revenge?",
    pattern: 'confusion',
    timestamp: '2026-02-21T09:18:00Z',
    topic: "Hamlet's Hesitation",
  },
  {
    id: 'r3',
    studentId: 's3',
    studentName: 'Blake S.',
    content: "The 'antic disposition' is brilliant. By acting mad, Hamlet creates a smoke screen to observe Claudius without being a direct suspect.",
    pattern: 'clarity',
    timestamp: '2026-02-21T09:20:00Z',
    topic: "Hamlet's Hesitation",
  },
  {
    id: 'r4',
    studentId: 's4',
    studentName: 'Charlie D.',
    content: "What is the difference between Hamlet's feigned madness and Ophelia's actual madness? I don't understand where the line is.",
    pattern: 'curiosity',
    timestamp: '2026-02-21T09:22:00Z',
    topic: "Hamlet's Hesitation",
  },
  {
    id: 'r5',
    studentId: 's5',
    studentName: 'Dani L.',
    content: "Hamlet's hesitation isn't weakness; it's a search for 'grounds more relative.' He needs certainty before committing regicide.",
    pattern: 'clarity',
    timestamp: '2026-02-21T09:25:00Z',
    topic: "Hamlet's Hesitation",
  },
  {
    id: 'r6',
    studentId: 's6',
    studentName: 'Emerson J.',
    content: "I'm confused about Iago's motive-hunting. Does he really hate Othello because of the promotion, or is he just evil for the sake of it?",
    pattern: 'confusion',
    timestamp: '2026-02-21T09:28:00Z',
    topic: 'Othello & Iago',
  },
  {
    id: 'r7',
    studentId: 's7',
    studentName: 'Finn K.',
    content: "Iago is a master of language. He uses Othello's racial insecurities as a lever to break his trust in Desdemona. It's psychological warfare.",
    pattern: 'clarity',
    timestamp: '2026-02-21T09:30:00Z',
    topic: 'Othello & Iago',
  },
  {
    id: 'r8',
    studentId: 's8',
    studentName: 'Gale M.',
    content: "Why does Othello trust Iago more than his own wife? This breakdown in communication is so frustrating to read. I don't get it.",
    pattern: 'confusion',
    timestamp: '2026-02-21T09:33:00Z',
    topic: 'Othello & Iago',
  },
  {
    id: 'r9',
    studentId: 's9',
    studentName: 'Hollis R.',
    content: "The handkerchief is a vital symbol of fidelity. Once Othello sees it in Cassio's hand, the 'proof' becomes undeniable to him.",
    pattern: 'clarity',
    timestamp: '2026-02-21T09:35:00Z',
    topic: 'Othello & Iago',
  },
  {
    id: 'r10',
    studentId: 's10',
    studentName: 'Indi P.',
    content: "I'm confused about the military hierarchy. Why was Cassio promoted over Iago in the first place? Was it purely favoritism?",
    pattern: 'curiosity',
    timestamp: '2026-02-21T09:38:00Z',
    topic: 'Othello & Iago',
  },
  {
    id: 'r11',
    studentId: 's11',
    studentName: 'Jordan T.',
    content: "Othello's tragic flaw is his 'free and open nature' which Iago exploits. His love is so intense it's easily curdled into jealousy.",
    pattern: 'wonder',
    timestamp: '2026-02-21T09:40:00Z',
    topic: 'Othello & Iago',
  },
  {
    id: 'r12',
    studentId: 's12',
    studentName: 'Kai B.',
    content: "Is Hamlet a hero or a villain? He kills Polonius and treats Ophelia horribly. I'm struggling to stay on his side.",
    pattern: 'curiosity',
    timestamp: '2026-02-21T09:42:00Z',
    topic: "Hamlet's Hesitation",
  },
  {
    id: 'r13',
    studentId: 's13',
    studentName: 'Lennon W.',
    content: "The 'To be or not to be' speech is the ultimate conceptual tension. It's not just about suicide; it's about the burden of existence.",
    pattern: 'wonder',
    timestamp: '2026-02-21T09:45:00Z',
    topic: "Hamlet's Hesitation",
  },
  {
    id: 'r14',
    studentId: 's1',
    studentName: 'Jordan Smith',
    content: "I'm confused about the ghost. Is it a real ghost or just Hamlet's imagination? The language makes it hard to tell.",
    pattern: 'confusion',
    timestamp: '2026-02-21T10:00:00Z',
    topic: 'Hamlet',
  },
  {
    id: 'r15',
    studentId: 's14',
    studentName: 'Casey Rivera',
    content: "The ghost acts as a catalyst for the plot. It represents the 'unresolved' past coming back to haunt the present.",
    pattern: 'clarity',
    timestamp: '2026-02-21T10:05:00Z',
    topic: 'Hamlet',
  },
  {
    id: 'r16',
    studentId: 's15',
    studentName: 'Sam Taylor',
    content: "I'm lost on the scene with the players. Why is Hamlet so obsessed with the play-within-a-play?",
    pattern: 'confusion',
    timestamp: '2026-02-21T10:10:00Z',
    topic: 'Hamlet',
  },
  // Statistics reflections
  {
    id: 'r17',
    studentId: 's1',
    studentName: 'Jordan Smith',
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
    pattern: 'wonder',
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
  { id: 's1', name: 'Jordan Smith', courses: ['Shakespeare_ENG302', 'Statistics_MATH201'], reflections: REFLECTIONS.filter(r => r.studentId === 's1'), overallPattern: 'confusion' },
  { id: 's2', name: 'Aria V.', courses: ['Shakespeare_ENG302'], reflections: REFLECTIONS.filter(r => r.studentId === 's2'), overallPattern: 'confusion' },
  { id: 's3', name: 'Blake S.', courses: ['Shakespeare_ENG302'], reflections: REFLECTIONS.filter(r => r.studentId === 's3'), overallPattern: 'clarity' },
  { id: 's4', name: 'Charlie D.', courses: ['Shakespeare_ENG302'], reflections: REFLECTIONS.filter(r => r.studentId === 's4'), overallPattern: 'curiosity' },
  { id: 's5', name: 'Dani L.', courses: ['Shakespeare_ENG302'], reflections: REFLECTIONS.filter(r => r.studentId === 's5'), overallPattern: 'clarity' },
  { id: 's6', name: 'Emerson J.', courses: ['Shakespeare_ENG302'], reflections: REFLECTIONS.filter(r => r.studentId === 's6'), overallPattern: 'confusion' },
  { id: 's7', name: 'Finn K.', courses: ['Shakespeare_ENG302'], reflections: REFLECTIONS.filter(r => r.studentId === 's7'), overallPattern: 'clarity' },
  { id: 's8', name: 'Gale M.', courses: ['Shakespeare_ENG302'], reflections: REFLECTIONS.filter(r => r.studentId === 's8'), overallPattern: 'confusion' },
  { id: 's9', name: 'Hollis R.', courses: ['Shakespeare_ENG302'], reflections: REFLECTIONS.filter(r => r.studentId === 's9'), overallPattern: 'clarity' },
  { id: 's10', name: 'Indi P.', courses: ['Shakespeare_ENG302'], reflections: REFLECTIONS.filter(r => r.studentId === 's10'), overallPattern: 'curiosity' },
  { id: 's11', name: 'Jordan T.', courses: ['Shakespeare_ENG302'], reflections: REFLECTIONS.filter(r => r.studentId === 's11'), overallPattern: 'wonder' },
  { id: 's12', name: 'Kai B.', courses: ['Shakespeare_ENG302'], reflections: REFLECTIONS.filter(r => r.studentId === 's12'), overallPattern: 'curiosity' },
  { id: 's13', name: 'Lennon W.', courses: ['Shakespeare_ENG302'], reflections: REFLECTIONS.filter(r => r.studentId === 's13'), overallPattern: 'wonder' },
  { id: 's14', name: 'Casey Rivera', courses: ['Shakespeare_ENG302', 'Statistics_MATH201'], reflections: REFLECTIONS.filter(r => r.studentId === 's14'), overallPattern: 'clarity' },
  { id: 's15', name: 'Sam Taylor', courses: ['Shakespeare_ENG302', 'Statistics_MATH201'], reflections: REFLECTIONS.filter(r => r.studentId === 's15'), overallPattern: 'confusion' },
];

export const TOPIC_CLUSTERS: TopicCluster[] = [
  { id: 'tc1', label: "Hamlet's Hesitation", pattern: 'confusion', count: 6, x: 30, y: 35, size: 90 },
  { id: 'tc2', label: 'Othello & Iago', pattern: 'curiosity', count: 6, x: 65, y: 40, size: 85 },
  { id: 'tc3', label: 'Feigned vs Real Madness', pattern: 'wonder', count: 3, x: 45, y: 65, size: 60 },
  { id: 'tc4', label: 'Central Limit Theorem', pattern: 'confusion', count: 3, x: 75, y: 70, size: 55 },
  { id: 'tc5', label: "Iago's Motives", pattern: 'clarity', count: 3, x: 20, y: 60, size: 50 },
  { id: 'tc6', label: 'Burden of Existence', pattern: 'wonder', count: 2, x: 50, y: 25, size: 45 },
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
  const distribution = { confusion: 0, curiosity: 0, clarity: 0, wonder: 0 };
  reflections.forEach(r => distribution[r.pattern]++);
  return distribution;
}
