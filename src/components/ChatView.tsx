import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Send, Paperclip, Mic, Bot, User } from 'lucide-react';
import type { ChatMessage } from '../types';

export const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Welcome to ScholarTrack AI! How can I assist with your study goals today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userText = input.trim();
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const apiKey = localStorage.getItem('gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Missing Gemini API key. Please verify your VITE_GEMINI_API_KEY environment variable in Vercel.',
        },
      ]);
      setLoading(false);
      return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const candidateModels = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-pro'];

    let responseText = '';
    let success = false;
    let lastError = '';

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(userText);
        const res = await result.response;
        responseText = res.text();
        success = true;
        break;
      } catch (err: any) {
        console.warn(`Model ${modelName} failed:`, err);
        lastError = err?.message || String(err);
      }
    }

    if (success && responseText) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: responseText,
        },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Error connecting to Gemini API: ${lastError}`,
        },
      ]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] bg-slate-950 text-slate-100">
      <div className="border-b border-slate-800 p-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Bot className="text-indigo-400" size={20} /> ScholarTrack AI Assistant
          </h2>
          <p className="text-xs text-slate-400">Ask questions, get summaries, or practice topics</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div
              className={`p-2 rounded-xl text-white ${
                msg.role === 'user' ? 'bg-indigo-600' : 'bg-slate-800 border border-slate-700'
              }`}
            >
              {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
            </div>
            <div
              className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-indigo-400">
            <Bot size={16} className="animate-spin" />
            <span>ScholarTrack is thinking...</span>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-800">
        <div className="relative bg-slate-900/80 border border-slate-800 rounded-2xl p-2 flex items-center gap-2 focus-within:border-indigo-500 transition">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything or paste your study material..."
            rows={1}
            className="w-full bg-transparent resize-none text-sm text-slate-100 placeholder-slate-500 focus:outline-none px-2"
          />
          <button className="text-slate-400 hover:text-slate-200 transition p-1">
            <Paperclip size={18} />
          </button>
          <button className="text-slate-400 hover:text-slate-200 transition p-1">
            <Mic size={18} />
          </button>
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-xl transition disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-[10px] text-slate-500 mt-2 text-center">
          Press <kbd className="bg-slate-800 px-1 rounded">Enter</kbd> to send, <kbd className="bg-slate-800 px-1 rounded">Shift + Enter</kbd> for line break
        </p>
      </div>
    </div>
  );
};
