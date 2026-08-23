import React, { useState } from 'react';

interface OnboardingModalProps {
  onComplete: (profileData: UserProfile) => void;
}

export interface UserProfile {
  educationLevel: string;
  referralSource: string;
  dailyGoal: string;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete }) => {
  const [educationLevel, setEducationLevel] = useState('High School');
  const [referralSource, setReferralSource] = useState('Social Media');
  const [dailyGoal, setDailyGoal] = useState('15 mins');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const profileData: UserProfile = { educationLevel, referralSource, dailyGoal };
    localStorage.setItem('scholartrack_user_profile', JSON.stringify(profileData));
    onComplete(profileData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 shadow-2xl border border-gray-100 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome to ScholarTrack! 👋</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Customize your study experience in 3 quick questions.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1">
              Education Level / Grade
            </label>
            <select
              value={educationLevel}
              onChange={(e) => setEducationLevel(e.target.value)}
              className="w-full p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="Primary / Elementary">Primary / Elementary</option>
              <option value="Middle School / Junior High">Middle School / Junior High</option>
              <option value="High School / Secondary">High School / Secondary</option>
              <option value="Undergraduate">Undergraduate / University</option>
              <option value="Postgraduate / Master's">Postgraduate / Master's</option>
              <option value="Self-Learner">Self-Learner</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1">
              Where did you hear about us?
            </label>
            <select
              value={referralSource}
              onChange={(e) => setReferralSource(e.target.value)}
              className="w-full p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="Social Media">Social Media (X, TikTok, Instagram)</option>
              <option value="Friend or Classmate">Friend or Classmate</option>
              <option value="Search Engine">Search Engine (Google, Bing)</option>
              <option value="YouTube">YouTube</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1">
              Target Daily Usage Goal
            </label>
            <select
              value={dailyGoal}
              onChange={(e) => setDailyGoal(e.target.value)}
              className="w-full p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="15 mins">15 minutes / day</option>
              <option value="30 mins">30 minutes / day</option>
              <option value="45 mins">45 minutes / day</option>
              <option value="60+ mins">60+ minutes / day</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition duration-200"
          >
            Start Learning
          </button>
        </form>
      </div>
    </div>
  );
};