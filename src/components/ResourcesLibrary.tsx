import { useState, useRef, type ChangeEvent } from 'react';
import { motion } from 'framer-motion';

export const ResourcesLibrary = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState([
    { title: 'Calculus_Integration_Guide.pdf', type: 'PDF', icon: '📄', color: 'border-sky-500/40 bg-sky-950/30' },
    { title: 'Organic_Chemistry_Diagram.png', type: 'Image', icon: '🖼️', color: 'border-emerald-500/40 bg-emerald-950/30' },
    { title: 'Physics_Lab_Lecture.mp4', type: 'Video', icon: '🎥', color: 'border-amber-500/40 bg-amber-950/30' },
  ]);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    const fileType = uploadedFile.name.endsWith('.pdf') ? 'PDF' : uploadedFile.type.startsWith('image/') ? 'Image' : 'Video';
    const icon = fileType === 'PDF' ? '📄' : fileType === 'Image' ? '🖼️' : '🎥';

    setFiles(prev => [
      { title: uploadedFile.name, type: fileType, icon, color: 'border-violet-500/40 bg-violet-950/30' },
      ...prev
    ]);
  };

  const filtered = files.filter((f) => {
    const matchesFilter = activeFilter === 'All' || f.type === activeFilter;
    const matchesSearch = f.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Sources & Cloud Library</h1>
          <p className="text-xs text-slate-400 mt-1">Upload, search, and manage your study documents, videos, and images.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.06, y: -2 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => fileInputRef.current?.click()}
          className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs rounded-2xl shadow-lg shadow-violet-600/30 cursor-pointer flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <span>+</span> Upload Files
        </motion.button>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {['All', 'PDF', 'Image', 'Video'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeFilter === tab ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30' : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search materials..." className="w-full sm:w-64 bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <motion.div
            key={item.title}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 350, damping: 20 }}
            className={`bg-slate-900/60 border rounded-3xl p-5 backdrop-blur-md flex items-center gap-4 cursor-pointer shadow-lg ${item.color}`}
          >
            <div className="text-3xl shrink-0">{item.icon}</div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{item.title}</p>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{item.type} Document</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
