import { Space, ChatMessage } from '../types';

export const initialSpaces: Space[] = [
  { id: '1', name: 'Std 5 Geography & Environment', materialCount: 4, iconName: 'Globe' },
  { id: '2', name: 'WEATHER NOTES', materialCount: 2, iconName: 'Cloud' },
  { id: '3', name: 'Std 5 Mathematics', materialCount: 3, iconName: 'Calculator' },
];

export const initialMessages: ChatMessage[] = [
  {
    id: 'm1',
    role: 'assistant',
    content: 'Hello Ahmed! I am ScholarTrack AI. How can I help you study today?',
    timestamp: '17:28',
  }
];
