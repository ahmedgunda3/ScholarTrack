export type ThemeType = 'dark' | 'oled' | 'cyberpunk' | 'synthwave';

export interface UserSettings {
  theme: ThemeType;
  publicStreak: boolean;
  xpNotifications: boolean;
  dailyGoalMins: number;
}

export interface FriendActivity {
  id: string;
  name: string;
  avatar: string;
  streakDays: number;
  xpToday: number;
  lastAction: string;
}