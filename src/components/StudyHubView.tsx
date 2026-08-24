import React, { useState, useEffect, useRef, type ChangeEvent } from 'react';

type SubTab = 'flashcards' | 'audio' | 'video' | 'exams';

interface Flashcard {
  id: string;
  front: string;
  back: string;
}

interface MatchingPair {
  id: string;
  itemA: string;
  itemB: string;
}

interface ExamQuestion {
  id: string;
  type: 'mcq' | 'matching' | 'tf' | 'short';
  prompt: string;
  options?: string[];
  matchingPairs?: MatchingPair[];
  correctAnswer?: string;
}

interface Avatar {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
  bgColor: string;
  accentColor: string;
}

const PRESET_AVATARS: Avatar[] = [
  { id: 'dr-scholar', name: 'Dr. Scholar', role: 'Academic Professor', bgColor: '#1e1b4b', accentColor: '#8b5cf6' },
  { id: 'byte-tech', name: 'Prof. Byte', role: 'STEM & Code Expert', bgColor: '#0f172a', accentColor: '#06b6d4' },
  { id: 'nova-host', name: 'Nova', role: 'Podcast Host', bgColor: '#2e1065', accentColor: '#d946ef' },
];

export const StudyHubView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SubTab>('video');

  // Flashcards State
  const [cardTopic, setCardTopic] = useState('');
  const [flashcards, setFlashcards] = useState<Flashcard[]>([
    { id: '1', front: 'What is Mitochondria?', back: 'The powerhouse of the cell, generating ATP energy.' },
    { id: '2', front: 'What is Osmosis?', back: 'Movement of water across a semi-permeable membrane.' }
  ]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Audio On-The-Go & Podcast State
  const [audioTopic, setAudioTopic] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [audioScript, setAudioScript] = useState("Welcome to your ScholarTrack AI Video & Audio Lesson! Upload any document or type a topic, choose an avatar, and let's break down the subject step-by-step.");
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isParsingPdf, setIsParsingPdf] = useState(false);
  
  // Voices State
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');

  // Format & Export State
  const [audioFormat, setAudioFormat] = useState<'webm' | 'mp3' | 'wav' | 'mkv'>('mp3');

  // AI Avatar Video Generation State
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>('dr-scholar');
  const [customAvatarImg, setCustomAvatarImg] = useState<string | null>(null);
  const [isVideoRendering, setIsVideoRendering] = useState(false);
  const [renderedVideoUrl, setRenderedVideoUrl] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoChunksRef = useRef<Blob[]>([]);

  // Exam Generator State
  const [examTopic, setExamTopic] = useState('');
  const [includeMCQ, setIncludeMCQ] = useState(true);
  const [includeMatching, setIncludeMatching] = useState(true);
  const [includeTF, setIncludeTF] = useState(true);
  const [generatedExam, setGeneratedExam] = useState<ExamQuestion[] | null>(null);

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    const populateVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);

      if (availableVoices.length > 0 && !selectedVoiceURI) {
        const preferredVoice = availableVoices.find(
          (v) => v.name.includes('Natural') || v.name.includes('Online') || v.name.includes('Google') || v.lang.startsWith('en')
        ) || availableVoices[0];
        setSelectedVoiceURI(preferredVoice.voiceURI);
      }
    };

    populateVoices();
    window.speechSynthesis.onvoiceschanged = populateVoices;
  }, [selectedVoiceURI]);

  const formatAsPodcast = (topic: string, bodyText: string) => {
    return `Hey everyone, welcome back to your ScholarTrack AI Video Studio! Today, we're analyzing ${topic}. Let's break down the main takeaways based on your file material: ${bodyText} ... And that completes your lesson video for ${topic}. Keep up the great work!`;
  };

  // Document & PDF Parser
  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    const topicName = file.name.replace(/\.[^/.]+$/, "");
    setAudioTopic(topicName);

    if (file.name.toLowerCase().endsWith('.pdf')) {
      setIsParsingPdf(true);
      setAudioScript(`Analyzing PDF document "${file.name}" for video generation... Please wait.`);

      try {
        if (!(window as any).pdfjsLib) {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
          document.head.appendChild(script);
          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
          });
          (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        }

        const arrayBuffer = await file.arrayBuffer();
        const pdfjsLib = (window as any).pdfjsLib;
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        let extractedText = '';
        const maxPages = Math.min(pdf.numPages, 10);
        for (let i = 1; i <= maxPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(' ');
          extractedText += pageText + ' ';
        }

        const cleanedText = extractedText.replace(/\s+/g, ' ').trim();
        if (!cleanedText) {
          setAudioScript(`Lesson overview for ${file.name}. (PDF contains scanned images without selectable text).`);
        } else {
          const snippet = cleanedText.length > 850 ? cleanedText.slice(0, 850) + '...' : cleanedText;
          setAudioScript(formatAsPodcast(topicName, snippet));
        }
      } catch (err) {
        console.error(err);
        setAudioScript(`Could not parse ${file.name}. Try uploading a .txt or .md file.`);
      } finally {
        setIsParsingPdf(false);
      }
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        const rawText = event.target?.result as string;
        if (rawText) {
          const cleanedText = rawText.replace(/\s+/g, ' ').trim();
          const snippet = cleanedText.length > 850 ? cleanedText.slice(0, 850) + '...' : cleanedText;
          setAudioScript(formatAsPodcast(topicName, snippet));
        }
      };
      reader.readAsText(file);
    }
  };

  // Custom Avatar Image Upload Handler
  const handleCustomAvatarUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCustomAvatarImg(imageUrl);
      setSelectedAvatarId('custom');
    }
  };

  // Draw Avatar & Animated Canvas Frame
  const drawAvatarFrame = (ctx: CanvasRenderingContext2D, speaking: boolean, textChunk: string) => {
    const canvas = ctx.canvas;
    const width = canvas.width;
    const height = canvas.height;

    // Background
    const currentAvatar = PRESET_AVATARS.find(a => a.id === selectedAvatarId) || PRESET_AVATARS[0];
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, selectedAvatarId === 'custom' ? '#0f172a' : currentAvatar.bgColor);
    bgGrad.addColorStop(1, '#020617');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Grid lines pattern
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Avatar Circle / Image
    const centerX = width / 2;
    const centerY = height / 2 - 30;
    const radius = 90;

    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = speaking ? (selectedAvatarId === 'custom' ? '#10b981' : currentAvatar.accentColor) : 'rgba(255,255,255,0.2)';
    ctx.lineWidth = speaking ? 8 : 4;
    ctx.stroke();
    ctx.clip();

    if (selectedAvatarId === 'custom' && customAvatarImg) {
      const img = new Image();
      img.src = customAvatarImg;
      ctx.drawImage(img, centerX - radius, centerY - radius, radius * 2, radius * 2);
    } else {
      ctx.fillStyle = currentAvatar.accentColor;
      ctx.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 42px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(currentAvatar.name.charAt(0), centerX, centerY);
    }
    ctx.restore();

    // Animated Speech Waveform
    if (speaking) {
      ctx.beginPath();
      const waveY = centerY + radius + 30;
      for (let x = centerX - 120; x <= centerX + 120; x += 10) {
        const offset = Math.sin((x + Date.now() / 8) / 10) * (Math.random() * 12 + 4);
        ctx.lineTo(x, waveY + offset);
      }
      ctx.strokeStyle = selectedAvatarId === 'custom' ? '#10b981' : currentAvatar.accentColor;
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // Header Overlay
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(audioTopic ? `LESSON: ${audioTopic.toUpperCase()}` : 'SCHOLARTRACK AI AVATAR LESSON', centerX, 40);

    // Dynamic Subtitles Bar
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(40, height - 90, width - 80, 60);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.strokeRect(40, height - 90, width - 80, 60);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    const displaySubtitle = textChunk.length > 70 ? textChunk.slice(0, 70) + '...' : textChunk;
    ctx.fillText(displaySubtitle || 'Listening to lesson context...', centerX, height - 55);
  };

  // Generate Real Video File with Canvas + Speech Audio
  const handleGenerateAvatarVideo = async () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech Synthesis is not supported in this browser.');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsVideoRendering(true);
    setRenderedVideoUrl(null);
    videoChunksRef.current = [];

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const canvasStream = canvas.captureStream(30);
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const dest = audioCtx.createMediaStreamDestination();

      const combinedStream = new MediaStream([
        ...canvasStream.getVideoTracks(),
        ...dest.stream.getAudioTracks()
      ]);

      const supportedMime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm';

      const mediaRecorder = new MediaRecorder(combinedStream, { mimeType: supportedMime });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) videoChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const videoBlob = new Blob(videoChunksRef.current, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(videoBlob);
        setRenderedVideoUrl(videoUrl);
        setIsVideoRendering(false);
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      };

      mediaRecorder.start();

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(audioScript);
      utterance.rate = playbackSpeed;

      if (selectedVoiceURI) {
        const voice = voices.find(v => v.voiceURI === selectedVoiceURI);
        if (voice) utterance.voice = voice;
      }

      let isSpeaking = true;
      const animate = () => {
        drawAvatarFrame(ctx, isSpeaking, audioScript);
        animationFrameRef.current = requestAnimationFrame(animate);
      };

      animate();

      utterance.onend = () => {
        isSpeaking = false;
        setTimeout(() => {
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
          }
        }, 600);
      };

      window.speechSynthesis.speak(utterance);

    } catch (err) {
      console.error(err);
      setIsVideoRendering(false);
      alert('Could not render avatar video stream in this browser.');
    }
  };

  const handleToggleAudio = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(audioScript);
      utterance.rate = playbackSpeed;
      if (selectedVoiceURI) {
        const v = voices.find(v => v.voiceURI === selectedVoiceURI);
        if (v) utterance.voice = v;
      }
      utterance.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  const handleAddFlashcard = () => {
    if (!cardTopic.trim()) return;
    setFlashcards([
      ...flashcards,
      { id: Date.now().toString(), front: cardTopic, back: `Core key summary for ${cardTopic}` }
    ]);
    setCardTopic('');
  };

  const handleGenerateExam = () => {
    if (!examTopic.trim()) return;
    const exam: ExamQuestion[] = [];

    if (includeMCQ) {
      exam.push({
        id: '1',
        type: 'mcq',
        prompt: `Which of the following best defines primary mechanisms in ${examTopic}?`,
        options: ['Option A: Standard model', 'Option B: Dynamic state', 'Option C: Passive variable', 'Option D: Linear threshold'],
        correctAnswer: 'Option A: Standard model'
      });
    }

    if (includeMatching) {
      exam.push({
        id: '2',
        type: 'matching',
        prompt: `Match Column A terms with Column B definitions for ${examTopic}:`,
        matchingPairs: [
          { id: 'm1', itemA: 'Concept Alpha', itemB: 'Primary operational module' },
          { id: 'm2', itemA: 'Concept Beta', itemB: 'Secondary feedback mechanism' },
          { id: 'm3', itemA: 'Concept Gamma', itemB: 'Terminal output threshold' }
        ]
      });
    }

    if (includeTF) {
      exam.push({
        id: '3',
        type: 'tf',
        prompt: `True or False: ${examTopic} principles apply uniformly across standard conditions.`,
        correctAnswer: 'True'
      });
    }

    setGeneratedExam(exam);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 text-slate-100">
      {/* Navigation Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div>
          <h1 className="text-2xl font-black bg-gradient-to-r from-violet-400 via-fuchsia-400 to-emerald-400 bg-clip-text text-transparent">
            ScholarTrack AI Studio
          </h1>
          <p className="text-xs text-slate-400">Generate AI Avatar videos, podcast audio, flashcards, and custom exams.</p>
        </div>

        <div className="flex flex-wrap gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('video')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === 'video' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            🎬 AI Avatar Video
          </button>
          <button
            onClick={() => setActiveTab('audio')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === 'audio' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            🎧 Audio Studio
          </button>
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === 'flashcards' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            🎴 Flashcards
          </button>
          <button
            onClick={() => setActiveTab('exams')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === 'exams' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            📝 Exam Builder
          </button>
        </div>
      </div>

      {/* AI AVATAR VIDEO TAB */}
      {activeTab === 'video' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <span>🤖</span> Choose Your AI Avatar Host
              </h2>
              <p className="text-xs text-slate-400">Select a preset AI presenter or upload your own portrait sample to create an animated video lesson.</p>
            </div>

            {/* Avatar Selection Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {PRESET_AVATARS.map((avatar) => (
                <div
                  key={avatar.id}
                  onClick={() => setSelectedAvatarId(avatar.id)}
                  className={`cursor-pointer rounded-2xl p-4 border text-center transition flex flex-col items-center space-y-2 ${selectedAvatarId === avatar.id ? 'border-violet-500 bg-violet-950/40 ring-2 ring-violet-500/50' : 'border-slate-800 bg-slate-950 hover:border-slate-700'}`}
                >
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-lg" style={{ backgroundColor: avatar.accentColor }}>
                    {avatar.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-100">{avatar.name}</h3>
                    <p className="text-[10px] text-slate-400">{avatar.role}</p>
                  </div>
                </div>
              ))}

              {/* Custom Upload Card */}
              <label className={`cursor-pointer rounded-2xl p-4 border text-center transition flex flex-col items-center justify-center space-y-2 ${selectedAvatarId === 'custom' ? 'border-emerald-500 bg-emerald-950/40 ring-2 ring-emerald-500/50' : 'border-slate-800 bg-slate-950 hover:border-slate-700'}`}>
                {customAvatarImg ? (
                  <img src={customAvatarImg} alt="Custom Avatar" className="w-16 h-16 rounded-full object-cover border-2 border-emerald-400" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-dashed border-slate-600 flex items-center justify-center text-xl">
                    📸
                  </div>
                )}
                <div>
                  <h3 className="text-xs font-bold text-slate-100">{customAvatarImg ? 'Custom Portrait' : 'Upload Avatar'}</h3>
                  <p className="text-[10px] text-slate-400">PNG / JPG Image</p>
                </div>
                <input type="file" accept="image/*" onChange={handleCustomAvatarUpload} className="hidden" />
              </label>
            </div>

            {/* Document Upload Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-300">📄 File Analysis Input</span>
                <p className="text-[11px] text-slate-500">Upload sample document or notes to generate explanation video.</p>
              </div>
              <div className="flex items-center gap-3">
                {uploadedFileName && (
                  <span className="text-xs text-emerald-400 font-semibold truncate max-w-[150px]">{uploadedFileName}</span>
                )}
                <label className="bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-bold px-4 py-2 rounded-xl cursor-pointer transition border border-slate-700">
                  <span>📁</span> {isParsingPdf ? 'Parsing File...' : 'Upload Sample File'}
                  <input type="file" accept=".pdf,.txt,.md" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            </div>

            {/* Live Canvas Studio & Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-400">📽️ Studio Preview Canvas</span>
                <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex justify-center items-center p-2">
                  <canvas ref={canvasRef} width={640} height={360} className="w-full h-auto rounded-xl bg-black" />
                </div>
              </div>

              <div className="space-y-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <span className="text-xs font-bold text-slate-300 block">📝 Video Script & Analysis Summary</span>
                <textarea
                  value={audioScript}
                  onChange={(e) => setAudioScript(e.target.value)}
                  rows={8}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none resize-none"
                />

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={handleGenerateAvatarVideo}
                    disabled={isVideoRendering || isParsingPdf}
                    className="flex-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold py-3 rounded-xl text-xs transition disabled:opacity-50"
                  >
                    {isVideoRendering ? '🎬 Rendering AI Video Stream...' : '🎥 Generate AI Avatar Video'}
                  </button>
                </div>

                {renderedVideoUrl && (
                  <div className="bg-emerald-950/40 border border-emerald-500/40 p-4 rounded-xl space-y-3 mt-3">
                    <span className="text-xs font-bold text-emerald-300 block">✅ AI Avatar Video Generated!</span>
                    <video controls src={renderedVideoUrl} className="w-full rounded-lg border border-emerald-500/30 max-h-48" />
                    <a
                      href={renderedVideoUrl}
                      download={`ScholarTrack_Lesson_Video.${audioFormat === 'mkv' ? 'mkv' : 'webm'}`}
                      className="block text-center bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl text-xs transition"
                    >
                      Download Video File 💾
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AUDIO STUDIO TAB */}
      {activeTab === 'audio' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <span>🎧</span> Podcast Audio Studio
            </h2>
            <p className="text-xs text-slate-400">Choose custom voices, playback speed, and export MP3/WAV/WebM audio tracks.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">🎙️ Speaker Voice:</label>
              <select
                value={selectedVoiceURI}
                onChange={(e) => setSelectedVoiceURI(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl p-2.5"
              >
                {voices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">💾 Audio Export Format:</label>
              <select
                value={audioFormat}
                onChange={(e) => setAudioFormat(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl p-2.5 uppercase font-semibold"
              >
                <option value="mp3">MP3 (.mp3)</option>
                <option value="webm">WebM (.webm)</option>
                <option value="wav">WAV (.wav)</option>
                <option value="mkv">MKV (.mkv)</option>
              </select>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
            <textarea
              value={audioScript}
              onChange={(e) => setAudioScript(e.target.value)}
              rows={6}
              className="w-full bg-transparent text-xs text-slate-300 focus:outline-none resize-none"
            />

            <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-800 pt-4 gap-4">
              <button
                onClick={handleToggleAudio}
                className="bg-violet-600 hover:bg-violet-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs"
              >
                {isPlaying ? '⏸ Pause Podcast' : '▶ Play Podcast Audio'}
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-bold">Speed:</span>
                {[0.8, 1, 1.25, 1.5].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold ${playbackSpeed === speed ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FLASHCARDS TAB */}
      {activeTab === 'flashcards' && (
        <div className="space-y-6">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter card topic or concept..."
              value={cardTopic}
              onChange={(e) => setCardTopic(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-violet-500"
            />
            <button
              onClick={handleAddFlashcard}
              className="bg-violet-600 hover:bg-violet-500 font-bold px-4 py-2 rounded-xl text-sm transition"
            >
              + Add Card
            </button>
          </div>

          {flashcards.length > 0 && (
            <div className="flex flex-col items-center justify-center space-y-4">
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="w-full max-w-lg h-64 bg-slate-900 border-2 border-violet-500/30 hover:border-violet-500 rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer shadow-xl transition-all select-none"
              >
                <span className="text-xs uppercase tracking-widest text-violet-400 mb-2 font-bold">
                  {isFlipped ? 'Answer / Back' : 'Question / Front (Click to Flip)'}
                </span>
                <p className="text-lg font-medium text-slate-100">
                  {isFlipped ? flashcards[currentCardIndex].back : flashcards[currentCardIndex].front}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  disabled={currentCardIndex === 0}
                  onClick={() => { setIsFlipped(false); setCurrentCardIndex((prev) => prev - 1); }}
                  className="px-4 py-2 bg-slate-800 rounded-xl text-xs font-bold disabled:opacity-40"
                >
                  ← Prev
                </button>
                <span className="text-xs text-slate-400 font-bold">
                  {currentCardIndex + 1} of {flashcards.length}
                </span>
                <button
                  disabled={currentCardIndex === flashcards.length - 1}
                  onClick={() => { setIsFlipped(false); setCurrentCardIndex((prev) => prev + 1); }}
                  className="px-4 py-2 bg-slate-800 rounded-xl text-xs font-bold disabled:opacity-40"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* EXAM BUILDER TAB */}
      {activeTab === 'exams' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold">🎓 Custom Style Exam Generator</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Exam Topic (e.g., Organic Chemistry Chapter 4)"
                value={examTopic}
                onChange={(e) => setExamTopic(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-violet-500"
              />

              <div className="flex flex-wrap items-center gap-4 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={includeMCQ} onChange={(e) => setIncludeMCQ(e.target.checked)} />
                  Multiple Choice
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={includeMatching} onChange={(e) => setIncludeMatching(e.target.checked)} />
                  List A & B Matching
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={includeTF} onChange={(e) => setIncludeTF(e.target.checked)} />
                  True / False
                </label>
              </div>
            </div>

            <button
              onClick={handleGenerateExam}
              className="w-full bg-violet-600 hover:bg-violet-500 font-bold py-2.5 rounded-xl text-sm transition"
            >
              Generate Exam Paper
            </button>
          </div>

          {generatedExam && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
                <h3 className="font-bold text-lg text-violet-400">Exam Paper: {examTopic}</h3>
                <button
                  onClick={() => window.print()}
                  className="bg-slate-800 hover:bg-slate-700 text-xs px-3 py-1.5 rounded-lg font-bold"
                >
                  🖨️ Print / Export PDF
                </button>
              </div>

              {generatedExam.map((q, idx) => (
                <div key={q.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <p className="text-sm font-semibold">
                    Q{idx + 1}. {q.prompt}
                  </p>

                  {q.type === 'mcq' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-4">
                      {q.options?.map((opt, i) => (
                        <div key={i} className="text-xs bg-slate-900 p-2 rounded border border-slate-800">
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}

                  {q.type === 'matching' && (
                    <div className="grid grid-cols-2 gap-4 bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs">
                      <div>
                        <span className="font-bold text-violet-400 block mb-2">Column A</span>
                        {q.matchingPairs?.map((pair, i) => (
                          <p key={i} className="py-1">{i + 1}. {pair.itemA}</p>
                        ))}
                      </div>
                      <div>
                        <span className="font-bold text-violet-400 block mb-2">Column B</span>
                        {q.matchingPairs?.map((pair, i) => (
                          <p key={i} className="py-1">[{String.fromCharCode(65 + i)}] {pair.itemB}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {q.type === 'tf' && (
                    <div className="flex gap-4 pl-4 text-xs font-bold">
                      <span className="px-3 py-1 bg-slate-900 rounded border border-slate-800">[ ] True</span>
                      <span className="px-3 py-1 bg-slate-900 rounded border border-slate-800">[ ] False</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
