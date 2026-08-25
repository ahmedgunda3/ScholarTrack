import React, { useState } from 'react';

interface DashboardProps {
  xp: number;
  addXp: (amount: number) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ xp, addXp }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Complete Calculus Problem Set #4', due: 'Today 11:59 PM', tag: 'bg-rose-500/20 text-rose-300 border-rose-500/30', completed: false },
    { id: 2, title: 'Review Organic Chemistry Flashcards', due: 'Tomorrow', tag: 'bg-amber-500/20 text-amber-300 border-amber-500/30', completed: false },
    { id: 3, title: 'Submit AP Physics Lab Report', due: 'In 3 Days', tag: 'bg-sky-500/20 text-sky-300 border-sky-500/30', completed: false },
  ]);

  const quizOptions = ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'];
  const correctAnswer = 'O(log n)';

  const handleSelectAnswer = (option: string) => {
    if (selectedAnswer) return;
    setSelectedAnswer(option);
    if (option === correctAnswer) {
      addXp(50);
    }
  };

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const remainingTasks = tasks.filter(t => !t.completed).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* WELCOME BANNER */}
      <div className="relative overflow-hidden bg-gradient-to-r from-violet-950/60 via-slate-900 to-indigo-950/60 border border-violet-500/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl backdrop-blur-md">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            Welcome back, Scholar! 👋
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-lg">
            Your study momentum is high this week. Keep going!
          </p>
        </div>

        <div className="px-6 py-3.5 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl shadow-lg shadow-violet-600/30 border border-violet-400/30 flex items-center gap-3 shrink-0 hover:scale-105 transition-transform">
          <span className="text-2xl">🔥</span>
          <div>
            <p className="text-[10px] font-black uppercase text-violet-200 tracking-wider">Streak</p>
            <p className="text-lg font-black text-white leading-none">7 Days</p>
          </div>
        </div>
      </div>

      {/* DAILY CHECK: KNOWLEDGE PROMPT */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-md space-y-4 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 bg-violet-500/20 text-violet-300 border border-violet-500/30 rounded-xl">
            DAILY CHECK: KNOWLEDGE PROMPT
          </span>
          {selectedAnswer && (
            <span className="text-xs font-bold text-emerald-400 animate-pulse">
              {selectedAnswer === correctAnswer ? 'Correct! +50 XP' : 'Incorrect choice'}
            </span>
          )}
        </div>

        <h3 className="text-base sm:text-lg font-bold text-white">
          What is the time complexity of searching an element in a balanced Binary Search Tree (BST)?
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quizOptions.map((opt) => {
            const isSelected = selectedAnswer === opt;
            const isCorrect = opt === correctAnswer;
            let btnStyle = 'bg-slate-800/60 border-slate-700/80 text-slate-200 hover:border-violet-500 hover:bg-slate-800';

            if (selectedAnswer) {
              if (isCorrect) btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-500/20';
              else if (isSelected) btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
            }

            return (
              <button
                key={opt}
                onClick={() => handleSelectAnswer(opt)}
                className={`py-3 px-4 rounded-2xl border font-bold text-xs sm:text-sm transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer ${btnStyle}`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* STATS METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 backdrop-blur-md hover:border-slate-700 transition-all hover:-translate-y-1 duration-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-slate-400">Current Break</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Personal Best 🔥</span>
          </div>
          <p className="text-2xl font-black text-white">7 Days</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 backdrop-blur-md hover:border-slate-700 transition-all hover:-translate-y-1 duration-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-slate-400">Total Scholar XP</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-violet-500/20 text-violet-300 border border-violet-500/30">+150 XP this wk</span>
          </div>
          <p className="text-2xl font-black text-white">{xp.toLocaleString()} XP</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 backdrop-blur-md hover:border-slate-700 transition-all hover:-translate-y-1 duration-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-slate-400">Study Time</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/30">Top 12%</span>
          </div>
          <p className="text-2xl font-black text-white">18.5 hrs</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 backdrop-blur-md hover:border-slate-700 transition-all hover:-translate-y-1 duration-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-slate-400">Global Rank</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">Scholar Tier 🏆</span>
          </div>
          <p className="text-2xl font-black text-white">#84</p>
        </div>
      </div>

      {/* BOTTOM SECTION: TASKS & WEEKLY CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* UPCOMING TASKS */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              📌 Upcoming Tasks & Deadlines
            </h3>
            <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-violet-500/20 text-violet-300 border border-violet-500/30">
              {remainingTasks} Remaining
            </span>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  task.completed 
                    ? 'bg-slate-900/30 border-slate-800/50 opacity-50 line-through' 
                    : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/80 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => {}}
                    className="w-4 h-4 accent-violet-600 rounded cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-200">{task.title}</span>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-xl border ${task.tag}`}>
                  {task.due}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* WEEKLY PACE GRAPH */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-md space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              📊 Weekly Pace
            </h3>
            <span className="text-xs font-bold text-slate-400">Target: 20h</span>
          </div>

          <div className="grid grid-cols-7 gap-2 items-end h-40 pt-6">
            {[
              { day: 'M', h: 60, val: '2.5h' },
              { day: 'T', h: 80, val: '3.8h' },
              { day: 'W', h: 45, val: '1.9h' },
              { day: 'T', h: 90, val: '4.2h' },
              { day: 'F', h: 70, val: '3.1h' },
              { day: 'S', h: 50, val: '2.0h' },
              { day: 'S', h: 30, val: '1.0h' },
            ].map((bar, i) => (
              <div key={i} className="flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {bar.val}
                </span>
                <div 
                  style={{ height: `${bar.h}%` }}
                  className="w-full bg-gradient-to-t from-violet-700 to-indigo-500 rounded-xl group-hover:brightness-125 transition-all shadow-md shadow-violet-600/20"
                />
                <span className="text-xs font-bold text-slate-400">{bar.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
