import React, { useState, useEffect } from 'react';
import { X, Moon, Zap, Shield, Bell, Flame } from 'lucide-react';
import type { ThemeType, UserSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('scholartrack_settings');
    return saved ? JSON.parse(saved) : {
      theme: 'dark',
      publicStreak: true,
      xpNotifications: true,
      dailyGoalMins: 15,
    };
  });

  useEffect(() => {
    localStorage.setItem('scholartrack_settings', JSON.stringify(settings));
    document.documentElement.setAttribute('data-theme', settings.theme);
  }, [settings]);

  if (!isOpen) return null;

  const themes: { id: ThemeType; label: string; previewClass: string }[] = [
    { id: 'dark', label: 'Default Dark', previewClass: 'bg-slate-900 border-slate-700' },
    { id: 'oled', label: 'True OLED Black', previewClass: 'bg-black border-zinc-800' },
    { id: 'cyberpunk', label: 'Cyberpunk Neon', previewClass: 'bg-[#0f051d] border-[#ff007f]' },
    { id: 'synthwave', label: 'Synthwave 80s', previewClass: 'bg-[#1a103c] border-[#f43f5e]' },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 text-slate-100 rounded-2xl max-w-lg w-full p-6 border border-slate-800 shadow-2xl relative">
        <div className="flex justify-between items-center pb-4 border-b border-slate-800">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span>App Settings</span>
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6 mt-5 max-h-[70vh] overflow-y-auto pr-1">
          {/* Theme Switcher */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-3 flex items-center gap-1.5">
              <Moon size={14} /> Theme Style
            </label>
            <div className="grid grid-cols-2 gap-3">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSettings({ ...settings, theme: t.id })}
                  className={`p-3 rounded-xl border text-left flex items-center justify-between transition ${
                    settings.theme === t.id ? 'border-indigo-500 ring-2 ring-indigo-500/30' : 'border-slate-800 hover:border-slate-700'
                  } ${t.previewClass}`}
                >
                  <span className="text-xs font-medium">{t.label}</span>
                  {settings.theme === t.id && <Zap size={14} className="text-indigo-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Social & Streak Options */}
          <div className="pt-4 border-t border-slate-800">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-3 flex items-center gap-1.5">
              <Flame size={14} className="text-amber-500" /> Social & Streaks (Duolingo Style)
            </label>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-800/40 rounded-xl border border-slate-800">
                <div>
                  <p className="text-xs font-medium text-slate-200">Share My Streak & XP</p>
                  <p className="text-[11px] text-slate-500">Allow friends to see your daily streak and level-ups</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.publicStreak}
                  onChange={(e) => setSettings({ ...settings, publicStreak: e.target.checked })}
                  className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-800/40 rounded-xl border border-slate-800">
                <div>
                  <p className="text-xs font-medium text-slate-200">Friend XP Activity Alerts</p>
                  <p className="text-[11px] text-slate-500">Get notified when your friends finish study sessions</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.xpNotifications}
                  onChange={(e) => setSettings({ ...settings, xpNotifications: e.target.checked })}
                  className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition"
        >
          Save & Apply
        </button>
      </div>
    </div>
  );
};