export type TabType = 'home' | 'chat' | 'practice';

export interface Space {
  id: string;
  name: string;
  materialCount: number;
  iconName: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  thoughtProcess?: string;
}
