import React from 'react';
import { HelpCircle, Sparkles, Layers, Mic, Calendar, Flame, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SocialLeaderboard } from './SocialLeaderboard';

export const Dashboard: React.FC = () => {
  const { setActiveTab } = useApp();

  const quickActions = [
    { title: 'Ask the tutor', icon: HelpCircle, color: 'text-sky-400', tab: 'chat' },
    { title: 'Create a quiz', icon: Sparkles, color: 'text-purple-400', tab: 'practice' },
    { title: 'Make Flashcards', icon: Layers, color: 'text-emerald-400', tab: 'practice' },
    { title: 'Record a lecture', icon: Mic, color: 'text-rose-400', tab: 'chat' },
    { title: 'Start a study plan', icon: Calendar, color: 'text-amber-400', tab: 'practice' },
  ];

  return (
    <div className="flex-1 bg-[var(--bg-primary,#0b0f19)] text-slate-100 p-8 overflow-y-auto">
      {/* Streak Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 rounded-2xl p-4 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Flame className="text-amber-500 animate-pulse" size={24} />
          <span className="text-sm font-medium text-amber-200">Study Streak Active! Keep up the momentum 🔥</span>
        </div>
        <div className="text-xs px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full font-semibold border border-amber-500/30">
          3 Day Streak
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Actions */}
          <div>
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Quick actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTab(action.tab as any)}
                  className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 p-4 rounded-xl flex flex-col items-center justify-center gap-3 transition group text-center"
                >
                  <action.icon className={`${action.color} group-hover:scale-110 transition`} size={22} />
                  <span className="text-xs font-medium text-slate-300">{action.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Jump Back In */}
          <div>
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Active Course</h2>
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs font-semibold text-sky-400 uppercase tracking-wide">Course Module</span>
                  <h3 className="text-xl font-bold text-white mt-1">General Studies</h3>
                  <p className="text-xs text-slate-400 mt-1">Interactive Study Workspace</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('chat')}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition"
              >
                <span>Continue studying</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Social Leaderboard */}
        <div className="space-y-6">
          <SocialLeaderboard />
        </div>
      </div>
    </div>
  );
};