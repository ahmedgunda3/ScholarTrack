import React, { useState } from 'react';

export const ByteCompanion: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {isOpen && (
        <div className="mb-3 w-72 bg-slate-900 border border-violet-500/40 rounded-2xl p-4 shadow-2xl shadow-violet-950/80 text-xs backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
            <span className="font-black text-violet-300 flex items-center gap-1.5">
              🤖 Byte (AI Companion)
            </span>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white font-bold"
            >
              ✕
            </button>
          </div>
          <p className="text-slate-300 leading-relaxed">
            Hey! I'm tracking your study progress. You're 1.5 hours away from hitting your weekly goal! 🚀
          </p>
        </div>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2.5 bg-slate-900/90 hover:bg-violet-950/80 text-white text-xs font-black rounded-2xl border border-violet-500/50 shadow-xl shadow-black/50 backdrop-blur-md flex items-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
      >
        <span className="text-sm group-hover:animate-bounce">🤖</span>
        <span>Byte (Companion)</span>
      </button>
    </div>
  );
};
