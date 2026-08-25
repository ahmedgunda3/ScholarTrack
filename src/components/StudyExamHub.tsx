import React, { useState } from 'react';
import type { QuestionType, Flashcard } from '../types/scholar';

export const StudyExamHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'avatar' | 'audio' | 'flashcards' | 'exam'>('avatar');

  // Flashcards state
  const [flashcards, setFlashcards] = useState<Flashcard[]>([
    { id: '1', question: 'What is the Derivative of sin(x)?', answer: 'cos(x)', category: 'Calculus' },
    { id: '2', question: 'What is the powerhouse of the cell?', answer: 'Mitochondria', category: 'Biology' },
    { id: '3', question: 'State Newton\'s Second Law of Motion.', answer: 'F = m * a', category: 'Physics' },
  ]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  // AI Avatar / AI Tutor state & uploaded file
  const [script, setScript] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoGenerated, setVideoGenerated] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);

  // Audio Studio state & uploaded file
  const [audioTopic, setAudioTopic] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Exam Builder state & uploaded file
  const [examFile, setExamFile] = useState<File | null>(null);
  const [examGenerated, setExamGenerated] = useState(false);
  const [isGeneratingExam, setIsGeneratingExam] = useState(false);

  // Handlers for file uploads
  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleAudioFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFile(e.target.files[0]);
      if (!audioTopic) {
        setAudioTopic(e.target.files[0].name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleExamFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setExamFile(e.target.files[0]);
    }
  };

  const handleGenerateVideo = () => {
    setIsGeneratingVideo(true);
    setTimeout(() => {
      setIsGeneratingVideo(false);
      setVideoGenerated(true);
      setGeneratedVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
    }, 2500);
  };

  const handleAddFlashcard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    const card: Flashcard = {
      id: Date.now().toString(),
      question: newQuestion,
      answer: newAnswer,
      category: 'General',
    };
    setFlashcards([...flashcards, card]);
    setNewQuestion('');
    setNewAnswer('');
  };

  const questionTypeOptions: { id: QuestionType; label: string; desc: string }[] = [
    { id: 'multiple_choice', label: 'Multiple Choice', desc: 'Standard 4-option questions' },
    { id: 'true_false', label: 'True / False', desc: 'Quick concept verification' },
    { id: 'word_in_box', label: 'Word in Box (Fill Blank)', desc: 'Drag words to complete key sentences' },
    { id: 'diagram_labeling', label: 'Diagram Labeling', desc: 'Label visual diagrams and charts' },
  ];

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header & Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div>
          <h1 className="text-2xl font-black text-white">ScholarTrack AI Studio & Exam Hub</h1>
          <p className="text-xs text-slate-400">
            Upload study documents to generate avatar video explainers, study podcasts, flashcards, or custom practice exams.
          </p>
        </div>

        <div className="flex gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('avatar')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'avatar' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            🤖 AI Tutor Avatar
          </button>
          <button
            onClick={() => setActiveTab('audio')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'audio' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            🎙️ Audio Studio
          </button>
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'flashcards' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            🎴 Flashcards
          </button>
          <button
            onClick={() => setActiveTab('exam')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'exam' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            📝 Exam Builder
          </button>
        </div>
      </div>

      {/* 1. AI TUTOR / AVATAR VIDEO TAB */}
      {activeTab === 'avatar' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">🤖 AI Tutor & Avatar Video Generator</h3>
              <p className="text-xs text-slate-400">
                Upload lecture slides, notes, or PDFs, or enter a custom prompt script to render an AI video lesson.
              </p>
            </div>
          </div>

          {/* Document Upload Area */}
          <div className="bg-slate-950 border border-dashed border-slate-800 hover:border-violet-500/50 rounded-2xl p-4 transition text-center space-y-2">
            <label className="cursor-pointer flex flex-col items-center gap-1">
              <span className="text-2xl">📁</span>
              <span className="text-xs font-bold text-white">
                {avatarFile ? avatarFile.name : 'Click to attach study materials (PDF, DOCX, TXT, PNG)'}
              </span>
              <span className="text-[10px] text-slate-500">
                {avatarFile ? `${(avatarFile.size / (1024 * 1024)).toFixed(2)} MB • File Attached` : 'Upload file context for the AI Tutor'}
              </span>
              <input type="file" accept=".pdf,.doc,.docx,.txt,.png,.jpg" onChange={handleAvatarFileUpload} className="hidden" />
            </label>
            {avatarFile && (
              <button
                onClick={() => setAvatarFile(null)}
                className="text-[10px] text-rose-400 hover:underline font-bold"
              >
                Remove attached file
              </button>
            )}
          </div>

          <textarea
            value={script}
            onChange={(e) => setScript(e.target.value)}
            placeholder="Optionally write instructions or script for your AI Tutor (e.g. 'Explain integration by parts using uploaded notes')..."
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-violet-500 h-28"
          />

          <button
            onClick={handleGenerateVideo}
            disabled={isGeneratingVideo || (!script.trim() && !avatarFile)}
            className="bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold px-6 py-3 rounded-xl transition transform active:scale-95 disabled:opacity-50"
          >
            {isGeneratingVideo ? '⚡ AI Tutor Processing File & Script...' : '✨ Render AI Tutor Video'}
          </button>

          {videoGenerated && generatedVideoUrl && (
            <div className="mt-4 bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4 animate-fadeIn">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-slate-800 pb-3">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Rendered AI Tutor Video Lesson
                  </h4>
                  {avatarFile && (
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Based on material: <span className="text-violet-400 font-medium">{avatarFile.name}</span>
                    </p>
                  )}
                </div>

                <a
                  href={generatedVideoUrl}
                  download="AI_Tutor_Lesson.mp4"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-2 active:scale-95 shadow-md"
                >
                  <span>📥</span>
                  <span>Download Video (.MP4)</span>
                </a>
              </div>

              <div className="w-full max-w-2xl mx-auto aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-violet-500/30 relative">
                <video
                  src={generatedVideoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. AUDIO STUDIO TAB */}
      {activeTab === 'audio' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">🎙️ Audio Studio & Podcast Synthesizer</h3>
            <p className="text-xs text-slate-400">
              Upload your revision notes or specify a topic to turn textbook chapters into an audio podcast.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 border border-dashed border-slate-800 hover:border-violet-500/50 rounded-2xl p-4 text-center">
              <label className="cursor-pointer flex flex-col items-center gap-1">
                <span className="text-2xl">📄</span>
                <span className="text-xs font-bold text-white">
                  {audioFile ? audioFile.name : 'Attach Notes Document'}
                </span>
                <span className="text-[10px] text-slate-500">PDF, TXT, or Word files</span>
                <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleAudioFileUpload} className="hidden" />
              </label>
              {audioFile && (
                <button onClick={() => setAudioFile(null)} className="text-[10px] text-rose-400 font-bold mt-1">
                  Remove File
                </button>
              )}
            </div>

            <div className="flex flex-col justify-center space-y-2">
              <label className="text-xs text-slate-400 font-bold">Or enter a study topic:</label>
              <input
                type="text"
                value={audioTopic}
                onChange={(e) => setAudioTopic(e.target.value)}
                placeholder="e.g. Photosynthesis & Cellular Respiration"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <button
            onClick={() => setIsPlayingAudio(!isPlayingAudio)}
            disabled={!audioTopic && !audioFile}
            className="bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold px-6 py-3 rounded-xl transition disabled:opacity-50"
          >
            {isPlayingAudio ? '⏸ Pause Podcast Stream' : '🎙️ Synthesize & Play Podcast'}
          </button>

          {isPlayingAudio && (
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between animate-fadeIn">
              <div className="flex items-center gap-3">
                <span className="text-2xl animate-pulse">📻</span>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    {audioFile ? audioFile.name : audioTopic || 'AI Revision Audio Track'}
                  </h4>
                  <p className="text-[10px] text-slate-400">Synthesizing audio explanation from source material</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="w-1 bg-violet-500 h-6 animate-pulse rounded-full" />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. FLASHCARDS TAB */}
      {activeTab === 'flashcards' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-black text-white">🎴 Interactive Flashcard Deck</h3>
            <span className="text-xs font-bold text-violet-400">
              Card {currentCardIndex + 1} of {flashcards.length}
            </span>
          </div>

          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full max-w-lg mx-auto h-64 bg-slate-950 border border-violet-500/30 rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer text-center transition-all duration-300 hover:border-violet-500 shadow-xl"
          >
            <span className="text-[10px] uppercase tracking-widest text-violet-400 font-bold mb-4">
              {isFlipped ? 'ANSWER' : 'QUESTION (Click to flip)'}
            </span>
            <p className="text-lg font-bold text-white">
              {isFlipped ? flashcards[currentCardIndex].answer : flashcards[currentCardIndex].question}
            </p>
          </div>

          <div className="flex justify-center gap-4 pt-2">
            <button
              onClick={() => {
                setIsFlipped(false);
                setCurrentCardIndex((prev) => (prev > 0 ? prev - 1 : flashcards.length - 1));
              }}
              className="bg-slate-950 hover:bg-slate-800 border border-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
            >
              ← Previous
            </button>
            <button
              onClick={() => {
                setIsFlipped(false);
                setCurrentCardIndex((prev) => (prev < flashcards.length - 1 ? prev + 1 : 0));
              }}
              className="bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold px-6 py-2 rounded-xl transition"
            >
              Next Card →
            </button>
          </div>

          <form onSubmit={handleAddFlashcard} className="flex gap-2 pt-4 border-t border-slate-800">
            <input
              type="text"
              placeholder="Card Question..."
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            />
            <input
              type="text"
              placeholder="Card Answer..."
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            />
            <button type="submit" className="bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs px-4 py-2 rounded-xl">
              + Add Card
            </button>
          </form>
        </div>
      )}

      {/* 4. EXAM BUILDER TAB */}
      {activeTab === 'exam' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div>
            <h3 className="text-lg font-black text-white">📝 AI Custom Exam Builder</h3>
            <p className="text-xs text-slate-400">
              Upload past papers, course syllabi, or textbook chapters to automatically generate custom mock exams.
            </p>
          </div>

          {/* Exam Source File Upload */}
          <div className="bg-slate-950 border border-dashed border-slate-800 hover:border-violet-500/50 rounded-2xl p-6 text-center space-y-2">
            <label className="cursor-pointer flex flex-col items-center gap-1">
              <span className="text-3xl">📝</span>
              <span className="text-xs font-bold text-white">
                {examFile ? examFile.name : 'Upload Exam Source Document (PDF, DOCX)'}
              </span>
              <span className="text-[10px] text-slate-500">
                {examFile ? `${(examFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for exam synthesis` : 'Upload syllabus or lecture notes to base exam questions on'}
              </span>
              <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleExamFileUpload} className="hidden" />
            </label>
            {examFile && (
              <button onClick={() => setExamFile(null)} className="text-[10px] text-rose-400 font-bold">
                Remove Attached File
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {questionTypeOptions.map((opt) => (
              <div key={opt.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 hover:border-violet-500 transition">
                <h4 className="text-xs font-bold text-white">{opt.label}</h4>
                <p className="text-[10px] text-slate-400 mt-1">{opt.desc}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              setIsGeneratingExam(true);
              setTimeout(() => {
                setIsGeneratingExam(false);
                setExamGenerated(true);
              }, 2000);
            }}
            disabled={isGeneratingExam || !examFile}
            className="bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold px-6 py-3 rounded-xl transition disabled:opacity-50"
          >
            {isGeneratingExam ? '⚡ Extracting concepts & generating test questions...' : '✨ Generate Mock Exam from File'}
          </button>

          {examGenerated && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 animate-fadeIn">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-white">Generated Mock Exam (10 Questions)</h4>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800 font-bold">Ready</span>
              </div>
              <p className="text-[11px] text-slate-400">1. What is the main theme outlined in {examFile?.name || 'the uploaded document'}?</p>
              <p className="text-[11px] text-slate-400">2. True or False: The key parameters are mutually exclusive.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
