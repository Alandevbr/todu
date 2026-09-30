import React from 'react';
import { 
  FileText, 
  Calendar, 
  CheckSquare, 
  FolderKanban, 
  Flame, 
  Archive,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NavTab } from '../../types';

export const QuickAccess: React.FC = () => {
  const { setActiveTab, notes, tasks, projects, habits } = useApp();

  const shortcuts: {
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    tab: NavTab;
    badge: string;
    accentColor: string;
  }[] = [
    {
      title: 'Bloco de Notas',
      description: 'Editor minimalista e anotações rápidas',
      icon: FileText,
      tab: 'notes',
      badge: `${notes.filter(n => !n.deleted && !n.archived).length} notas`,
      accentColor: '#10b981',
    },
    {
      title: 'Calendário',
      description: 'Visão mensal, prazos e compromissos',
      icon: Calendar,
      tab: 'calendar',
      badge: 'Visualização',
      accentColor: '#3b82f6',
    },
    {
      title: 'Lista de Tarefas',
      description: 'Gestão completa, filtros e prioridades',
      icon: CheckSquare,
      tab: 'tasks',
      badge: `${tasks.filter(t => t.status !== 'concluida' && !t.archived).length} pendentes`,
      accentColor: '#6366f1',
    },
    {
      title: 'Projetos & Metas',
      description: 'Acompanhamento de objetivos estratégicos',
      icon: FolderKanban,
      tab: 'projects',
      badge: `${projects.length} ativos`,
      accentColor: '#8b5cf6',
    },
    {
      title: 'Minha Rotina',
      description: 'Hábitos diários e rastreamento de consistência',
      icon: Flame,
      tab: 'routine',
      badge: `${habits.length} hábitos`,
      accentColor: '#f59e0b',
    },
    {
      title: 'Arquivo & Lixeira',
      description: 'Itens concluídos, arquivados ou descartados',
      icon: Archive,
      tab: 'archive',
      badge: 'Armazenamento',
      accentColor: '#64748b',
    },
  ];

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight">
          Acesso rápido
        </h2>
        <p className="text-xs text-zinc-400">
          Navegue instantaneamente para os módulos principais do seu espaço
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {shortcuts.map(item => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              onClick={() => setActiveTab(item.tab)}
              className="p-3.5 bg-[#12141c] hover:bg-[#171a25] border border-[#202332] hover:border-[#30354a] rounded-xl cursor-pointer transition-all duration-200 group flex flex-col justify-between shadow-subtle hover:-translate-y-0.5"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                    style={{ 
                      backgroundColor: `${item.accentColor}15`, 
                      color: item.accentColor 
                    }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-300 transition-colors" />
                </div>

                <h3 className="text-xs font-semibold text-zinc-200 group-hover:text-white mb-0.5">
                  {item.title}
                </h3>
                <p className="text-[11px] text-zinc-500 line-clamp-1 leading-snug">
                  {item.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-[#1b1e2c]">
                <span className="text-[10px] text-zinc-400 font-mono">
                  {item.badge}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
