export interface LessonFormData {
  subject: string;
  grade: number;
  topic: string;
  lesson_type: string;
  duration: number;
}

export interface LessonPlanStage {
  stage: string;
  duration: number;
  activity: string;
}

export interface LessonTasks {
  easy: string;
  medium: string;
  hard: string;
}

export interface LessonContent {
  objectives: string[];
  plan: LessonPlanStage[];
  tasks: LessonTasks;
  homework: string;
  assessment: string;
}

export interface Lesson {
  id: string;
  user_id: string;
  subject: string;
  grade: number;
  topic: string;
  lesson_type: string;
  content: LessonContent;
  created_at: string;
}

export interface Profile {
  id: string;
  name: string | null;
  school: string | null;
  city: string | null;
  default_subject: string | null;
  default_grade: number | null;
  created_at: string;
}

export const SUBJECTS = [
  "Математика",
  "Русский язык",
  "Литература",
  "История",
  "Биология",
  "Химия",
  "Физика",
  "География",
  "Английский язык",
  "Информатика",
] as const;

export const GRADES = [5, 6, 7, 8, 9, 10, 11] as const;

export const LESSON_TYPES = [
  "Новый материал",
  "Повторение",
  "Закрепление",
  "Контрольная",
] as const;

export const DURATIONS = [45, 90] as const;

export type Subject = (typeof SUBJECTS)[number];
export type Grade = (typeof GRADES)[number];
export type LessonType = (typeof LESSON_TYPES)[number];
