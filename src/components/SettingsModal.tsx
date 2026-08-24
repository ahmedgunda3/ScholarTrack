import React, { useState, useEffect } from 'react';
import { X, Key, User, Sliders, Check, Eye, EyeOff, Shield } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [userName, setUserName] = useState('Student User');
  const [studyLevel, setStudyLevel] = useState('Undergraduate');
  const [aiTone, setAiTone] = useState('Concise Tutor');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key') || '';
    const savedName = localStorage.getItem('scholartrack_user_name') || 'Student User';
    const savedLevel = localStorage.getItem('scholartrack_study_level') || 'Undergraduate';
    const savedTone = localStorage.getItem('scholartrack_ai_tone') || 'Concise Tutor';

    setApiKey(savedKey);
    setUserName(savedName);
    setStudyLevel(savedLevel);
    setAiTone(savedTone);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    localStorage.setItem('gemini_api_key', apiKey.trim());
    localStorage.setItem('scholartrack_user_name', userName.trim());
    localStorage.setItem('scholartrack_study_level', studyLevel);
    localStorage.setItem('scholartrack_ai_tone', aiTone);

    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
      window.location.reload();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2">
            <Sliders className="text-indigo-400" size={20} />
            <h3 className="text-lg font-bold text-slate-100">ScholarTrack Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto text-slate-200">
          {/* Profile Section */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
              <User size={14} /> Profile Information
            </label>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Display Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Education Level</label>
              <select
                value={studyLevel}
                onChange={(e) => setStudyLevel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="High School">High School</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Postgraduate">Postgraduate</option>
                <option value="Self Learner">Self Learner</option>
              </select>
            </div>
          </div>

          {/* Manual API Key Input */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <label className="text-xs font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
              <Key size={14} /> Local API Key Override
            </label>
            <p className="text-xs text-slate-400">
              Paste any working Gemini key directly to save it in local storage without rebuilding Vercel environment variables.
            </p>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                placeholder="AQ... or AIzaSy..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
              >
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* AI Persona */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <label className="text-xs font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
              <Shield size={14} /> AI Study Persona
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['Concise Tutor', 'In-Depth Explainer', 'Socratic Prompting', 'Exam Prep Mode'].map((tone) => (
                <button
                  key={tone}
                  type="button"
                  onClick={() => setAiTone(tone)}
                  className={`p-3 rounded-xl border text-xs text-left transition ${
                    aiTone === tone
                      ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300 font-semibold'
                      : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {tone}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-800 bg-slate-950/50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition"
          >
            {saved ? <Check size={14} /> : null}
            {saved ? 'Saved!' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  );
};
