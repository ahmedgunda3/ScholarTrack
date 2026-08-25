import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const AIExamHub = () => {
  const [activeModal, setActiveModal] = useState<'exam' | 'flashcard' | null>(null);
  const [topic, setTopic] = useState('');
  const [generatedResult, setGeneratedResult] = useState<string | null>(null);

  const handleGenerate = () => {
    if (!topic.trim()) return;
    setGeneratedResult(`Generated ${activeModal === 'exam' ? 'Mock Exam' : 'Flashcards'} for: "${topic}"!`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-black text-white">AI Studio & Exam Hub</h1>
        <p className="text-xs text-slate-400 mt-1">Generate custom mock exams, study guides, and spaced-repetition flashcards instantly.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div whileHover={{ y: -6, scale: 1.01 }} className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-xl">📝</div>
          <h2 className="text-lg font-bold text-white">Generate Mock Exam</h2>
          <p className="text-xs text-slate-400">Create personalized practice test papers based on your syllabus.</p>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }} onClick={() => { setGeneratedResult(null); setActiveModal('exam'); }} className="w-full py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs rounded-2xl cursor-pointer">
            Start Exam Builder
          </motion.button>
        </motion.div>

        <motion.div whileHover={{ y: -6, scale: 1.01 }} className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-xl">🎴</div>
          <h2 className="text-lg font-bold text-white">Flashcard Generator</h2>
          <p className="text-xs text-slate-400">Convert notes into spaced-repetition flashcard decks.</p>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }} onClick={() => { setGeneratedResult(null); setActiveModal('flashcard'); }} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-2xl cursor-pointer">
            Create Flashcards
          </motion.button>
        </motion.div>
      </div>

      <AnimatePresence>
        {activeModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} className="bg-slate-900 border border-violet-500/30 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
              <h2 className="text-lg font-black text-white">{activeModal === 'exam' ? 'Exam Builder' : 'Flashcard Creator'}</h2>
              <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Topic (e.g. Organic Chemistry, Calculus Integrals)..." className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-violet-500" />
              {generatedResult && <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl text-xs text-emerald-200 font-bold">{generatedResult}</div>}
              <div className="flex justify-end gap-3">
                <button onClick={() => setActiveModal(null)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold cursor-pointer">Close</button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleGenerate} className="px-5 py-2 bg-violet-600 text-white rounded-xl text-xs font-bold cursor-pointer">Generate</motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
