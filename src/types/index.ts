export interface Subject {
  id: string;
  name: string;
  color: string;
  creditHours: number;
  targetGrade: number;
  semester: string;
}

export interface Assignment {
  id: string;
  subjectId: string;
  name: string;
  category: string;
  dueDate: Date;
  score: number | null;
  maxScore: number;
  weight: number;
  isPending: boolean;
}

export interface AppContextType {
  subjects: Subject[];
  assignments: Assignment[];
  currentSemester: string;
  darkMode: boolean;
  sidebarOpen: boolean;
  addSubject: (subject: Subject) => void;
  updateSubject: (id: string, subject: Subject) => void;
  deleteSubject: (id: string) => void;
  addAssignment: (assignment: Assignment) => void;
  updateAssignment: (id: string, assignment: Assignment) => void;
  deleteAssignment: (id: string) => void;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
  setSemester: (semester: string) => void;
}