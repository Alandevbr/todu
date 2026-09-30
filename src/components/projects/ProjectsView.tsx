import React, { useState } from 'react';
import { 
  Plus, 
  FolderKanban, 
  Calendar as CalendarIcon, 
  CheckSquare, 
  FileText, 
  Clock, 
  ArrowUpRight,
  Sparkles,
  Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Project } from '../../types';

export const ProjectsView: React.FC = () => {
  const { 
    projects, 
    tasks, 
    notes, 
    setSelectedProjectDetailId, 
    setIsQuickAddOpen, 
    setQuickAddType 
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const categories = ['all', 'Carreira', 'Projetos Pessoais', 'Estudos', 'Finanças', 'Saúde', 'Ideias'];

  const filteredProjects = projects.filter(p => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (selectedStatus !== 'all' && p.status !== selectedStatus) return false;
    return true;
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2.5">
            <span>Projetos & Objetivos</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 font-mono">
              {projects.length} iniciativas
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Acompanhe iniciativas de médio e longo prazo inspiradas na vitrine de conteúdos da Netflix
          </p>
        </div>

        <button
          onClick={() => {
            setQuickAddType('project');
            setIsQuickAddOpen(true);
          }}
          className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-sm shadow-violet-600/30 self-start sm:self-auto transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Projeto</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#11131a] border border-[#1f2230] rounded-xl text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-zinc-500 text-[11px] mr-1">Área:</span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs capitalize transition-colors ${
                selectedCategory === cat
                  ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {cat === 'all' ? 'Todas as Áreas' : cat}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-1.5">
          <span className="text-zinc-500 text-[11px]">Status:</span>
          {['all', 'em_andamento', 'planejado', 'em_pausa', 'concluido'].map(st => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-2 py-0.5 rounded-md text-[11px] capitalize transition-colors ${
                selectedStatus === st
                  ? 'bg-[#232738] text-white border border-[#353b52]'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {st === 'all' ? 'Todos' : st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Showcase Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((project: Project) => {
          const projectTasks = tasks.filter(t => t.projectId === project.id && !t.archived);
          const completedTasksCount = projectTasks.filter(t => t.status === 'concluida').length;
          const projectNotes = notes.filter(n => n.projectId === project.id && !n.deleted);

          // Deadline calculation
          const deadline = new Date(project.deadline);
          deadline.setHours(0, 0, 0, 0);
          const diffDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

          return (
            <div
              key={project.id}
              onClick={() => setSelectedProjectDetailId(project.id)}
              className="bg-[#12141c] hover:bg-[#161925] border border-[#202332] hover:border-[#32374c] rounded-2xl p-5 cursor-pointer transition-all duration-200 group flex flex-col justify-between shadow-subtle hover:shadow-card hover:-translate-y-1"
            >
              <div>
                {/* Category & Status */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span 
                      className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: project.color || '#6366f1' }}
                    />
                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      {project.category}
                    </span>
                  </div>

                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#181a26] border border-[#232738] text-zinc-400 capitalize font-medium">
                    {project.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Project Title */}
                <h3 className="text-base font-bold text-white group-hover:text-violet-300 transition-colors tracking-tight mb-1.5 flex items-center justify-between">
                  <span>{project.name}</span>
                  <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 transition-colors shrink-0 ml-2" />
                </h3>

                {/* Description */}
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-4">
                  {project.description}
                </p>
              </div>

              {/* Progress and Bottom Meta */}
              <div className="space-y-3 pt-3 border-t border-[#1b1e2c]">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-zinc-500 font-medium">Progresso</span>
                    <span className="font-mono font-bold text-zinc-200">{project.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#1e2230] rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${project.progress}%`,
                        backgroundColor: project.color || '#8b5cf6'
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                  <span className="flex items-center gap-1">
                    <CheckSquare className="w-3 h-3 text-zinc-500" />
                    {completedTasksCount}/{projectTasks.length} tarefas
                  </span>

                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3 text-zinc-500" />
                    {projectNotes.length} notas
                  </span>

                  <span className={`flex items-center gap-1 ${
                    diffDays < 0 ? 'text-red-400 font-semibold' : diffDays <= 14 ? 'text-amber-400' : 'text-zinc-400'
                  }`}>
                    <Clock className="w-3 h-3" />
                    {diffDays < 0 ? `${Math.abs(diffDays)}d atr.` : `${diffDays}d rest.`}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
