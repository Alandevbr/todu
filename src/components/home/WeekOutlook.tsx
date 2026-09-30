import React from 'react';
import { Calendar, ChevronRight, CheckSquare } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const WeekOutlook: React.FC = () => {
  const { tasks, projects, setActiveTab } = useApp();

  // Generate next 7 days starting from today
  const days = Array.from({ length: 7 }).map((_, index) => {
    const d = new Date();
    d.setDate(d.getDate() + index);
    const dateStr = d.toISOString().split('T')[0];
    
    const dayName = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' }).format(d);
    const dayNumber = d.getDate();
    const isToday = index === 0;

    const dayTasks = tasks.filter(t => t.date === dateStr && !t.archived);
    const dayProjects = projects.filter(p => p.deadline === dateStr);

    return {
      dateStr,
      dayName: dayName.replace('.', '').toUpperCase(),
      dayNumber,
      isToday,
      tasks: dayTasks,
      projectDeadlines: dayProjects,
      hasHighPriority: dayTasks.some(t => t.priority === 'alta' && t.status !== 'concluida')
    };
  });

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight flex items-center space-x-2">
            <span>Minha semana</span>
          </h2>
          <p className="text-xs text-zinc-400">
            Visão compacta dos próximos 7 dias e entregas prioritárias
          </p>
        </div>

        <button
          onClick={() => setActiveTab('calendar')}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center space-x-1 group"
        >
          <span>Abrir calendário</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* 7 Days Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
        {days.map(day => (
          <div
            key={day.dateStr}
            onClick={() => setActiveTab('calendar')}
            className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between min-h-[110px] group ${
              day.isToday
                ? 'bg-[#151826] border-indigo-500/50 shadow-sm shadow-indigo-500/10'
                : 'bg-[#11131b] hover:bg-[#161824] border-[#1e2130] hover:border-[#2e334a]'
            }`}
          >
            {/* Top Date Header */}
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-semibold tracking-wider ${
                day.isToday ? 'text-indigo-400' : 'text-zinc-500'
              }`}>
                {day.dayName}
              </span>
              {day.isToday && (
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              )}
            </div>

            {/* Day Number */}
            <div className="my-1">
              <span className={`text-xl font-bold font-mono tracking-tight ${
                day.isToday ? 'text-white' : 'text-zinc-300 group-hover:text-white'
              }`}>
                {day.dayNumber}
              </span>
            </div>

            {/* Bottom summary / badge */}
            <div className="space-y-1">
              {day.tasks.length > 0 ? (
                <div className="flex items-center justify-between text-[10px]">
                  <span className={`flex items-center gap-1 font-mono ${
                    day.hasHighPriority ? 'text-red-400 font-medium' : 'text-zinc-400'
                  }`}>
                    <CheckSquare className="w-2.5 h-2.5" />
                    {day.tasks.length} {day.tasks.length === 1 ? 'tarefa' : 'tarefas'}
                  </span>
                </div>
              ) : (
                <span className="text-[10px] text-zinc-600 block">Livre</span>
              )}

              {/* Deadline indicator if any project deadline lands on this day */}
              {day.projectDeadlines.length > 0 && (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 font-medium truncate block">
                  Prazo: {day.projectDeadlines[0].name}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
