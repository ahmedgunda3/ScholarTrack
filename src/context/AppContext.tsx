import React, { createContext, useContext, useState, useEffect } from 'react';
import { Subject, Assignment, AppContextType } from '../types/index';
import { mockSubjects, mockAssignments } from '../data/mockData';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [currentSemester, setCurrentSemester] = useState('Fall 2026');
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('scholartrack_v1');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setSubjects(data.subjects);
        setAssignments(data.assignments.map((a: Assignment) => ({
          ...a,
          dueDate: new Date(a.dueDate),
        })));
        setCurrentSemester(data.currentSemester);
        setDarkMode(data.darkMode);
        setSidebarOpen(data.sidebarOpen);
      } catch (error) {
        console.error('Failed to load data from localStorage:', error);
        setSubjects(mockSubjects);
        setAssignments(mockAssignments);
      }
    } else {
      setSubjects(mockSubjects);
      setAssignments(mockAssignments);
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    const data = {
      subjects,
      assignments,
      currentSemester,
      darkMode,
      sidebarOpen,
    };
    localStorage.setItem('scholartrack_v1', JSON.stringify(data));
  }, [subjects, assignments, currentSemester, darkMode, sidebarOpen]);

  const addSubject = (subject: Subject) => {
    setSubjects([...subjects, subject]);
  };

  const updateSubject = (id: string, subject: Subject) => {
    setSubjects(subjects.map(s => (s.id === id ? subject : s)));
  };

  const deleteSubject = (id: string) => {
    setSubjects(subjects.filter(s => s.id !== id));
    setAssignments(assignments.filter(a => a.subjectId !== id));
  };

  const addAssignment = (assignment: Assignment) => {
    setAssignments([...assignments, assignment]);
  };

  const updateAssignment = (id: string, assignment: Assignment) => {
    setAssignments(assignments.map(a => (a.id === id ? assignment : a)));
  };

  const deleteAssignment = (id: string) => {
    setAssignments(assignments.filter(a => a.id !== id));
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const value: AppContextType = {
    subjects,
    assignments,
    currentSemester,
    darkMode,
    sidebarOpen,
    addSubject,
    updateSubject,
    deleteSubject,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    toggleDarkMode,
    toggleSidebar,
    setSemester: setCurrentSemester,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};