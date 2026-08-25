import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Source {
  id: number;
  name: string;
  type: string;
}

interface Space {
  id: number;
  title: string;
  category: string;
  sources: Source[];
  flashcards: number;
  exams: number;
}

export const StudySpaces = () => {
  const [spaces, setSpaces] = useState<Space[]>([
    {
      id: 1,
      title: 'Calculus Conquerors',
      category: 'Math',
      sources: [
        { id: 101, name: 'Calculus_Integration_Guide.pdf', type: 'PDF' },
        { id: 102, name: 'Derivatives_CheatSheet.pdf', type: 'PDF' }
      ],
      flashcards: 14,
      exams: 2
    },
    {
      id: 2,
      title: 'Organic Chem Guild',
      category: 'Chemistry',
      sources: [{ id: 201, name: 'Reaction_Mechanisms.pdf', type: 'PDF' }],
      flashcards: 25,
      exams: 3
    }
  ]);

  const [activeSpaceId, setActiveSpaceId] = useState<number | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Math');

  const [newSourceName, setNewSourceName] = useState('');
  const [activeToolModal, setActiveToolModal] = useState<'audio' | 'flashcard' | 'exam' | null>(null);
  const [selectedSource, setSelectedSource] = useState<Source | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [generatedFlashcards, setGeneratedFlashcards] = useState<string[]>([]);
  const [generatedExam, setGeneratedExam] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeSpace = spaces.find((s) => s.id === activeSpaceId);

  const handleCreateSpace = () => {
    if (!newTitle.trim()) return;
    const newSpace: Space = {
      id: Date.now(),
      title: newTitle,
      category: newCategory,
      sources: [],
      flashcards: 0,
      exams: 0
    };
    setSpaces((prev) => [...prev, newSpace]);
    setNewTitle('');
    setIsCreateModalOpen(false);
  };

  const handleDeleteSpace = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSpaces((prev) => prev.filter((s) => s.id !== id));
    if (activeSpaceId === id) setActiveSpaceId(null);
  };

  const handleAddSourceText = () => {
    if (!activeSpaceId) return;
    const rawName = newSourceName.trim() || 'New_Study_Notes.pdf';
    const name = rawName.endsWith('.pdf') ? rawName : `${rawName}.pdf`;

    setSpaces((prev) =>
      prev.map((s) => {
        if (s.id === activeSpaceId) {
          return {
            ...s,
            sources: [...s.sources, { id: Date.now(), name, type: 'PDF' }]
          };
        }
        return s;
      })
    );
    setNewSourceName('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !activeSpaceId) return;

    const newSources: Source[] = Array.from(files).map((file, idx) => ({
      id: Date.now() + idx,
      name: file.name,
      type: file.name.split('.').pop()?.toUpperCase() || 'FILE'
    }));

    setSpaces((prev) =>
      prev.map((s) => {
        if (s.id === activeSpaceId) {
          return { ...s, sources: [...s.sources, ...newSources] };
        }
        return s;
      })
    );

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleConvertAudio = (source: Source) => {
    setSelectedSource(source);
    setIsPlayingAudio(true);
    setActiveToolModal('audio');
  };

  const handleConvertFlashcards = (source: Source) => {
    setSelectedSource(source);
    setGeneratedFlashcards([
      `Definition of key concept in ${source.name}`,
      `Core formula extracted from ${source.name}`,
      `Practice question on Chapter 1 of ${source.name}`
    ]);
    setActiveToolModal('flashcard');
    setSpaces((prev) =>
      prev.map((s) => (s.id === activeSpaceId ? { ...s, flashcards: s.flashcards + 3 } : s))
    );
  };

  const handleConvertExam = (source: Source) => {
    setSelectedSource(source);
    setGeneratedExam([
      `Question 1: Explain the primary thesis of ${source.name}.`,
      `Question 2: Solve the key problem presented on page 12 of ${source.name}.`,
      `Question 3: Discuss the real-world application of ${source.name}.`
    ]);
    setActiveToolModal('exam');
    setSpaces((prev) =>
      prev.map((s) => (s.id === activeSpaceId ? { ...s, exams: s.exams + 1 } : s))
    );
  };

  if (activeSpace) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveSpaceId(null)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold cursor-pointer transition-all"
            >
              &larr; Back to Spaces
            </button>
            <div>
              <h1 className="text-2xl font-black text-white">{activeSpace.title}</h1>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-lg border border-purple-500/30 bg-purple-950/40 text-purple-300 inline-block mt-1">
                {activeSpace.category} Workspace
              </span>
            </div>
          </div>
          <button
            onClick={(e) => handleDeleteSpace(activeSpace.id, e)}
            className="px-3.5 py-2 bg-rose-950/60 hover:bg-rose-900 border border-rose-500/30 text-rose-300 rounded-xl text-xs font-bold cursor-pointer transition-all"
          >
            Delete Space
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center">
            <span className="text-xl font-black text-purple-400">{activeSpace.sources.length}</span>
            <p className="text-[11px] text-slate-400 font-medium">Textbooks / PDFs</p>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center">
            <span className="text-xl font-black text-indigo-400">{activeSpace.flashcards}</span>
            <p className="text-[11px] text-slate-400 font-medium">Generated Cards</p>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center">
            <span className="text-xl font-black text-emerald-400">{activeSpace.exams}</span>
            <p className="text-[11px] text-slate-400 font-medium">Practice Exams</p>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-3">
          <h2 className="text-sm font-bold text-white">Add PDF / Textbook Source</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.txt"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-purple-950/60 hover:bg-purple-900 text-purple-200 font-bold text-xs rounded-2xl border border-purple-500/30 cursor-pointer flex items-center justify-center gap-2"
            >
              📂 Select File from PC
            </button>
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={newSourceName}
                onChange={(e) => setNewSourceName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSourceText()}
                placeholder="Type name (e.g. Physics_Ch4.pdf)..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
              />
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleAddSourceText}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-2xl cursor-pointer shrink-0"
              >
                + Add Source
              </motion.button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-black text-white">Your Sources & AI Tools</h2>
          {activeSpace.sources.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/40 border border-slate-800/80 rounded-3xl text-slate-500 text-xs font-semibold">
              No sources added to this space yet. Select a file or type a name above!
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {activeSpace.sources.map((src) => (
                <motion.div
                  key={src.id}
                  whileHover={{ y: -2 }}
                  className="bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 rounded-3xl p-5 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-xl shrink-0">
                      📄
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{src.name}</h3>
                      <p className="text-[10px] text-slate-400 font-medium">Ready for AI Conversion ({src.type})</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleConvertAudio(src)}
                      className="px-3.5 py-2 bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5"
                    >
                      <span>🎧</span> Convert to Audio
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleConvertFlashcards(src)}
                      className="px-3.5 py-2 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5"
                    >
                      <span>🎴</span> Convert to Flashcards
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleConvertExam(src)}
                      className="px-3.5 py-2 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5"
                    >
                      <span>📝</span> Generate Exam
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <AnimatePresence>
          {activeToolModal && selectedSource && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="bg-slate-900 border border-purple-500/30 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl"
              >
                {activeToolModal === 'audio' && (
                  <div className="space-y-4 text-center">
                    <span className="text-4xl">🎧</span>
                    <h2 className="text-xl font-black text-white">Audio Podcast Converter</h2>
                    <p className="text-xs text-slate-300">
                      Converted <span className="text-purple-400 font-bold">{selectedSource.name}</span> into synthesized audio study notes.
                    </p>
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
                      <button
                        onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold cursor-pointer"
                      >
                        {isPlayingAudio ? '⏸️ Pause Audio' : '▶️ Play Audio'}
                      </button>
                      <span className="text-xs text-purple-300 font-mono animate-pulse">
                        {isPlayingAudio ? 'Playing AI Voice...' : 'Paused'}
                      </span>
                    </div>
                  </div>
                )}

                {activeToolModal === 'flashcard' && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-black text-white">Generated Flashcards</h2>
                    <p className="text-xs text-slate-400">
                      Created from <span className="text-indigo-400 font-bold">{selectedSource.name}</span>:
                    </p>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {generatedFlashcards.map((fc, idx) => (
                        <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200">
                          <span className="font-bold text-indigo-400">Card {idx + 1}:</span> {fc}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeToolModal === 'exam' && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-black text-white">Generated Practice Exam</h2>
                    <p className="text-xs text-slate-400">
                      Extracted key questions from <span className="text-emerald-400 font-bold">{selectedSource.name}</span>:
                    </p>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {generatedExam.map((eq, idx) => (
                        <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200">
                          {eq}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => {
                      setActiveToolModal(null);
                      setIsPlayingAudio(false);
                    }}
                    className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Interactive Study Spaces</h1>
          <p className="text-sm text-slate-400 mt-1">
            Create custom study environments, store textbook PDFs, and convert them to audio, flashcards, or exams.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.06, y: -2 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 450, damping: 15 }}
          onClick={() => setIsCreateModalOpen(true)}
          className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-2xl shadow-lg shadow-purple-600/30 cursor-pointer flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <span>+</span> Create New Space
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {spaces.map((space) => (
          <motion.div
            key={space.id}
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 350, damping: 20 }}
            className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-md flex flex-col justify-between hover:border-purple-500/50 shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold px-3 py-1 rounded-xl border border-purple-500/30 bg-purple-950/40 text-purple-300">
                  {space.category}
                </span>
                <button
                  onClick={(e) => handleDeleteSpace(space.id, e)}
                  className="text-xs font-semibold text-rose-400 hover:text-rose-300 px-2 py-1 bg-rose-950/40 border border-rose-500/20 rounded-lg cursor-pointer transition-all"
                >
                  Delete
                </button>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{space.title}</h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                Contains {space.sources.length} sources/textbooks, {space.flashcards} flashcards, and {space.exams} exams.
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveSpaceId(space.id)}
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-2xl border border-purple-500/40 shadow-lg shadow-purple-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              Enter Workspace &rarr;
            </motion.button>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isCreateModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 30 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              className="bg-slate-900 border border-purple-500/30 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl"
            >
              <h2 className="text-lg font-black text-white">Create New Study Space</h2>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateSpace()}
                placeholder="Space Title (e.g. Physics Quantum Mechanics)..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-purple-500"
              />
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-slate-300 focus:outline-none focus:border-purple-500"
              >
                <option value="Math">Math</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Physics">Physics</option>
                <option value="Computer Science">Computer Science</option>
                <option value="General">General</option>
              </select>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCreateSpace}
                  className="px-5 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Create Space
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
