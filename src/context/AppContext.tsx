import React, { createContext, useContext, useState } from 'react';
import type { TabType, Space, ChatMessage } from '../types';
import { initialSpaces, initialMessages } from '../data/mockData';

interface AppContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  spaces: Space[];
  selectedSpaceId: string | null;
  setSelectedSpaceId: (id: string | null) => void;
  messages: ChatMessage[];
  addMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [spaces] = useState<Space[]>(initialSpaces);
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const addMessage = (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...msg,
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        spaces,
        selectedSpaceId,
        setSelectedSpaceId,
        messages,
        addMessage,
        isSidebarOpen,
        setIsSidebarOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
