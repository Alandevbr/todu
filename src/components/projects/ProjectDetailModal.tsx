import React, { useState } from 'react';
import { 
  X, 
  Calendar as CalendarIcon, 
  CheckSquare, 
  FileText, 
  Plus, 
  Trash2, 
  Edit3, 
  Clock, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Priority, TaskStatus } from '../../types';

export const ProjectDetailModal: React.FC = () => {
  const { 
    selectedProjectDetailId, 
    setSelectedProjectDetailId, 
    projects, 
    updateProject, 
    deleteProject, 
    tasks, 
    notes, 
    addTask, 
    toggleTaskStatus, 
    setActiveTab, 
    setSelectedNoteId 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'tasks' | 'notes' | 'info'>('tasks');
  const [isEditing, setIsEditing] = useState(false);
  
  // Quick task add inline state
  const [inlineTaskTitle, setInlineTaskTitle] = useState('');
  const [inlineTaskPriority, setInlineTaskPriority] = useState<Priority>('media');

  // Edit fields
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDeadline, setEditDeadline] = useState('');
  const [editStatus, setEditStatus] = useState<any>('em_andamento');

  const project = projects.find(p => p.id === selectedProjectDetailId);

  if (!selectedProjectDetailId || !project) return null;

  const projectTasks = tasks.filter(t => t.projectId === project.id && !t.archived);
  const projectNotes = notes.filter(n => n.projectId === project.id && !n.deleted);

  const completedTasks = projectTasks.filter(t => t.status === 'concluida');
  const pendingTasks = projectTasks.filter(t => t.status !== 'concluida');

  const startEdit = () => {
    setEditName(project.name);
    setEditDesc(project.description);
    setEditCategory(project.category);
    setEditDeadline(project.deadline);
    setEditStatus(project.status);
    setIsEditing(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;
    updateProject(project.id, {
      name: editName.trim(),
      description: editDesc.trim(),
      category: editCategory,
      deadline: editDeadline,
      status: editStatus,
    });
    setIsEditing(false);
  };

  const handleInlineAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inlineTaskTitle.trim()) return;

    addTask({
      title: inlineTaskTitle.trim(),
      date: new Date().toISOString().split('T')[0],
      priority: inlineTaskPriority,
      category: project.category,
      status: 'pendente',
      projectId: project.id,
    });

    setInlineTaskTitle('');
  };

  // Calculate days remaining
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadlineDate = new Date(project.deadline);
  deadlineDate.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="fixed inset-0" 
        onClick={() => setSelectedProjectDetailId(null)} 
      />

      <div className="relative w-full max-w-3xl bg-[#11131b] border border-[#232738] rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[88vh]">
        {/* Banner with subtle accent gradient */}
        <div 
          className="p-6 relative border-b border-[#202334]"
          style={{
            background: `linear-gradient(135deg, ${project.color}15 0%, #11131b 80%)`
          }}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center space-x-2">
                <span 
                  className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                  style={{ backgroundColor: project.color || '#6366f1' }}
                />
                <span className="text-xs uppercase tracking-wider font-semibold text-zinc-400">
                  {project.category}
                </span>
                <span className="text-zinc-600">&bull;</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#1b1e2c] border border-[#272b3c] text-zinc-300 font-medium capitalize">
                  {project.status.replace('_', ' ')}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {project.name}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center space-x-1.5 shrink-0">
              <button
                onClick={startEdit}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-[#1a1d2c] transition-colors border border-transparent hover:border-[#2b2f42]"
                title="Editar Projeto"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  deleteProject(project.id);
                  setSelectedProjectDetailId(null);
                }}
                className="p-1.5 text-zinc-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                title="Excluir Projeto"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSelectedProjectDetailId(null)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-[#1a1d2c] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-[#1c1f2e]">
            <div className="bg-[#141622]/80 p-2.5 rounded-xl border border-[#222638]">
              <span className="text-[11px] text-zinc-400 block mb-1">Progresso Geral</span>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-white font-mono">{project.progress}%</span>
                <span className="text-[11px] text-zinc-500">{completedTasks.length}/{projectTasks.length} tarefas</span>
              </div>
              <div className="w-full h-1.5 bg-[#202434] rounded-full overflow-hidden mt-1.5">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${project.progress}%`, backgroundColor: project.color || '#6366f1' }}
                />
              </div>
            </div>

            <div className="bg-[#141622]/80 p-2.5 rounded-xl border border-[#222638]">
              <span className="text-[11px] text-zinc-400 block mb-1">Prazo Alvo</span>
              <div className="flex items-center space-x-1.5">
                <CalendarIcon className="w-4 h-4 text-zinc-400" />
                <span className="text-sm font-semibold text-zinc-200">{project.deadline}</span>
              </div>
              <span className={`text-[10px] block mt-1 font-medium ${
                diffDays < 0 ? 'text-red-400' : diffDays <= 7 ? 'text-amber-400' : 'text-zinc-500'
              }`}>
                {diffDays < 0 ? `${Math.abs(diffDays)} dias atrasado` : `${diffDays} dias restantes`}
              </span>
            </div>

            <div className="bg-[#141622]/80 p-2.5 rounded-xl border border-[#222638]">
              <span className="text-[11px] text-zinc-400 block mb-1">Notas Vinculadas</span>
              <div className="flex items-center space-x-1.5">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span className="text-lg font-bold text-zinc-200 font-mono">{projectNotes.length}</span>
              </div>
              <span className="text-[10px] text-zinc-500 block mt-1">Conhecimento e documentação</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-1 px-6 pt-3 border-b border-[#1b1e2c] bg-[#13151f]">
          <button
            onClick={() => setActiveSubTab('tasks')}
            className={`flex items-center space-x-2 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeSubTab === 'tasks'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Tarefas ({projectTasks.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('notes')}
            className={`flex items-center space-x-2 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeSubTab === 'notes'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Anotações ({projectNotes.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 flex-1 space-y-4">
          {/* Edit form inline if editing */}
          {isEditing && (
            <form onSubmit={handleSaveEdit} className="p-4 bg-[#161824] rounded-xl border border-[#262a3c] space-y-3 mb-4">
              <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Editar Informações</h4>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Nome</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#12141d] border border-[#25283a] rounded-lg text-xs text-zinc-100"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Descrição</label>
                <textarea
                  rows={2}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#12141d] border border-[#25283a] rounded-lg text-xs text-zinc-100"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Prazo</label>
                  <input
                    type="date"
                    value={editDeadline}
                    onChange={(e) => setEditDeadline(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#12141d] border border-[#25283a] rounded-lg text-xs text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#12141d] border border-[#25283a] rounded-lg text-xs text-zinc-100"
                  >
                    <option value="planejado">Planejado</option>
                    <option value="em_andamento">Em andamento</option>
                    <option value="em_pausa">Em pausa</option>
                    <option value="concluido">Concluído</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium"
                >
                  Salvar
                </button>
              </div>
            </form>
          )}

          {/* SubTab: Tasks */}
          {activeSubTab === 'tasks' && (
            <div className="space-y-4">
              {/* Add task inline */}
              <form onSubmit={handleInlineAddTask} className="flex gap-2">
                <input
                  type="text"
                  value={inlineTaskTitle}
                  onChange={(e) => setInlineTaskTitle(e.target.value)}
                  placeholder="Adicionar nova tarefa a este projeto..."
                  className="flex-1 px-3 py-2 bg-[#151722] border border-[#25293c] rounded-lg text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                />
                <select
                  value={inlineTaskPriority}
                  onChange={(e) => setInlineTaskPriority(e.target.value as Priority)}
                  className="px-2 py-1.5 bg-[#151722] border border-[#25293c] rounded-lg text-xs text-zinc-300 focus:outline-none"
                >
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                </select>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Adicionar</span>
                </button>
              </form>

              {/* Task Lists */}
              {projectTasks.length === 0 ? (
                <div className="text-center py-8 text-zinc-500 text-xs border border-dashed border-[#202436] rounded-xl">
                  Nenhuma tarefa associada a este projeto ainda. Adicione acima!
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Pending tasks */}
                  {pendingTasks.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                        Pendentes ({pendingTasks.length})
                      </span>
                      {pendingTasks.map(t => (
                        <div
                          key={t.id}
                          className="flex items-center justify-between p-2.5 bg-[#141620] hover:bg-[#1a1d29] border border-[#212534] rounded-lg transition-colors group"
                        >
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => toggleTaskStatus(t.id)}
                              className="w-4 h-4 rounded border border-zinc-600 hover:border-indigo-400 flex items-center justify-center transition-colors"
                            />
                            <div>
                              <span className="text-xs text-zinc-200 group-hover:text-white font-medium">
                                {t.title}
                              </span>
                              {t.time && (
                                <span className="text-[10px] text-zinc-500 ml-2">
                                  {t.time}
                                </span>
                              )}
                            </div>
                          </div>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                            t.priority === 'alta' ? 'bg-red-500/10 text-red-400' :
                            t.priority === 'media' ? 'bg-amber-500/10 text-amber-400' :
                            'bg-blue-500/10 text-blue-400'
                          }`}>
                            {t.priority}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Completed tasks */}
                  {completedTasks.length > 0 && (
                    <div className="space-y-1.5 pt-2">
                      <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                        Concluídas ({completedTasks.length})
                      </span>
                      {completedTasks.map(t => (
                        <div
                          key={t.id}
                          className="flex items-center justify-between p-2.5 bg-[#12141c] border border-[#1b1e2a] rounded-lg opacity-60 hover:opacity-100 transition-opacity"
                        >
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => toggleTaskStatus(t.id)}
                              className="w-4 h-4 rounded bg-emerald-600/30 border border-emerald-500 flex items-center justify-center text-emerald-400"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                            </button>
                            <span className="text-xs text-zinc-400 line-through">
                              {t.title}
                            </span>
                          </div>
                          <span className="text-[10px] text-zinc-500 font-mono">
                            {t.completedAt || t.date}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* SubTab: Notes */}
          {activeSubTab === 'notes' && (
            <div className="space-y-3">
              {projectNotes.length === 0 ? (
                <div className="text-center py-8 text-zinc-500 text-xs border border-dashed border-[#202436] rounded-xl">
                  Nenhuma anotação vinculada a este projeto.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {projectNotes.map(n => (
                    <div
                      key={n.id}
                      onClick={() => {
                        setSelectedNoteId(n.id);
                        setActiveTab('notes');
                        setSelectedProjectDetailId(null);
                      }}
                      className="p-3.5 bg-[#141620] hover:bg-[#1a1d29] border border-[#212534] hover:border-[#2f354a] rounded-xl cursor-pointer transition-all group"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold text-zinc-200 group-hover:text-white">
                          {n.title}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1e2232] text-zinc-400">
                          {n.folder || n.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 line-clamp-3 leading-relaxed">
                        {n.content.replace(/[#*`>-]/g, '').trim()}
                      </p>
                      <span className="text-[10px] text-zinc-500 block mt-2 font-mono">
                        Atualizado {n.updatedAt}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
