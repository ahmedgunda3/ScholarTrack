import React from 'react';
import { Flame, Trophy, Zap, UserPlus } from 'lucide-react';
import type { FriendActivity } from '../types';

export const SocialLeaderboard: React.FC = () => {
  const friends: FriendActivity[] = [
    { id: '1', name: 'Alex M.', avatar: '⚡', streakDays: 14, xpToday: 240, lastAction: 'Completed 15m Quiz' },
    { id: '2', name: 'Sarah K.', avatar: '🌟', streakDays: 8, xpToday: 180, lastAction: 'Created 10 Flashcards' },
    { id: '3', name: 'You', avatar: '🔥', streakDays: 3, xpToday: 120, lastAction: 'Studied AI Chat' },
  ];

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 text-slate-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy size={18} className="text-amber-400" />
          <h3 className="text-sm font-bold">Friend Leaderboard</h3>
        </div>
        <button className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium">
          <UserPlus size={14} /> Add Friend
        </button>
      </div>

      <div className="space-y-3">
        {friends.map((friend, idx) => (
          <div
            key={friend.id}
            className={`flex items-center justify-between p-3 rounded-xl border ${
              friend.name === 'You' ? 'bg-indigo-950/40 border-indigo-500/40' : 'bg-slate-800/30 border-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500 w-4">#{idx + 1}</span>
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm">
                {friend.avatar}
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-200">{friend.name}</p>
                <p className="text-[10px] text-slate-400">{friend.lastAction}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold">
              <div className="flex items-center gap-1 text-amber-400">
                <Flame size={14} />
                <span>{friend.streakDays}d</span>
              </div>
              <div className="flex items-center gap-1 text-indigo-400">
                <Zap size={14} />
                <span>{friend.xpToday} XP</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};