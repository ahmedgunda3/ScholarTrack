import React, { useState } from 'react';
import { Avatar3D } from './Avatar3D';
import { AvatarStudioModal } from './AvatarStudioModal';
import type { UserGamification } from '../types';

interface UserProfileBadgeProps {
  user: UserGamification;
  onUpdateAvatarUrl: (url: string) => void;
}

export const UserProfileBadge: React.FC<UserProfileBadgeProps> = ({ user, onUpdateAvatarUrl }) => {
  const [isStudioOpen, setIsStudioOpen] = useState(false);

  return (
    <>
      <div 
        onClick={() => setIsStudioOpen(true)}
        className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 p-2 pr-4 rounded-2xl cursor-pointer hover:border-violet-500 transition-all group"
      >
        <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 flex-shrink-0">
          <Avatar3D avatarUrl={user.avatar3dUrl} />
        </div>
        <div>
          <div className="text-xs text-slate-400 group-hover:text-violet-400 font-medium">Profile</div>
          <div className="text-sm font-bold text-white flex items-center gap-1.5">
            Lvl {user.level} Scholar
            <span className="text-[10px] bg-violet-500/20 text-violet-300 px-1.5 py-0.5 rounded-full border border-violet-500/30">
              Edit Avatar
            </span>
          </div>
        </div>
      </div>

      {isStudioOpen && (
        <AvatarStudioModal
          onClose={() => setIsStudioOpen(false)}
          onSave={(url) => {
            onUpdateAvatarUrl(url);
            localStorage.setItem('scholartrack_avatar_url', url);
          }}
        />
      )}
    </>
  );
};
