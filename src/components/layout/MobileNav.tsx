import React from 'react';
import { 
  Home, 
  CheckSquare, 
  FileText, 
  FolderKanban, 
  Calendar,
  Flame,
  Archive
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NavTab } from '../../types';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const tabs: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'tasks', label: 'Tarefas', icon: CheckSquare },
    { id: 'notes', label: 'Notas', icon: FileText },
    { id: 'projects', label: 'Projetos', icon: FolderKanban },
    { id: 'routine', label: 'Rotina', icon: Flame },
    { id: 'calendar', label: 'Agenda', icon: Calendar },
    { id: 'archive', label: 'Mais', icon: Archive },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#0c0d13]/95 backdrop-blur-lg border-t border-[#1b1e2a] px-2 py-2">
      <div className="flex items-center justify-around">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors ${
                isActive ? 'text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
