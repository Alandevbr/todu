import React, { useState, useRef } from 'react';
import { 
  X, 
  Settings, 
  User, 
  Database, 
  Download, 
  Upload, 
  RotateCcw, 
  Trash2,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SettingsModal: React.FC = () => {
  const { 
    isSettingsOpen, 
    setIsSettingsOpen, 
    userName, 
    setUserName, 
    resetDemoData, 
    clearAllData, 
    exportData, 
    importData,
    showToast
  } = useApp();

  const [nameInput, setNameInput] = useState(userName);
  const [confirmClear, setConfirmClear] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isSettingsOpen) return null;

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    setUserName(nameInput.trim());
    showToast('Nome atualizado!', 'success');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importData(content);
        setIsSettingsOpen(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="fixed inset-0" 
        onClick={() => setIsSettingsOpen(false)} 
      />

      <div className="relative w-full max-w-md bg-[#12141c] border border-[#232738] rounded-2xl shadow-2xl overflow-hidden z-10 p-5 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#1f2233]">
          <div className="flex items-center space-x-2">
            <Settings className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">Configurações & Dados</h3>
          </div>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="p-1 text-zinc-500 hover:text-zinc-300 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Name */}
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-zinc-500" />
            <span>Seu Nome de Exibição</span>
          </label>
          <form onSubmit={handleSaveName} className="flex gap-2">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-[#171924] border border-[#272b3c] rounded-lg text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Salvar</span>
            </button>
          </form>
        </div>

        {/* Data Persistence & Demo data controls */}
        <div className="space-y-3 pt-2 border-t border-[#1f2233]">
          <div className="flex items-center space-x-2 text-xs font-medium text-zinc-300">
            <Database className="w-3.5 h-3.5 text-indigo-400" />
            <span>Gerenciamento de Dados Locais</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={exportData}
              className="flex items-center justify-center space-x-1.5 p-2 bg-[#171924] hover:bg-[#1f2232] border border-[#272b3c] rounded-lg text-xs text-zinc-300 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>Exportar JSON</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center space-x-1.5 p-2 bg-[#171924] hover:bg-[#1f2232] border border-[#272b3c] rounded-lg text-xs text-zinc-300 transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              <span>Importar Backup</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          <button
            onClick={() => {
              resetDemoData();
              setIsSettingsOpen(false);
            }}
            className="w-full flex items-center justify-center space-x-2 p-2 bg-[#171924] hover:bg-[#1f2232] border border-[#272b3c] rounded-lg text-xs text-zinc-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Restaurar Dados de Exemplo</span>
          </button>

          {/* Clear all data */}
          {confirmClear ? (
            <div className="p-2.5 bg-red-950/30 border border-red-500/30 rounded-lg space-y-2">
              <p className="text-[11px] text-red-300">
                Tem certeza? Isso apagará todas as suas tarefas, notas e projetos.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    clearAllData();
                    setConfirmClear(false);
                    setIsSettingsOpen(false);
                  }}
                  className="flex-1 py-1 bg-red-600 hover:bg-red-500 text-white text-xs rounded font-medium"
                >
                  Sim, limpar tudo
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="px-3 py-1 bg-[#1c1e2b] text-zinc-300 text-xs rounded hover:bg-[#25283a]"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setConfirmClear(true)}
              className="w-full flex items-center justify-center space-x-1.5 p-2 text-zinc-500 hover:text-red-400 text-xs transition-colors rounded-lg hover:bg-red-500/10"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpar todos os dados</span>
            </button>
          )}
        </div>

        <div className="text-[11px] text-zinc-500 text-center pt-2 border-t border-[#1f2233]">
          MySpace v1.0 &bull; Estética Dark Premium (Netflix + Notion + Linear)
        </div>
      </div>
    </div>
  );
};
