import React, { useState } from 'react';

interface Note {
  id: string;
  title: string;
  content: string;
}

interface Source {
  id: string;
  name: string;
  type: string;
}

interface Subject {
  id: string;
  name: string;
  code: string;
  color: string;
  notes: Note[];
  sources: Source[];
}

interface AIStudioExamHubProps {
  addXp?: (amount: number) => void;
}

export const AIStudioExamHub: React.FC<AIStudioExamHubProps> = ({ addXp }) => {
  const [activeTab, setActiveTab] = useState<'subject' | 'avatar' | 'audio' | 'flashcards' | 'exam'>('subject');
  const [subjects, setSubjects] = useState<Subject[]>([
    {
      id: '1',
      name: 'Advanced Calculus',
      code: 'MATH-301',
      color: 'border-violet-500 bg-violet-950/40 text-violet-300',
      notes: [
        { id: 'n1', title: 'Integration by Parts', content: 'Formula: ∫ u dv = uv - ∫ v du. Choose u using LIATE rule.' }
      ],
      sources: [
        { id: 's1', name: 'Calculus_Integration_Guide.pdf', type: 'PDF' }
      ]
    },
    {
      id: '2',
      name: 'Organic Chemistry',
      code: 'CHEM-202',
      color: 'border-emerald-500 bg-emerald-950/40 text-emerald-300',
      notes: [
        { id: 'n2', title: 'Nucleophilic Substitution', content: 'SN1 reaction is two-step involving carbocation intermediate.' }
      ],
      sources: [
        { id: 's2', name: 'Reaction_Mechanisms.png', type: 'Image' }
      ]
    }
  ]);

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('1');
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectCode, setNewSubjectCode] = useState('');

  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [sourceName, setSourceName] = useState('');

  const [flippedCard, setFlippedCard] = useState<number | null>(null);
  const [masteredCards, setMasteredCards] = useState<number[]>([]);

  const defaultSubject: Subject = {
    id: 'default',
    name: 'General Studies',
    code: 'GEN-101',
    color: 'border-violet-500 bg-violet-950/40 text-violet-300',
    notes: [],
    sources: []
  };

  const selectedSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0] || defaultSubject;

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;
    const colors = [
      'border-violet-500 bg-violet-950/40 text-violet-300',
      'border-cyan-500 bg-cyan-950/40 text-cyan-300',
      'border-emerald-500 bg-emerald-950/40 text-emerald-300',
      'border-amber-500 bg-amber-950/40 text-amber-300',
    ];
    const newSub: Subject = {
      id: Date.now().toString(),
      name: newSubjectName,
      code: newSubjectCode || 'GEN-101',
      color: colors[Math.floor(Math.random() * colors.length)],
      notes: [],
      sources: [],
    };
    setSubjects([...subjects, newSub]);
    setSelectedSubjectId(newSub.id);
    setNewSubjectName('');
    setNewSubjectCode('');
  };

  const handleDeleteSubject = (id: string) => {
    const filtered = subjects.filter((s) => s.id !== id);
    setSubjects(filtered);
    if (selectedSubjectId === id && filtered.length > 0) {
      setSelectedSubjectId(filtered[0].id);
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim()) return;
    const newNote: Note = {
      id: Date.now().toString(),
      title: noteTitle,
      content: noteContent || 'No details provided.',
    };
    setSubjects(
      subjects.map((s) =>
        s.id === selectedSubject.id ? { ...s, notes: [...s.notes, newNote] } : s
      )
    );
    setNoteTitle('');
    setNoteContent('');
  };

  const handleDeleteNote = (noteId: string) => {
    setSubjects(
      subjects.map((s) =>
        s.id === selectedSubject.id
          ? { ...s, notes: s.notes.filter((n) => n.id !== noteId) }
          : s
      )
    );
  };

  const handleAddSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceName.trim()) return;
    const newSrc: Source = {
      id: Date.now().toString(),
      name: sourceName,
      type: 'Doc / Link',
    };
    setSubjects(
      subjects.map((s) =>
        s.id === selectedSubject.id ? { ...s, sources: [...s.sources, newSrc] } : s
      )
    );
    setSourceName('');
  };

  const handleMasterCard = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!masteredCards.includes(idx)) {
      setMasteredCards([...masteredCards, idx]);
      if (addXp) addXp(350);
    }
  };

  const tabs = [
    { id: 'subject', label: 'Subject Hub', icon: '📚' },
    { id: 'avatar', label: 'AI Tutor Avatar', icon: '👤' },
    { id: 'audio', label: 'Audio Studio', icon: '🎙️' },
    { id: 'flashcards', label: 'Flashcards', icon: '🎴' },
    { id: 'exam', label: 'Exam Builder', icon: '📝' },
  ];

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 transition-all duration-300 transform hover:-translate-y-1 hover:border-violet-500/30 hover:shadow-xl">
        <h1 className="text-2xl font-black text-white">ScholarTrack AI Studio & Exam Hub</h1>
        <p className="text-xs text-slate-400 mt-1">Manage course subjects, notes, and sources, then generate video lessons, podcasts, flashcards, and mock exams.</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-3 border-b border-slate-800 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-xl active:translate-y-0 active:scale-95 cursor-pointer flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/25'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: SUBJECT KNOWLEDGE HUB */}
      {activeTab === 'subject' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <h3 className="text-sm font-bold text-white mb-3">➕ Add New Course Subject</h3>
            <form onSubmit={handleAddSubject} className="flex flex-wrap gap-3 items-center">
              <input
                type="text"
                placeholder="Subject Name (e.g. Physics Mechanics)..."
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                className="flex-1 min-w-[200px] bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-violet-500"
              />
              <input
                type="text"
                placeholder="Code (e.g. PHYS-101)..."
                value={newSubjectCode}
                onChange={(e) => setNewSubjectCode(e.target.value)}
                className="w-36 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-violet-500"
              />
              <button
                type="submit"
                className="bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs px-6 py-3 rounded-2xl transition-all duration-200 transform hover:-translate-y-1 active:scale-95 cursor-pointer"
              >
                + Create Subject
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {subjects.map((sub) => (
              <div
                key={sub.id}
                onClick={() => setSelectedSubjectId(sub.id)}
                className={`p-5 rounded-2xl border transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl cursor-pointer relative group ${
                  selectedSubject?.id === sub.id
                    ? `${sub.color} shadow-xl scale-[1.02]`
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-slate-950 border border-slate-800">
                    {sub.code}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSubject(sub.id);
                    }}
                    className="text-slate-500 hover:text-rose-400 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity p-1"
                  >
                    🗑️
                  </button>
                </div>
                <h4 className="text-sm font-black text-white">{sub.name}</h4>
                <p className="text-[10px] text-slate-400 mt-1">{sub.notes.length} Notes • {sub.sources.length} Sources</p>
              </div>
            ))}
          </div>

          {/* Selected Subject Details */}
          {selectedSubject && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white">📝 Notes for {selectedSubject.name}</h3>

                <form onSubmit={handleAddNote} className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <input
                    type="text"
                    placeholder="Note Title..."
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                  <textarea
                    rows={2}
                    placeholder="Note Content..."
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-violet-500 resize-none"
                  />
                  <button
                    type="submit"
                    className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs py-2.5 rounded-xl transition-all duration-200 active:scale-95 cursor-pointer"
                  >
                    + Add Note
                  </button>
                </form>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {selectedSubject.notes.map((note) => (
                    <div key={note.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-bold text-white">{note.title}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">{note.content}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="text-slate-500 hover:text-rose-400 text-xs ml-2"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white">📎 Sources & References</h3>
                <form onSubmit={handleAddSource} className="flex gap-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <input
                    type="text"
                    placeholder="Source File or URL..."
                    value={sourceName}
                    onChange={(e) => setSourceName(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                  <button
                    type="submit"
                    className="bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all duration-200 active:scale-95 cursor-pointer"
                  >
                    + Add
                  </button>
                </form>

                <div className="space-y-2">
                  {selectedSubject.sources.map((src) => (
                    <div key={src.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                      <span className="text-xs font-bold text-white">📄 {src.name}</span>
                      <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">Linked</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: AI AVATAR */}
      {activeTab === 'avatar' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <h3 className="text-base font-black text-white">👤 AI Tutor Avatar Generator</h3>
          <p className="text-xs text-slate-400">Selected Subject: <strong className="text-violet-400">{selectedSubject?.name}</strong></p>
          <button className="bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs px-6 py-3.5 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 active:scale-95 cursor-pointer">
            🎬 Render AI Video Lesson
          </button>
        </div>
      )}

      {/* TAB 3: AUDIO STUDIO */}
      {activeTab === 'audio' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <h3 className="text-base font-black text-white">🎙️ Audio Studio & Podcast Synthesizer</h3>
          <button className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs px-6 py-3.5 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 active:scale-95 cursor-pointer">
            🎧 Synthesize Study Podcast
          </button>
        </div>
      )}

      {/* TAB 4: FLASHCARDS (+350 XP) */}
      {activeTab === 'flashcards' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-black text-white">🎴 Flashcard Review</h3>
              <p className="text-xs text-slate-400">Click card to reveal definition. Mark mastered to earn <strong className="text-amber-400">+350 XP</strong>!</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {selectedSubject?.notes.map((note, idx) => {
              const isMastered = masteredCards.includes(idx);
              return (
                <div
                  key={idx}
                  onClick={() => setFlippedCard(flippedCard === idx ? null : idx)}
                  className={`p-6 border rounded-2xl min-h-[160px] flex flex-col justify-between text-center transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl cursor-pointer relative ${
                    flippedCard === idx
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                      : 'bg-slate-950 border-slate-800 text-white hover:border-violet-500/50'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    {flippedCard === idx ? 'Solution / Answer' : note.title}
                  </span>
                  <p className="text-xs font-bold leading-relaxed my-2">
                    {flippedCard === idx ? note.content : 'Click to flip card'}
                  </p>
                  <button
                    onClick={(e) => handleMasterCard(idx, e)}
                    disabled={isMastered}
                    className={`text-[10px] font-bold py-1.5 px-3 rounded-xl transition-all ${
                      isMastered
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500 hover:text-black'
                    }`}
                  >
                    {isMastered ? '✓ Mastered (+350 XP Earned)' : 'Mark Mastered (+350 XP)'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: EXAM BUILDER */}
      {activeTab === 'exam' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <h3 className="text-base font-black text-white">📝 AI Custom Exam Builder</h3>
          <button className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-6 py-3.5 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 active:scale-95 cursor-pointer">
            ⚡ Generate Custom Mock Exam
          </button>
        </div>
      )}
    </div>
  );
};

export const AIStudioView = AIStudioExamHub;
