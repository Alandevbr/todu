import React, { useState } from 'react';
import { 
  FileText, 
  Inbox, 
  Send, 
  Trash2, 
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const QuickNotesPad: React.FC = () => {
  const { notes, addNote, deleteNote, setActiveTab, setSelectedNoteId } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'quick' | 'inbox'>('quick');
  const [inputText, setInputText] = useState('');

  const quickNotes = notes.filter(n => n.isQuickNote && !n.deleted && !n.archived);
  const inboxNotes = notes.filter(n => n.isInbox && !n.deleted && !n.archived);

  const handleCapture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (activeSubTab === 'quick') {
      addNote({
        title: `Nota rápida: ${inputText.trim().slice(0, 28)}...`,
        content: inputText.trim(),
        category: 'Geral',
        isQuickNote: true,
      });
    } else {
      addNote({
        title: inputText.trim().slice(0, 32),
        content: inputText.trim(),
        category: 'Ideias',
        isInbox: true,
      });
    }

    setInputText('');
  };

  const currentList = activeSubTab === 'quick' ? quickNotes : inboxNotes;

  return (
    <section className="bg-[#11131a] border border-[#1f2230] rounded-2xl p-5 shadow-subtle space-y-4">
      {/* Header and Mode switch */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1b1e2a]">
        <div className="flex items-center space-x-1.5 bg-[#161824] p-1 rounded-xl border border-[#232738]">
          <button
            onClick={() => setActiveSubTab('quick')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              activeSubTab === 'quick'
                ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>Anotações Rápidas ({quickNotes.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('inbox')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              activeSubTab === 'inbox'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Inbox className="w-3.5 h-3.5 text-indigo-400" />
            <span>Caixa de Entrada ({inboxNotes.length})</span>
          </button>
        </div>

        <button
          onClick={() => setActiveTab('notes')}
          className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1"
        >
          <span>Abrir Bloco de Notas</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      {/* Input area */}
      <form onSubmit={handleCapture} className="flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            activeSubTab === 'quick'
              ? 'Escreva um pensamento rápido sem sair do fluxo...'
              : 'Jogue aqui uma ideia solta, link ou lembrete para organizar depois...'
          }
          className="flex-1 px-3.5 py-2 bg-[#161824] border border-[#25293c] hover:border-[#353a52] focus:border-emerald-500 rounded-xl text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none transition-colors"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white rounded-xl text-xs font-medium flex items-center space-x-1.5 shadow-sm transition-all"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Capturar</span>
        </button>
      </form>

      {/* Stream of items */}
      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
        {currentList.length === 0 ? (
          <div className="text-center py-6 text-xs text-zinc-500 border border-dashed border-[#1f2232] rounded-xl">
            {activeSubTab === 'quick'
              ? 'Nenhuma anotação rápida registrada no momento.'
              : 'Caixa de entrada limpa! Suas ideias soltas ficam salvas aqui.'}
          </div>
        ) : (
          currentList.map(item => (
            <div
              key={item.id}
              className="flex items-start justify-between p-3 bg-[#141620] hover:bg-[#181a26] border border-[#202332] rounded-xl transition-all group"
            >
              <div 
                className="cursor-pointer flex-1 mr-3"
                onClick={() => {
                  setSelectedNoteId(item.id);
                  setActiveTab('notes');
                }}
              >
                <p className="text-xs text-zinc-200 group-hover:text-white leading-relaxed">
                  {item.content || item.title}
                </p>
                <span className="text-[10px] text-zinc-500 font-mono mt-1 block">
                  Capturado em {item.createdAt}
                </span>
              </div>

              <div className="flex items-center space-x-1 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => {
                    setSelectedNoteId(item.id);
                    setActiveTab('notes');
                  }}
                  className="p-1 text-zinc-400 hover:text-emerald-400 rounded"
                  title="Expandir no editor"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deleteNote(item.id)}
                  className="p-1 text-zinc-500 hover:text-red-400 rounded"
                  title="Excluir"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};
