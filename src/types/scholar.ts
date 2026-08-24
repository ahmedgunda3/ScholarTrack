export interface StudySpace {
  id: string;
  name: string;
  description: string;
  members: number;
  category?: string;
}

export interface Resource {
  id: string;
  title: string;
  type: string;
  addedAgo: string;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  daysStreak: number;
  xp: number;
  isCurrentUser?: boolean;
}
