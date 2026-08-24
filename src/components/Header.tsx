import React from 'react';

interface HeaderProps {
  onOpenAvatarModal: () => void;
  userLevel: number;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAvatarModal, userLevel }) => {
  return (
    <header className="h-16 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-950 sticky top-0 z-40">
      <div className="flex items-center gap-2">
        <span className="font-black text-lg tracking-tight text-white">ScholarTrack</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl px-3 py-1.5 flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs font-bold text-white block">VANE</span>
            <span className="text-[10px] text-violet-400 block">Lvl {userLevel} Scholar</span>
          </div>
          <button
            onClick={onOpenAvatarModal}
            className="bg-violet-600 hover:bg-violet-500 text-[11px] font-bold px-2.5 py-1 rounded-lg text-white transition"
          >
            Edit Avatar
          </button>
        </div>
      </div>
    </header>
  );
};
