import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Topbar } from './components/layout/Topbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';

// Views
import { HomeView } from './components/home/HomeView';
import { TasksView } from './components/tasks/TasksView';
import { NotesView } from './components/notes/NotesView';
import { ProjectsView } from './components/projects/ProjectsView';
import { CalendarView } from './components/calendar/CalendarView';
import { RoutineView } from './components/routine/RoutineView';
import { ArchiveView } from './components/archive/ArchiveView';

// Modals
import { GlobalSearchModal } from './components/modals/GlobalSearchModal';
import { QuickAddModal } from './components/modals/QuickAddModal';
import { ShortcutsModal } from './components/modals/ShortcutsModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { TaskModal } from './components/modals/TaskModal';
import { ProjectDetailModal } from './components/projects/ProjectDetailModal';
import { AuthModal } from './components/modals/AuthModal';

const AppContent: React.FC = () => {
  const { activeTab, notification } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView />;
      case 'routine':
        return <RoutineView />;
      case 'tasks':
        return <TasksView />;
      case 'notes':
        return <NotesView />;
      case 'projects':
        return <ProjectsView />;
      case 'calendar':
        return <CalendarView />;
      case 'archive':
        return <ArchiveView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#090a0d] text-[#ededed] flex flex-col font-sans selection:bg-indigo-500/25 selection:text-white">
      {/* Topbar */}
      <Topbar />

      {/* Main Shell */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar (Desktop) */}
        <Sidebar />

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 md:pb-8 pb-20 max-w-7xl mx-auto w-full">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Global Modals & Dialogs */}
      <GlobalSearchModal />
      <QuickAddModal />
      <ShortcutsModal />
      <SettingsModal />
      <TaskModal />
      <ProjectDetailModal />
      <AuthModal />

      {/* Toast Notification Container */}
      {notification && (
        <div className="fixed bottom-16 md:bottom-6 right-6 z-50 animate-slide-up">
          <div className={`px-4 py-2.5 rounded-xl border text-xs font-medium shadow-2xl flex items-center space-x-2 backdrop-blur-md ${
            notification.type === 'success'
              ? 'bg-[#101918]/90 border-emerald-500/40 text-emerald-300'
              : notification.type === 'warning'
              ? 'bg-[#1c1414]/90 border-red-500/40 text-red-300'
              : 'bg-[#141622]/90 border-indigo-500/40 text-indigo-300'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            <span>{notification.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
