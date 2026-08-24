export type TabType = 'home' | 'dashboard' | 'spaces' | 'chat' | 'practice' | 'sources' | 'leaderboard';

export interface AvatarConfig {
  skinColor: string;
  hairStyle: 'afro' | 'curly' | 'dreads' | 'short' | 'buzz' | 'long' | 'spiky' | 'none';
  hairColor: string;
  expression: 'happy' | 'focused' | 'confident' | 'cool' | 'wink';
  outfit: 'hoodie' | 'tshirt' | 'blazer' | 'sweater';
  outfitColor: string;
  glasses: 'none' | 'round' | 'square' | 'sunglasses';
  headwear: 'none' | 'cap' | 'beanie' | 'gradCap';
}

export interface UserGamification {
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: string;
  dailyXpGoal: number;
  dailyXpEarned: number;
  streakFreezeCount: number;
  avatarConfig: AvatarConfig;
  avatar3dUrl?: string;
}

export interface AttachedSource {
  name: string;
  data?: string;
}

export interface Assignment {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  status: 'Pending' | 'Completed';
  category?: string;
  targetGrade?: string;
  attachedSources?: AttachedSource[];
}

export interface StudySource {
  id: string;
  title: string;
  urlOrName?: string;
  type?: string;
  fileData?: string;
  subject?: string;
  fileSize?: string;
  dateAdded?: string;
}

export interface GrowthPoint {
  day: string;
  hours: number;
  score: number;
}

export interface ChatMessage {
  id: string;
  role?: string;
  sender?: 'user' | 'ai';
  content?: string;
  text?: string;
  timestamp?: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  subject?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface FriendActivity {
  id: string;
  name: string;
  avatar?: string;
  xp?: number;
  streak?: number;
  status?: string;
  streakDays?: number;
  xpToday?: number;
  lastAction?: string;
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
  space?: string;
}

export interface Space {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  iconName?: string;
  membersCount?: number;
  materialCount?: number;
}
