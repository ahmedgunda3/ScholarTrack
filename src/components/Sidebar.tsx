import React from 'react';
import { BookOpen, BarChart3, Clock, Settings, Moon, Sun, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Sidebar: React.FC = () => {
  const { sidebarOpen, toggleSidebar, darkMode, toggleDarkMode, currentSemester, subjects } = useApp();

  return (
    <div className={`fixed left-0 top-0 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} flex flex-col`}>
      {/* Logo */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center w-full'}`}>
          <div className="w-10 h-10 bg-purple-400 rounded-lg flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          {sidebarOpen && <span className="font-bold text-lg">ScholarTrack</span>}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <NavItem icon={<BarChart3 className="w-5 h-5" />} label="Overview" active sidebarOpen={sidebarOpen} />
        <NavItem icon={<BookOpen className="w-5 h-5" />} label="Subjects" sidebarOpen={sidebarOpen} />
        <NavItem icon={<Clock className="w-5 h-5" />} label="Grade Log" badge="5" sidebarOpen={sidebarOpen} />
      </nav>

      {/* Semester Card */}
      {sidebarOpen && (
        <div className="mx-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800 mb-4">
          <p className="text-sm font-semibold text-purple-900 dark:text-purple-200">{currentSemester}</p>
          <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">{subjects.length} subjects enrolled</p>
        </div>
      )}

      {/* Bottom Controls */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {darkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
          {sidebarOpen && <span className="text-sm">{darkMode ? 'Light' : 'Dark'}</span>}
        </button>

        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {sidebarOpen ? (
            <ChevronLeft className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
          {sidebarOpen && <span className="text-sm">Collapse</span>}
        </button>
      </div>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: string;
  sidebarOpen: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, badge, sidebarOpen }) => {
  return (
    <button
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
        active
          ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-200'
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
      }`}
    >
      {icon}
      {sidebarOpen && (
        <>
          <span className="text-sm flex-1 text-left">{label}</span>
          {badge && (
            <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {badge}
            </span>
          )}
        </>
      )}
    </button>
  );
};

export default Sidebar;