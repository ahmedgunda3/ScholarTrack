import React, { useState, useEffect } from 'react';

export interface PetStyle {
  id: string;
  name: string;
  color: string;
  bgGradient: string;
}

export interface Pet {
  id: string;
  name: string;
  title: string;
  element: string;
  icon: string;
  description: string;
  styles: PetStyle[];
  evolutionStages: { stage: string; minLevel: number; perk: string }[];
}

const PETS_ROSTER: Pet[] = [
  {
    id: 'ignis',
    name: 'Ignis',
    title: 'The Flame Dragon',
    element: 'Fire',
    icon: '🐉',
    description: 'Hatches as a fiery shoulder drake and matures into an armored inferno titan.',
    styles: [
      { id: 'default', name: 'Original Crimson', color: '#ef4444', bgGradient: 'from-red-900/40 via-orange-950/40 to-slate-950' },
      { id: 'frost', name: 'Frostfire Blue', color: '#38bdf8', bgGradient: 'from-cyan-900/40 via-blue-950/40 to-slate-950' },
      { id: 'shadow', name: 'Neon Shadow', color: '#a855f7', bgGradient: 'from-purple-900/40 via-fuchsia-950/40 to-slate-950' },
      { id: 'gold', name: 'Mythic Gold', color: '#eab308', bgGradient: 'from-amber-900/40 via-yellow-950/40 to-slate-950' },
    ],
    evolutionStages: [
      { stage: 'Baby Hatchling', minLevel: 1, perk: 'Base XP Boost (+5%)' },
      { stage: 'Juvenile Drake', minLevel: 6, perk: 'Flame Trail Unlocked' },
      { stage: 'Adult Dragon', minLevel: 16, perk: 'Shoulder Mount Toggle' },
      { stage: 'Mythic Titan', minLevel: 31, perk: 'Golden Aura & 2x Quiz XP' },
    ],
  },
  {
    id: 'athena',
    name: 'Athena',
    title: 'The Cyber-Owl',
    element: 'Tech',
    icon: '🦉',
    description: 'Holographic companion equipped with analytical visors and rune energy.',
    styles: [
      { id: 'default', name: 'Cyber Teal', color: '#06b6d4', bgGradient: 'from-cyan-900/40 via-slate-950 to-slate-950' },
      { id: 'overdrive', name: 'Red Overdrive', color: '#f43f5e', bgGradient: 'from-rose-900/40 via-slate-950 to-slate-950' },
    ],
    evolutionStages: [
      { stage: 'Fledgling Drone', minLevel: 1, perk: 'Flashcard Speed Bonus' },
      { stage: 'Rune Sentinel', minLevel: 6, perk: 'Holo-Visor Unlocked' },
      { stage: 'Cyber Sovereign', minLevel: 16, perk: 'Floating Companion Mode' },
      { stage: 'Omni Titan', minLevel: 31, perk: 'Auto-Study Multiplier' },
    ],
  },
  {
    id: 'kitsune',
    name: 'Kitsune',
    title: 'The Spirit Fox',
    element: 'Arcane',
    icon: '🦊',
    description: 'Grows glowing ethereal tails and mystical spell rings as study streaks increase.',
    styles: [
      { id: 'default', name: 'Spirit Violet', color: '#c084fc', bgGradient: 'from-violet-900/40 via-slate-950 to-slate-950' },
      { id: 'emerald', name: 'Jade Spirit', color: '#10b981', bgGradient: 'from-emerald-900/40 via-slate-950 to-slate-950' },
    ],
    evolutionStages: [
      { stage: 'Single Tail', minLevel: 1, perk: 'Daily Streak Protection' },
      { stage: 'Three Tails', minLevel: 6, perk: 'Ethereal Trail Unlocked' },
      { stage: 'Six Tails', minLevel: 16, perk: 'Arcane Shield Aura' },
      { stage: 'Nine-Tailed Myth', minLevel: 31, perk: '3x Exam XP Multiplier' },
    ],
  },
];

interface OnboardingAnswers {
  targetSubject: string;
  dailyGoalMinutes: number;
  avatarStyle: string;
}

export const PetStudio: React.FC = () => {
  // Gamification State
  const [xp, setXp] = useState<number>(() => Number(localStorage.getItem('st_xp') || 240));
  const [selectedPetId, setSelectedPetId] = useState<string>(() => localStorage.getItem('st_pet') || 'ignis');
  const [selectedStyleId, setSelectedStyleId] = useState<string>('default');
  const [isOnboarded, setIsOnboarded] = useState<boolean>(() => localStorage.getItem('st_onboarded') === 'true');
  
  // Onboarding Step State
  const [onboardingStep, setOnboardingStep] = useState<number>(1);
  const [answers, setAnswers] = useState<OnboardingAnswers>({
    targetSubject: 'Computer Science',
    dailyGoalMinutes: 30,
    avatarStyle: 'Cyber Neon',
  });

  // Daily Quests State
  const [quests, setQuests] = useState([
    { id: 1, text: 'Complete 1 Audio Lesson', xpReward: 150, done: false },
    { id: 2, text: 'Review 10 Flashcards', xpReward: 100, done: true },
    { id: 3, text: 'Pass 1 Practice Exam Paper', xpReward: 250, done: false },
  ]);

  useEffect(() => {
    localStorage.setItem('st_xp', xp.toString());
    localStorage.setItem('st_pet', selectedPetId);
    localStorage.setItem('st_onboarded', isOnboarded.toString());
  }, [xp, selectedPetId, isOnboarded]);

  // Math Calculations for Level Progression (500 XP per Level)
  const currentLevel = Math.floor(xp / 500) + 1;
  const currentLevelXp = xp % 500;
  const progressPercent = Math.min(100, Math.floor((currentLevelXp / 500) * 100));

  const currentPet = PETS_ROSTER.find((p) => p.id === selectedPetId) || PETS_ROSTER[0];
  const activeStyle = currentPet.styles.find((s) => s.id === selectedStyleId) || currentPet.styles[0];

  // Determine Active Evolution Stage
  const currentStage =
    [...currentPet.evolutionStages].reverse().find((s) => currentLevel >= s.minLevel) || currentPet.evolutionStages[0];

  const handleGainXp = (amount: number) => {
    setXp((prev) => prev + amount);
  };

  const handleCompleteQuest = (id: number, reward: number) => {
    setQuests((prev) =>
      prev.map((q) => (q.id === id ? { ...q, done: true } : q))
    );
    handleGainXp(reward);
  };

  const handleFinishOnboarding = () => {
    setIsOnboarded(true);
    handleGainXp(200); // Starter bonus XP
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 text-slate-100 font-sans">
      {/* FIRST-TIME ONBOARDING OVERLAY */}
      {!isOnboarded && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-8 shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold text-violet-400 tracking-wider uppercase">Welcome to ScholarTrack</span>
                <h2 className="text-2xl font-black">Hunter Diagnostic Setup</h2>
              </div>
              <span className="text-xs bg-slate-800 px-3 py-1 rounded-full font-bold">Step {onboardingStep} of 3</span>
            </div>

            {onboardingStep === 1 && (
              <div className="space-y-4">
                <p className="text-sm text-slate-300">Set your primary study focus to calibrate your daily XP quests:</p>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Target Subject Focus</label>
                  <input
                    type="text"
                    value={answers.targetSubject}
                    onChange={(e) => setAnswers({ ...answers, targetSubject: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Daily Study Target (Minutes)</label>
                  <select
                    value={answers.dailyGoalMinutes}
                    onChange={(e) => setAnswers({ ...answers, dailyGoalMinutes: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500"
                  >
                    <option value={15}>15 Mins / Day (Casual)</option>
                    <option value={30}>30 Mins / Day (Grind)</option>
                    <option value={60}>60 Mins / Day (Hardcore)</option>
                  </select>
                </div>
                <button
                  onClick={() => setOnboardingStep(2)}
                  className="w-full bg-violet-600 hover:bg-violet-500 font-bold py-3 rounded-xl text-sm transition"
                >
                  Next: Customize 3D Avatar →
                </button>
              </div>
            )}

            {onboardingStep === 2 && (
              <div className="space-y-4">
                <p className="text-sm text-slate-300">Select your student avatar archetype:</p>
                <div className="grid grid-cols-3 gap-3">
                  {['Cyber Neon', 'Academic Scholar', 'Streetwear Gamer'].map((style) => (
                    <div
                      key={style}
                      onClick={() => setAnswers({ ...answers, avatarStyle: style })}
                      className={`p-4 rounded-2xl border text-center cursor-pointer transition ${answers.avatarStyle === style ? 'border-violet-500 bg-violet-950/40' : 'border-slate-800 bg-slate-950'}`}
                    >
                      <div className="text-3xl mb-2">{style.includes('Cyber') ? '⚡' : style.includes('Academic') ? '🎓' : '🎧'}</div>
                      <span className="text-xs font-bold block">{style}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setOnboardingStep(1)} className="px-4 py-3 bg-slate-800 rounded-xl text-xs font-bold">Back</button>
                  <button onClick={() => setOnboardingStep(3)} className="flex-1 bg-violet-600 hover:bg-violet-500 font-bold py-3 rounded-xl text-sm transition">
                    Next: Pick Starter Companion →
                  </button>
                </div>
              </div>
            )}

            {onboardingStep === 3 && (
              <div className="space-y-4">
                <p className="text-sm text-slate-300">Choose your starter elemental pet:</p>
                <div className="grid grid-cols-3 gap-3">
                  {PETS_ROSTER.map((pet) => (
                    <div
                      key={pet.id}
                      onClick={() => setSelectedPetId(pet.id)}
                      className={`p-4 rounded-2xl border text-center cursor-pointer transition ${selectedPetId === pet.id ? 'border-violet-500 bg-violet-950/40 ring-2 ring-violet-500/50' : 'border-slate-800 bg-slate-950'}`}
                    >
                      <div className="text-4xl mb-2">{pet.icon}</div>
                      <span className="text-xs font-bold block">{pet.name}</span>
                      <span className="text-[10px] text-slate-400 block">{pet.element}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleFinishOnboarding}
                  className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold py-3.5 rounded-xl text-sm transition shadow-lg"
                >
                  🚀 Enter Battle Pass & Claim +200 XP
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TOP STATS & BATTLE PASS LEVEL HEADER */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center font-black text-2xl shadow-lg border border-violet-400/30">
              {currentLevel}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-violet-400 tracking-wider uppercase">Level Pass</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md font-semibold">Active Season 1</span>
              </div>
              <h1 className="text-xl font-black">Level {currentLevel} Scholar</h1>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
            <div className="px-3 py-1 bg-violet-950/60 border border-violet-500/30 rounded-xl text-center">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Total XP</span>
              <span className="text-xs font-black text-violet-300">{xp} XP</span>
            </div>
            <button
              onClick={() => setIsOnboarded(false)}
              className="text-xs bg-slate-800 hover:bg-slate-700 font-bold px-3 py-2 rounded-xl transition"
            >
              ⚙️ Setup
            </button>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-slate-400">
            <span>Level Progress</span>
            <span>{currentLevelXp} / 500 XP to Lvl {currentLevel + 1}</span>
          </div>
          <div className="w-full h-4 bg-slate-950 rounded-full border border-slate-800 overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-emerald-400 rounded-full transition-all duration-500 shadow-lg"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* MAIN PET SHOWCASE & CUSTOMIZATION GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 3D Stage / Pet Display */}
        <div className={`lg:col-span-2 bg-gradient-to-b ${activeStyle.bgGradient} border border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-between min-h-[420px] relative overflow-hidden shadow-2xl`}>
          {/* Top Stage Overlay */}
          <div className="w-full flex justify-between items-center z-10">
            <div className="bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 backdrop-blur-md">
              <span>⚡ {currentPet.element} Elemental</span>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Stage: {currentStage.stage}</span>
            </div>
          </div>

          {/* Avatar & Pet Animated Stage Rendering */}
          <div className="relative my-8 flex items-center justify-center">
            {/* Glowing Aura Effect */}
            <div
              className="absolute w-56 h-56 rounded-full opacity-30 blur-3xl animate-pulse"
              style={{ backgroundColor: activeStyle.color }}
            />

            {/* Stage Pedestal */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="text-8xl mb-2 animate-bounce transform duration-1000 select-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
                {currentPet.icon}
              </div>
              <div className="w-32 h-4 bg-black/60 rounded-full blur-md" />
            </div>
          </div>

          {/* Bottom Stage Info */}
          <div className="w-full bg-slate-950/80 border border-slate-800 p-4 rounded-2xl backdrop-blur-md flex justify-between items-center z-10">
            <div>
              <h3 className="font-black text-base flex items-center gap-2">
                <span>{currentPet.name}</span>
                <span className="text-xs text-slate-400 font-normal">({activeStyle.name})</span>
              </h3>
              <p className="text-xs text-emerald-400 font-semibold">Active Perk: {currentStage.perk}</p>
            </div>
            
            {/* Simulation XP Test Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => handleGainXp(50)}
                className="bg-violet-600/80 hover:bg-violet-600 text-xs font-bold px-3 py-2 rounded-xl transition"
              >
                +50 XP (Quiz)
              </button>
              <button
                onClick={() => handleGainXp(150)}
                className="bg-emerald-600/80 hover:bg-emerald-600 text-xs font-bold px-3 py-2 rounded-xl transition"
              >
                +150 XP (Exam Pass)
              </button>
            </div>
          </div>
        </div>

        {/* CUSTOMIZATION PANEL & QUESTS */}
        <div className="space-y-6">
          
          {/* Edit Styles & Pet Switcher */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="font-bold text-sm text-slate-300">🎨 Edit Styles & Companion Switch</h3>
            
            {/* Select Active Pet */}
            <div className="grid grid-cols-3 gap-2">
              {PETS_ROSTER.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { setSelectedPetId(p.id); setSelectedStyleId('default'); }}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition ${selectedPetId === p.id ? 'border-violet-500 bg-violet-950/50' : 'border-slate-800 bg-slate-950 hover:border-slate-700'}`}
                >
                  <span className="text-xl">{p.icon}</span>
                  <span className="truncate w-full text-center">{p.name}</span>
                </button>
              ))}
            </div>

            {/* Select Color Style Variant */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-xs font-bold text-slate-400 block">Style Edit Variants</span>
              <div className="flex flex-wrap gap-2">
                {currentPet.styles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyleId(style.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition ${selectedStyleId === style.id ? 'border-violet-500 bg-slate-950' : 'border-slate-800 bg-slate-950 opacity-60'}`}
                  >
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: style.color }} />
                    {style.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Daily Quests Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-slate-300">🎯 Daily XP Quests</h3>
              <span className="text-[10px] bg-violet-950 border border-violet-500/30 text-violet-400 px-2 py-0.5 rounded-md font-bold">Resets Daily</span>
            </div>

            <div className="space-y-2">
              {quests.map((q) => (
                <div key={q.id} className="bg-slate-950 border border-slate-800 p-3 rounded-2xl flex justify-between items-center text-xs">
                  <div className="space-y-0.5">
                    <p className={`font-semibold ${q.done ? 'line-through text-slate-500' : 'text-slate-200'}`}>{q.text}</p>
                    <span className="text-emerald-400 font-bold">+{q.xpReward} XP</span>
                  </div>
                  <button
                    disabled={q.done}
                    onClick={() => handleCompleteQuest(q.id, q.xpReward)}
                    className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 disabled:bg-slate-800 disabled:text-slate-600 font-bold rounded-xl transition"
                  >
                    {q.done ? 'Claimed ✓' : 'Claim'}
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
