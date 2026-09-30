import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Settings, 
  Keyboard, 
  CheckSquare, 
  FileText, 
  FolderKanban,
  Sparkles,
  Cloud,
  CloudCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Topbar: React.FC = () => {
  const { 
    userName, 
    setIsSearchOpen, 
    setIsQuickAddOpen, 
    setQuickAddType, 
    setIsShortcutsOpen,
    setIsSettingsOpen,
    setIsAuthOpen,
    user,
    todayProgressPercentage,
    todayTasks,
    completedTodayCount
  } = useApp();

  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  // Formatted Brazilian date & personalized greeting
  const now = new Date();
  const hours = now.getHours();
  let greeting = 'Bom dia';
  if (hours >= 12 && hours < 18) {
    greeting = 'Boa tarde';
  } else if (hours >= 18 || hours < 5) {
    greeting = 'Boa noite';
  }

  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(now);

  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  const handleOpenAdd = (type: 'task' | 'note' | 'project') => {
    setQuickAddType(type);
    setIsQuickAddOpen(true);
    setIsAddMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 py-3.5 bg-[#090a0d]/90 backdrop-blur-md border-b border-[#1c1e28]">
      {/* Brand & Greeting */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold text-sm">
            M
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-white tracking-tight text-base">MySpace</span>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                PRO
              </span>
            </div>
            <p className="text-xs text-zinc-400 hidden sm:block">
              {greeting}, <span className="text-zinc-200 font-medium">{userName}</span> &bull; {capitalizedDate}
            </p>
          </div>
        </div>
      </div>

      {/* Center Search Bar */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-2 text-sm text-zinc-400 bg-[#14161f] hover:bg-[#1a1d29] border border-[#232736] hover:border-[#32374b] rounded-lg transition-all group"
        >
          <div className="flex items-center space-x-2.5">
            <Search className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
            <span className="text-xs text-zinc-400 group-hover:text-zinc-300">Buscar tarefas, notas, projetos...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-zinc-400 bg-[#1c1e2b] border border-[#2c3044] rounded">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Supabase Cloud Connection Status */}
        <button
          onClick={() => setIsAuthOpen(true)}
          className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
            user
              ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-400 hover:bg-emerald-950/50'
              : 'bg-[#141622] border-[#242838] text-zinc-400 hover:text-zinc-200 hover:border-[#353a50]'
          }`}
          title={user ? `Conectado como ${user.email}` : 'Conectar ao banco de dados Supabase'}
        >
          <Cloud className={`w-3.5 h-3.5 ${user ? 'text-emerald-400' : 'text-zinc-500'}`} />
          <span className="hidden sm:inline">
            {user ? 'Nuvem Ativa' : 'Conectar Nuvem'}
          </span>
        </button>

        {/* Mobile Search trigger */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-[#151722] rounded-lg md:hidden border border-[#222533]"
          title="Pesquisar"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Quick Add Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] rounded-lg shadow-sm shadow-indigo-600/30 transition-all border border-indigo-400/20"
          >
            <Plus className="w-4 h-4" />
            <span>Novo</span>
          </button>

          {isAddMenuOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsAddMenuOpen(false)} 
              />
              <div className="absolute right-0 mt-2 w-48 py-1.5 bg-[#141620] border border-[#262a3a] rounded-xl shadow-2xl z-50 animate-fade-in">
                <button
                  onClick={() => handleOpenAdd('task')}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs text-zinc-300 hover:text-white hover:bg-[#1e2232] transition-colors"
                >
                  <div className="flex items-center space-x-2.5">
                    <CheckSquare className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Nova Tarefa</span>
                  </div>
                  <kbd className="text-[10px] text-zinc-500 font-mono">T</kbd>
                </button>
                <button
                  onClick={() => handleOpenAdd('note')}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs text-zinc-300 hover:text-white hover:bg-[#1e2232] transition-colors"
                >
                  <div className="flex items-center space-x-2.5">
                    <FileText className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Nova Nota</span>
                  </div>
                  <kbd className="text-[10px] text-zinc-500 font-mono">N</kbd>
                </button>
                <button
                  onClick={() => handleOpenAdd('project')}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs text-zinc-300 hover:text-white hover:bg-[#1e2232] transition-colors"
                >
                  <div className="flex items-center space-x-2.5">
                    <FolderKanban className="w-3.5 h-3.5 text-violet-400" />
                    <span>Novo Projeto</span>
                  </div>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Daily progress indicator pill */}
        <div 
          className="hidden lg:flex items-center space-x-2 px-2.5 py-1.5 rounded-lg bg-[#12141c] border border-[#202330] text-xs text-zinc-400"
          title={`Hoje: ${completedTodayCount} de ${todayTasks.length} concluídas`}
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>{completedTodayCount}/{todayTasks.length} Hoje</span>
          <div className="w-12 h-1.5 bg-[#202434] rounded-full overflow-hidden ml-1">
            <div 
              className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
              style={{ width: `${todayProgressPercentage}%` }} 
            />
          </div>
        </div>

        {/* Shortcuts Button */}
        <button
          onClick={() => setIsShortcutsOpen(true)}
          className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-[#151722] rounded-lg transition-colors border border-transparent hover:border-[#222533]"
          title="Atalhos de teclado (?)"
        >
          <Keyboard className="w-4 h-4" />
        </button>

        {/* Settings Button */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-[#151722] rounded-lg transition-colors border border-transparent hover:border-[#222533]"
          title="Configurações e Dados"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
