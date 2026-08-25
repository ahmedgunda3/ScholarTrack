import React, { useState } from 'react';
import type { LibraryItem } from '../types/scholar';

export const LibraryView: React.FC = () => {
  const [items, setItems] = useState<LibraryItem[]>([
    { id: '1', name: 'Calculus_Integration_Guide.pdf', type: 'pdf', size: '3.4 MB', uploadedDate: '2 hours ago', category: 'Math' },
    { id: '2', name: 'Organic_Chemistry_Diagram.png', type: 'image', size: '1.2 MB', uploadedDate: '1 day ago', category: 'Chemistry' },
    { id: '3', name: 'Physics_Lab_Lecture.mp4', type: 'video', size: '45.0 MB', uploadedDate: '3 days ago', category: 'Physics' },
    { id: '4', name: 'Voice_Note_Revision.mp3', type: 'audio', size: '5.1 MB', uploadedDate: '4 days ago', category: 'General' },
  ]);

  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newItems: LibraryItem[] = Array.from(files).map((file, idx) => {
      let ext: LibraryItem['type'] = 'doc';
      if (file.type.includes('pdf')) ext = 'pdf';
      else if (file.type.includes('image')) ext = 'image';
      else if (file.type.includes('video')) ext = 'video';
      else if (file.type.includes('audio')) ext = 'audio';

      return {
        id: Date.now().toString() + idx,
        name: file.name,
        type: ext,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadedDate: 'Just now',
        category: 'Uploaded',
      };
    });

    setItems([...newItems, ...items]);
  };

  const handleDelete = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const filteredItems = items.filter((item) => {
    const matchesFilter = activeFilter === 'all' || item.type === activeFilter;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getIcon = (type: LibraryItem['type']) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'image': return '🖼️';
      case 'video': return '🎥';
      case 'audio': return '🎙️';
      default: return '📁';
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div>
          <h1 className="text-2xl font-black text-white">Sources & Cloud Library</h1>
          <p className="text-xs text-slate-400">Upload, search, and manage your study documents, videos, images, and audio notes.</p>
        </div>

        <label className="cursor-pointer bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition transform active:scale-95 flex items-center gap-2">
          <span>📤 Upload Files</span>
          <input type="file" multiple onChange={handleFileUpload} className="hidden" />
        </label>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto">
          {['all', 'pdf', 'image', 'video', 'audio'].map((type) => (
            <button
              key={type}
              onClick={() => setActiveFilter(type)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition ${
                activeFilter === type ? 'bg-violet-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search materials..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-64 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
        />
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-dashed border-slate-800">
          <p className="text-slate-400 text-sm">No materials found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex justify-between items-center hover:border-violet-500/50 transition shadow-sm">
              <div className="flex items-center gap-3 overflow-hidden">
                <span className="text-3xl bg-slate-950 p-2.5 rounded-xl border border-slate-800">{getIcon(item.type)}</span>
                <div className="overflow-hidden">
                  <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                    <span>{item.size}</span>
                    <span>•</span>
                    <span>{item.uploadedDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => handleDelete(item.id)} className="text-slate-500 hover:text-rose-400 text-xs p-1">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
