import React, { useState } from 'react';
import { QuestionType } from '../types/scholar';

export const StudyExamHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'video' | 'audio' | 'flashcards' | 'exam'>('exam');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const [selectedTypes, setSelectedTypes] = useState<QuestionType[]>([
    'multiple_choice',
    'true_false',
  ]);

  const questionTypeOptions: { id: QuestionType; label: string; desc: string }[] = [
    { id: 'multiple_choice', label: 'Multiple Choice', desc: 'Standard 4-option questions' },
    { id: 'matchmaking', label: 'Matchmaking', desc: 'Pair definitions with terms' },
    { id: 'true_false', label: 'True / False', desc: 'Quick concept verification' },
    { id: 'word_in_box', label: 'Word in Box (Fill Blank)', desc: 'Drag words to complete key sentences' },
    { id: 'diagram_labeling', label: 'Diagram Labeling', desc: 'Label visual diagrams and charts' },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const toggleQuestionType = (type: QuestionType) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  return (
    <div className="p-6 space-y-6 text-slate-100">
      <div>
        <h1 className="text-2xl font-black">ScholarTrack AI Studio</h1>
        <p className="text-xs text-slate-400">Generate custom exam flows, flashcards, audio, and avatar video lessons</p>
      </div>

      <div className="flex gap-2 border-b border-slate-800 pb-2">
        {[
          { id: 'video', label: '📹 AI Avatar Video' },
          { id: 'audio', label: '🎙️ Audio Studio' },
          { id: 'flashcards', label: '🎴 Flashcards' },
          { id: 'exam', label: '📝 Exam Builder' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === tab.id
                ? 'bg-violet-600 text-white'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-slate-900 border border-dashed border-slate-700 hover:border-violet-500 rounded-2xl p-6 text-center transition">
        <input type="file" id="hub-file-upload" onChange={handleFileUpload} className="hidden" />
        <label htmlFor="hub-file-upload" className="cursor-pointer space-y-2 block">
          <div className="text-3xl">📄</div>
          <span className="text-sm font-bold block text-violet-400">
            {uploadedFile ? `Loaded: ${uploadedFile.name}` : 'Upload Document, PDF, or Notes File'}
          </span>
          <span className="text-xs text-slate-500 block">Click or drag & drop source files to generate content</span>
        </label>
      </div>

      {activeTab === 'exam' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div>
            <h3 className="font-bold text-base">Custom Exam Question Flow</h3>
            <p className="text-xs text-slate-400">Choose default or custom question formats for your test setup</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {questionTypeOptions.map((opt) => {
              const isChecked = selectedTypes.includes(opt.id);
              return (
                <div
                  key={opt.id}
                  onClick={() => toggleQuestionType(opt.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition ${
                    isChecked ? 'border-violet-500 bg-violet-950/40 ring-1 ring-violet-500' : 'border-slate-800 bg-slate-950 opacity-70'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-xs">{opt.label}</span>
                    <input type="checkbox" checked={isChecked} readOnly className="accent-violet-600" />
                  </div>
                  <p className="text-[11px] text-slate-400">{opt.desc}</p>
                </div>
              );
            })}
          </div>

          <button className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 font-bold py-3.5 rounded-xl text-sm transition shadow-lg">
            🚀 Generate Custom Exam Flow ({selectedTypes.length} Format Types Selected)
          </button>
        </div>
      )}
    </div>
  );
};
