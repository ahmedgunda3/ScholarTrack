import React, { useState } from 'react';

interface AvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPet: string;
  onSelectPet: (icon: string) => void;
}

export const AvatarModal: React.FC<AvatarModalProps> = ({ isOpen, onClose, currentPet, onSelectPet }) => {
  const [selectedGender, setSelectedGender] = useState<'masc' | 'fem'>('masc');
  const [outfitColor, setOutfitColor] = useState('bg-violet-600');

  if (!isOpen) return null;

  const avatars = ['🐉', '🦊', '🦅', '🐺', '🦁', '🤖'];
  const colors = ['bg-violet-600', 'bg-emerald-600', 'bg-fuchsia-600', 'bg-blue-600'];

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-6 shadow-2xl">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="font-black text-lg text-white">3D Avatar & Companion Studio</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-bold text-sm">✕ Close</button>
        </div>

        {/* Live Preview Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center space-y-3">
          <div className={`w-24 h-24 rounded-full ${outfitColor} flex items-center justify-center text-4xl shadow-lg ring-4 ring-slate-800`}>
            {selectedGender === 'masc' ? '👨‍🎓' : '👩‍🎓'}
          </div>
          <span className="text-xs font-bold text-violet-400">Equipped Companion: {currentPet}</span>
        </div>

        {/* Customization Controls */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-2">Base Model</label>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedGender('masc')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold ${selectedGender === 'masc' ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-400'}`}
              >
                Masc Scholar
              </button>
              <button
                onClick={() => setSelectedGender('fem')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold ${selectedGender === 'fem' ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-400'}`}
              >
                Fem Scholar
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 block mb-2">Aura Color</label>
            <div className="flex gap-2">
              {colors.map((c) => (
                <button key={c} onClick={() => setOutfitColor(c)} className={`w-8 h-8 rounded-full ${c} ring-2 ring-slate-700`} />
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 block mb-2">Select Companion Pet</label>
            <div className="flex gap-2">
              {avatars.map((a) => (
                <button
                  key={a}
                  onClick={() => onSelectPet(a)}
                  className={`p-2.5 rounded-xl border text-xl ${currentPet === a ? 'border-violet-500 bg-violet-950' : 'border-slate-800 bg-slate-950'}`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button onClick={onClose} className="w-full bg-violet-600 hover:bg-violet-500 font-bold py-3 rounded-xl text-xs text-white transition">
          Save Avatar Settings
        </button>
      </div>
    </div>
  );
};
