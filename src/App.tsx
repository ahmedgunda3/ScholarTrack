import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ChatView } from './components/ChatView';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="flex min-h-screen bg-[#0b0f19]">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0">
        {activeTab === 'home' && <Dashboard />}
        {activeTab === 'chat' && <ChatView />}
        {activeTab === 'practice' && (
          <div className="p-8 text-slate-400">
            <h1 className="text-xl font-bold text-white mb-2">Practice Hub</h1>
            <p>Quiz and Flashcard generators will display here.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
