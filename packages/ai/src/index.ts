export * from "./provider";

// ── Temel 5 agent (mevcut) ──
export { generateLesson, type Lesson } from "./agents/teacher";
export { generateQuiz, type GenQuestion } from "./agents/quiz";
export { analyzeResult, type Analysis } from "./agents/analysis";
export { generateParentReport, type ParentReport } from "./agents/parentReport";
export { generateTeacherReport, type TeacherReport } from "./agents/teacherReport";

// ── Yeni 5 agent + interaktif motor (AI TEACHER derinleştirme) ──
export { analyzeMaterial, type MaterialSummary } from "./agents/materialAnalyzer";
export { adaptToAge, type AdaptedContent } from "./agents/ageAdapter";
export { buildVisualStoryboard, type VisualStoryboard } from "./agents/visualLearning";
export { simplify, type SimplifiedExplanation } from "./agents/contentSimplifier";
export { detectLearningStyle, type LearningStyleResult } from "./agents/learningStyleDetector";
export { detectWeaknesses, type WeaknessReport } from "./agents/weaknessDetector";
export { tutorRespond, type TutorTurn } from "./agents/interactiveTutor";
