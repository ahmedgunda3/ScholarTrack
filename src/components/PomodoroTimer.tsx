import React, { useState, useEffect } from 'react';

interface PomodoroProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PomodoroTimer: React.FC<PomodoroProps> = ({ isOpen, onClose }) => {
  const [theme, setTheme] = useState<'neon' | 'zen' | 'classic' | 'sunset'>('neon');
  const [mode, setMode] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
  const [workTime, setWorkTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [ambientSound, setAmbientSound] = useState<'none' | 'rain' | 'lofi' | 'forest'>('none');

  useEffect(() => {
    let timer: any = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const switchMode = (newMode: 'work' | 'shortBreak' | 'longBreak') => {
    setMode(newMode);
    setIsRunning(false);
    if (newMode === 'work') setTimeLeft(workTime * 60);
    if (newMode === 'shortBreak') setTimeLeft(breakTime * 60);
    if (newMode === 'longBreak') setTimeLeft(15 * 60);
  };

  const updateWorkTime = (mins: number) => {
    setWorkTime(mins);
    if (mode === 'work' && !isRunning) setTimeLeft(mins * 60);
  };

  const updateBreakTime = (mins: number) => {
    setBreakTime(mins);
    if (mode === 'shortBreak' && !isRunning) setTimeLeft(mins * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const themeStyles = {
    neon: 'bg-slate-950 border-violet-500/50 text-violet-400 shadow-violet-900/50',
    zen: 'bg-emerald-950/90 border-emerald-500/40 text-emerald-300 shadow-emerald-900/40',
    classic: 'bg-rose-950/90 border-rose-500/40 text-rose-300 shadow-rose-900/40',
    sunset: 'bg-amber-950/90 border-amber-500/40 text-amber-300 shadow-amber-900/40',
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className={`w-full max-w-md border rounded-3xl p-6 shadow-2xl relative space-y-6 transition-all ${themeStyles[theme]}`}>
        <div className="flex justify-between items-center border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">⏱️</span>
            <h2 className="font-black text-white text-lg">Scholar Pomodoro</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl font-bold">✕</button>
        </div>

        <div className="flex bg-black/40 p-1 rounded-2xl border border-white/10 text-xs font-bold">
          <button
            onClick={() => switchMode('work')}
            className={`flex-1 py-2 rounded-xl transition ${mode === 'work' ? 'bg-violet-600 text-white shadow' : 'text-slate-400'}`}
          >
            🧠 Focus ({workTime}m)
          </button>
          <button
            onClick={() => switchMode('shortBreak')}
            className={`flex-1 py-2 rounded-xl transition ${mode === 'shortBreak' ? 'bg-violet-600 text-white shadow' : 'text-slate-400'}`}
          >
            ☕ Short ({breakTime}m)
          </button>
          <button
            onClick={() => switchMode('longBreak')}
            className={`flex-1 py-2 rounded-xl transition ${mode === 'longBreak' ? 'bg-violet-600 text-white shadow' : 'text-slate-400'}`}
          >
            🌴 Long (15m)
          </button>
        </div>

        <div className="text-center py-6">
          <div className="text-6xl font-black font-mono tracking-widest text-white drop-shadow-lg">
            {formatTime(timeLeft)}
          </div>
          <p className="text-xs text-slate-400 mt-2 capitalize">{mode} Session in progress</p>
        </div>

        <div className="flex justify-center gap-3">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="px-8 py-3 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-black text-sm tracking-wider shadow-lg transform active:scale-95 transition"
          >
            {isRunning ? 'PAUSE' : 'START FOCUS'}
          </button>
          <button
            onClick={() => { setIsRunning(false); setTimeLeft(workTime * 60); }}
            className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition"
          >
            Reset
          </button>
        </div>

        <div className="space-y-3 pt-3 border-t border-white/10 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Duration Limits:</span>
            <div className="flex gap-2">
              <button onClick={() => updateWorkTime(25)} className="px-2 py-1 bg-black/50 rounded border border-white/10 text-[10px]">Work 25m</button>
              <button onClick={() => updateWorkTime(50)} className="px-2 py-1 bg-black/50 rounded border border-white/10 text-[10px]">Work 50m</button>
              <button onClick={() => updateBreakTime(10)} className="px-2 py-1 bg-black/50 rounded border border-white/10 text-[10px]">Break 10m</button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">Theme Style:</span>
            <div className="flex gap-1">
              {(['neon', 'zen', 'classic', 'sunset'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`px-2 py-1 rounded-md capitalize text-[10px] font-bold border ${theme === t ? 'bg-white text-black' : 'border-white/10 text-slate-400'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">Ambient Background Sound:</span>
            <select
              value={ambientSound}
              onChange={(e) => setAmbientSound(e.target.value as any)}
              className="bg-black/60 border border-white/10 text-white rounded-lg px-2 py-1 text-[11px]"
            >
              <option value="none">Off</option>
              <option value="rain">🌧️ Soft Rain</option>
              <option value="lofi">🎧 Lo-Fi Beats</option>
              <option value="forest">🌲 Forest Ambience</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
