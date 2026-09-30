import React, { useState } from 'react';
import { 
  Archive, 
  Trash2, 
  RotateCcw, 
  FileText, 
  CheckSquare, 
  AlertOctagon 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ArchiveView: React.FC = () => {
  const { 
    tasks, 
    notes, 
    archiveTask, 
    deleteTask, 
    toggleArchiveNote, 
    restoreNote, 
    permanentDeleteNote 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'archived' | 'trash'>('archived');

  const archivedTasks = tasks.filter(t => t.archived);
  const archivedNotes = notes.filter(n => n.archived && !n.deleted);
  const deletedNotes = notes.filter(n => n.deleted);

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2.5">
          <span>Arquivo & Lixeira</span>
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Gerencie conteúdos arquivados para manter seu painel principal limpo e recupere itens excluídos
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-[#1b1e2a] pb-2">
        <button
          onClick={() => setActiveTab('archived')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'archived'
              ? 'bg-[#181a26] text-white border border-[#272b3c]'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Archive className="w-4 h-4 text-indigo-400" />
          <span>Arquivados ({archivedTasks.length + archivedNotes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('trash')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'trash'
              ? 'bg-[#181a26] text-white border border-[#272b3c]'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Trash2 className="w-4 h-4 text-red-400" />
          <span>Lixeira ({deletedNotes.length})</span>
        </button>
      </div>

      {/* Archived Tab Content */}
      {activeTab === 'archived' && (
        <div className="space-y-6">
          {/* Archived Tasks */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-indigo-400" />
              <span>Tarefas Arquivadas ({archivedTasks.length})</span>
            </h3>

            {archivedTasks.length === 0 ? (
              <div className="text-xs text-zinc-500 py-6 text-center border border-dashed border-[#1f2232] rounded-xl">
                Nenhuma tarefa arquivada.
              </div>
            ) : (
              <div className="space-y-1.5">
                {archivedTasks.map(t => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between p-3 bg-[#12141c] border border-[#1f2230] rounded-xl"
                  >
                    <div>
                      <span className="text-xs font-medium text-zinc-300">{t.title}</span>
                      <span className="text-[10px] text-zinc-500 ml-2">({t.category} &bull; {t.date})</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => archiveTask(t.id)}
                        className="text-xs text-indigo-400 hover:text-indigo-300 px-2 py-1 rounded bg-[#171a27] border border-[#262a3d]"
                      >
                        Desarquivar
                      </button>
                      <button
                        onClick={() => deleteTask(t.id)}
                        className="p-1 text-zinc-500 hover:text-red-400"
                        title="Excluir permanentemente"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Archived Notes */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>Notas Arquivadas ({archivedNotes.length})</span>
            </h3>

            {archivedNotes.length === 0 ? (
              <div className="text-xs text-zinc-500 py-6 text-center border border-dashed border-[#1f2232] rounded-xl">
                Nenhuma nota arquivada.
              </div>
            ) : (
              <div className="space-y-1.5">
                {archivedNotes.map(n => (
                  <div
                    key={n.id}
                    className="flex items-center justify-between p-3 bg-[#12141c] border border-[#1f2230] rounded-xl"
                  >
                    <div>
                      <span className="text-xs font-medium text-zinc-300">{n.title}</span>
                      <span className="text-[10px] text-zinc-500 ml-2">({n.category})</span>
                    </div>
                    <button
                      onClick={() => toggleArchiveNote(n.id)}
                      className="text-xs text-emerald-400 hover:text-emerald-300 px-2 py-1 rounded bg-[#171a27] border border-[#262a3d]"
                    >
                      Desarquivar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Trash Tab Content */}
      {activeTab === 'trash' && (
        <div className="space-y-3">
          <div className="p-3 bg-red-950/20 border border-red-500/20 rounded-xl flex items-center space-x-2 text-xs text-red-300">
            <AlertOctagon className="w-4 h-4 text-red-400 shrink-0" />
            <span>Itens na lixeira podem ser recuperados a qualquer momento ou removidos definitivamente.</span>
          </div>

          {deletedNotes.length === 0 ? (
            <div className="text-xs text-zinc-500 py-10 text-center border border-dashed border-[#1f2232] rounded-xl">
              A lixeira está vazia.
            </div>
          ) : (
            <div className="space-y-1.5">
              {deletedNotes.map(n => (
                <div
                  key={n.id}
                  className="flex items-center justify-between p-3 bg-[#12141c] border border-[#1f2230] rounded-xl"
                >
                  <div>
                    <span className="text-xs font-medium text-zinc-300">{n.title}</span>
                    <span className="text-[10px] text-zinc-500 ml-2">Excluído em {n.deletedAt || n.updatedAt}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => restoreNote(n.id)}
                      className="flex items-center space-x-1 text-xs text-emerald-400 hover:text-emerald-300 px-2.5 py-1 rounded bg-[#161a24] border border-[#242938]"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Recuperar</span>
                    </button>
                    <button
                      onClick={() => permanentDeleteNote(n.id)}
                      className="flex items-center space-x-1 text-xs text-red-400 hover:text-red-300 px-2.5 py-1 rounded bg-[#1d161a] border border-[#382429]"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Excluir definitivamente</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
