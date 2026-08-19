import React from 'react';
import { AppProvider } from './context/AppContext';
import MainLayout from './layouts/MainLayout';
import Header from './components/Header';

function App() {
  return (
    <AppProvider>
      <MainLayout>
        <Header />
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Dashboard Coming Soon</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Foundation complete. Ready for dashboard components.</p>
        </div>
      </MainLayout>
    </AppProvider>
  );
}

export default App;