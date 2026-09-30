import React from 'react';
import { 
  Home, 
  CheckSquare, 
  FileText, 
  FolderKanban, 
  Calendar, 
  Archive, 
  Flame,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NavTab } from '../../types';

interface NavItem {
  id: NavTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
}

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    tasks, 
    notes, 
    projects, 
    habits,
    todayProgressPercentage 
  } = useApp();

  // Active counts for badges
  const pendingTasksCount = tasks.filter(t => t.status !== 'concluida' && !t.archived).length;
  const activeNotesCount = notes.filter(n => !n.archived && !n.deleted).length;
  const activeProjectsCount = projects.filter(p => p.status === 'em_andamento').length;

  const navItems: NavItem[] = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'routine', label: 'Minha rotina', icon: Flame, badge: habits.length },
    { id: 'tasks', label: 'Tarefas', icon: CheckSquare, badge: pendingTasksCount },
    { id: 'notes', label: 'Notas', icon: FileText, badge: activeNotesCount },
    { id: 'projects', label: 'Projetos', icon: FolderKanban, badge: activeProjectsCount },
    { id: 'calendar', label: 'Calendário', icon: Calendar },
    { id: 'archive', label: 'Arquivo & Lixeira', icon: Archive },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#0c0d12] border-r border-[#1a1c26] h-[calc(100vh-57px)] sticky top-[57px] select-none p-3.5 justify-between">
      {/* Navigation Links */}
      <div className="space-y-6">
        <div>
          <div className="px-3 mb-2 flex items-center justify-between text-[11px] font-semibold tracking-wider text-zinc-500 uppercase">
            <span>Espaço Pessoal</span>
            <Layers className="w-3 h-3 text-zinc-600" />
          </div>
          <nav className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#181a25] text-white shadow-sm border border-[#272b3c]'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#12141c]'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-indigo-400' : 'text-zinc-500'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge !== 0 && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                      isActive
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        : 'bg-[#181a24] text-zinc-500 border border-[#222533]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick project pinned rail in sidebar */}
        <div className="pt-2 border-t border-[#181a24]">
          <div className="px-3 mb-2 flex items-center justify-between text-[11px] font-semibold tracking-wider text-zinc-500 uppercase">
            <span>Foco Atual</span>
            <span className="text-[10px] text-zinc-600 font-mono">{projects.length}</span>
          </div>
          <div className="space-y-1">
            {projects.slice(0, 4).map(proj => (
              <button
                key={proj.id}
                onClick={() => setActiveTab('projects')}
                className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-zinc-200 hover:bg-[#12141c] flex items-center justify-between group transition-colors"
              >
                <div className="flex items-center space-x-2 truncate">
                  <span 
                    className="w-2 h-2 rounded-full shrink-0" 
                    style={{ backgroundColor: proj.color || '#6366f1' }}
                  />
                  <span className="truncate">{proj.name}</span>
                </div>
                <ChevronRight className="w-3 h-3 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Mini Card: Daily Focus */}
      <div className="p-3 bg-[#11131a] rounded-xl border border-[#1f2230]">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-zinc-300">Progresso do Dia</span>
          <span className="text-xs font-mono font-semibold text-indigo-400">{todayProgressPercentage}%</span>
        </div>
        <div className="w-full h-1.5 bg-[#1b1e2c] rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full transition-all duration-500"
            style={{ width: `${todayProgressPercentage}%` }}
          />
        </div>
        <p className="mt-2 text-[11px] text-zinc-500">
          Mantenha a consistência em pequenos passos.
        </p>
      </div>
    </aside>
  );
};
