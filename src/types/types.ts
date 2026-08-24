export type TabType = 'home' | 'chat' | 'practice';

export interface Space {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  thoughtProcess?: string;
  timestamp?: number;
}