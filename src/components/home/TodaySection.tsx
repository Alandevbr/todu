import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Plus, 
  ArrowRight,
  Sparkles,
  CalendarDays
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getRelativeDate } from '../../data/initialData';
import { Priority } from '../../types';

export const TodaySection: React.FC = () => {
  const { 
    todayTasks, 
    toggleTaskStatus, 
    addTask, 
    setActiveTab, 
    setEditingTaskId,
    todayProgressPercentage,
    completedTodayCount 
  } = useApp();

  const [inlineTitle, setInlineTitle] = useState('');
  const [inlinePriority, setInlinePriority] = useState<Priority>('media');

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inlineTitle.trim()) return;

    addTask({
      title: inlineTitle.trim(),
      date: getRelativeDate(0),
      priority: inlinePriority,
      category: 'Trabalho',
      status: 'pendente',
    });

    setInlineTitle('');
  };

  const pendingTasks = todayTasks.filter(t => t.status !== 'concluida');
  const completedTasks = todayTasks.filter(t => t.status === 'concluida');

  return (
    <section className="bg-[#11131a] border border-[#1f2230] rounded-2xl p-5 sm:p-6 shadow-subtle space-y-5">
      {/* Header with Title and Daily Progress Metric */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1b1e2a]">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-indigo-400" />
              <span>Foco de Hoje</span>
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
              {pendingTasks.length} pendentes
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Priorize o essencial para ter um dia produtivo e equilibrado
          </p>
        </div>

        {/* Progress meter */}
        <div className="flex items-center space-x-3 bg-[#151722] px-3.5 py-2 rounded-xl border border-[#232738] shrink-0">
          <div className="text-right">
            <span className="text-xs font-semibold text-zinc-200 block font-mono">
              {completedTodayCount} de {todayTasks.length} concluídas
            </span>
            <span className="text-[10px] text-zinc-500">Progresso do dia</span>
          </div>
          <div className="w-16 h-2 bg-[#202436] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500" 
              style={{ width: `${todayProgressPercentage}%` }} 
            />
          </div>
          <span className="text-xs font-bold text-indigo-400 font-mono">
            {todayProgressPercentage}%
          </span>
        </div>
      </div>

      {/* Inline Quick Add Input */}
      <form onSubmit={handleQuickAdd} className="flex gap-2">
        <input
          type="text"
          value={inlineTitle}
          onChange={(e) => setInlineTitle(e.target.value)}
          placeholder="Adicionar tarefa para hoje... (Pressione Enter)"
          className="flex-1 px-3.5 py-2 bg-[#161824] border border-[#25293c] hover:border-[#353a52] focus:border-indigo-500 rounded-xl text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none transition-colors"
        />
        <select
          value={inlinePriority}
          onChange={(e) => setInlinePriority(e.target.value as Priority)}
          className="px-2.5 py-2 bg-[#161824] border border-[#25293c] rounded-xl text-xs text-zinc-300 focus:outline-none"
        >
          <option value="alta">Alta</option>
          <option value="media">Média</option>
          <option value="baixa">Baixa</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white rounded-xl text-xs font-medium flex items-center space-x-1.5 transition-all shadow-sm shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Adicionar</span>
        </button>
      </form>

      {/* Task List */}
      <div className="space-y-2">
        {todayTasks.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-[#202436] rounded-xl">
            <Sparkles className="w-6 h-6 text-zinc-600 mx-auto mb-2" />
            <p className="text-xs text-zinc-400 font-medium">Nenhuma tarefa agendada para hoje!</p>
            <p className="text-[11px] text-zinc-600 mt-0.5">Aproveite o tempo livre ou adicione uma nova meta acima.</p>
          </div>
        ) : (
          <>
            {/* Pending Tasks */}
            {pendingTasks.map(task => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 bg-[#141620] hover:bg-[#181b28] border border-[#202332] hover:border-[#2d3246] rounded-xl transition-all group"
              >
                <div className="flex items-center space-x-3 truncate">
                  <button
                    onClick={() => toggleTaskStatus(task.id)}
                    className="shrink-0 text-zinc-600 hover:text-indigo-400 transition-colors"
                    title="Concluir tarefa"
                  >
                    <Circle className="w-4 h-4" />
                  </button>

                  <div 
                    onClick={() => setEditingTaskId(task.id)}
                    className="truncate cursor-pointer"
                  >
                    <span className="text-xs sm:text-sm font-medium text-zinc-200 group-hover:text-white transition-colors truncate block">
                      {task.title}
                    </span>
                    <div className="flex items-center space-x-2 mt-0.5 text-[11px] text-zinc-500">
                      <span>{task.category}</span>
                      {task.time && (
                        <>
                          <span>&bull;</span>
                          <span className="flex items-center gap-1 font-mono text-zinc-400">
                            <Clock className="w-2.5 h-2.5" />
                            {task.time}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0 ml-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    task.priority === 'alta' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                    task.priority === 'media' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            ))}

            {/* Completed Tasks Accordion / Group */}
            {completedTasks.length > 0 && (
              <div className="pt-2">
                <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block mb-1.5">
                  Concluídas hoje ({completedTasks.length})
                </span>
                <div className="space-y-1.5 opacity-60 hover:opacity-100 transition-opacity">
                  {completedTasks.map(task => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-2.5 bg-[#12141c] border border-[#1b1e29] rounded-xl"
                    >
                      <div className="flex items-center space-x-3 truncate">
                        <button
                          onClick={() => toggleTaskStatus(task.id)}
                          className="shrink-0 text-emerald-400 hover:text-zinc-500 transition-colors"
                          title="Desmarcar"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <span className="text-xs sm:text-sm text-zinc-400 line-through truncate">
                          {task.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono ml-2 shrink-0">
                        Feito
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="pt-3 border-t border-[#1b1e2a] flex items-center justify-between">
        <span className="text-xs text-zinc-500">
          Mostrando tarefas de hoje ({todayTasks.length})
        </span>
        <button
          onClick={() => setActiveTab('tasks')}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center space-x-1 group"
        >
          <span>Ver todas as tarefas</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </section>
  );
};
