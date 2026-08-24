import React, { useState } from 'react';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AITutorChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: "Hello! I am your ScholarTrack AI Tutor. What subject or formula are we tackling today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let aiResponseText = `Here is a custom breakdown for "${currentInput}": Focus on core definitions, practice active recall, and test yourself in the Exam Studio.`;

      if (currentInput.toLowerCase().includes('what') || currentInput.toLowerCase().includes('how')) {
        aiResponseText = `Great question regarding "${currentInput}". To master this, break the concept into 3 core steps: 1) Define key terminology, 2) Solve 2 practice problems, 3) Review flashcards.`;
      } else if (currentInput.toLowerCase().includes('hello') || currentInput.toLowerCase().includes('hi')) {
        aiResponseText = "Hey there! Ready to grind? Upload your notes or ask any specific study questions!";
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 p-6">
      <div className="border-b border-slate-800 pb-4 mb-4">
        <h2 className="text-xl font-black text-white">ScholarTrack AI Tutor</h2>
        <p className="text-xs text-slate-400">Context-Aware AI Assistant & Solver</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xl p-4 rounded-2xl text-sm ${m.sender === 'user' ? 'bg-violet-600 text-white rounded-br-none' : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'}`}>
              <p>{m.text}</p>
              <span className="text-[10px] opacity-60 block text-right mt-1">{m.timestamp}</span>
            </div>
          </div>
        ))}
        {isTyping && <div className="text-xs text-violet-400 animate-pulse">AI Tutor is thinking...</div>}
      </div>

      <form onSubmit={handleSend} className="mt-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a concept or formula..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500"
        />
        <button type="submit" className="bg-violet-600 hover:bg-violet-500 font-bold px-6 py-3 rounded-xl text-sm transition">
          Send
        </button>
      </form>
    </div>
  );
};
