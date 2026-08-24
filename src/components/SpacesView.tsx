import React, { useState, useEffect } from 'react';
import { FileText, Plus, Save, Trash2 } from 'lucide-react';
import type { NoteItem } from '../types';

export const SpacesView: React.FC = () => {
  const [notes, setNotes] = useState<NoteItem[]>(() => {
    const saved = localStorage.getItem('scholartrack_notes');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'General Research Notes', content: 'Key concepts on systemic learning and active recall routines.', space: 'General Studies', updatedAt: '2026-08-23' },
      { id: '2', title: 'Data Structures - Lecture 3', content: 'Notes covering balanced search trees, red-black trees, and heap properties.', space: 'Course Notes', updatedAt: '2026-08-21' }
    ];
  });

  const [activeNoteId, setActiveNoteId] = useState<string>(notes[0]?.id || '');
  const activeNote = notes.find((n) => n.id === activeNoteId) || notes[0];

  const [title, setTitle] = useState(activeNote?.title || '');
  const [content, setContent] = useState(activeNote?.content || '');

  useEffect(() => {
    if (activeNote) {
      setTitle(activeNote.title);
      setContent(activeNote.content);
    }
  }, [activeNoteId]);

  useEffect(() => {
    localStorage.setItem('scholartrack_notes', JSON.stringify(notes));
  }, [notes]);

  const handleSave = () => {
    setNotes(notes.map(n => n.id === activeNoteId ? { ...n, title, content, updatedAt: new Date().toISOString().split('T')[0] } : n));
  };

  const createNote = () => {
    const newNote: NoteItem = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      space: 'General Studies',
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
  };

  const deleteNote = (id: string) => {
    const filtered = notes.filter(n => n.id !== id);
    setNotes(filtered);
    if (filtered.length > 0) setActiveNoteId(filtered[0].id);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto h-[calc(100vh-2rem)] flex gap-6 text-slate-100">
      {/* Sidebar List */}
      <div className="w-1/3 bg-slate-900 border border-slate-800 rounded-3xl p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold flex items-center gap-2 text-indigo-400">
              <FileText size={16} /> Course Notes & Spaces
            </h2>
            <button
              onClick={createNote}
              className="p-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="space-y-2 max-h-[70vh] overflow-y-auto">
            {notes.map((n) => (
              <div
                key={n.id}
                onClick={() => setActiveNoteId(n.id)}
                className={`p-3 rounded-2xl border text-xs cursor-pointer transition ${
                  n.id === activeNoteId
                    ? 'bg-indigo-600/20 border-indigo-500 text-slate-100'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-semibold truncate">{n.title || 'Untitled Note'}</div>
                <div className="text-[10px] text-slate-500 mt-1">{n.space} • {n.updatedAt}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Editor Pane */}
      {activeNote ? (
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note Title"
              className="bg-transparent text-lg font-bold text-slate-100 focus:outline-none w-full"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
              >
                <Save size={14} /> Save
              </button>
              <button
                onClick={() => deleteNote(activeNote.id)}
                className="p-1.5 text-slate-500 hover:text-rose-400 transition"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your study notes or markdown material here..."
            className="flex-1 bg-transparent resize-none text-xs text-slate-200 focus:outline-none leading-relaxed"
          />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-xs text-slate-500">
          No note selected
        </div>
      )}
    </div>
  );
};
