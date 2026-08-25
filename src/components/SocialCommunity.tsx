import React from 'react';

export const SocialCommunity: React.FC = () => {
  const rankings = [
    { name: 'Alex K.', xp: '1,650 XP', rank: 1, avatar: '👑' },
    { name: 'VANE (You)', xp: '2450 XP', rank: 2, avatar: '⚡' },
    { name: 'Sarah R.', xp: '210 XP', rank: 3, avatar: '🎓' },
  ];

  const friends = [
    { name: 'Alex K.', status: 'Shared Notes 4' },
    { name: 'Sarah R.', status: 'Shared Notes 1' },
    { name: 'David M.', status: 'Shared Notes 2' },
  ];

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/30 hover:shadow-xl">
        <h1 className="text-2xl font-black text-white">Social & Community Hub</h1>
        <p className="text-xs text-slate-400 mt-1">Connect with friends, compare rankings, and trade shared study resources.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leaderboard Column */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 transition-all duration-300 hover:border-slate-700">
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            🏆 Scholar Rankings
          </h3>

          <div className="space-y-3">
            {rankings.map((user, idx) => (
              <div
                key={idx}
                className="p-4 bg-slate-950 border border-slate-800 hover:border-violet-500/50 rounded-2xl flex items-center justify-between transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-xl cursor-pointer active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{user.avatar}</span>
                  <div>
                    <h4 className="text-xs font-bold text-white">#{user.rank} {user.name}</h4>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800">
                  {user.xp}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Friends & Shared Notes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Friends list */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black text-white">👥 Friends ({friends.length})</h3>
              <button className="bg-violet-600 hover:bg-violet-500 text-white font-bold text-[10px] px-3 py-1.5 rounded-xl transition-all duration-300 transform hover:-translate-y-1 active:scale-95 cursor-pointer">
                + Add Friend
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {friends.map((friend, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-950 border border-slate-800 rounded-2xl transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:border-violet-500/50 active:scale-95 cursor-pointer group"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mb-2"></div>
                  <h4 className="text-xs font-bold text-white group-hover:text-violet-300 transition">{friend.name}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">{friend.status}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Shared Notes Library */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-black text-white">📚 Shared Notes & Library Exchange</h3>
            <div className="space-y-3">
              {[
                { title: 'Calculus_Integration_Notes.pdf', author: 'Shared by Alex K.' },
                { title: 'Organic_Chemistry_Summary.docx', author: 'Shared by Sarah R.' },
              ].map((doc, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex justify-between items-center transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-xl hover:border-violet-500/50 cursor-pointer"
                >
                  <div>
                    <h4 className="text-xs font-bold text-white">{doc.title}</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">{doc.author}</p>
                  </div>
                  <button className="bg-slate-900 hover:bg-violet-600 text-slate-300 hover:text-white border border-slate-800 hover:border-violet-500 font-bold text-[10px] px-3 py-1.5 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95">
                    Download 📥
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

export const SocialCommunityView = SocialCommunity;
