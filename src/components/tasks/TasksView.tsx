import React, { useState } from 'react';
import { 
  CheckSquare, 
  Circle, 
  CheckCircle2, 
  Plus, 
  Filter, 
  Calendar as CalendarIcon, 
  Clock, 
  Flag, 
  Tag, 
  Trash2, 
  Edit3, 
  AlertTriangle, 
  LayoutList, 
  Kanban,
  Archive,
  ArrowUpDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Priority, TaskStatus, Task } from '../../types';
import { getRelativeDate } from '../../data/initialData';

export const TasksView: React.FC = () => {
  const { 
    tasks, 
    addTask, 
    toggleTaskStatus, 
    deleteTask, 
    setEditingTaskId,
    archiveTask,
    setIsQuickAddOpen,
    setQuickAddType
  } = useApp();

  // Filters & Views
  const [timeFilter, setTimeFilter] = useState<'todas' | 'hoje' | 'semana' | 'atrasadas' | 'concluidas'>('todas');
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [selectedPriority, setSelectedPriority] = useState<string>('todas');
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'status'>('date');

  // Inline quick create
  const [inlineTitle, setInlineTitle] = useState('');
  const [inlineCategory, setInlineCategory] = useState('Trabalho');
  const [inlinePriority, setInlinePriority] = useState<Priority>('media');
  const [inlineDate, setInlineDate] = useState(getRelativeDate(0));

  const todayStr = getRelativeDate(0);

  // Active non-archived tasks
  const activeTasks = tasks.filter(t => !t.archived);

  // Overdue calculation
  const overdueTasks = activeTasks.filter(t => t.date < todayStr && t.status !== 'concluida');

  // Filter application
  let filtered = activeTasks.filter(task => {
    // Time filter
    if (timeFilter === 'hoje') {
      if (task.date !== todayStr) return false;
    } else if (timeFilter === 'semana') {
      const maxWeekDate = getRelativeDate(7);
      if (task.date < todayStr || task.date > maxWeekDate) return false;
    } else if (timeFilter === 'atrasadas') {
      if (task.date >= todayStr || task.status === 'concluida') return false;
    } else if (timeFilter === 'concluidas') {
      if (task.status !== 'concluida') return false;
    }

    // Category
    if (selectedCategory !== 'todas' && task.category !== selectedCategory) return false;

    // Priority
    if (selectedPriority !== 'todas' && task.priority !== selectedPriority) return false;

    return true;
  });

  // Sorting
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'date') return a.date.localeCompare(b.date);
    if (sortBy === 'priority') {
      const pWeight = { alta: 3, media: 2, baixa: 1 };
      return pWeight[b.priority] - pWeight[a.priority];
    }
    if (sortBy === 'status') {
      const sWeight = { pendente: 1, em_andamento: 2, concluida: 3 };
      return sWeight[a.status] - sWeight[b.status];
    }
    return 0;
  });

  const handleInlineAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inlineTitle.trim()) return;

    addTask({
      title: inlineTitle.trim(),
      date: inlineDate,
      category: inlineCategory,
      priority: inlinePriority,
      status: 'pendente',
    });

    setInlineTitle('');
  };

  const categories = ['todas', 'Trabalho', 'Pessoal', 'Estudos', 'Finanças', 'Saúde', 'Ideias'];

  const completedCount = activeTasks.filter(t => t.status === 'concluida').length;
  const completionRate = activeTasks.length > 0 ? Math.round((completedCount / activeTasks.length) * 100) : 0;

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Banner and Quick Metrics */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2.5">
            <span>Gestão de Tarefas</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
              {activeTasks.length} ativas
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Organize prazos, categorias e prioridades com visão integrada
          </p>
        </div>

        {/* Global Add Button */}
        <button
          onClick={() => {
            setQuickAddType('task');
            setIsQuickAddOpen(true);
          }}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-sm shadow-indigo-600/30 self-start md:self-auto transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Tarefa</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-[#11131b] border border-[#1e2230] rounded-xl">
          <span className="text-xs text-zinc-400 block mb-1">Total de Tarefas</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white font-mono">{activeTasks.length}</span>
            <span className="text-[11px] text-zinc-500">no sistema</span>
          </div>
        </div>

        <div className="p-4 bg-[#11131b] border border-[#1e2230] rounded-xl">
          <span className="text-xs text-zinc-400 block mb-1">Concluídas</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-emerald-400 font-mono">{completedCount}</span>
            <span className="text-[11px] text-zinc-500">finalizadas</span>
          </div>
        </div>

        <div className="p-4 bg-[#11131b] border border-[#1e2230] rounded-xl">
          <span className="text-xs text-zinc-400 block mb-1">Atrasadas</span>
          <div className="flex items-baseline space-x-2">
            <span className={`text-2xl font-bold font-mono ${overdueTasks.length > 0 ? 'text-red-400' : 'text-zinc-400'}`}>
              {overdueTasks.length}
            </span>
            <span className="text-[11px] text-zinc-500">requerem atenção</span>
          </div>
        </div>

        <div className="p-4 bg-[#11131b] border border-[#1e2230] rounded-xl">
          <span className="text-xs text-zinc-400 block mb-1">Taxa de Eficiência</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-indigo-400 font-mono">{completionRate}%</span>
            <span className="text-[11px] text-zinc-500">conclusão</span>
          </div>
        </div>
      </div>

      {/* Overdue alert if applicable */}
      {overdueTasks.length > 0 && timeFilter !== 'atrasadas' && (
        <div className="p-3.5 bg-red-950/20 border border-red-500/25 rounded-xl flex items-center justify-between text-xs text-red-300">
          <div className="flex items-center space-x-2.5">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>
              Você tem <strong>{overdueTasks.length}</strong> {overdueTasks.length === 1 ? 'tarefa atrasada' : 'tarefas atrasadas'}.
            </span>
          </div>
          <button
            onClick={() => setTimeFilter('atrasadas')}
            className="text-red-400 hover:text-red-200 underline font-medium"
          >
            Visualizar atrasadas
          </button>
        </div>
      )}

      {/* Filter and View Controls Toolbar */}
      <div className="bg-[#11131a] border border-[#1f2230] rounded-2xl p-4 space-y-3">
        {/* Row 1: Time Filters & View Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1b1e2a]">
          {/* Time Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'todas', label: 'Todas' },
              { id: 'hoje', label: 'Hoje' },
              { id: 'semana', label: 'Esta Semana' },
              { id: 'atrasadas', label: `Atrasadas (${overdueTasks.length})` },
              { id: 'concluidas', label: 'Concluídas' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setTimeFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  timeFilter === tab.id
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#161824]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* View mode & Sort */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-[#161824] p-1 rounded-lg border border-[#232738]">
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Lista Tradicional"
              >
                <LayoutList className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'kanban' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Quadro Kanban"
              >
                <Kanban className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center space-x-1.5 text-xs text-zinc-400 bg-[#161824] px-2.5 py-1.5 rounded-lg border border-[#232738]">
              <ArrowUpDown className="w-3 h-3 text-zinc-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs text-zinc-300 focus:outline-none"
              >
                <option value="date">Por Data</option>
                <option value="priority">Por Prioridade</option>
                <option value="status">Por Status</option>
              </select>
            </div>
          </div>
        </div>

        {/* Row 2: Category and Priority Filter Chips */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-zinc-500 text-[11px] mr-1">Categoria:</span>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2 py-0.5 rounded-md text-[11px] capitalize transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#232738] text-white border border-[#353b52]'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Priority */}
          <div className="flex items-center space-x-1.5">
            <span className="text-zinc-500 text-[11px]">Prioridade:</span>
            {['todas', 'alta', 'media', 'baixa'].map(p => (
              <button
                key={p}
                onClick={() => setSelectedPriority(p)}
                className={`px-2 py-0.5 rounded-md text-[11px] capitalize transition-colors ${
                  selectedPriority === p
                    ? 'bg-[#232738] text-white border border-[#353b52]'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Inline Quick Add Task Box */}
      <form onSubmit={handleInlineAdd} className="bg-[#12141c] border border-[#212433] rounded-xl p-3 flex flex-wrap sm:flex-nowrap gap-2 items-center">
        <input
          type="text"
          value={inlineTitle}
          onChange={(e) => setInlineTitle(e.target.value)}
          placeholder="+ Adicionar tarefa rápida nesta visualização..."
          className="flex-1 px-3 py-1.5 bg-[#171924] border border-[#272b3c] rounded-lg text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
        />
        <input
          type="date"
          value={inlineDate}
          onChange={(e) => setInlineDate(e.target.value)}
          className="px-2.5 py-1.5 bg-[#171924] border border-[#272b3c] rounded-lg text-xs text-zinc-300 focus:outline-none"
        />
        <select
          value={inlineCategory}
          onChange={(e) => setInlineCategory(e.target.value)}
          className="px-2 py-1.5 bg-[#171924] border border-[#272b3c] rounded-lg text-xs text-zinc-300 focus:outline-none"
        >
          <option value="Trabalho">Trabalho</option>
          <option value="Pessoal">Pessoal</option>
          <option value="Estudos">Estudos</option>
          <option value="Finanças">Finanças</option>
          <option value="Saúde">Saúde</option>
          <option value="Ideias">Ideias</option>
        </select>
        <select
          value={inlinePriority}
          onChange={(e) => setInlinePriority(e.target.value as Priority)}
          className="px-2 py-1.5 bg-[#171924] border border-[#272b3c] rounded-lg text-xs text-zinc-300 focus:outline-none"
        >
          <option value="alta">Alta</option>
          <option value="media">Média</option>
          <option value="baixa">Baixa</option>
        </select>
        <button
          type="submit"
          className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium whitespace-nowrap transition-colors"
        >
          Adicionar
        </button>
      </form>

      {/* Main Content: Traditional List vs Kanban Board */}
      {viewMode === 'list' ? (
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-[#11131b] border border-dashed border-[#202332] rounded-2xl">
              <CheckSquare className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
              <p className="text-sm text-zinc-300 font-medium">Nenhuma tarefa encontrada com os filtros selecionados.</p>
              <p className="text-xs text-zinc-500 mt-1">Experimente alterar os filtros ou criar uma nova tarefa.</p>
            </div>
          ) : (
            filtered.map(task => {
              const isOverdue = task.date < todayStr && task.status !== 'concluida';
              const isDone = task.status === 'concluida';

              return (
                <div
                  key={task.id}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all duration-150 group ${
                    isDone
                      ? 'bg-[#10121a]/60 border-[#1a1c27] opacity-65'
                      : isOverdue
                      ? 'bg-[#151218] border-red-500/25 hover:border-red-500/40'
                      : 'bg-[#12141c] hover:bg-[#161925] border-[#202332] hover:border-[#2f3448]'
                  }`}
                >
                  <div className="flex items-center space-x-3.5 truncate">
                    {/* Status Checkbox */}
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className="shrink-0 transition-colors"
                      title={isDone ? 'Marcar como pendente' : 'Marcar como concluída'}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Circle className="w-4 h-4 text-zinc-600 group-hover:text-indigo-400" />
                      )}
                    </button>

                    {/* Task Title & Details */}
                    <div 
                      onClick={() => setEditingTaskId(task.id)}
                      className="truncate cursor-pointer"
                    >
                      <span className={`text-xs sm:text-sm font-medium transition-colors block truncate ${
                        isDone ? 'text-zinc-500 line-through' : 'text-zinc-200 group-hover:text-white'
                      }`}>
                        {task.title}
                      </span>

                      <div className="flex items-center space-x-2 mt-0.5 text-[11px] text-zinc-500">
                        <span className="text-zinc-400">{task.category}</span>
                        <span>&bull;</span>
                        <span className={`flex items-center gap-1 font-mono ${isOverdue ? 'text-red-400 font-semibold' : ''}`}>
                          <CalendarIcon className="w-2.5 h-2.5" />
                          {task.date === todayStr ? 'Hoje' : task.date}
                        </span>
                        {task.time && (
                          <>
                            <span>&bull;</span>
                            <span className="flex items-center gap-1 font-mono text-zinc-400">
                              <Clock className="w-2.5 h-2.5" />
                              {task.time}
                            </span>
                          </>
                        )}
                        {task.description && (
                          <>
                            <span className="hidden sm:inline">&bull;</span>
                            <span className="hidden sm:inline truncate max-w-xs text-zinc-500">
                              {task.description}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Priority & Actions */}
                  <div className="flex items-center space-x-2.5 shrink-0 ml-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      task.priority === 'alta' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      task.priority === 'media' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                      {task.priority}
                    </span>

                    <button
                      onClick={() => setEditingTaskId(task.id)}
                      className="p-1 text-zinc-600 hover:text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Editar"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => archiveTask(task.id)}
                      className="p-1 text-zinc-600 hover:text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Arquivar"
                    >
                      <Archive className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Excluir"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Kanban Board View */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { id: 'pendente', label: 'Pendente', color: 'text-zinc-400', bg: 'border-zinc-700/40' },
            { id: 'em_andamento', label: 'Em Andamento', color: 'text-amber-400', bg: 'border-amber-500/30' },
            { id: 'concluida', label: 'Concluída', color: 'text-emerald-400', bg: 'border-emerald-500/30' },
          ].map(col => {
            const colTasks = filtered.filter(t => t.status === col.id);

            return (
              <div key={col.id} className="bg-[#10121a] border border-[#1e2230] rounded-2xl p-4 flex flex-col min-h-[400px]">
                <div className="flex items-center justify-between pb-3 border-b border-[#1b1e2a] mb-3">
                  <span className={`text-xs font-bold uppercase tracking-wider ${col.color}`}>
                    {col.label}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#161824] text-zinc-400 font-mono">
                    {colTasks.length}
                  </span>
                </div>

                <div className="space-y-2 flex-1">
                  {colTasks.length === 0 ? (
                    <div className="text-center py-10 text-[11px] text-zinc-600 border border-dashed border-[#1b1e28] rounded-xl">
                      Nenhuma tarefa
                    </div>
                  ) : (
                    colTasks.map(task => (
                      <div
                        key={task.id}
                        onClick={() => setEditingTaskId(task.id)}
                        className="p-3 bg-[#141620] hover:bg-[#181a26] border border-[#202332] rounded-xl cursor-pointer transition-all space-y-2 group"
                      >
                        <div className="flex items-start justify-between">
                          <span className={`text-xs font-medium leading-snug group-hover:text-white ${
                            task.status === 'concluida' ? 'line-through text-zinc-500' : 'text-zinc-200'
                          }`}>
                            {task.title}
                          </span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ml-2 shrink-0 ${
                            task.priority === 'alta' ? 'bg-red-500/10 text-red-400' :
                            task.priority === 'media' ? 'bg-amber-500/10 text-amber-400' :
                            'bg-blue-500/10 text-blue-400'
                          }`}>
                            {task.priority}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1 border-t border-[#1b1e29]">
                          <span>{task.category}</span>
                          <span className="font-mono">{task.date}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
