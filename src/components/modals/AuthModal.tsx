import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  Cloud,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AuthModal: React.FC = () => {
  const { 
    isAuthOpen, 
    setIsAuthOpen, 
    user, 
    signIn, 
    signUp, 
    signOut, 
    syncLocalToCloud,
    isSyncing 
  } = useApp();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isAuthOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const ok = await signIn(email, password);
        if (ok) {
          setIsAuthOpen(false);
        } else {
          setErrorMsg('Credenciais inválidas ou usuário não encontrado.');
        }
      } else {
        const ok = await signUp(email, password, name);
        if (ok) {
          setSuccessMsg('Conta criada com sucesso! Verifique seu e-mail caso a confirmação seja exigida.');
          setTimeout(() => setIsAuthOpen(false), 1500);
        } else {
          setErrorMsg('Não foi possível criar a conta. Verifique os dados digitados.');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao processar autenticação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="fixed inset-0" 
        onClick={() => setIsAuthOpen(false)} 
      />

      <div className="relative w-full max-w-md bg-[#12141c] border border-[#232738] rounded-2xl shadow-2xl overflow-hidden z-10 p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1f2233]">
          <div className="flex items-center space-x-2">
            <Cloud className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">
              {user ? 'Sua Conta Supabase' : mode === 'login' ? 'Entrar no MySpace' : 'Criar Conta no MySpace'}
            </h3>
          </div>
          <button
            onClick={() => setIsAuthOpen(false)}
            className="p-1 text-zinc-500 hover:text-zinc-300 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* If user is already authenticated */}
        {user ? (
          <div className="space-y-4">
            <div className="p-3.5 bg-[#161824] border border-[#25293c] rounded-xl space-y-1">
              <span className="text-[11px] text-zinc-400 block">Conectado como</span>
              <p className="text-sm font-semibold text-white truncate">{user.email}</p>
              <div className="flex items-center space-x-1.5 text-xs text-emerald-400 mt-2 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>Nuvem Supabase Ativa & Sincronizada</span>
              </div>
            </div>

            <button
              onClick={syncLocalToCloud}
              disabled={isSyncing}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all shadow-sm"
            >
              <Cloud className="w-4 h-4" />
              <span>{isSyncing ? 'Sincronizando dados...' : 'Forçar Envio de Dados Locais para Nuvem'}</span>
            </button>

            <button
              onClick={async () => {
                await signOut();
                setIsAuthOpen(false);
              }}
              className="w-full py-2 bg-[#181a26] hover:bg-[#222536] text-zinc-300 hover:text-white rounded-xl text-xs font-medium border border-[#262a3c] transition-colors"
            >
              Desconectar Conta (Voltar para Modo Local)
            </button>
          </div>
        ) : (
          /* Login / Signup Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-2.5 bg-red-950/30 border border-red-500/30 rounded-xl flex items-center space-x-2 text-xs text-red-300">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-2.5 bg-emerald-950/30 border border-emerald-500/30 rounded-xl flex items-center space-x-2 text-xs text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Seu Nome</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Alan"
                  className="w-full px-3 py-2 bg-[#171924] border border-[#272b3c] rounded-lg text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-zinc-500" />
                <span>E-mail</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-3 py-2 bg-[#171924] border border-[#272b3c] rounded-lg text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-zinc-500" />
                <span>Senha</span>
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 bg-[#171924] border border-[#272b3c] rounded-lg text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all shadow-sm shadow-indigo-600/30"
            >
              <span>{loading ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Cadastrar'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'login' ? 'signup' : 'login');
                  setErrorMsg('');
                }}
                className="text-xs text-zinc-400 hover:text-indigo-400 transition-colors"
              >
                {mode === 'login'
                  ? 'Não tem uma conta? Crie uma agora'
                  : 'Já possui conta? Clique para entrar'}
              </button>
            </div>
          </form>
        )}

        <div className="pt-3 border-t border-[#1f2233] flex items-center justify-between text-[11px] text-zinc-500">
          <div className="flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>PostgreSQL + Row Level Security (RLS)</span>
          </div>
          <span>Supabase Cloud</span>
        </div>
      </div>
    </div>
  );
};
