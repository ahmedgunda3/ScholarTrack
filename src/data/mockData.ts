import type { Space, ChatMessage } from '../types';

export const initialSpaces: Space[] = [
  { id: '1', name: 'General Studies', materialCount: 0, iconName: 'BookOpen' },
  { id: '2', name: 'Course Notes', materialCount: 0, iconName: 'FileText' },
];

export const initialMessages: ChatMessage[] = [
  {
    id: 'm1',
    role: 'assistant',
    content: 'Welcome to ScholarTrack AI! How can I assist with your study goals today?',
    timestamp: '12:00',
  }
];