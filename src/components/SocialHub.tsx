import React from 'react';

export const SocialHub: React.FC = () => {
  const leaderboard = [
    { rank: 1, name: 'Alex K.', xp: '1,850 XP', avatar: 'AK' },
    { rank: 2, name: 'VANE (You)', xp: '240 XP', avatar: 'V', isUser: true },
    { rank: 3, name: 'Sarah R.', xp: '210 XP', avatar: 'SR' },
  ];

  const friends = [
    { name: 'Alex K.', notes: 3 },
    { name: 'Sarah R.', notes: 1 },
    { name: 'David M.', notes: 5 },
  ];

  const files = [
    { name: 'Calculus_Integration_Notes.pdf', time: 'Uploaded 2 days ago' },
    { name: 'Organic_Chemistry_Summary.docx', time: 'Uploaded 4 days ago' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-white">Social & Community Hub</h1>
        <p className="text-xs text-slate-400 mt-1">
          Leaderboards, shared notes, and friend activity for seamless collaboration.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-md space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            🏆 Scholar Rankings
          </h2>

          <div className="space-y-2.5">
            {leaderboard.map((user) => (
              <div
                key={user.name}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all hover:scale-[1.01] ${
                  user.isUser
                    ? 'bg-violet-600/20 border-violet-500/50 text-white shadow-md shadow-violet-600/10'
                    : 'bg-slate-800/40 border-slate-700/50 text-slate-200 hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-slate-400 w-5">#{user.rank}</span>
                  <div className="w-8 h-8 rounded-xl bg-violet-600/30 border border-violet-500/40 flex items-center justify-center text-xs font-bold text-violet-300">
                    {user.avatar}
                  </div>
                  <span className="text-xs font-bold">{user.name}</span>
                </div>
                <span className="text-xs font-bold text-violet-400">{user.xp}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                👥 Friends ({friends.length})
              </h2>
              <button className="px-3.5 py-1.5 bg-violet-600 hover:bg-violet-500 hover:scale-105 active:scale-95 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md shadow-violet-600/20">
                + Add Friend
              </button>
            </div>

            <div className="space-y-2">
              {friends.map((friend) => (
                <div
                  key={friend.name}
                  className="flex items-center justify-between p-3 bg-slate-800/40 border border-slate-700/40 rounded-2xl text-xs hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span className="font-bold text-white">{friend.name}</span>
                  </div>
                  <span className="text-slate-400 font-semibold text-[11px]">Shared Notes: {friend.notes}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-md space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              📚 Shared Notes & Library Exchange
            </h2>

            <div className="space-y-2.5">
              {files.map((file) => (
                <div
                  key={file.name}
                  className="flex items-center justify-between p-3.5 bg-slate-800/40 border border-slate-700/40 rounded-2xl text-xs"
                >
                  <div>
                    <p className="font-bold text-white">{file.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{file.time}</p>
                  </div>
                  <button className="px-3.5 py-1.5 bg-slate-700 hover:bg-violet-600 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer">
                    Download
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
