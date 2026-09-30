import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  CheckSquare, 
  Clock, 
  Plus, 
  Circle, 
  CheckCircle2 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getRelativeDate } from '../../data/initialData';
import { Priority } from '../../types';

export const CalendarView: React.FC = () => {
  const { tasks, projects, addTask, toggleTaskStatus, setEditingTaskId } = useApp();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(getRelativeDate(0));
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>('media');

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDateStr(getRelativeDate(0));
  };

  // Month data calculation
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(currentDate);
  const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Days array (with blank pads for previous month)
  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    days.push(dStr);
  }

  // Active tasks and selected day items
  const activeTasks = tasks.filter(t => !t.archived);
  const selectedDayTasks = activeTasks.filter(t => t.date === selectedDateStr);
  const selectedDayDeadlines = projects.filter(p => p.deadline === selectedDateStr);

  const handleAddDayTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    addTask({
      title: newTaskTitle.trim(),
      date: selectedDateStr,
      priority: newTaskPriority,
      category: 'Trabalho',
      status: 'pendente',
    });

    setNewTaskTitle('');
  };

  const todayStr = getRelativeDate(0);

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2.5">
            <span>Calendário & Prazos</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Planejamento mensal de compromissos, tarefas e entregas estratégicas
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={goToToday}
            className="px-3 py-1.5 bg-[#151722] hover:bg-[#1d202e] border border-[#25293a] text-zinc-300 rounded-lg text-xs font-medium transition-colors"
          >
            Hoje
          </button>
          <div className="flex items-center space-x-1 bg-[#151722] border border-[#25293a] rounded-lg p-1">
            <button
              onClick={prevMonth}
              className="p-1 text-zinc-400 hover:text-white rounded hover:bg-[#1e2232]"
              title="Mês Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 text-xs font-semibold text-zinc-200">
              {capitalizedMonth}
            </span>
            <button
              onClick={nextMonth}
              className="p-1 text-zinc-400 hover:text-white rounded hover:bg-[#1e2232]"
              title="Próximo Mês"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Calendar on Left (8 cols), Selected Day Drawer on Right (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calendar Grid (8 cols) */}
        <div className="lg:col-span-8 bg-[#11131a] border border-[#1f2230] rounded-2xl p-5 shadow-subtle flex flex-col">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(w => (
              <span key={w} className="text-[11px] font-semibold text-zinc-500 uppercase py-1">
                {w}
              </span>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-1.5 flex-1">
            {days.map((dateStr, idx) => {
              if (!dateStr) {
                return <div key={`empty-${idx}`} className="h-20 sm:h-24 rounded-xl opacity-20 bg-transparent" />;
              }

              const dayNumber = parseInt(dateStr.split('-')[2]);
              const isToday = dateStr === todayStr;
              const isSelected = dateStr === selectedDateStr;

              const dayTasks = activeTasks.filter(t => t.date === dateStr);
              const dayDeadlines = projects.filter(p => p.deadline === dateStr);
              const hasHighPriority = dayTasks.some(t => t.priority === 'alta' && t.status !== 'concluida');

              return (
                <div
                  key={dateStr}
                  onClick={() => setSelectedDateStr(dateStr)}
                  className={`h-20 sm:h-24 p-2 rounded-xl border cursor-pointer transition-all duration-150 flex flex-col justify-between group ${
                    isSelected
                      ? 'bg-[#181b29] border-indigo-500 shadow-sm'
                      : isToday
                      ? 'bg-[#151724] border-indigo-500/40'
                      : 'bg-[#13151f] hover:bg-[#171a26] border-[#1f2232]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-mono font-bold ${
                      isToday ? 'text-indigo-400' : isSelected ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'
                    }`}>
                      {dayNumber}
                    </span>

                    {dayDeadlines.length > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400" title="Prazo de Projeto" />
                    )}
                  </div>

                  {/* Task pill count */}
                  <div className="space-y-1">
                    {dayTasks.length > 0 && (
                      <div className={`text-[10px] px-1 py-0.5 rounded truncate font-mono ${
                        hasHighPriority ? 'bg-red-500/15 text-red-300' : 'bg-[#1e2232] text-zinc-400'
                      }`}>
                        {dayTasks.length} {dayTasks.length === 1 ? 'tarefa' : 'tarefas'}
                      </div>
                    )}
                    {dayDeadlines.length > 0 && (
                      <div className="text-[9px] px-1 py-0.5 rounded bg-violet-500/20 text-violet-300 truncate font-medium">
                        {dayDeadlines[0].name}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Details Panel (4 cols) */}
        <div className="lg:col-span-4 bg-[#11131a] border border-[#1f2230] rounded-2xl p-5 shadow-subtle flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#1b1e2a] mb-3">
              <div>
                <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block">
                  Data Selecionada
                </span>
                <h3 className="text-base font-bold text-white tracking-tight">
                  {selectedDateStr === todayStr ? 'Hoje' : selectedDateStr}
                </h3>
              </div>
              <span className="text-xs font-mono text-zinc-400 bg-[#161824] px-2 py-1 rounded-lg border border-[#232738]">
                {selectedDayTasks.length} tarefas
              </span>
            </div>

            {/* Project Deadlines on this day */}
            {selectedDayDeadlines.length > 0 && (
              <div className="mb-3 p-3 bg-violet-950/20 border border-violet-500/30 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-violet-300 tracking-wider">
                  Prazo de Projeto
                </span>
                {selectedDayDeadlines.map(p => (
                  <p key={p.id} className="text-xs font-semibold text-white">
                    {p.name} ({p.category})
                  </p>
                ))}
              </div>
            )}

            {/* Tasks on this day */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {selectedDayTasks.length === 0 ? (
                <div className="text-center py-10 text-xs text-zinc-500 border border-dashed border-[#1e2232] rounded-xl">
                  Nenhuma tarefa agendada para esta data.
                </div>
              ) : (
                selectedDayTasks.map(task => {
                  const isDone = task.status === 'concluida';
                  return (
                    <div
                      key={task.id}
                      className="p-2.5 bg-[#141620] hover:bg-[#181a26] border border-[#202332] rounded-xl flex items-center justify-between transition-colors group"
                    >
                      <div className="flex items-center space-x-2.5 truncate">
                        <button
                          onClick={() => toggleTaskStatus(task.id)}
                          className="shrink-0"
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Circle className="w-4 h-4 text-zinc-600 group-hover:text-indigo-400" />
                          )}
                        </button>
                        <span 
                          onClick={() => setEditingTaskId(task.id)}
                          className={`text-xs truncate cursor-pointer font-medium ${
                            isDone ? 'line-through text-zinc-500' : 'text-zinc-200 group-hover:text-white'
                          }`}
                        >
                          {task.title}
                        </span>
                      </div>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono shrink-0 ml-2 ${
                        task.priority === 'alta' ? 'bg-red-500/10 text-red-400' :
                        task.priority === 'media' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-blue-500/10 text-blue-400'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Quick add task for this specific date */}
          <form onSubmit={handleAddDayTask} className="pt-3 border-t border-[#1b1e2a] space-y-2">
            <span className="text-[11px] font-medium text-zinc-400 block">
              + Adicionar tarefa para esta data:
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Título da tarefa..."
                className="flex-1 px-3 py-1.5 bg-[#171924] border border-[#272b3c] rounded-lg text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
              />
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value as Priority)}
                className="px-2 py-1.5 bg-[#171924] border border-[#272b3c] rounded-lg text-xs text-zinc-300 focus:outline-none"
              >
                <option value="alta">Alta</option>
                <option value="media">Média</option>
                <option value="baixa">Baixa</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors"
            >
              Adicionar para {selectedDateStr}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
