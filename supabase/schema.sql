-- ============================================================
-- SCHEMA DO BANCO DE DADOS: MYSPACE (SUPABASE POSTGRESQL)
-- Execute este script no SQL Editor do seu dashboard Supabase
-- ============================================================

-- 1. EXTENSÕES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABELA DE PROJETOS
CREATE TABLE IF NOT EXISTS public.projects (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL DEFAULT 'Geral',
    deadline DATE,
    status TEXT NOT NULL DEFAULT 'em_andamento',
    progress INTEGER NOT NULL DEFAULT 0,
    icon TEXT DEFAULT 'FolderKanban',
    color TEXT DEFAULT '#6366f1',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TABELA DE TAREFAS
CREATE TABLE IF NOT EXISTS public.tasks (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id TEXT REFERENCES public.projects(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    time TEXT,
    priority TEXT NOT NULL DEFAULT 'media',
    category TEXT NOT NULL DEFAULT 'Trabalho',
    status TEXT NOT NULL DEFAULT 'pendente',
    archived BOOLEAN NOT NULL DEFAULT false,
    completed_at DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABELA DE NOTAS
CREATE TABLE IF NOT EXISTS public.notes (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id TEXT REFERENCES public.projects(id) ON DELETE SET NULL,
    title TEXT NOT NULL DEFAULT 'Sem título',
    content TEXT DEFAULT '',
    category TEXT NOT NULL DEFAULT 'Geral',
    folder TEXT,
    pinned BOOLEAN NOT NULL DEFAULT false,
    archived BOOLEAN NOT NULL DEFAULT false,
    deleted BOOLEAN NOT NULL DEFAULT false,
    deleted_at DATE,
    is_quick_note BOOLEAN NOT NULL DEFAULT false,
    is_inbox BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TABELA DE HÁBITOS & ROTINA
CREATE TABLE IF NOT EXISTS public.habits (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    time_of_day TEXT NOT NULL DEFAULT 'manha',
    days_of_week INTEGER[] DEFAULT ARRAY[0,1,2,3,4,5,6],
    completed_dates TEXT[] DEFAULT ARRAY[]::TEXT[],
    streak INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================
-- HABILITAR ROW LEVEL SECURITY (RLS) - SEGURANÇA POR USUÁRIO
-- ============================================================

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;

-- Políticas para PROJETOS
DROP POLICY IF EXISTS "Usuários podem gerenciar seus projetos" ON public.projects;
CREATE POLICY "Usuários podem gerenciar seus projetos"
ON public.projects
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Políticas para TAREFAS
DROP POLICY IF EXISTS "Usuários podem gerenciar suas tarefas" ON public.tasks;
CREATE POLICY "Usuários podem gerenciar suas tarefas"
ON public.tasks
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Políticas para NOTAS
DROP POLICY IF EXISTS "Usuários podem gerenciar suas notas" ON public.notes;
CREATE POLICY "Usuários podem gerenciar suas notas"
ON public.notes
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Políticas para HÁBITOS
DROP POLICY IF EXISTS "Usuários podem gerenciar seus hábitos" ON public.habits;
CREATE POLICY "Usuários podem gerenciar seus hábitos"
ON public.habits
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
