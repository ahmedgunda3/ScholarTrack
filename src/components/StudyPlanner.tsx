import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const StudyPlanner = () => {
  const [activeDay, setActiveDay] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [blockTitle, setBlockTitle] = useState('');
  const [selectedDay, setSelectedDay] = useState('Mon');
  const [time, setTime] = useState('09:00 AM');

  const [days, setDays] = useState([
    { name: 'Mon', title: 'Calculus Revision', time: '08:00 AM', hasEvent: true, color: 'bg-indigo-950/80 border-indigo-500/50 text-indigo-200' },
    { name: 'Tue', title: 'No Events', time: '', hasEvent: false, color: '' },
    { name: 'Wed', title: 'Chemistry Lab Prep', time: '11:00 AM', hasEvent: true, color: 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200' },
    { name: 'Thu', title: 'No Events', time: '', hasEvent: false, color: '' },
    { name: 'Fri', title: 'Physics Practice Test', time: '03:00 PM', hasEvent: true, color: 'bg-amber-950/80 border-amber-500/50 text-amber-200' },
    { name: 'Sat', title: 'No Events', time: '', hasEvent: false, color: '' },
    { name: 'Sun', title: 'No Events', time: '', hasEvent: false, color: '' },
  ]);

  const handleAddBlock = () => {
    if (!blockTitle.trim()) return;
    setDays(prev => prev.map(d => d.name === selectedDay ? {
      ...d,
      title: blockTitle,
      time: time,
      hasEvent: true,
      color: 'bg-violet-950/80 border-violet-500/50 text-violet-200'
    } : d));
    setBlockTitle('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Interactive Study Planner</h1>
          <p className="text-xs text-slate-400 mt-1">Schedule daily Focus Blocks and task revisions with interactive bouncing cards.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.06, y: -2 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs rounded-2xl shadow-lg shadow-violet-600/30 cursor-pointer"
        >
          + Add Block
        </motion.button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
        {days.map((day) => {
          const isHovered = activeDay === day.name;
          return (
            <motion.div
              key={day.name}
              onMouseEnter={() => setActiveDay(day.name)}
              onMouseLeave={() => setActiveDay(null)}
              whileHover={{ y: -8, scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
              className={`bg-slate-900/60 border rounded-3xl p-4 flex flex-col min-h-[220px] backdrop-blur-md cursor-pointer ${
                isHovered ? 'border-violet-500/80 shadow-xl shadow-violet-600/20 bg-slate-900' : 'border-slate-800'
              }`}
            >
              <span className={`text-xs font-black text-center mb-4 pb-2 border-b border-slate-800 ${isHovered ? 'text-violet-400' : 'text-slate-400'}`}>
                {day.name}
              </span>

              {day.hasEvent ? (
                <div className={`p-3.5 rounded-2xl border ${day.color} flex flex-col gap-1.5 shadow-lg`}>
                  <span className="text-[10px] font-black uppercase tracking-wider opacity-80">{day.time}</span>
                  <span className="text-xs font-bold leading-snug">{day.title}</span>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-[11px] font-semibold text-slate-600">No Events</div>
              )}
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} className="bg-slate-900 border border-violet-500/30 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
              <h2 className="text-lg font-black text-white">Add Schedule Block</h2>
              <input type="text" value={blockTitle} onChange={(e) => setBlockTitle(e.target.value)} placeholder="Block Activity Title..." className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-violet-500" />
              <div className="grid grid-cols-2 gap-3">
                <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2.5 text-xs text-slate-300">
                  {days.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
                </select>
                <input type="text" value={time} onChange={(e) => setTime(e.target.value)} placeholder="e.g. 10:00 AM" className="bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2.5 text-xs text-white" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold cursor-pointer">Cancel</button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleAddBlock} className="px-5 py-2 bg-violet-600 text-white rounded-xl text-xs font-bold cursor-pointer">Add Block</motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
