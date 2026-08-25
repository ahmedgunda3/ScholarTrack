import React, { useState } from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem('scholartrack_sidebar_collapsed');
    return saved ? JSON.parse(saved) : false;
  });

  const handleToggle = () => {
    setIsCollapsed((prev) => {
      const nextState = !prev;
      localStorage.setItem('scholartrack_sidebar_collapsed', JSON.stringify(nextState));
      return nextState;
    });
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'spaces', label: 'Study Spaces', icon: '💬' },
    { id: 'ai-tutor', label: 'AI Tutor Chat', icon: '🤖' },
    { id: 'ai-studio', label: 'AI Studio & Exam Hub', icon: '🎨' },
    { id: 'planner', label: 'Study Planner', icon: '📅' },
    { id: 'resources', label: 'Resources & Library', icon: '📚' },
    { id: 'social', label: 'Social & Friends', icon: '👥' },
  ];

  return (
    <aside
      className={`h-full bg-slate-950 border-r border-slate-800/80 transition-all duration-300 flex flex-col justify-between shrink-0 relative ${
        isCollapsed ? 'w-20 p-3' : 'w-64 p-4'
      }`}
    >
      {/* Arrow Toggle Button with hover glow */}
      <button
        onClick={handleToggle}
        className="hidden md:flex absolute -right-3.5 top-6 bg-violet-600 hover:bg-violet-500 hover:scale-110 active:scale-95 text-white w-7 h-7 rounded-full items-center justify-center shadow-lg shadow-violet-600/40 border border-slate-700 transition-all duration-200 z-50 cursor-pointer"
        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <span className={`text-xs font-bold transform transition-transform duration-300 ${isCollapsed ? 'rotate-180' : 'rotate-0'}`}>
          ◀
        </span>
      </button>

      <div className="space-y-6">
        <div className="flex items-center gap-3 px-1 pt-2 md:pt-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center font-black text-white shadow-lg shadow-violet-600/30 shrink-0">
            S
          </div>
          {!isCollapsed && (
            <h1 className="text-lg font-black text-white tracking-wide truncate">
              ScholarTrack
            </h1>
          )}
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <div key={item.id} className="relative group">
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl font-bold text-xs transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/40 border border-violet-500/50 scale-[1.02]'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900 hover:border-slate-800/80 border border-transparent'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                >
                  <span className="text-lg shrink-0 transition-transform group-hover:scale-110">{item.icon}</span>
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </button>

                {/* Hover Tooltip when collapsed */}
                {isCollapsed && (
                  <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:block bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-xl whitespace-nowrap shadow-xl border border-slate-800 z-50 pointer-events-none">
                    {item.label}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {!isCollapsed && (
        <div className="p-3 bg-slate-900/80 border border-slate-800/80 rounded-2xl flex items-center gap-3 transition-colors hover:bg-slate-900">
          <div className="w-8 h-8 rounded-xl bg-violet-500/20 text-violet-400 font-bold flex items-center justify-center text-xs border border-violet-500/30">
            ST
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">Scholar Session</p>
            <p className="text-[10px] text-emerald-400 font-semibold">Online</p>
          </div>
        </div>
      )}
    </aside>
  );
};
