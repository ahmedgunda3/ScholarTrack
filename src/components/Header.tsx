import React, { useState } from 'react';

export const Header: React.FC = () => {
  const [pomodoroActive, setPomodoroActive] = useState(false);

  return (
    <div className="flex items-center justify-end gap-3 mb-6">
      <button 
        onClick={() => setPomodoroActive(!pomodoroActive)}
        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
          pomodoroActive 
            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-lg shadow-rose-500/20' 
            : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700'
        }`}
      >
        <span>⏱️</span> {pomodoroActive ? 'Pomodoro: 24:59' : 'Pomodoro'}
      </button>

      <div className="px-3.5 py-1.5 bg-slate-900/80 border border-slate-800 rounded-xl text-xs font-bold text-violet-300 flex items-center gap-1.5">
        <span>🎓</span> Lot 3 Scholar
      </div>

      <button className="px-3.5 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-violet-600/30 cursor-pointer flex items-center gap-1.5">
        <span>👤</span> Edit Avatar
      </button>
    </div>
  );
};
