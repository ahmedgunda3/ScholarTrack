import React, { useState } from 'react';
import { Send, Upload, Mic, Link as LinkIcon, Sparkles, Loader2 } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useApp } from '../context/AppContext';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export const ChatView: React.FC = () => {
  const { messages, addMessage, spaces } = useApp();
  const [input, setInput] = useState('');
  const [selectedSpace, setSelectedSpace] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userQuery = input;
    setInput('');

    addMessage({ role: 'user', content: userQuery });
    setIsLoading(true);

    try {
      if (!apiKey) {
        throw new Error("Gemini API key is missing. Add VITE_GEMINI_API_KEY to .env.local");
      }

      const currentSpace = spaces.find((s) => s.id === selectedSpace);
      const spaceContext = currentSpace 
        ? `[Context Space: ${currentSpace.name}]\n` 
        : `[Context: General Academic Assistant]\n`;

      const systemPrompt = `${spaceContext}You are ScholarTrack AI, an intelligent academic tutor. Help the user learn, generate flashcards, or construct quizzes clearly and encouragingly.`;

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(`${systemPrompt}\n\nStudent Question: ${userQuery}`);
      const responseText = result.response.text();

      addMessage({
        role: 'assistant',
        content: responseText,
        thoughtProcess: `Powered by Gemini 1.5 Flash • ${currentSpace ? currentSpace.name : 'Global Knowledge'}`,
      });
    } catch (error: any) {
      addMessage({
        role: 'assistant',
        content: `⚠️ Error: ${error.message || 'Failed to get response from Gemini API.'}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-[#0b0f19] text-slate-100 flex flex-col h-screen">
      <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between bg-[#0f172a]/50">
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-medium">Context Space:</span>
          <select
            value={selectedSpace}
            onChange={(e) => setSelectedSpace(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">No Space (Global Knowledge)</option>
            {spaces.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-2xl rounded-2xl p-4 text-sm leading-relaxed ${
              msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
            }`}>
              {msg.thoughtProcess && (
                <details className="mb-3 text-xs text-slate-400 border-b border-slate-800 pb-2">
                  <summary className="cursor-pointer font-medium hover:text-indigo-400 flex items-center gap-1">
                    <Sparkles size={12} /> Model Details
                  </summary>
                  <p className="mt-1 pl-3 text-slate-400 italic">{msg.thoughtProcess}</p>
                </details>
              )}
              <div className="whitespace-pre-wrap">{msg.content}</div>
              <span className="text-[10px] text-slate-400 block text-right mt-2 opacity-60">{msg.timestamp}</span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-indigo-400 text-xs p-2">
            <Loader2 className="animate-spin" size={16} />
            <span>ScholarTrack AI is thinking...</span>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-slate-800/80 bg-[#0f172a]/30">
        <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1">
          <button onClick={() => setInput("Explain photosythesis to me simply")} className="text-xs bg-slate-800/80 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-full border border-slate-700 shrink-0">💡 Explain simply</button>
          <button onClick={() => setInput("Create 3 study flashcards for Geography")} className="text-xs bg-slate-800/80 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-full border border-slate-700 shrink-0">🎴 Generate Flashcards</button>
          <button onClick={() => setInput("Make a 5 question quiz on Std 5 Science")} className="text-xs bg-slate-800/80 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-full border border-slate-700 shrink-0">📝 Quiz me</button>
        </div>

        <div className="bg-slate-900 border border-slate-800 focus-within:border-indigo-500 rounded-2xl p-3 flex flex-col gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            placeholder="Ask ScholarTrack AI anything or request flashcards..."
            className="bg-transparent border-none text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-none h-16"
          />
          <div className="flex items-center justify-between border-t border-slate-800/60 pt-2">
            <div className="flex items-center gap-2 text-slate-400">
              <button className="p-1.5 hover:bg-slate-800 rounded-lg hover:text-slate-200" title="Upload Document"><Upload size={16} /></button>
              <button className="p-1.5 hover:bg-slate-800 rounded-lg hover:text-slate-200" title="Record Audio"><Mic size={16} /></button>
              <button className="p-1.5 hover:bg-slate-800 rounded-lg hover:text-slate-200" title="Add Link"><LinkIcon size={16} /></button>
            </div>
            <button onClick={handleSend} disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white p-2 rounded-xl">
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
