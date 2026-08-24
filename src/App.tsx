import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { AvatarModal } from './components/AvatarModal';
import { AITutorChat } from './components/AITutorChat';
import { StudySpacesView } from './components/StudySpaces';
import { StudyExamHub } from './components/StudyExamHub';
import { SocialHub } from './components/SocialHub';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userLevel] = useState(5);
  const [petIcon, setPetIcon] = useState('🐉');
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userLevel={userLevel}
        petName="Byte"
        petIcon={petIcon}
      />

      <div className="flex-1 flex flex-col min-h-screen">
        <Header
          userLevel={userLevel}
          onOpenAvatarModal={() => setIsAvatarModalOpen(true)}
        />

        <main className="flex-1 p-2">
          {activeTab === 'tutor' && <AITutorChat />}
          {activeTab === 'spaces' && <StudySpacesView />}
          {activeTab === 'hub' && <StudyExamHub />}
          {activeTab === 'social' && <SocialHub />}
          {(activeTab === 'dashboard' || activeTab === 'library') && (
            <div className="p-6 space-y-4">
              <h1 className="text-2xl font-black capitalize">{activeTab} View</h1>
              <p className="text-slate-400 text-xs">
                Select <strong className="text-violet-400">AI Tutor Chat</strong> or <strong className="text-violet-400">Study Spaces</strong> to test new interactive flows.
              </p>
            </div>
          )}
        </main>
      </div>

      <AvatarModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        currentPet={petIcon}
        onSelectPet={(icon) => setPetIcon(icon)}
      />
    </div>
  );
}
