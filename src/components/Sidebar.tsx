import React, { useState } from 'react';
import { Home, MessageSquare, Flame, BookOpen, ChevronLeft, ChevronRight, Plus, Settings } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SettingsModal } from './SettingsModal';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, spaces, isSidebarOpen, setIsSidebarOpen } = useApp();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-[var(--bg-secondary,#0f172a)] text-slate-300 flex flex-col border-r border-slate-800 h-screen sticky top-0`}>
        {/* Top Header */}
        <div className="p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white">S</div>
            {isSidebarOpen && <span className="font-bold text-white text-lg tracking-wide">ScholarTrack</span>}
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-400 hover:text-white p-1">
            {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          <button onClick={() => setActiveTab('home')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${activeTab === 'home' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}>
            <Home size={18} />
            {isSidebarOpen && <span>Home</span>}
          </button>
          <button onClick={() => setActiveTab('chat')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${activeTab === 'chat' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}>
            <MessageSquare size={18} />
            {isSidebarOpen && <span>AI Chat</span>}
          </button>
          <button onClick={() => setActiveTab('practice')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${activeTab === 'practice' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}>
            <Flame size={18} />
            {isSidebarOpen && <span>Practice & Quizzes</span>}
          </button>
        </nav>

        {/* Spaces Section */}
        {isSidebarOpen && (
          <div className="flex-1 overflow-y-auto px-3 py-4 border-t border-slate-800">
            <div className="flex items-center justify-between mb-2 px-2 text-xs font-semibold text-slate-400 tracking-wider uppercase">
              <span>Spaces</span>
              <button className="hover:text-white"><Plus size={14} /></button>
            </div>
            <div className="space-y-1">
              {spaces.map((space) => (
                <div key={space.id} className="flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 cursor-pointer transition">
                  <BookOpen size={14} className="text-indigo-400" />
                  <span className="truncate">{space.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* User Footer & Settings Gear */}
        <div className="p-3 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold text-xs">U</div>
            {isSidebarOpen && (
              <div className="flex-1 truncate">
                <p className="text-xs font-medium text-slate-200 truncate">Student User</p>
                <p className="text-[10px] text-slate-500 truncate">Active Learner</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            title="Open Settings & Themes"
          >
            <Settings size={18} />
          </button>
        </div>
      </aside>

      {/* Render Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
};