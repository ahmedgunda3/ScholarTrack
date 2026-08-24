import React, { useState } from 'react';

export interface StudySpace {
  id: string;
  name: string;
  description: string;
  members: number;
  category?: string;
}

export const StudySpacesView: React.FC = () => {
  const [spaces] = useState<StudySpace[]>([
    { id: '1', name: 'Calculus Study Group', description: 'Active collaboration space with flashcards and practice sets.', members: 12 },
    { id: '2', name: 'AP Physics Review', description: 'Active collaboration space with flashcards and practice sets.', members: 17 },
    { id: '3', name: 'Python & CS Lounge', description: 'Active collaboration space with flashcards and practice sets.', members: 23 },
  ]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-white">Study Spaces</h1>
          <p className="text-xs text-slate-400">Join or create collaborative learning groups.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {spaces.map((space) => (
          <div key={space.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex justify-between items-center hover:border-violet-500/50 transition">
            <div className="space-y-1">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <span>📂</span> {space.name}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm">{space.description}</p>
              <span className="text-[10px] font-semibold text-violet-400 block mt-2">👥 {space.members} Members</span>
            </div>
            <button className="bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition">
              Enter Space
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
