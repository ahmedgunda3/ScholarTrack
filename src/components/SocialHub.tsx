import React, { useState } from 'react';
import { Friend, SharedNote } from '../types/scholar';

export const SocialHub: React.FC = () => {
  const [friends] = useState<Friend[]>([
    { id: '1', name: 'Alex K.', status: 'studying', xp: 1450, sharedNotesCount: 4 },
    { id: '2', name: 'Sarah R.', status: 'online', xp: 210, sharedNotesCount: 1 },
    { id: '3', name: 'David M.', status: 'offline', xp: 890, sharedNotesCount: 0 },
  ]);

  const [notes] = useState<SharedNote[]>([
    { id: '1', title: 'Calculus_Integration_Notes.pdf', senderName: 'Alex K.', fileSize: '2.4 MB', timestamp: '2h ago' },
    { id: '2', title: 'Organic_Chemistry_Summary.docx', senderName: 'Sarah R.', fileSize: '1.1 MB', timestamp: '1d ago' },
  ]);

  return (
    <div className="p-6 space-y-6 text-slate-100">
      <div>
        <h1 className="text-2xl font-black">Social & Community Hub</h1>
        <p className="text-xs text-slate-400">Leaderboards, friends list, note sharing, and direct collaboration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <h3 className="font-bold text-sm text-slate-300">🏆 Scholar Rankings</h3>
          <div className="space-y-2">
            {[
              { rank: 1, name: 'Alex K.', streak: '14 Days', xp: '1,450 XP' },
              { rank: 2, name: 'VANE (You)', streak: '4 Days', xp: '240 XP' },
              { rank: 3, name: 'Sarah R.', streak: '3 Days', xp: '210 XP' },
            ].map((user) => (
              <div key={user.rank} className="bg-slate-950 border border-slate-800 p-3 rounded-2xl flex justify-between items-center text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-black text-violet-400">#{user.rank}</span>
                  <span className="font-bold">{user.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-emerald-400 font-bold block">{user.xp}</span>
                  <span className="text-[10px] text-slate-500">{user.streak}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-slate-300">👥 Friends ({friends.length})</h3>
              <button className="bg-violet-600 hover:bg-violet-500 text-xs font-bold px-3 py-1.5 rounded-xl transition">
                + Add Friend
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {friends.map((f) => (
                <div key={f.id} className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${f.status === 'online' ? 'bg-emerald-400' : f.status === 'studying' ? 'bg-violet-400 animate-pulse' : 'bg-slate-600'}`} />
                    <span className="font-bold text-xs">{f.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block">Shared Notes: {f.sharedNotesCount}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="font-bold text-sm text-slate-300">📑 Shared Notes & Library Exchange</h3>
            <div className="space-y-2">
              {notes.map((n) => (
                <div key={n.id} className="bg-slate-950 border border-slate-800 p-3 rounded-2xl flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold block text-violet-300">{n.title}</span>
                    <span className="text-[10px] text-slate-500">From {n.senderName} • {n.fileSize}</span>
                  </div>
                  <button className="bg-slate-800 hover:bg-slate-700 font-bold px-3 py-1.5 rounded-xl text-xs transition">
                    Download ⬇
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
