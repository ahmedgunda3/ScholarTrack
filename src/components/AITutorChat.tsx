import React, { useState, useRef, useEffect } from 'react';

export const AITutorChat: React.FC = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Hello! I am your ScholarTrack AI Tutor. What subject or formula are we tackling today?',
      time: '02:18 PM'
    }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    setTimeout(() => {
      setIsThinking(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: 'Hey there! Ready to grind? Upload your notes or ask any specific study questions!',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-5xl mx-auto bg-slate-900/60 border border-slate-800 rounded-3xl backdrop-blur-md overflow-hidden shadow-2xl">
      <div className="p-5 border-b border-slate-800 flex items-center gap-3 bg-slate-950/40">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white text-lg font-bold shadow-md shadow-violet-600/30">
          🤖
        </div>
        <div>
          <h2 className="text-base font-black text-white flex items-center gap-2">
            ScholarTrack AI Tutor
          </h2>
          <p className="text-xs text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Continuous AI Study Partner • Online
          </p>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-xl p-4 rounded-3xl text-xs sm:text-sm font-medium shadow-md transition-all ${
                msg.sender === 'user'
                  ? 'bg-violet-600 text-white rounded-br-none shadow-violet-600/20'
                  : 'bg-slate-800/90 text-slate-100 border border-slate-700/80 rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 px-1 font-semibold">{msg.time}</span>
          </div>
        ))}

        {isThinking && (
          <div className="flex items-center gap-2 text-xs font-bold text-violet-400 p-2">
            <span className="animate-pulse">🤖 AI Tutor is thinking...</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a concept or Formula..."
          className="flex-1 bg-slate-900/90 border border-slate-700/80 rounded-2xl px-5 py-3.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
        />
        <button
          type="submit"
          className="px-6 py-3.5 bg-violet-600 hover:bg-violet-500 hover:scale-105 active:scale-95 text-white font-bold text-xs rounded-2xl shadow-lg shadow-violet-600/30 transition-all cursor-pointer shrink-0"
        >
          Send
        </button>
      </form>
    </div>
  );
};
