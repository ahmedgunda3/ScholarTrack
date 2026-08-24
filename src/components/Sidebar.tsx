import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userLevel: number;
  petIcon: string;
  petName: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  userLevel,
  petIcon,
  petName,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'spaces', label: 'Study Spaces', icon: '👥' },
    { id: 'tutor', label: 'AI Tutor Chat', icon: '💬' },
    { id: 'hub', label: 'Study & Exam Hub', icon: '🎓' },
    { id: 'library', label: 'Sources & Library', icon: '📚' },
    { id: 'social', label: 'Social & Friends', icon: '🏆' },
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between h-screen sticky top-0 p-4">
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center font-black text-xl shadow-lg">
            S
          </div>
          <span className="font-black text-lg tracking-tight text-white">ScholarTrack</span>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                  isActive
                    ? 'bg-violet-600/20 text-violet-400 border border-violet-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-violet-950 border border-violet-500/50 flex items-center justify-center font-bold text-sm">
              👨‍🎓
            </div>
            <div title={`${petName} (Companion)`} className="absolute -bottom-1 -right-1 text-sm animate-bounce">
              {petIcon}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-white truncate">VANE (You)</h4>
            <span className="text-[10px] text-violet-400 font-semibold block">
              Level {userLevel} Scholar
            </span>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('social')}
          className="w-full bg-slate-800 hover:bg-slate-700 text-[11px] font-bold py-1.5 rounded-lg text-slate-300 transition"
        >
          View Companion & Stats
        </button>
      </div>
    </aside>
  );
};
