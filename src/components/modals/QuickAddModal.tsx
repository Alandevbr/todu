import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckSquare, 
  FileText, 
  FolderKanban, 
  Calendar as CalendarIcon, 
  Clock, 
  Flag,
  Tag,
  Briefcase
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Priority, ProjectStatus } from '../../types';
import { getRelativeDate } from '../../data/initialData';

export const QuickAddModal: React.FC = () => {
  const { 
    isQuickAddOpen, 
    setIsQuickAddOpen, 
    quickAddType, 
    setQuickAddType,
    addTask, 
    addNote, 
    addProject, 
    projects,
    setActiveTab
  } = useApp();

  // Task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDate, setTaskDate] = useState(getRelativeDate(0));
  const [taskTime, setTaskTime] = useState('');
  const [taskPriority, setTaskPriority] = useState<Priority>('media');
  const [taskCategory, setTaskCategory] = useState('Trabalho');
  const [taskProjectId, setTaskProjectId] = useState<string>('');

  // Note form state
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteCategory, setNoteCategory] = useState('Geral');
  const [noteFolder, setNoteFolder] = useState('');
  const [noteIsQuick, setNoteIsQuick] = useState(false);
  const [noteIsInbox, setNoteIsInbox] = useState(false);

  // Project form state
  const [projName, setProjName] = useState('');
  const [projDescription, setProjDescription] = useState('');
  const [projCategory, setProjCategory] = useState('Carreira');
  const [projDeadline, setProjDeadline] = useState(getRelativeDate(30));
  const [projColor, setProjColor] = useState('#6366f1');

  useEffect(() => {
    if (isQuickAddOpen) {
      setTaskDate(getRelativeDate(0));
    }
  }, [isQuickAddOpen]);

  if (!isQuickAddOpen) return null;

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    addTask({
      title: taskTitle.trim(),
      description: taskDescription.trim() || undefined,
      date: taskDate,
      time: taskTime || undefined,
      priority: taskPriority,
      category: taskCategory,
      status: 'pendente',
      projectId: taskProjectId || undefined,
    });

    // Reset and close
    setTaskTitle('');
    setTaskDescription('');
    setTaskTime('');
    setIsQuickAddOpen(false);
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim()) return;

    addNote({
      title: noteTitle.trim(),
      content: noteContent.trim(),
      category: noteCategory,
      folder: noteFolder.trim() || undefined,
      isQuickNote: noteIsQuick,
      isInbox: noteIsInbox,
    });

    // Reset and close
    setNoteTitle('');
    setNoteContent('');
    setIsQuickAddOpen(false);
    setActiveTab('notes');
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projName.trim()) return;

    addProject({
      name: projName.trim(),
      description: projDescription.trim(),
      category: projCategory,
      deadline: projDeadline,
      status: 'em_andamento' as ProjectStatus,
      progress: 0,
      icon: 'FolderKanban',
      color: projColor,
    });

    // Reset and close
    setProjName('');
    setProjDescription('');
    setIsQuickAddOpen(false);
    setActiveTab('projects');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="fixed inset-0" 
        onClick={() => setIsQuickAddOpen(false)} 
      />

      <div className="relative w-full max-w-lg bg-[#12141c] border border-[#232738] rounded-2xl shadow-2xl overflow-hidden z-10">
        {/* Header Tabs */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-[#1f2233] bg-[#151722]">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setQuickAddType('task')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                quickAddType === 'task'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5 text-indigo-400" />
              <span>Nova Tarefa</span>
            </button>
            <button
              onClick={() => setQuickAddType('note')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                quickAddType === 'note'
                  ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>Nova Nota</span>
            </button>
            <button
              onClick={() => setQuickAddType('project')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                quickAddType === 'project'
                  ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <FolderKanban className="w-3.5 h-3.5 text-violet-400" />
              <span>Novo Projeto</span>
            </button>
          </div>

          <button
            onClick={() => setIsQuickAddOpen(false)}
            className="p-1 text-zinc-500 hover:text-zinc-300 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Task Form */}
        {quickAddType === 'task' && (
          <form onSubmit={handleCreateTask} className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Título da Tarefa *</label>
              <input
                type="text"
                autoFocus
                required
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="Ex: Concluir revisão do projeto de arquitetura"
                className="w-full px-3 py-2 bg-[#171924] border border-[#272b3c] rounded-lg text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Descrição (opcional)</label>
              <textarea
                rows={2}
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                placeholder="Detalhes ou critérios de aceitação..."
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
                  value={taskDate}
                  onChange={(e) => setTaskDate(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#171924] border border-[#272b3c] rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-zinc-500" />
                  <span>Horário (opcional)</span>
                </label>
                <input
                  type="time"
                  value={taskTime}
                  onChange={(e) => setTaskTime(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#171924] border border-[#272b3c] rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1 flex items-center gap-1">
                  <Flag className="w-3 h-3 text-zinc-500" />
                  <span>Prioridade</span>
                </label>
                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value as Priority)}
                  className="w-full px-3 py-1.5 bg-[#171924] border border-[#272b3c] rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
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
                  value={taskCategory}
                  onChange={(e) => setTaskCategory(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#171924] border border-[#272b3c] rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Trabalho">Trabalho</option>
                  <option value="Pessoal">Pessoal</option>
                  <option value="Estudos">Estudos</option>
                  <option value="Finanças">Finanças</option>
                  <option value="Saúde">Saúde</option>
                  <option value="Ideias">Ideias</option>
                </select>
              </div>
            </div>

            {/* Associate with Project */}
            {projects.length > 0 && (
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1 flex items-center gap-1">
                  <Briefcase className="w-3 h-3 text-zinc-500" />
                  <span>Vincular a Projeto (opcional)</span>
                </label>
                <select
                  value={taskProjectId}
                  onChange={(e) => setTaskProjectId(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#171924] border border-[#272b3c] rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="">Nenhum projeto</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.category})</option>
                  ))}
                </select>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end space-x-2 border-t border-[#1f2233]">
              <button
                type="button"
                onClick={() => setIsQuickAddOpen(false)}
                className="px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium shadow-sm transition-all"
              >
                Adicionar Tarefa
              </button>
            </div>
          </form>
        )}

        {/* Note Form */}
        {quickAddType === 'note' && (
          <form onSubmit={handleCreateNote} className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Título da Nota *</label>
              <input
                type="text"
                autoFocus
                required
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="Ex: Reflexões sobre produtividade e foco"
                className="w-full px-3 py-2 bg-[#171924] border border-[#272b3c] rounded-lg text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Conteúdo (suporta Markdown)</label>
              <textarea
                rows={5}
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Escreva sua nota, ideias, checklists com `- [ ]`..."
                className="w-full px-3 py-2 bg-[#171924] border border-[#272b3c] rounded-lg text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 resize-none font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Categoria</label>
                <select
                  value={noteCategory}
                  onChange={(e) => setNoteCategory(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#171924] border border-[#272b3c] rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Geral">Geral</option>
                  <option value="Estudos">Estudos</option>
                  <option value="Carreira">Carreira</option>
                  <option value="Pessoal">Pessoal</option>
                  <option value="Ideias">Ideias</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Pasta / Subpasta</label>
                <input
                  type="text"
                  value={noteFolder}
                  onChange={(e) => setNoteFolder(e.target.value)}
                  placeholder="Ex: Engenharia, Leituras"
                  className="w-full px-3 py-1.5 bg-[#171924] border border-[#272b3c] rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4 pt-1">
              <label className="flex items-center space-x-2 text-xs text-zinc-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={noteIsQuick}
                  onChange={(e) => setNoteIsQuick(e.target.checked)}
                  className="rounded border-[#2a2e40] bg-[#191c28] text-emerald-500 focus:ring-0"
                />
                <span>Anotação Rápida</span>
              </label>

              <label className="flex items-center space-x-2 text-xs text-zinc-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={noteIsInbox}
                  onChange={(e) => setNoteIsInbox(e.target.checked)}
                  className="rounded border-[#2a2e40] bg-[#191c28] text-emerald-500 focus:ring-0"
                />
                <span>Caixa de Entrada</span>
              </label>
            </div>

            <div className="pt-2 flex items-center justify-end space-x-2 border-t border-[#1f2233]">
              <button
                type="button"
                onClick={() => setIsQuickAddOpen(false)}
                className="px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium shadow-sm transition-all"
              >
                Salvar Nota
              </button>
            </div>
          </form>
        )}

        {/* Project Form */}
        {quickAddType === 'project' && (
          <form onSubmit={handleCreateProject} className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Nome do Projeto *</label>
              <input
                type="text"
                autoFocus
                required
                value={projName}
                onChange={(e) => setProjName(e.target.value)}
                placeholder="Ex: Aprender Arquitetura de Microsserviços"
                className="w-full px-3 py-2 bg-[#171924] border border-[#272b3c] rounded-lg text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Descrição</label>
              <textarea
                rows={2}
                value={projDescription}
                onChange={(e) => setProjDescription(e.target.value)}
                placeholder="Objetivo principal e escopo do projeto..."
                className="w-full px-3 py-2 bg-[#171924] border border-[#272b3c] rounded-lg text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-violet-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Área / Categoria</label>
                <select
                  value={projCategory}
                  onChange={(e) => setProjCategory(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#171924] border border-[#272b3c] rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-violet-500"
                >
                  <option value="Carreira">Carreira</option>
                  <option value="Projetos Pessoais">Projetos Pessoais</option>
                  <option value="Estudos">Estudos</option>
                  <option value="Finanças">Finanças</option>
                  <option value="Saúde">Saúde</option>
                  <option value="Ideias">Ideias</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Prazo Alvo</label>
                <input
                  type="date"
                  value={projDeadline}
                  onChange={(e) => setProjDeadline(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#171924] border border-[#272b3c] rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Cor Temática</label>
              <div className="flex items-center space-x-2">
                {[
                  { color: '#6366f1', label: 'Indigo' },
                  { color: '#8b5cf6', label: 'Violet' },
                  { color: '#3b82f6', label: 'Azul' },
                  { color: '#10b981', label: 'Verde' },
                  { color: '#f59e0b', label: 'Âmbar' },
                  { color: '#f43f5e', label: 'Rosa' },
                ].map(c => (
                  <button
                    key={c.color}
                    type="button"
                    onClick={() => setProjColor(c.color)}
                    className={`w-6 h-6 rounded-full transition-transform ${
                      projColor === c.color ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-[#12141c]' : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: c.color }}
                    title={c.label}
                  />
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end space-x-2 border-t border-[#1f2233]">
              <button
                type="button"
                onClick={() => setIsQuickAddOpen(false)}
                className="px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-medium shadow-sm transition-all"
              >
                Criar Projeto
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
