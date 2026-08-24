import React from 'react';
import { Sparkles, X } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full relative text-slate-100 shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X size={18} />
        </button>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Sparkles size={24} />
          </div>
          <h3 className="text-xl font-bold">Welcome to ScholarTrack</h3>
        </div>
        <p className="text-sm text-slate-300 mb-6 leading-relaxed">
          Your personal AI study companion. Organize study spaces, generate practice material, and chat with AI models.
        </p>
        <button
          onClick={onClose}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};