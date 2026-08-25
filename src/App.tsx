import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { StudySpaces } from './components/StudySpaces';
import { AITutorChat } from './components/AITutorChat';
import { AIExamHub } from './components/AIExamHub';
import { StudyPlanner } from './components/StudyPlanner';
import { ResourcesLibrary } from './components/ResourcesLibrary';
import { SocialHub } from './components/SocialHub';
import { ByteCompanion } from './components/ByteCompanion';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [xp, setXp] = useState(2450);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const addXp = (amount: number) => setXp((prev) => prev + amount);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard xp={xp} addXp={addXp} />;
      case 'spaces':
        return <StudySpaces />;
      case 'ai-tutor':
        return <AITutorChat />;
      case 'ai-studio':
        return <AIExamHub />;
      case 'planner':
        return <StudyPlanner />;
      case 'resources':
        return <ResourcesLibrary />;
      case 'social':
        return <SocialHub />;
      default:
        return <Dashboard xp={xp} addXp={addXp} />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* MOBILE HEADER */}
      <div className="flex md:hidden items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 z-40 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center font-black text-white text-xs shadow-md shadow-violet-600/30">
            S
          </div>
          <span className="font-black text-sm text-white">ScholarTrack</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
        >
          {isMobileMenuOpen ? '✕ Close' : '☰ Menu'}
        </button>
      </div>

      {/* MOBILE BACKDROP */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`fixed md:relative inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setIsMobileMenuOpen(false);
          }}
        />
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto w-full max-w-full p-4 sm:p-6 relative">
        <Header />
        {renderContent()}
        <ByteCompanion />
      </main>
    </div>
  );
};

export default App;
