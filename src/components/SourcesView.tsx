import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, FileText, Link as LinkIcon, Plus, Trash2, Search, Upload, ExternalLink, Download, File } from 'lucide-react';
import type { StudySource } from '../types';

export const SourcesView: React.FC = () => {
  const [sources, setSources] = useState<StudySource[]>(() => {
    const saved = localStorage.getItem('scholartrack_sources');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Calculus Early Transcendentals', type: 'Textbook', subject: 'Mathematics', urlOrName: 'Stewart_Calculus.pdf', fileSize: '14.2 MB', dateAdded: '2026-08-20' },
      { id: '2', title: 'Data Structures & Algorithms Cheat Sheet', type: 'PDF', subject: 'Computer Science', urlOrName: 'DSA_Summary.pdf', fileSize: '1.8 MB', dateAdded: '2026-08-22' },
    ];
  });

  const [title, setTitle] = useState('');
  const [type, setType] = useState<StudySource['type']>('PDF');
  const [subject, setSubject] = useState('');
  const [urlOrName, setUrlOrName] = useState('');
  const [fileData, setFileData] = useState<string | undefined>(undefined);
  const [fileSize, setFileSize] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem('scholartrack_sources', JSON.stringify(sources));
    } catch (e) {
      console.warn('Storage quota exceeded for local files:', e);
    }
  }, [sources]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Format File Size
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    setFileSize(`${sizeInMB} MB`);
    setUrlOrName(file.name);

    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, ''));
    }

    // Determine type from extension
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') setType('PDF');
    else if (['doc', 'docx', 'txt', 'md'].includes(ext || '')) setType('Notes');
    else setType('File');

    // Read File as Data URL for browser preview/downloading
    const reader = new FileReader();
    reader.onload = (event) => {
      setFileData(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAddSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !subject) return;

    const newSource: StudySource = {
      id: Date.now().toString(),
      title,
      type,
      subject,
      urlOrName: urlOrName || 'Uploaded_Document.pdf',
      fileData,
      fileSize,
      dateAdded: new Date().toISOString().split('T')[0],
    };

    setSources([newSource, ...sources]);
    setTitle('');
    setSubject('');
    setUrlOrName('');
    setFileData(undefined);
    setFileSize(undefined);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    setSources(sources.filter((s) => s.id !== id));
  };

  const handleOpenSource = (item: StudySource) => {
    if (item.fileData) {
      const win = window.open();
      if (win) {
        win.document.write(`<iframe src="${item.fileData}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
      }
    } else if (item.urlOrName?.startsWith('http')) {
      window.open(item.urlOrName, '_blank');
    } else {
      alert(`Local reference: ${item.urlOrName}`);
    }
  };

  const filtered = sources.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.subject?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 text-slate-100">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="text-indigo-400" size={26} /> Knowledge Sources & Textbooks
          </h1>
          <p className="text-xs text-slate-400">Upload local PDFs, textbook files, and study notes directly from your computer</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition"
        >
          <Plus size={16} /> Add Source
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddSource} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
          <h3 className="text-sm font-semibold text-indigo-300">New Source Resource</h3>

          {/* Local File Input Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 text-center cursor-pointer transition bg-slate-950/50"
          >
            <Upload className="mx-auto text-slate-500 mb-2" size={24} />
            <p className="text-xs font-medium text-slate-200">
              {urlOrName ? `Selected: ${urlOrName} (${fileSize || 'Local'})` : 'Click to select a local file (PDF, TXT, DOCX, Image)'}
            </p>
            <p className="text-[10px] text-slate-500 mt-1">Files are stored locally in your browser workspace</p>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Source Title (e.g., Organic Chemistry Vol. 1)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              required
            />
            <input
              type="text"
              placeholder="Subject (e.g., Chemistry, CS, Physics)"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              required
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value as StudySource['type'])}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              <option value="PDF">PDF File</option>
              <option value="Textbook">Textbook</option>
              <option value="Notes">Lecture Notes</option>
              <option value="Link">Web Reference</option>
              <option value="File">Other File</option>
            </select>
            <input
              type="text"
              placeholder="Filename or Web Link URL"
              value={urlOrName}
              onChange={(e) => setUrlOrName(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
            >
              Save Resource
            </button>
          </div>
        </form>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
        <input
          type="text"
          placeholder="Filter sources by title or subject..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Grid of Sources */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div key={item.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {item.type}
                </span>
                <span className="text-[10px] text-slate-500">{item.fileSize || item.dateAdded}</span>
              </div>
              <h4 className="text-sm font-semibold text-slate-100 mb-1">{item.title}</h4>
              <p className="text-xs text-slate-400">{item.subject}</p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800/60 text-xs">
              <button
                onClick={() => handleOpenSource(item)}
                className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-[11px] font-medium"
              >
                {item.type === 'PDF' ? <File size={12} /> : item.type === 'Link' ? <LinkIcon size={12} /> : <FileText size={12} />}
                <span className="truncate max-w-[140px]">{item.urlOrName}</span>
                <ExternalLink size={10} />
              </button>

              <div className="flex items-center gap-2">
                {item.fileData && (
                  <a
                    href={item.fileData}
                    download={item.urlOrName}
                    className="text-slate-400 hover:text-slate-200"
                    title="Download File"
                  >
                    <Download size={14} />
                  </a>
                )}
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-slate-500 hover:text-rose-400 transition"
                  title="Delete Source"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
