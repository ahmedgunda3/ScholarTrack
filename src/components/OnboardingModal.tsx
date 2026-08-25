import React, { useState } from 'react';

type DeviceType = 'mobile' | 'pc' | 'tablet';

interface OnboardingModalProps {
  onComplete: (data: { device: DeviceType; avatar: string; subjectGoal: string }) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>('pc');
  const [selectedAvatar, setSelectedAvatar] = useState<string>('🤖 AI Bot');
  const [subjectGoal, setSubjectGoal] = useState<string>('');

  const avatarOptions = [
    { id: 'bot', name: '🤖 Scholar Bot', label: 'Tech & Math Focus' },
    { id: 'tutor_m', name: '👨‍🏫 Professor Alex', label: 'Humanities & History' },
    { id: 'tutor_f', name: '👩‍🔬 Dr. Sarah', label: 'Sciences & Research' },
    { id: 'cyber', name: '⚡ Spark AI', label: 'Quick Study & Flashcards' },
  ];

  const handleNextStep = () => {
    if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
    else {
      onComplete({
        device: selectedDevice,
        avatar: selectedAvatar,
        subjectGoal,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-8 shadow-2xl animate-fadeIn space-y-6">
        
        {/* Progress Indicator */}
        <div className="flex items-center justify-between text-xs text-slate-400 font-bold border-b border-slate-800 pb-4">
          <span>STEP {step} OF 3</span>
          <div className="flex gap-1.5">
            <span className={`w-8 h-1.5 rounded-full ${step >= 1 ? 'bg-violet-600' : 'bg-slate-800'}`} />
            <span className={`w-8 h-1.5 rounded-full ${step >= 2 ? 'bg-violet-600' : 'bg-slate-800'}`} />
            <span className={`w-8 h-1.5 rounded-full ${step === 3 ? 'bg-violet-600' : 'bg-slate-800'}`} />
          </div>
        </div>

        {/* STEP 1: Device Selection */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl font-black text-white">Choose Your Device Layout</h2>
              <p className="text-xs text-slate-400 mt-1">
                Select your primary screen setup so ScholarTrack optimizes the UI layout for your workspace.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'mobile' as DeviceType, icon: '📱', label: 'Mobile', desc: 'Compact vertical view' },
                { id: 'tablet' as DeviceType, icon: '📱', label: 'Tablet', desc: 'Medium flexible grid' },
                { id: 'pc' as DeviceType, icon: '💻', label: 'PC / Laptop', desc: 'Full widescreen layout' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedDevice(item.id)}
                  className={`p-5 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-2 ${
                    selectedDevice === item.id
                      ? 'bg-violet-600/20 border-violet-500 text-white shadow-lg'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-3xl">{item.icon}</span>
                  <span className="text-xs font-bold text-white">{item.label}</span>
                  <span className="text-[10px] text-slate-500">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Avatar Selection */}
        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl font-black text-white">Select Your AI Tutor Avatar</h2>
              <p className="text-xs text-slate-400 mt-1">
                Pick a tutor personality to guide your study sessions and render video explanations.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {avatarOptions.map((avatar) => (
                <button
                  key={avatar.id}
                  type="button"
                  onClick={() => setSelectedAvatar(avatar.name)}
                  className={`p-4 rounded-2xl border text-left transition ${
                    selectedAvatar === avatar.name
                      ? 'bg-violet-600/20 border-violet-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="text-2xl mb-1">{avatar.name.split(' ')[0]}</div>
                  <div className="text-xs font-bold text-white">{avatar.name.substring(2)}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{avatar.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Initial Setup Questions */}
        {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl font-black text-white">Quick Preferences</h2>
              <p className="text-xs text-slate-400 mt-1">
                What major subjects or exam goals are you focusing on right now?
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-xs text-slate-300 font-bold block">Primary Study Focus</label>
              <input
                type="text"
                value={subjectGoal}
                onChange={(e) => setSubjectGoal(e.target.value)}
                placeholder="e.g. Calculus II, Physics, Biology, History..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-800">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => (prev - 1) as 1 | 2 | 3)}
              className="text-xs text-slate-400 hover:text-white font-bold"
            >
              ← Back
            </button>
          ) : (
            <span />
          )}

          <button
            type="button"
            onClick={handleNextStep}
            className="bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold px-6 py-3 rounded-xl transition shadow-lg active:scale-95"
          >
            {step === 3 ? 'Finish & Start Studying 🎉' : 'Continue →'}
          </button>
        </div>

      </div>
    </div>
  );
};
