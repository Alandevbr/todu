import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  CheckSquare, 
  FileText, 
  FolderKanban, 
  ArrowRight,
  Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const GlobalSearchModal: React.FC = () => {
  const { 
    isSearchOpen, 
    setIsSearchOpen, 
    tasks, 
    notes, 
    projects, 
    setActiveTab, 
    setSelectedNoteId, 
    setSelectedProjectDetailId,
    setEditingTaskId
  } = useApp();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const q = query.trim().toLowerCase();

  const filteredTasks = q
    ? tasks.filter(t => !t.archived && (t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)))
    : tasks.slice(0, 3);

  const filteredNotes = q
    ? notes.filter(n => !n.deleted && (n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q) || n.category.toLowerCase().includes(q)))
    : notes.slice(0, 3);

  const filteredProjects = q
    ? projects.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
    : projects.slice(0, 3);

  const totalResults = filteredTasks.length + filteredNotes.length + filteredProjects.length;

  const handleSelectTask = (taskId: string) => {
    setEditingTaskId(taskId);
    setActiveTab('tasks');
    setIsSearchOpen(false);
  };

  const handleSelectNote = (noteId: string) => {
    setSelectedNoteId(noteId);
    setActiveTab('notes');
    setIsSearchOpen(false);
  };

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectDetailId(projectId);
    setActiveTab('projects');
    setIsSearchOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="fixed inset-0" 
        onClick={() => setIsSearchOpen(false)} 
      />

      <div className="relative w-full max-w-2xl bg-[#11131b] border border-[#232738] rounded-xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#1f2233] bg-[#141622]">
          <Search className="w-5 h-5 text-indigo-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar em tarefas, notas e projetos..."
            className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
          />
          {query ? (
            <button 
              onClick={() => setQuery('')}
              className="p-1 text-zinc-500 hover:text-zinc-300 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="text-[10px] text-zinc-500 bg-[#1c1e2e] border border-[#2a2e44] px-1.5 py-0.5 rounded font-mono">
              ESC
            </kbd>
          )}
        </div>

        {/* Results Body */}
        <div className="overflow-y-auto p-3 space-y-4">
          {totalResults === 0 ? (
            <div className="text-center py-12 text-zinc-500 text-xs">
              Nenhum resultado encontrado para &quot;{query}&quot;
            </div>
          ) : (
            <>
              {/* Projects */}
              {filteredProjects.length > 0 && (
                <div>
                  <div className="flex items-center space-x-1.5 px-2 py-1 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                    <FolderKanban className="w-3.5 h-3.5 text-violet-400" />
                    <span>Projetos ({filteredProjects.length})</span>
                  </div>
                  <div className="space-y-1 mt-1">
                    {filteredProjects.map(proj => (
                      <button
                        key={proj.id}
                        onClick={() => handleSelectProject(proj.id)}
                        className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-[#181a26] text-left group transition-colors"
                      >
                        <div className="flex items-center space-x-3 truncate">
                          <span 
                            className="w-2.5 h-2.5 rounded-full shrink-0" 
                            style={{ backgroundColor: proj.color || '#6366f1' }}
                          />
                          <div className="truncate">
                            <span className="text-xs font-medium text-zinc-200 group-hover:text-white">
                              {proj.name}
                            </span>
                            <p className="text-[11px] text-zinc-500 truncate">{proj.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 shrink-0 ml-2">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-[#1e2130] text-zinc-400 font-mono">
                            {proj.progress}%
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tasks */}
              {filteredTasks.length > 0 && (
                <div>
                  <div className="flex items-center space-x-1.5 px-2 py-1 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                    <CheckSquare className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Tarefas ({filteredTasks.length})</span>
                  </div>
                  <div className="space-y-1 mt-1">
                    {filteredTasks.map(task => (
                      <button
                        key={task.id}
                        onClick={() => handleSelectTask(task.id)}
                        className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-[#181a26] text-left group transition-colors"
                      >
                        <div className="flex items-center space-x-2.5 truncate">
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            task.status === 'concluida' ? 'bg-emerald-400' : 'bg-indigo-400'
                          }`} />
                          <div className="truncate">
                            <span className={`text-xs font-medium ${
                              task.status === 'concluida' ? 'text-zinc-500 line-through' : 'text-zinc-200 group-hover:text-white'
                            }`}>
                              {task.title}
                            </span>
                            <div className="flex items-center space-x-2 mt-0.5">
                              <span className="text-[10px] text-zinc-500">{task.category}</span>
                              {task.time && (
                                <span className="text-[10px] text-zinc-500 flex items-center gap-0.5">
                                  <Clock className="w-2.5 h-2.5" />
                                  {task.time}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                          task.priority === 'alta' ? 'bg-red-500/10 text-red-400' :
                          task.priority === 'media' ? 'bg-amber-500/10 text-amber-400' :
                          'bg-blue-500/10 text-blue-400'
                        }`}>
                          {task.priority}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {filteredNotes.length > 0 && (
                <div>
                  <div className="flex items-center space-x-1.5 px-2 py-1 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                    <FileText className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Notas ({filteredNotes.length})</span>
                  </div>
                  <div className="space-y-1 mt-1">
                    {filteredNotes.map(note => (
                      <button
                        key={note.id}
                        onClick={() => handleSelectNote(note.id)}
                        className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-[#181a26] text-left group transition-colors"
                      >
                        <div className="truncate">
                          <span className="text-xs font-medium text-zinc-200 group-hover:text-white">
                            {note.title}
                          </span>
                          <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                            {note.content.replace(/[#*`>-]/g, '').trim().slice(0, 60)}
                          </p>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#1e2130] text-zinc-400 ml-2 shrink-0">
                          {note.category}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-4 py-2 bg-[#0d0e14] border-t border-[#1a1c28] flex items-center justify-between text-[11px] text-zinc-500">
          <span>Dica: Use palavras-chave como título, categoria ou conteúdo</span>
          <span className="hidden sm:inline">Pressione ESC para fechar</span>
        </div>
      </div>
    </div>
  );
};
