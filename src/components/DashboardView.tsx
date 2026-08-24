import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, TrendingUp, Clock, CheckSquare, Award, Plus, Zap, Sparkles, Calendar, Trash2, Target, FileText, Upload, ExternalLink, X } from 'lucide-react';
import type { Assignment, GrowthPoint, StudySource, AttachedSource, UserGamification, AvatarConfig } from '../types';
import { StreakXpWidget } from './StreakXpWidget';

export const DashboardView: React.FC = () => {
  const [gamification, setGamification] = useState<UserGamification>(() => {
    const saved = localStorage.getItem('scholartrack_gamification');
    const today = new Date().toISOString().split('T')[0];
    if (saved) {
      const parsed: UserGamification = JSON.parse(saved);
      if (parsed.lastActiveDate !== today) {
        const lastDate = new Date(parsed.lastActiveDate);
        const currDate = new Date(today);
        const diffDays = Math.round((currDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
        
        let newStreak = parsed.streakDays;
        let newFreezes = parsed.streakFreezeCount;

        if (diffDays === 1) {
          newStreak += 1;
        } else if (diffDays > 1) {
          if (newFreezes > 0) {
            newFreezes -= 1;
          } else {
            newStreak = 1;
          }
        }
        return {
          ...parsed,
          streakDays: newStreak,
          streakFreezeCount: newFreezes,
          lastActiveDate: today,
          dailyXpEarned: 0,
        };
      }
      return parsed;
    }
    return {
      xp: 120,
      level: 1,
      streakDays: 3,
      lastActiveDate: today,
      dailyXpGoal: 50,
      dailyXpEarned: 20,
      streakFreezeCount: 1,
      avatarConfig: {
        skinColor: '#f3d299',
        hairStyle: 'curly',
        hairColor: '#1e1b18',
        expression: 'confident',
        outfit: 'hoodie',
        outfitColor: '#4f46e5',
        glasses: 'round',
        headwear: 'none',
      },
    };
  });

  useEffect(() => {
    localStorage.setItem('scholartrack_gamification', JSON.stringify(gamification));
  }, [gamification]);

  const addXp = (amount: number) => {
    setGamification((prev) => {
      const totalXp = prev.xp + amount;
      const newLevel = Math.floor(totalXp / 250) + 1;
      return {
        ...prev,
        xp: totalXp,
        level: newLevel,
        dailyXpEarned: prev.dailyXpEarned + amount,
      };
    });
  };

  const handleUpdateAvatar = (newConfig: AvatarConfig) => {
    setGamification((prev) => ({
      ...prev,
      avatarConfig: newConfig,
    }));
  };

  // Timer States
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [customMins, setCustomMins] = useState('');

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    } else if (secondsLeft === 0) {
      setIsActive(false);
      addXp(30);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsLeft]);

  const handleSetTimer = (mins: number) => {
    setIsActive(false);
    setTimerMinutes(mins);
    setSecondsLeft(mins * 60);
  };

  const handleCustomTimerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(customMins, 10);
    if (parsed && parsed > 0) {
      handleSetTimer(parsed);
      setCustomMins('');
    }
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Saved Knowledge Sources
  const [savedSources] = useState<StudySource[]>(() => {
    const saved = localStorage.getItem('scholartrack_sources');
    return saved ? JSON.parse(saved) : [];
  });

  // Assignments & Tasks State
  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem('scholartrack_assignments');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        title: 'Calculus Problem Set 4',
        course: 'Mathematics',
        dueDate: '2026-08-25',
        status: 'Pending',
        category: 'Assignment',
        targetGrade: 'A+',
        attachedSources: [{ name: 'Stewart_Calculus_Ch4.pdf' }, { name: 'Formula_Sheet.pdf' }]
      },
      {
        id: '2',
        title: 'Data Structures Lab Report',
        course: 'Computer Science',
        dueDate: '2026-08-28',
        status: 'Pending',
        category: 'Assignment',
        targetGrade: 'A',
        attachedSources: [{ name: 'DSA_Lab2_Guide.pdf' }]
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('scholartrack_assignments', JSON.stringify(assignments));
  }, [assignments]);

  // Form States
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCourse, setNewCourse] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newTargetGrade, setNewTargetGrade] = useState('A+');
  const [attachedFiles, setAttachedFiles] = useState<AttachedSource[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Study Plan Builder States
  const [isBuildingPlan, setIsBuildingPlan] = useState(false);
  const [planSubject, setPlanSubject] = useState('');
  const [planDays, setPlanDays] = useState('3');
  const [planTargetGrade, setPlanTargetGrade] = useState('A+');

  const handleMultipleFileAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const filePromises = Array.from(files).map((file) => {
      return new Promise<AttachedSource>((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve({
            name: file.name,
            data: event.target?.result as string,
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(filePromises).then((newFiles) => {
      setAttachedFiles((prev) => [...prev, ...newFiles]);
    });
  };

  const addLibrarySourceToTask = (sourceName: string) => {
    if (!sourceName) return;
    if (attachedFiles.some((f) => f.name === sourceName)) return;
    setAttachedFiles((prev) => [...prev, { name: sourceName }]);
  };

  const removeAttachedFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newCourse) return;

    const task: Assignment = {
      id: Date.now().toString(),
      title: newTitle,
      course: newCourse,
      dueDate: newDueDate || new Date().toISOString().split('T')[0],
      status: 'Pending',
      category: 'Assignment',
      targetGrade: newTargetGrade,
      attachedSources: attachedFiles.length > 0 ? attachedFiles : undefined,
    };

    setAssignments([task, ...assignments]);
    addXp(15);
    setNewTitle('');
    setNewCourse('');
    setNewDueDate('');
    setNewTargetGrade('A+');
    setAttachedFiles([]);
    setIsAddingTask(false);
  };

  const addQuickTask = (title: string, defaultCourse = 'General') => {
    const task: Assignment = {
      id: Date.now().toString(),
      title,
      course: defaultCourse,
      dueDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      category: 'Quick Task',
      targetGrade: 'Pass',
    };
    setAssignments([task, ...assignments]);
    addXp(10);
  };

  const handleGenerateStudyPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!planSubject) return;

    const daysCount = parseInt(planDays, 10) || 3;
    const generated: Assignment[] = [];

    const planSteps = [
      'Review core concepts & syllabus key points',
      'Solve practice problems & past quizzes',
      'Create active recall flashcard deck',
      'Conduct timed mock exam / self test',
      'Final weak-point review & summary notes',
    ];

    for (let i = 0; i < Math.min(daysCount, planSteps.length); i++) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + i);

      generated.push({
        id: (Date.now() + i).toString(),
        title: `[Plan Day ${i + 1}] ${planSteps[i]} - ${planSubject}`,
        course: planSubject,
        dueDate: targetDate.toISOString().split('T')[0],
        status: 'Pending',
        category: 'Study Plan',
        targetGrade: planTargetGrade,
      });
    }

    setAssignments([...generated, ...assignments]);
    addXp(25);
    setPlanSubject('');
    setIsBuildingPlan(false);
  };

  const toggleAssignment = (id: string) => {
    setAssignments(
      assignments.map((a) => {
        if (a.id === id) {
          const isNowCompleted = a.status !== 'Completed';
          if (isNowCompleted) {
            addXp(20);
          }
          return { ...a, status: isNowCompleted ? 'Completed' : 'Pending' };
        }
        return a;
      })
    );
  };

  const deleteTask = (id: string) => {
    setAssignments(assignments.filter((a) => a.id !== id));
  };

  const handleOpenAttachedSource = (src: AttachedSource) => {
    if (src.data) {
      const win = window.open();
      if (win) {
        win.document.write(`<iframe src="${src.data}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
      }
    } else {
      alert(`Attached Source: ${src.name}`);
    }
  };

  const growthData: GrowthPoint[] = [
    { day: 'Mon', hours: 2.5, score: 78 },
    { day: 'Tue', hours: 4.0, score: 82 },
    { day: 'Wed', hours: 3.2, score: 85 },
    { day: 'Thu', hours: 5.1, score: 88 },
    { day: 'Fri', hours: 1.8, score: 86 },
    { day: 'Sat', hours: 6.0, score: 92 },
    { day: 'Sun', hours: 4.5, score: 94 },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 text-slate-100">
      <StreakXpWidget
        stats={gamification}
        onClaimBonus={() => addXp(15)}
        onUpdateAvatar={handleUpdateAvatar}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Custom Timer Module */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clock size={16} /> Focus Timer (+30 XP)
            </span>
          </div>

          <div className="text-center py-2">
            <div className="text-4xl font-bold text-slate-100 font-mono tracking-wider">
              {formatTime(secondsLeft)}
            </div>
            <p className="text-xs text-slate-500 mt-1">{isActive ? 'Focus session active...' : 'Timer paused'}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-1">
              {[5, 15, 25, 45, 60].map((mins) => (
                <button
                  key={mins}
                  onClick={() => handleSetTimer(mins)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-medium transition ${
                    timerMinutes === mins && !isActive
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {mins >= 60 ? `${mins / 60}h` : `${mins}m`}
                </button>
              ))}
            </div>

            <form onSubmit={handleCustomTimerSubmit} className="flex gap-2">
              <input
                type="number"
                placeholder="Set mins..."
                value={customMins}
                onChange={(e) => setCustomMins(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                min="1"
                max="300"
              />
              <button
                type="submit"
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium"
              >
                Set
              </button>
            </form>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => setIsActive(!isActive)}
              className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition"
            >
              {isActive ? <Pause size={14} /> : <Play size={14} />}
              {isActive ? 'Pause' : 'Start Timer'}
            </button>
            <button
              onClick={() => handleSetTimer(timerMinutes)}
              className="p-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 hover:text-slate-200"
              title="Reset Timer"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        {/* Weekly Growth Chart */}
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp size={16} /> Weekly Study Metrics
            </span>
            <span className="text-xs text-emerald-400 font-medium">+14% vs last week</span>
          </div>

          <div className="h-36 flex items-end justify-between gap-3 pt-6 border-b border-slate-800 pb-2">
            {growthData.map((pt) => (
              <div key={pt.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div
                  className="w-full bg-indigo-600/80 hover:bg-indigo-500 rounded-t-lg transition-all"
                  style={{ height: `${(pt.hours / 7) * 100}%` }}
                />
                <span className="text-[10px] text-slate-400">{pt.day}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Total Focused: 27.1 Hours</span>
            <span>Avg Quiz Score: 87%</span>
          </div>
        </div>
      </div>

      {/* Deadlines & Tasks Workspace */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CheckSquare className="text-indigo-400" size={20} />
            <h2 className="text-base font-bold text-slate-100">Upcoming Deadlines & Goals</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBuildingPlan(!isBuildingPlan)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/30 rounded-xl text-xs font-semibold transition"
            >
              <Sparkles size={14} /> Generate Study Plan
            </button>
            <button
              onClick={() => setIsAddingTask(!isAddingTask)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition"
            >
              <Plus size={14} /> Add Deadline & Goal
            </button>
          </div>
        </div>

        {/* Quick Add Action Presets Bar */}
        <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-2xl flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mr-2">
            <Zap size={13} className="text-amber-400" /> Quick Add Tasks (+10 XP):
          </span>
          <button
            onClick={() => addQuickTask('🎙️ Record Lecture')}
            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs transition"
          >
            + Record Lecture
          </button>
          <button
            onClick={() => addQuickTask('📝 Write Summary Notes')}
            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs transition"
          >
            + Write Notes
          </button>
          <button
            onClick={() => addQuickTask('📖 Read Textbook Chapter')}
            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs transition"
          >
            + Read Chapter
          </button>
          <button
            onClick={() => addQuickTask('⚡ Review Quiz Flashcards')}
            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs transition"
          >
            + Review Cards
          </button>
        </div>

        {/* Generator Form: Study Plan */}
        {isBuildingPlan && (
          <form onSubmit={handleGenerateStudyPlan} className="p-4 bg-slate-950 border border-indigo-500/30 rounded-2xl space-y-3">
            <h3 className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
              <Sparkles size={14} /> Auto-Generate Target Study Plan (+25 XP)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Subject (e.g., Organic Chem, Calculus)"
                value={planSubject}
                onChange={(e) => setPlanSubject(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                required
              />
              <select
                value={planDays}
                onChange={(e) => setPlanDays(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="3">3-Day Preparation Routine</option>
                <option value="5">5-Day Complete Review</option>
              </select>
              <select
                value={planTargetGrade}
                onChange={(e) => setPlanTargetGrade(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="A+">Target Goal: A+</option>
                <option value="A">Target Goal: A</option>
                <option value="B+">Target Goal: B+</option>
                <option value="100%">Target Goal: 100%</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsBuildingPlan(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
              >
                Create Schedule
              </button>
            </div>
          </form>
        )}

        {/* Form: Add Custom Task */}
        {isAddingTask && (
          <form onSubmit={handleAddTask} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
            <h3 className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <Calendar size={14} className="text-indigo-400" /> New Task, Goal & Attachments (+15 XP)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input
                type="text"
                placeholder="Task Title (e.g., Midterm Exam)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                required
              />
              <input
                type="text"
                placeholder="Course / Subject"
                value={newCourse}
                onChange={(e) => setNewCourse(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                required
              />
              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
              <select
                value={newTargetGrade}
                onChange={(e) => setNewTargetGrade(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="A+">Grade Goal: A+</option>
                <option value="A">Grade Goal: A</option>
                <option value="A-">Grade Goal: A-</option>
                <option value="B+">Grade Goal: B+</option>
                <option value="100%">Grade Goal: 100%</option>
                <option value="90%+">Grade Goal: 90%+</option>
              </select>
            </div>

            {/* Multiple Attachment Inputs */}
            <div className="space-y-3 pt-2 border-t border-slate-900">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Add Saved Library Resource:</label>
                  <select
                    onChange={(e) => {
                      addLibrarySourceToTask(e.target.value);
                      e.target.value = '';
                    }}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">-- Choose from Library --</option>
                    {savedSources.map((s) => (
                      <option key={s.id} value={s.urlOrName}>
                        {s.title} ({s.urlOrName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Upload Multiple PDFs/Files:</label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 transition"
                  >
                    <Upload size={14} className="text-indigo-400" />
                    <span>Upload Multiple Local Files...</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleMultipleFileAttachment}
                    className="hidden"
                  />
                </div>
              </div>

              {attachedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {attachedFiles.map((f, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                    >
                      <FileText size={12} />
                      <span className="truncate max-w-[140px]">{f.name}</span>
                      <button
                        type="button"
                        onClick={() => removeAttachedFile(i)}
                        className="text-slate-400 hover:text-rose-400 transition ml-1"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingTask(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
              >
                Save Goal Task
              </button>
            </div>
          </form>
        )}

        {/* List of Tasks */}
        <div className="space-y-2">
          {assignments.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-6">No tasks or upcoming deadlines. Use Quick Add or Add Deadline above.</p>
          ) : (
            assignments.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border flex flex-wrap items-center justify-between gap-3 transition ${
                  item.status === 'Completed'
                    ? 'bg-slate-950/40 border-slate-800/50 opacity-60 line-through'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div
                  onClick={() => toggleAssignment(item.id)}
                  className="flex items-center gap-3 cursor-pointer flex-1 min-w-[200px]"
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${item.status === 'Completed' ? 'bg-indigo-600 border-indigo-600' : 'border-slate-700'}`}>
                    {item.status === 'Completed' && <Award size={10} className="text-white" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-slate-200">{item.title}</h4>
                    <p className="text-[10px] text-slate-500">{item.course} {item.category ? `• ${item.category}` : ''}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {item.attachedSources && item.attachedSources.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.attachedSources.map((src, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleOpenAttachedSource(src)}
                          className="text-[10px] font-medium text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/30 flex items-center gap-1 transition"
                          title={`Open ${src.name}`}
                        >
                          <FileText size={11} />
                          <span className="truncate max-w-[100px]">{src.name}</span>
                          <ExternalLink size={9} />
                        </button>
                      ))}
                    </div>
                  )}

                  {item.targetGrade && (
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 flex items-center gap-1">
                      <Target size={11} /> {item.targetGrade}
                    </span>
                  )}

                  <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                    Due: {item.dueDate}
                  </span>

                  <button
                    onClick={() => deleteTask(item.id)}
                    className="text-slate-500 hover:text-rose-400 transition ml-1"
                    title="Delete task"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
