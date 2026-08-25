import React, { useState } from 'react';

export const AITutor: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I am your ScholarTrack AI Tutor. What subject or formula are we tackling today?' }
  ]);

  const suggestions = [
    'Explain Integration by Parts',
    'Derive Newton\'s Second Law',
    'Summarize Cellular Respiration',
    'Solve Quadratic Equation'
  ];

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { sender: 'user', text: input }]);
    setInput('');
    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Great question! Let us analyze this step by step...' }]);
    }, 600);
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/30 hover:shadow-xl">
        <h1 className="text-2xl font-black text-white">ScholarTrack AI Tutor</h1>
        <p className="text-xs text-slate-400 mt-1">Converse with your dedicated AI tutor for step-by-step explanations.</p>
      </div>

      {/* Quick Suggestion Chips */}
      <div className="flex flex-wrap gap-2">
        {suggestions.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => setInput(prompt)}
            className="bg-slate-900 hover:bg-violet-600 border border-slate-800 hover:border-violet-500 text-slate-300 hover:text-white text-xs font-bold px-4 py-2.5 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg active:translate-y-0 active:scale-95 cursor-pointer"
          >
            💡 {prompt}
          </button>
        ))}
      </div>

      {/* Chat Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-[450px] flex flex-col justify-between space-y-4 transition-all duration-300 hover:border-slate-700">
        <div className="overflow-y-auto space-y-3 pr-2 flex-1">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-4 rounded-2xl max-w-lg text-xs font-medium transition-all duration-300 transform hover:-translate-y-0.5 ${
                msg.sender === 'user'
                  ? 'bg-violet-600 text-white ml-auto border border-violet-500 shadow-md'
                  : 'bg-slate-950 text-slate-200 border border-slate-800'
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input Controls */}
        <div className="flex gap-3 items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a concept or formula..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-violet-500 transition-all duration-300 transform hover:-translate-y-0.5"
          />
          <button
            onClick={handleSend}
            className="bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs px-6 py-3 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-600/30 active:translate-y-0 active:scale-95 cursor-pointer"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export const AITutorView = AITutor;
