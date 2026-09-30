import React, { useState, useEffect } from 'react';
import { 
  X, 
  Trash2, 
  Calendar as CalendarIcon, 
  Clock, 
  Flag, 
  Tag, 
  Briefcase,
  Archive
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Priority, TaskStatus } from '../../types';

export const TaskModal: React.FC = () => {
  const { 
    editingTaskId, 
    setEditingTaskId, 
    tasks, 
    updateTask, 
    deleteTask, 
    archiveTask,
    projects 
  } = useApp();

  const task = tasks.find(t => t.id === editingTaskId);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [priority, setPriority] = useState<Priority>('media');
  const [category, setCategory] = useState('Trabalho');
  const [status, setStatus] = useState<TaskStatus>('pendente');
  const [projectId, setProjectId] = useState<string>('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setDate(task.date);
      setTime(task.time || '');
      setPriority(task.priority);
      setCategory(task.category);
      setStatus(task.status);
      setProjectId(task.projectId || '');
    }
  }, [task]);

  if (!editingTaskId || !task) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    updateTask(task.id, {
      title: title.trim(),
      description: description.trim() || undefined,
      date,
      time: time || undefined,
      priority,
      category,
      status,
      projectId: projectId || undefined,
      completedAt: status === 'concluida' ? (task.completedAt || new Date().toISOString().split('T')[0]) : undefined
    });

    setEditingTaskId(null);
  };

  const handleDelete = () => {
    deleteTask(task.id);
    setEditingTaskId(null);
  };

  const handleToggleArchive = () => {
    archiveTask(task.id);
    setEditingTaskId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="fixed inset-0" 
        onClick={() => setEditingTaskId(null)} 
      />

      <div className="relative w-full max-w-lg bg-[#12141c] border border-[#232738] rounded-2xl shadow-2xl overflow-hidden z-10 p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1f2233]">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Editar Tarefa
          </span>
          <div className="flex items-center space-x-1">
            <button
              onClick={handleToggleArchive}
              className="p-1.5 text-zinc-500 hover:text-zinc-300 rounded-lg hover:bg-[#181b28]"
              title={task.archived ? 'Desarquivar tarefa' : 'Arquivar tarefa'}
            >
              <Archive className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 text-zinc-500 hover:text-red-400 rounded-lg hover:bg-red-500/10"
              title="Excluir tarefa"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setEditingTaskId(null)}
              className="p-1.5 text-zinc-500 hover:text-zinc-300 rounded-lg hover:bg-[#181b28]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Título *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-[#171924] border border-[#272b3c] rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Descrição</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Notas ou detalhes da tarefa..."
              className="w-full px-3 py-2 bg-[#171924] border border-[#272b3c] rounded-lg text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1 flex items-center gap-1">
                <CalendarIcon className="w-3 h-3 text-zinc-500" />
                <span>Data</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#171924] border border-[#272b3c] rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-zinc-500" />
                <span>Horário</span>
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#171924] border border-[#272b3c] rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1 flex items-center gap-1">
                <Flag className="w-3 h-3 text-zinc-500" />
                <span>Prioridade</span>
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-2.5 py-1.5 bg-[#171924] border border-[#272b3c] rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1 flex items-center gap-1">
                <Tag className="w-3 h-3 text-zinc-500" />
                <span>Categoria</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[#171924] border border-[#272b3c] rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="Trabalho">Trabalho</option>
                <option value="Pessoal">Pessoal</option>
                <option value="Estudos">Estudos</option>
                <option value="Finanças">Finanças</option>
                <option value="Saúde">Saúde</option>
                <option value="Ideias">Ideias</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-2.5 py-1.5 bg-[#171924] border border-[#272b3c] rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="pendente">Pendente</option>
                <option value="em_andamento">Em andamento</option>
                <option value="concluida">Concluída</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1 flex items-center gap-1">
              <Briefcase className="w-3 h-3 text-zinc-500" />
              <span>Vínculo de Projeto</span>
            </label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full px-3 py-1.5 bg-[#171924] border border-[#272b3c] rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="">Nenhum projeto</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.category})</option>
              ))}
            </select>
          </div>

          <div className="pt-2 flex items-center justify-end space-x-2 border-t border-[#1f2233]">
            <button
              type="button"
              onClick={() => setEditingTaskId(null)}
              className="px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium shadow-sm transition-all"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
