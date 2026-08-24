import React, { useState } from 'react';
import { X, Sparkles, User, Palette } from 'lucide-react';
import type { AvatarConfig } from '../types';
import { AvatarDisplay } from './AvatarDisplay';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  config: AvatarConfig;
  onSave: (newConfig: AvatarConfig) => void;
}

const SKIN_TONES = ['#f3d299', '#f8d5c2', '#e0ac69', '#c68642', '#8d5524', '#462b18'];
const HAIR_COLORS = ['#1e1b18', '#3b2314', '#a55728', '#d4a359', '#64748b', '#dc2626', '#4f46e5'];
const OUTFIT_COLORS = ['#4f46e5', '#0284c7', '#059669', '#dc2626', '#d97706', '#475569', '#9333ea'];

export const AvatarCustomizerModal: React.FC<Props> = ({ isOpen, onClose, config, onSave }) => {
  const [draft, setDraft] = useState<AvatarConfig>({ ...config });

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(draft);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl">
              <User size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Avatar Studio</h2>
              <p className="text-xs text-slate-400">Customize your student persona</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-100 rounded-xl hover:bg-slate-800">
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Live Preview Column */}
          <div className="flex flex-col items-center justify-center bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-4 text-center">
            <AvatarDisplay config={draft} size={140} />
            <div>
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Live Preview</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Appears on your streak widget & dashboard</p>
            </div>
          </div>

          {/* Configuration Controls */}
          <div className="md:col-span-2 space-y-4">
            {/* Hairstyle Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Sparkles size={13} className="text-amber-400" /> Hairstyle:
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['curly', 'afro', 'dreads', 'short', 'spiky', 'buzz', 'long', 'none'] as const).map((style) => (
                  <button
                    key={style}
                    onClick={() => setDraft({ ...draft, hairStyle: style })}
                    className={`px-2 py-1.5 rounded-xl text-xs capitalize transition ${
                      draft.hairStyle === style
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Hair Color */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Palette size={13} className="text-indigo-400" /> Hair Color:
              </label>
              <div className="flex flex-wrap gap-2">
                {HAIR_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setDraft({ ...draft, hairColor: color })}
                    className={`w-7 h-7 rounded-full border-2 transition ${
                      draft.hairColor === color ? 'border-indigo-400 scale-110' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Skin Color */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Skin Tone:</label>
              <div className="flex flex-wrap gap-2">
                {SKIN_TONES.map((color) => (
                  <button
                    key={color}
                    onClick={() => setDraft({ ...draft, skinColor: color })}
                    className={`w-7 h-7 rounded-full border-2 transition ${
                      draft.skinColor === color ? 'border-indigo-400 scale-110' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Expression */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Expression:</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['happy', 'confident', 'focused', 'cool', 'wink'] as const).map((exp) => (
                  <button
                    key={exp}
                    onClick={() => setDraft({ ...draft, expression: exp })}
                    className={`px-2 py-1.5 rounded-xl text-xs capitalize transition ${
                      draft.expression === exp
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {exp}
                  </button>
                ))}
              </div>
            </div>

            {/* Outfit Style & Color */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Outfit & Color:</label>
              <div className="grid grid-cols-4 gap-1.5 mb-2">
                {(['hoodie', 'tshirt', 'blazer', 'sweater'] as const).map((o) => (
                  <button
                    key={o}
                    onClick={() => setDraft({ ...draft, outfit: o })}
                    className={`px-2 py-1.5 rounded-xl text-xs capitalize transition ${
                      draft.outfit === o
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {OUTFIT_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setDraft({ ...draft, outfitColor: color })}
                    className={`w-7 h-7 rounded-full border-2 transition ${
                      draft.outfitColor === color ? 'border-indigo-400 scale-110' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Accessories (Glasses & Headwear) */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Glasses:</label>
                <select
                  value={draft.glasses}
                  onChange={(e) => setDraft({ ...draft, glasses: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="none">None</option>
                  <option value="round">Round Glasses</option>
                  <option value="square">Square Frame</option>
                  <option value="sunglasses">Sunglasses</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Headwear:</label>
                <select
                  value={draft.headwear}
                  onChange={(e) => setDraft({ ...draft, headwear: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="none">None</option>
                  <option value="cap">Baseball Cap</option>
                  <option value="beanie">Beanie</option>
                  <option value="gradCap">Graduation Cap</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-800 pt-4">
          <button onClick={onClose} className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            <Sparkles size={14} /> Save Avatar
          </button>
        </div>
      </div>
    </div>
  );
};
