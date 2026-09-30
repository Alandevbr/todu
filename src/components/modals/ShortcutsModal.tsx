import React from 'react';
import { X, Keyboard } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ShortcutsModal: React.FC = () => {
  const { isShortcutsOpen, setIsShortcutsOpen } = useApp();

  if (!isShortcutsOpen) return null;

  const shortcuts = [
    { key: 'Ctrl + K', description: 'Abrir busca global instantânea' },
    { key: 'T', description: 'Criar uma nova tarefa' },
    { key: 'N', description: 'Criar uma nova anotação' },
    { key: '?', description: 'Abrir este menu de atalhos' },
    { key: 'Esc', description: 'Fechar modais e caixas de diálogo ativas' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="fixed inset-0" 
        onClick={() => setIsShortcutsOpen(false)} 
      />

      <div className="relative w-full max-w-md bg-[#12141c] border border-[#232738] rounded-2xl shadow-2xl overflow-hidden z-10 p-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#1f2233]">
          <div className="flex items-center space-x-2">
            <Keyboard className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">Atalhos de Teclado</h3>
          </div>
          <button
            onClick={() => setIsShortcutsOpen(false)}
            className="p-1 text-zinc-500 hover:text-zinc-300 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="divide-y divide-[#1b1e2c] mt-2">
          {shortcuts.map(s => (
            <div key={s.key} className="py-2.5 flex items-center justify-between">
              <span className="text-xs text-zinc-300">{s.description}</span>
              <kbd className="px-2 py-1 bg-[#191c28] border border-[#282d40] text-zinc-300 text-[11px] font-mono rounded-md shadow-sm">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <p className="mt-4 text-[11px] text-zinc-500 text-center">
          Projetado para máxima agilidade e foco diário.
        </p>
      </div>
    </div>
  );
};
