import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Pin, 
  Archive, 
  Trash2, 
  Check, 
  Clock, 
  Folder, 
  Tag, 
  Bold, 
  Italic, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  CheckSquare, 
  Quote, 
  Code, 
  Link as LinkIcon, 
  Eye, 
  Edit3,
  Inbox,
  FileText,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Note } from '../../types';

export const NotesView: React.FC = () => {
  const { 
    notes, 
    addNote, 
    updateNote, 
    deleteNote, 
    togglePinNote, 
    toggleArchiveNote,
    selectedNoteId, 
    setSelectedNoteId 
  } = useApp();

  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'pinned' | 'quick' | 'inbox' | 'folders'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isPreview, setIsPreview] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Active notes (not deleted and not archived)
  const activeNotes = notes.filter(n => !n.deleted && !n.archived);

  // Search filter
  const q = search.trim().toLowerCase();
  const filteredNotes = activeNotes.filter(n => {
    // Mode
    if (filterMode === 'pinned' && !n.pinned) return false;
    if (filterMode === 'quick' && !n.isQuickNote) return false;
    if (filterMode === 'inbox' && !n.isInbox) return false;
    if (selectedCategory !== 'all' && n.category !== selectedCategory) return false;

    // Search query
    if (q) {
      const matchTitle = n.title.toLowerCase().includes(q);
      const matchContent = n.content.toLowerCase().includes(q);
      const matchCat = n.category.toLowerCase().includes(q);
      const matchFolder = n.folder?.toLowerCase().includes(q);
      return matchTitle || matchContent || matchCat || matchFolder;
    }
    return true;
  });

  // Sort: pinned first, then by updatedAt
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.updatedAt.localeCompare(a.updatedAt);
  });

  // Auto-select first note if none selected or selected note doesn't exist
  useEffect(() => {
    if (!selectedNoteId && sortedNotes.length > 0) {
      setSelectedNoteId(sortedNotes[0].id);
    }
  }, [sortedNotes, selectedNoteId, setSelectedNoteId]);

  const currentNote = notes.find(n => n.id === selectedNoteId);

  // Create new note
  const handleCreateNewNote = () => {
    const newNote = addNote({
      title: 'Nota sem título',
      content: '',
      category: 'Geral',
    });
    setSelectedNoteId(newNote.id);
    setIsPreview(false);
  };

  // Auto-save handler
  const handleTitleChange = (newTitle: string) => {
    if (!currentNote) return;
    setSaveStatus('saving');
    updateNote(currentNote.id, { title: newTitle });
    setTimeout(() => setSaveStatus('saved'), 400);
  };

  const handleContentChange = (newContent: string) => {
    if (!currentNote) return;
    setSaveStatus('saving');
    updateNote(currentNote.id, { content: newContent });
    setTimeout(() => setSaveStatus('saved'), 400);
  };

  // Markdown format insertion helper
  const insertFormatting = (prefix: string, suffix: string = '') => {
    if (!textareaRef.current || !currentNote) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = currentNote.content;
    const selected = text.substring(start, end);

    const replacement = prefix + (selected || 'texto') + suffix;
    const newContent = text.substring(0, start) + replacement + text.substring(end);

    handleContentChange(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selected ? selected.length : 5));
    }, 10);
  };

  // Markdown line helper (H1, H2, Checklist, etc.)
  const insertLinePrefix = (prefix: string) => {
    if (!textareaRef.current || !currentNote) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const text = currentNote.content;

    // Find start of line
    const lastNewline = text.lastIndexOf('\n', start - 1);
    const lineStart = lastNewline === -1 ? 0 : lastNewline + 1;

    const newContent = text.substring(0, lineStart) + prefix + text.substring(lineStart);
    handleContentChange(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length);
    }, 10);
  };

  // Categories list
  const categories = ['all', 'Geral', 'Estudos', 'Carreira', 'Pessoal', 'Ideias'];

  // Word count stats
  const wordCount = currentNote ? currentNote.content.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = currentNote ? currentNote.content.length : 0;

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] pb-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#1b1e2a] mb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <span>Bloco de Notas</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              {activeNotes.length} notas
            </span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Editor minimalista com salvamento automático e suporte a Markdown
          </p>
        </div>

        <button
          onClick={handleCreateNewNote}
          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-sm shadow-emerald-600/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Nota</span>
        </button>
      </div>

      {/* Split Pane: Notes List vs Clean Editor */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 overflow-hidden">
        {/* Left Column: Notes Navigation & List (5 cols) */}
        <div className="md:col-span-4 lg:col-span-4 bg-[#11131a] border border-[#1f2230] rounded-2xl flex flex-col overflow-hidden">
          {/* Search bar */}
          <div className="p-3 border-b border-[#1b1e2a] bg-[#141620]">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Pesquisar por título ou conteúdo..."
                className="w-full pl-8 pr-3 py-1.5 bg-[#171924] border border-[#262a3a] rounded-lg text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Filter pills */}
            <div className="flex items-center space-x-1 mt-2.5 overflow-x-auto no-scrollbar pb-0.5">
              {[
                { id: 'all', label: 'Todas' },
                { id: 'pinned', label: 'Fixadas' },
                { id: 'quick', label: 'Rápidas' },
                { id: 'inbox', label: 'Caixa de Entrada' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilterMode(f.id as any)}
                  className={`px-2 py-1 rounded-md text-[11px] whitespace-nowrap transition-colors ${
                    filterMode === f.id
                      ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notes items list */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#181a26]">
            {sortedNotes.length === 0 ? (
              <div className="p-8 text-center text-xs text-zinc-500">
                Nenhuma nota encontrada.
              </div>
            ) : (
              sortedNotes.map(n => {
                const isSelected = n.id === selectedNoteId;
                const snippet = n.content.replace(/[#*`>-]/g, '').trim().slice(0, 75) || 'Sem conteúdo adicional...';

                return (
                  <div
                    key={n.id}
                    onClick={() => {
                      setSelectedNoteId(n.id);
                      setIsPreview(false);
                    }}
                    className={`p-3.5 cursor-pointer transition-colors text-left group ${
                      isSelected
                        ? 'bg-[#181a25] border-l-2 border-emerald-400'
                        : 'hover:bg-[#141620]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <span className={`text-xs font-semibold truncate ${
                        isSelected ? 'text-white' : 'text-zinc-300 group-hover:text-white'
                      }`}>
                        {n.title || 'Sem título'}
                      </span>
                      {n.pinned && (
                        <Pin className="w-3 h-3 text-amber-400 shrink-0 fill-amber-400/20" />
                      )}
                    </div>

                    <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed">
                      {snippet}
                    </p>

                    <div className="flex items-center justify-between mt-2 text-[10px] text-zinc-600 font-mono">
                      <span>{n.category}</span>
                      <span>{n.updatedAt}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Minimalist Distraction-Free Editor (8 cols) */}
        <div className="md:col-span-8 lg:col-span-8 bg-[#11131a] border border-[#1f2230] rounded-2xl flex flex-col overflow-hidden">
          {currentNote ? (
            <>
              {/* Editor Top Bar */}
              <div className="p-3.5 border-b border-[#1b1e2a] bg-[#141620] flex flex-wrap items-center justify-between gap-2">
                {/* Formatting Tools */}
                <div className="flex items-center space-x-1 text-zinc-400">
                  <button
                    onClick={() => insertLinePrefix('# ')}
                    className="p-1 hover:text-white hover:bg-[#1f2232] rounded transition-colors"
                    title="Título H1 (# )"
                  >
                    <Heading1 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => insertLinePrefix('## ')}
                    className="p-1 hover:text-white hover:bg-[#1f2232] rounded transition-colors"
                    title="Subtítulo H2 (## )"
                  >
                    <Heading2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => insertLinePrefix('### ')}
                    className="p-1 hover:text-white hover:bg-[#1f2232] rounded transition-colors"
                    title="Subtítulo H3 (### )"
                  >
                    <Heading3 className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-zinc-700">|</span>
                  <button
                    onClick={() => insertFormatting('**', '**')}
                    className="p-1 hover:text-white hover:bg-[#1f2232] rounded transition-colors font-bold"
                    title="Negrito (**texto**)"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => insertFormatting('*', '*')}
                    className="p-1 hover:text-white hover:bg-[#1f2232] rounded transition-colors italic"
                    title="Itálico (*texto*)"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-zinc-700">|</span>
                  <button
                    onClick={() => insertLinePrefix('- ')}
                    className="p-1 hover:text-white hover:bg-[#1f2232] rounded transition-colors"
                    title="Lista com marcadores (- )"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => insertLinePrefix('1. ')}
                    className="p-1 hover:text-white hover:bg-[#1f2232] rounded transition-colors"
                    title="Lista numerada (1. )"
                  >
                    <ListOrdered className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => insertLinePrefix('- [ ] ')}
                    className="p-1 hover:text-white hover:bg-[#1f2232] rounded transition-colors"
                    title="Checklist (- [ ] )"
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => insertLinePrefix('> ')}
                    className="p-1 hover:text-white hover:bg-[#1f2232] rounded transition-colors"
                    title="Citação (> )"
                  >
                    <Quote className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => insertFormatting('```\n', '\n```')}
                    className="p-1 hover:text-white hover:bg-[#1f2232] rounded transition-colors"
                    title="Bloco de Código"
                  >
                    <Code className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Right controls: View Toggle, Pin, Archive, Trash, Auto-save badge */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 text-[11px] text-zinc-500 font-mono">
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>{saveStatus === 'saving' ? 'Salvando...' : 'Salvo'}</span>
                  </div>

                  <button
                    onClick={() => setIsPreview(!isPreview)}
                    className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                      isPreview
                        ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-[#181a26] text-zinc-400 border-[#262b3c] hover:text-zinc-200'
                    }`}
                    title={isPreview ? 'Voltar para modo de edição' : 'Visualizar Markdown'}
                  >
                    {isPreview ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">{isPreview ? 'Editar' : 'Visualizar'}</span>
                  </button>

                  <button
                    onClick={() => togglePinNote(currentNote.id)}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      currentNote.pinned
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'text-zinc-500 hover:text-zinc-300 border-transparent hover:bg-[#1e2130]'
                    }`}
                    title={currentNote.pinned ? 'Desafixar nota' : 'Fixar nota no topo'}
                  >
                    <Pin className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => toggleArchiveNote(currentNote.id)}
                    className="p-1.5 text-zinc-500 hover:text-zinc-300 rounded-lg border border-transparent hover:bg-[#1e2130]"
                    title="Arquivar nota"
                  >
                    <Archive className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => deleteNote(currentNote.id)}
                    className="p-1.5 text-zinc-500 hover:text-red-400 rounded-lg border border-transparent hover:bg-red-500/10"
                    title="Mover para a lixeira"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Meta bar: Title & Category select */}
              <div className="px-6 pt-5 pb-2">
                <input
                  type="text"
                  value={currentNote.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Título da nota..."
                  className="w-full text-xl sm:text-2xl font-bold bg-transparent text-white placeholder-zinc-600 focus:outline-none tracking-tight"
                />

                <div className="flex items-center space-x-3 mt-2 text-xs text-zinc-500">
                  <div className="flex items-center space-x-1.5">
                    <Tag className="w-3 h-3 text-zinc-500" />
                    <select
                      value={currentNote.category}
                      onChange={(e) => updateNote(currentNote.id, { category: e.target.value })}
                      className="bg-transparent text-xs text-zinc-400 hover:text-zinc-200 focus:outline-none"
                    >
                      <option value="Geral">Geral</option>
                      <option value="Estudos">Estudos</option>
                      <option value="Carreira">Carreira</option>
                      <option value="Pessoal">Pessoal</option>
                      <option value="Ideias">Ideias</option>
                    </select>
                  </div>

                  {currentNote.folder && (
                    <div className="flex items-center space-x-1">
                      <Folder className="w-3 h-3 text-zinc-500" />
                      <span className="text-zinc-400">{currentNote.folder}</span>
                    </div>
                  )}

                  <span>&bull;</span>
                  <span className="font-mono text-[11px] text-zinc-600">
                    {wordCount} palavras &bull; {charCount} caracteres
                  </span>
                </div>
              </div>

              {/* Editor Workspace / Markdown preview */}
              <div className="flex-1 p-6 overflow-y-auto">
                {isPreview ? (
                  /* Formatted Markdown Viewer */
                  <div className="prose prose-invert max-w-none space-y-3 text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
                    {currentNote.content.split('\n').map((line, idx) => {
                      if (line.startsWith('### ')) {
                        return <h3 key={idx} className="text-sm font-bold text-zinc-100 mt-3 mb-1">{line.replace('### ', '')}</h3>;
                      }
                      if (line.startsWith('## ')) {
                        return <h2 key={idx} className="text-base font-bold text-zinc-100 mt-4 mb-2">{line.replace('## ', '')}</h2>;
                      }
                      if (line.startsWith('# ')) {
                        return <h1 key={idx} className="text-lg font-bold text-white mt-5 mb-2">{line.replace('# ', '')}</h1>;
                      }
                      if (line.startsWith('> ')) {
                        return (
                          <blockquote key={idx} className="border-l-2 border-emerald-500 pl-3 py-1 my-2 text-zinc-400 italic bg-[#141620] rounded-r">
                            {line.replace('> ', '')}
                          </blockquote>
                        );
                      }
                      if (line.startsWith('- [ ] ') || line.startsWith('- [x] ')) {
                        const isDone = line.startsWith('- [x] ');
                        return (
                          <div key={idx} className="flex items-center space-x-2 my-1">
                            <span className={`w-3.5 h-3.5 rounded flex items-center justify-center border text-[9px] ${
                              isDone ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'border-zinc-600'
                            }`}>
                              {isDone ? '✓' : ''}
                            </span>
                            <span className={isDone ? 'line-through text-zinc-500' : 'text-zinc-300'}>
                              {line.replace(/- \[[ x]\] /, '')}
                            </span>
                          </div>
                        );
                      }
                      if (line.startsWith('- ')) {
                        return (
                          <li key={idx} className="ml-4 list-disc text-zinc-300">
                            {line.replace('- ', '')}
                          </li>
                        );
                      }
                      if (/^\d+\.\s/.test(line)) {
                        return (
                          <li key={idx} className="ml-4 list-decimal text-zinc-300">
                            {line.replace(/^\d+\.\s/, '')}
                          </li>
                        );
                      }
                      if (line.trim() === '') {
                        return <div key={idx} className="h-2" />;
                      }
                      return <p key={idx} className="my-1">{line}</p>;
                    })}
                  </div>
                ) : (
                  /* Minimalist Textarea */
                  <textarea
                    ref={textareaRef}
                    value={currentNote.content}
                    onChange={(e) => handleContentChange(e.target.value)}
                    placeholder="Comece a escrever sua nota... Suporta cabeçalhos (# ), listas (- ), checklists (- [ ] ) e citações (> )."
                    className="w-full h-full bg-transparent text-xs sm:text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none resize-none leading-relaxed font-sans"
                  />
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-zinc-500">
              <FileText className="w-10 h-10 text-zinc-700 mb-2" />
              <p className="text-sm font-medium text-zinc-400">Nenhuma nota selecionada</p>
              <p className="text-xs text-zinc-600 mt-1">Selecione uma nota à esquerda ou crie uma nova.</p>
              <button
                onClick={handleCreateNewNote}
                className="mt-4 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium"
              >
                + Criar Primeira Nota
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
