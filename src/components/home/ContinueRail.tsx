import React, { useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Briefcase, 
  Code2, 
  BookOpen, 
  Wallet, 
  Activity, 
  Lightbulb, 
  FolderKanban,
  ArrowUpRight,
  Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Project } from '../../types';

export const ContinueRail: React.FC = () => {
  const { projects, setSelectedProjectDetailId, tasks } = useApp();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -340 : 340;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Briefcase': return Briefcase;
      case 'Code2': return Code2;
      case 'BookOpen': return BookOpen;
      case 'Wallet': return Wallet;
      case 'Activity': return Activity;
      case 'Lightbulb': return Lightbulb;
      default: return FolderKanban;
    }
  };

  return (
    <section className="space-y-3">
      {/* Header with Title and Scroll Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight flex items-center space-x-2">
            <span>Continuar de onde parei</span>
            <span className="text-xs font-normal text-zinc-500 font-mono">({projects.length})</span>
          </h2>
          <p className="text-xs text-zinc-400">
            Seus projetos e áreas prioritárias em andamento
          </p>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => scroll('left')}
            className="p-1.5 rounded-lg bg-[#141620] hover:bg-[#1f2232] text-zinc-400 hover:text-white border border-[#242838] transition-colors"
            title="Rolar para esquerda"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1.5 rounded-lg bg-[#141620] hover:bg-[#1f2232] text-zinc-400 hover:text-white border border-[#242838] transition-colors"
            title="Rolar para direita"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Rail */}
      <div 
        ref={scrollContainerRef}
        className="flex space-x-4 overflow-x-auto no-scrollbar py-2 px-0.5 horizontal-rail"
      >
        {projects.map((proj: Project) => {
          const Icon = getIcon(proj.icon);
          const projTasks = tasks.filter(t => t.projectId === proj.id && !t.archived);
          const completedTasksCount = projTasks.filter(t => t.status === 'concluida').length;

          // Days remaining calculation
          const today = new Date();
          today.setHours(0,0,0,0);
          const deadline = new Date(proj.deadline);
          deadline.setHours(0,0,0,0);
          const diffDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

          return (
            <div
              key={proj.id}
              onClick={() => setSelectedProjectDetailId(proj.id)}
              className="shrink-0 w-[270px] sm:w-[310px] bg-[#12141c] hover:bg-[#171a25] border border-[#202332] hover:border-[#32374c] rounded-xl p-4 cursor-pointer transition-all duration-200 group flex flex-col justify-between shadow-subtle hover:shadow-card hover:-translate-y-0.5"
            >
              <div>
                {/* Category & Status pill */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                      style={{ 
                        backgroundColor: `${proj.color || '#6366f1'}15`, 
                        color: proj.color || '#6366f1' 
                      }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                      {proj.category}
                    </span>
                  </div>

                  <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 transition-colors" />
                </div>

                {/* Project Title */}
                <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-white line-clamp-1 mb-1 tracking-tight">
                  {proj.name}
                </h3>

                {/* Project Description */}
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {proj.description}
                </p>
              </div>

              {/* Bottom Progress & Metas */}
              <div className="mt-4 pt-3 border-t border-[#1b1e2c]">
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className="text-zinc-500">Progresso</span>
                  <span className="font-mono font-medium text-zinc-300">{proj.progress}%</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-[#1e2230] rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${proj.progress}%`,
                      backgroundColor: proj.color || '#6366f1'
                    }}
                  />
                </div>

                {/* Sub-info: Tasks count and Days left */}
                <div className="flex items-center justify-between text-[10px] text-zinc-500 mt-2 font-mono">
                  <span>{completedTasksCount}/{projTasks.length} tarefas</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {diffDays < 0 ? `${Math.abs(diffDays)}d atrasado` : `${diffDays}d restantes`}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
