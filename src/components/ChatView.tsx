import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Paperclip, Mic } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useApp } from '../context/AppContext';
import { playLevelUpSound } from '../utils/sound';

export const ChatView: React.FC = () => {
  const { messages, addMessage, spaces, selectedSpaceId } = useApp();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentSpace = spaces.find((s) => s.id === selectedSpaceId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');

    // 1. Add user message
    addMessage({
      role: 'user',
      content: userText,
    });

    setIsLoading(true);

    try {
      // 2. Initialize Gemini API with standard production model
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

      // Build context prompt if a space is selected
      const contextPrefix = currentSpace 
        ? `[Context: User is currently working inside the "${currentSpace.name}" workspace]\n\n` 
        : '';

      const prompt = `${contextPrefix}${userText}`;

      // 3. Call Gemini
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      // 4. Add AI message
      addMessage({
        role: 'assistant',
        content: responseText,
        thoughtProcess: `Powered by Gemini 2.0 Flash • ${currentSpace ? currentSpace.name : 'Global Knowledge'}`,
      });

      // 5. Play retro 8-bit level-up audio chime
      playLevelUpSound();

    } catch (error) {
      console.error('Error generating response:', error);
      addMessage({
        role: 'assistant',
        content: 'Sorry, I encountered an error connecting to Gemini. Please verify your API key in Vercel settings.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--bg-primary,#0b0f19)] text-slate-100 relative">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-[var(--bg-secondary,#0f172a)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">
              {currentSpace ? `${currentSpace.name} Workspace AI` : 'ScholarTrack AI Assistant'}
            </h2>
            <p className="text-xs text-slate-400">Ask questions, get summaries, or practice topics</p>
          </div>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-3xl ${
              msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 border border-slate-700 text-indigo-400'
              }`}
            >
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>

            <div className="space-y-1 max-w-[85%]">
              <div
                className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-900/80 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>

              {msg.thoughtProcess && (
                <div className="text-[10px] text-slate-500 px-1 italic flex items-center gap-1">
                  <span>{msg.thoughtProcess}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 max-w-3xl mr-auto">
            <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 text-indigo-400 flex items-center justify-center text-xs font-bold animate-pulse">
              <Bot size={16} />
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-400 text-sm flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
              <span className="text-xs ml-1">ScholarTrack is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[var(--bg-secondary,#0f172a)] border-t border-slate-800">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto relative">
          <div className="relative flex items-end bg-slate-900/90 border border-slate-800 focus-within:border-indigo-500/50 rounded-2xl p-2 transition">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                currentSpace
                  ? `Ask ScholarTrack about ${currentSpace.name}...`
                  : 'Ask anything or paste your study material...'
              }
              rows={2}
              className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm p-2 outline-none resize-none max-h-32"
            />

            <div className="flex items-center gap-2 p-1">
              <button
                type="button"
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
                title="Attach Document"
              >
                <Paperclip size={18} />
              </button>
              <button
                type="button"
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
                title="Voice Input"
              >
                <Mic size={18} />
              </button>
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white rounded-xl transition flex items-center justify-center"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 px-2 mt-2">
            <span>Press <kbd className="px-1 bg-slate-800 border border-slate-700 rounded text-[10px]">Enter</kbd> to send, <kbd className="px-1 bg-slate-800 border border-slate-700 rounded text-[10px]">Shift + Enter</kbd> for line break</span>
          </div>
        </form>
      </div>
    </div>
  );
};