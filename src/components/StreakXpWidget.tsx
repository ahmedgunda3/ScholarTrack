import React, { useState } from 'react';
import { Flame, Zap, Shield, Award, Sparkles, Settings2 } from 'lucide-react';
import type { UserGamification, AvatarConfig } from '../types';
import { AvatarDisplay } from './AvatarDisplay';
import { AvatarCustomizerModal } from './AvatarCustomizerModal';

interface Props {
  stats: UserGamification;
  onClaimBonus?: () => void;
  onUpdateAvatar?: (config: AvatarConfig) => void;
}

export const StreakXpWidget: React.FC<Props> = ({ stats, onClaimBonus, onUpdateAvatar }) => {
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const currentLevelProgress = Math.min(100, Math.round((stats.xp % 250) / 2.5));
  const dailyProgress = Math.min(100, Math.round((stats.dailyXpEarned / stats.dailyXpGoal) * 100));

  const mascotQuotes = [
    "You're on fire! Keep that study streak burning! 🔥",
    "Great work today! Every task completed boosts your GPA rank.",
    "Don't lose your streak! Complete 1 focus session or task now.",
    "Awesome job! You reached today's XP goal! 🎓"
  ];

  const currentQuote = dailyProgress >= 100 
    ? mascotQuotes[3] 
    : stats.streakDays > 0 
      ? mascotQuotes[0] 
      : mascotQuotes[2];

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/30 p-5 rounded-3xl space-y-4 shadow-xl">
      {/* Top Stats Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Streak Indicator */}
        <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/30 px-4 py-2 rounded-2xl">
          <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl animate-pulse">
            <Flame size={24} className="fill-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-xl font-extrabold text-amber-400">{stats.streakDays}</span>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">Day Streak</span>
            </div>
            <p className="text-[10px] text-amber-200/70">Daily study habit active</p>
          </div>
        </div>

        {/* XP & Level Meter */}
        <div className="flex items-center gap-3 bg-indigo-500/10 border border-indigo-500/30 px-4 py-2 rounded-2xl">
          <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl">
            <Zap size={24} className="fill-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold text-indigo-300">{stats.xp} XP</span>
              <span className="text-[11px] font-bold bg-indigo-600 text-white px-2 py-0.5 rounded-full">Lvl {stats.level}</span>
            </div>
            <div className="w-32 bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
              <div 
                className="bg-indigo-400 h-full rounded-full transition-all duration-500" 
                style={{ width: `${currentLevelProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Daily Goal Progress Bar */}
        <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-2xl">
          <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
            <Award size={24} />
          </div>
          <div>
            <div className="flex items-center justify-between gap-3 text-xs font-bold text-emerald-300">
              <span>Daily Goal</span>
              <span>{stats.dailyXpEarned}/{stats.dailyXpGoal} XP</span>
            </div>
            <div className="w-32 bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
              <div 
                className="bg-emerald-400 h-full rounded-full transition-all duration-500" 
                style={{ width: `${dailyProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Streak Freeze Shield */}
        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-2 rounded-2xl" title="Streak Freeze Shield">
          <Shield size={18} className="text-cyan-400 fill-cyan-400/20" />
          <span className="text-xs font-semibold text-slate-300">{stats.streakFreezeCount} Freeze</span>
        </div>
      </div>

      {/* Mascot & Customizable User Avatar Banner */}
      <div className="bg-slate-950/80 border border-slate-800/80 p-3.5 rounded-2xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative group cursor-pointer" onClick={() => setIsCustomizerOpen(true)}>
            <AvatarDisplay config={stats.avatarConfig} size={54} />
            <div className="absolute inset-0 bg-indigo-600/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <Settings2 size={16} className="text-white" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-slate-200">Student Persona</h4>
              <button
                onClick={() => setIsCustomizerOpen(true)}
                className="text-[10px] font-semibold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20 flex items-center gap-1 transition"
              >
                <Settings2 size={10} /> Customize Avatar
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{currentQuote}</p>
          </div>
        </div>

        {onClaimBonus && (
          <button
            onClick={onClaimBonus}
            className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-extrabold transition shrink-0"
          >
            <Sparkles size={14} /> Claim +15 XP
          </button>
        )}
      </div>

      {/* Avatar Customizer Modal */}
      {onUpdateAvatar && (
        <AvatarCustomizerModal
          isOpen={isCustomizerOpen}
          onClose={() => setIsCustomizerOpen(false)}
          config={stats.avatarConfig || {
            skinColor: '#f3d299',
            hairStyle: 'curly',
            hairColor: '#1e1b18',
            expression: 'confident',
            outfit: 'hoodie',
            outfitColor: '#4f46e5',
            glasses: 'round',
            headwear: 'none'
          }}
          onSave={onUpdateAvatar}
        />
      )}
    </div>
  );
};
