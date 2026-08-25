export interface SpaceSource {
  id: string;
  title: string;
  type: string;
  size: string;
  uploadedAt: string;
}

export interface StudySpace {
  id: string;
  name: string;
  description: string;
  members: number;
  category?: string;
  sources: SpaceSource[];
}

export interface LibraryItem {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'video' | 'audio' | 'code' | 'doc';
  size: string;
  uploadedDate: string;
  category: string;
  url?: string;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: string;
  mastered?: boolean;
}

export interface ScheduleEvent {
  id: string;
  title: string;
  subject: string;
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  time: string;
  duration: string;
  color: string;
}

export interface Friend {
  id: string;
  name: string;
  status: string;
  avatar?: string;
  xp?: number;
  sharedNotesCount?: number;
}

export interface SharedNote {
  id: string;
  title: string;
  author?: string;
  senderName?: string;
  date?: string;
  fileSize?: string;
  timestamp?: string;
}

export type QuestionType =
  | 'multiple_choice'
  | 'multiple-choice'
  | 'true_false'
  | 'matchmaking'
  | 'word_in_box'
  | 'diagram_labeling'
  | 'diagram'
  | 'short-answer';
