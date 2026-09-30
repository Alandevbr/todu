import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import type { 
  Task, 
  Note, 
  Project, 
  RoutineHabit, 
  NavTab, 
  AppNotification 
} from '../types';
import { 
  INITIAL_TASKS, 
  INITIAL_NOTES, 
  INITIAL_PROJECTS, 
  INITIAL_HABITS, 
  getRelativeDate 
} from '../data/initialData';

interface AppContextType {
  // Navigation & UI State
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isQuickAddOpen: boolean;
  setIsQuickAddOpen: (open: boolean) => void;
  quickAddType: 'task' | 'note' | 'project';
  setQuickAddType: (type: 'task' | 'note' | 'project') => void;
  isShortcutsOpen: boolean;
  setIsShortcutsOpen: (open: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  isAuthOpen: boolean;
  setIsAuthOpen: (open: boolean) => void;
  
  // Supabase Auth & Sync
  user: User | null;
  isSyncing: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, name?: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  syncLocalToCloud: () => Promise<void>;

  // Modals & Selection
  selectedProjectDetailId: string | null;
  setSelectedProjectDetailId: (id: string | null) => void;
  selectedNoteId: string | null;
  setSelectedNoteId: (id: string | null) => void;
  editingTaskId: string | null;
  setEditingTaskId: (id: string | null) => void;
  
  // User Profile
  userName: string;
  setUserName: (name: string) => void;

  // Data Collections
  tasks: Task[];
  notes: Note[];
  projects: Project[];
  habits: RoutineHabit[];
  
  // Task Operations
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
  archiveTask: (id: string) => void;
  
  // Note Operations
  addNote: (note: Partial<Note>) => Note;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  restoreNote: (id: string) => void;
  permanentDeleteNote: (id: string) => void;
  togglePinNote: (id: string) => void;
  toggleArchiveNote: (id: string) => void;
  
  // Project Operations
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  // Habit Operations
  toggleHabitToday: (habitId: string) => void;

  // Toast Notifications
  notification: AppNotification | null;
  showToast: (message: string, type?: 'info' | 'success' | 'warning') => void;

  // Persistence & Management
  resetDemoData: () => void;
  clearAllData: () => void;
  exportData: () => void;
  importData: (jsonData: string) => boolean;

  // Calculated Stats
  todayTasks: Task[];
  completedTodayCount: number;
  todayProgressPercentage: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  TASKS: 'myspace_tasks_v1',
  NOTES: 'myspace_notes_v1',
  PROJECTS: 'myspace_projects_v1',
  HABITS: 'myspace_habits_v1',
  USER: 'myspace_user_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & Modals
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddType, setQuickAddType] = useState<'task' | 'note' | 'project'>('task');
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedProjectDetailId, setSelectedProjectDetailId] = useState<string | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [notification, setNotification] = useState<AppNotification | null>(null);

  // Supabase state
  const [user, setUser] = useState<User | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // User Name
  const [userName, setUserNameState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.USER) || 'Alan';
  });

  const setUserName = (name: string) => {
    setUserNameState(name);
    localStorage.setItem(STORAGE_KEYS.USER, name);
  };

  // Main collections with localStorage persistence
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_TASKS;
  });

  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTES);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_NOTES;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_PROJECTS;
  });

  const [habits, setHabits] = useState<RoutineHabit[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.HABITS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_HABITS;
  });

  // Supabase Auth listener
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        if (session.user.user_metadata?.name) {
          setUserName(session.user.user_metadata.name);
        }
        loadDataFromSupabase(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        if (session.user.user_metadata?.name) {
          setUserName(session.user.user_metadata.name);
        }
        loadDataFromSupabase(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch data from Supabase
  const loadDataFromSupabase = async (userId: string) => {
    try {
      setIsSyncing(true);

      const [projRes, taskRes, noteRes, habitRes] = await Promise.all([
        supabase.from('projects').select('*').eq('user_id', userId),
        supabase.from('tasks').select('*').eq('user_id', userId),
        supabase.from('notes').select('*').eq('user_id', userId),
        supabase.from('habits').select('*').eq('user_id', userId),
      ]);

      if (projRes.data && projRes.data.length > 0) {
        setProjects(projRes.data.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description || '',
          category: p.category,
          deadline: p.deadline || '',
          status: p.status,
          progress: p.progress,
          icon: p.icon || 'FolderKanban',
          color: p.color || '#6366f1',
          createdAt: p.created_at?.split('T')[0] || getRelativeDate(0),
          updatedAt: p.updated_at?.split('T')[0] || getRelativeDate(0),
        })));
      }

      if (taskRes.data && taskRes.data.length > 0) {
        setTasks(taskRes.data.map(t => ({
          id: t.id,
          title: t.title,
          description: t.description || undefined,
          date: t.date || getRelativeDate(0),
          time: t.time || undefined,
          priority: t.priority,
          category: t.category,
          status: t.status,
          projectId: t.project_id || undefined,
          archived: t.archived,
          completedAt: t.completed_at || undefined,
          createdAt: t.created_at?.split('T')[0] || getRelativeDate(0),
        })));
      }

      if (noteRes.data && noteRes.data.length > 0) {
        setNotes(noteRes.data.map(n => ({
          id: n.id,
          title: n.title,
          content: n.content || '',
          category: n.category,
          folder: n.folder || undefined,
          pinned: n.pinned,
          archived: n.archived,
          deleted: n.deleted,
          deletedAt: n.deleted_at || undefined,
          isQuickNote: n.is_quick_note,
          isInbox: n.is_inbox,
          projectId: n.project_id || undefined,
          createdAt: n.created_at?.split('T')[0] || getRelativeDate(0),
          updatedAt: n.updated_at?.split('T')[0] || getRelativeDate(0),
        })));
      }

      if (habitRes.data && habitRes.data.length > 0) {
        setHabits(habitRes.data.map(h => ({
          id: h.id,
          title: h.title,
          timeOfDay: h.time_of_day,
          daysOfWeek: h.days_of_week || [0, 1, 2, 3, 4, 5, 6],
          completedDates: h.completed_dates || [],
          streak: h.streak || 0,
        })));
      }

      showToast('Dados sincronizados com o Supabase!', 'success');
    } catch (err) {
      console.warn('Erro ao carregar dados do Supabase:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Sync all local data to Supabase cloud
  const syncLocalToCloud = async () => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }

    try {
      setIsSyncing(true);

      // Projects
      if (projects.length > 0) {
        await supabase.from('projects').upsert(
          projects.map(p => ({
            id: p.id,
            user_id: user.id,
            name: p.name,
            description: p.description,
            category: p.category,
            deadline: p.deadline,
            status: p.status,
            progress: p.progress,
            icon: p.icon,
            color: p.color,
          }))
        );
      }

      // Tasks
      if (tasks.length > 0) {
        await supabase.from('tasks').upsert(
          tasks.map(t => ({
            id: t.id,
            user_id: user.id,
            project_id: t.projectId || null,
            title: t.title,
            description: t.description || null,
            date: t.date,
            time: t.time || null,
            priority: t.priority,
            category: t.category,
            status: t.status,
            archived: t.archived || false,
            completed_at: t.completedAt || null,
          }))
        );
      }

      // Notes
      if (notes.length > 0) {
        await supabase.from('notes').upsert(
          notes.map(n => ({
            id: n.id,
            user_id: user.id,
            project_id: n.projectId || null,
            title: n.title,
            content: n.content,
            category: n.category,
            folder: n.folder || null,
            pinned: n.pinned || false,
            archived: n.archived || false,
            deleted: n.deleted || false,
            deleted_at: n.deletedAt || null,
            is_quick_note: n.isQuickNote || false,
            is_inbox: n.isInbox || false,
          }))
        );
      }

      // Habits
      if (habits.length > 0) {
        await supabase.from('habits').upsert(
          habits.map(h => ({
            id: h.id,
            user_id: user.id,
            title: h.title,
            time_of_day: h.timeOfDay,
            days_of_week: h.daysOfWeek,
            completed_dates: h.completedDates,
            streak: h.streak,
          }))
        );
      }

      showToast('Dados enviados com sucesso para o Supabase!', 'success');
    } catch (err: any) {
      showToast('Erro ao sincronizar com nuvem: ' + err.message, 'warning');
    } finally {
      setIsSyncing(false);
    }
  };

  // Auth operations
  const signIn = async (email: string, pass: string): Promise<boolean> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) {
      showToast(error.message, 'warning');
      return false;
    }
    showToast('Login realizado com sucesso!', 'success');
    return true;
  };

  const signUp = async (email: string, pass: string, name?: string): Promise<boolean> => {
    const { error } = await supabase.auth.signUp({ 
      email, 
      password: pass,
      options: {
        data: { name: name || 'Alan' }
      }
    });
    if (error) {
      showToast(error.message, 'warning');
      return false;
    }
    showToast('Cadastro realizado!', 'success');
    return true;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    showToast('Desconectado. Operando em modo local.', 'info');
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
  }, [habits]);

  // Recalculate project progress whenever tasks change
  useEffect(() => {
    setProjects(prevProjects => 
      prevProjects.map(proj => {
        const projectTasks = tasks.filter(t => t.projectId === proj.id && !t.archived);
        if (projectTasks.length === 0) return proj;
        const completed = projectTasks.filter(t => t.status === 'concluida').length;
        const calculatedProgress = Math.round((completed / projectTasks.length) * 100);
        return { ...proj, progress: calculatedProgress };
      })
    );
  }, [tasks]);

  // Toast trigger
  const showToast = (message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    const id = Date.now().toString();
    setNotification({ id, message, type, timestamp: new Date().toISOString() });
    setTimeout(() => {
      setNotification(curr => (curr?.id === id ? null : curr));
    }, 3200);
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
        return;
      }

      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsQuickAddOpen(false);
        setIsShortcutsOpen(false);
        setIsSettingsOpen(false);
        setIsAuthOpen(false);
        setSelectedProjectDetailId(null);
        setEditingTaskId(null);
        return;
      }

      if (isInput) return;

      if (e.key === 'c' || e.key === 'n') {
        e.preventDefault();
        setQuickAddType('note');
        setIsQuickAddOpen(true);
      } else if (e.key === 't') {
        e.preventDefault();
        setQuickAddType('task');
        setIsQuickAddOpen(true);
      } else if (e.key === '?') {
        e.preventDefault();
        setIsShortcutsOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Task Operations
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>): Task => {
    const newTask: Task = {
      ...taskData,
      id: 'task-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTasks(prev => [newTask, ...prev]);

    // Async sync to Supabase if logged in
    if (user) {
      supabase.from('tasks').insert({
        id: newTask.id,
        user_id: user.id,
        project_id: newTask.projectId || null,
        title: newTask.title,
        description: newTask.description || null,
        date: newTask.date,
        time: newTask.time || null,
        priority: newTask.priority,
        category: newTask.category,
        status: newTask.status,
        archived: false,
      }).then(({ error }) => {
        if (error) console.warn('Supabase task insert error:', error.message);
      });
    }

    showToast('Tarefa criada com sucesso!', 'success');
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));

    if (user) {
      const dbUpdates: any = { ...updates };
      if (updates.projectId !== undefined) dbUpdates.project_id = updates.projectId || null;
      delete dbUpdates.projectId;
      supabase.from('tasks').update(dbUpdates).eq('id', id).then(({ error }) => {
        if (error) console.warn('Supabase task update error:', error.message);
      });
    }

    showToast('Tarefa atualizada', 'info');
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));

    if (user) {
      supabase.from('tasks').delete().eq('id', id).then(({ error }) => {
        if (error) console.warn('Supabase task delete error:', error.message);
      });
    }

    showToast('Tarefa excluída', 'info');
  };

  const toggleTaskStatus = (id: string) => {
    setTasks(prev => {
      const task = prev.find(t => t.id === id);
      if (!task) return prev;
      const nextStatus = task.status === 'concluida' ? 'pendente' : 'concluida';
      const completedAt = nextStatus === 'concluida' ? new Date().toISOString().split('T')[0] : undefined;
      
      if (nextStatus === 'concluida') {
        try {
          confetti({
            particleCount: 28,
            spread: 50,
            origin: { y: 0.8 },
            colors: ['#6366f1', '#8b5cf6', '#10b981'],
            ticks: 120,
            disableForReducedMotion: true
          });
        } catch {}
        showToast('Tarefa concluída!', 'success');
      }

      if (user) {
        supabase.from('tasks').update({ 
          status: nextStatus, 
          completed_at: completedAt || null 
        }).eq('id', id).then(({ error }) => {
          if (error) console.warn('Supabase task status update error:', error.message);
        });
      }

      return prev.map(t => (t.id === id ? { ...t, status: nextStatus, completedAt } : t));
    });
  };

  const archiveTask = (id: string) => {
    setTasks(prev => {
      const task = prev.find(t => t.id === id);
      const nextArchived = !task?.archived;

      if (user) {
        supabase.from('tasks').update({ archived: nextArchived }).eq('id', id).then();
      }

      return prev.map(t => (t.id === id ? { ...t, archived: nextArchived } : t));
    });
    showToast('Status de arquivamento atualizado', 'info');
  };

  // Note Operations
  const addNote = (noteData: Partial<Note>): Note => {
    const now = new Date().toISOString().split('T')[0];
    const newNote: Note = {
      id: 'note-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      title: noteData.title || 'Sem título',
      content: noteData.content || '',
      category: noteData.category || 'Geral',
      folder: noteData.folder,
      pinned: noteData.pinned || false,
      archived: false,
      deleted: false,
      isQuickNote: noteData.isQuickNote || false,
      isInbox: noteData.isInbox || false,
      projectId: noteData.projectId,
      createdAt: now,
      updatedAt: now,
    };
    setNotes(prev => [newNote, ...prev]);
    setSelectedNoteId(newNote.id);

    if (user) {
      supabase.from('notes').insert({
        id: newNote.id,
        user_id: user.id,
        project_id: newNote.projectId || null,
        title: newNote.title,
        content: newNote.content,
        category: newNote.category,
        folder: newNote.folder || null,
        pinned: newNote.pinned,
        is_quick_note: newNote.isQuickNote,
        is_inbox: newNote.isInbox,
      }).then(({ error }) => {
        if (error) console.warn('Supabase note insert error:', error.message);
      });
    }

    showToast('Nota criada com sucesso!', 'success');
    return newNote;
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    const now = new Date().toISOString().split('T')[0];
    setNotes(prev => prev.map(n => (n.id === id ? { ...n, ...updates, updatedAt: now } : n)));

    if (user) {
      const dbUpdates: any = { ...updates };
      if (updates.isQuickNote !== undefined) dbUpdates.is_quick_note = updates.isQuickNote;
      if (updates.isInbox !== undefined) dbUpdates.is_inbox = updates.isInbox;
      if (updates.projectId !== undefined) dbUpdates.project_id = updates.projectId || null;
      delete dbUpdates.isQuickNote;
      delete dbUpdates.isInbox;
      delete dbUpdates.projectId;
      supabase.from('notes').update(dbUpdates).eq('id', id).then();
    }
  };

  const deleteNote = (id: string) => {
    const now = new Date().toISOString().split('T')[0];
    setNotes(prev => prev.map(n => (n.id === id ? { ...n, deleted: true, deletedAt: now } : n)));
    if (selectedNoteId === id) setSelectedNoteId(null);

    if (user) {
      supabase.from('notes').update({ deleted: true, deleted_at: now }).eq('id', id).then();
    }

    showToast('Nota movida para a lixeira', 'info');
  };

  const restoreNote = (id: string) => {
    setNotes(prev => prev.map(n => (n.id === id ? { ...n, deleted: false, deletedAt: undefined } : n)));

    if (user) {
      supabase.from('notes').update({ deleted: false, deleted_at: null }).eq('id', id).then();
    }

    showToast('Nota restaurada!', 'success');
  };

  const permanentDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));

    if (user) {
      supabase.from('notes').delete().eq('id', id).then();
    }

    showToast('Nota excluída permanentemente', 'warning');
  };

  const togglePinNote = (id: string) => {
    setNotes(prev => {
      const note = prev.find(n => n.id === id);
      const nextPinned = !note?.pinned;

      if (user) {
        supabase.from('notes').update({ pinned: nextPinned }).eq('id', id).then();
      }

      return prev.map(n => (n.id === id ? { ...n, pinned: nextPinned } : n));
    });
  };

  const toggleArchiveNote = (id: string) => {
    setNotes(prev => {
      const note = prev.find(n => n.id === id);
      const nextArchived = !note?.archived;

      if (user) {
        supabase.from('notes').update({ archived: nextArchived }).eq('id', id).then();
      }

      return prev.map(n => (n.id === id ? { ...n, archived: nextArchived } : n));
    });
    showToast('Status de arquivamento atualizado', 'info');
  };

  // Project Operations
  const addProject = (projData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project => {
    const now = new Date().toISOString().split('T')[0];
    const newProject: Project = {
      ...projData,
      id: 'proj-' + Date.now(),
      createdAt: now,
      updatedAt: now,
    };
    setProjects(prev => [...prev, newProject]);

    if (user) {
      supabase.from('projects').insert({
        id: newProject.id,
        user_id: user.id,
        name: newProject.name,
        description: newProject.description,
        category: newProject.category,
        deadline: newProject.deadline,
        status: newProject.status,
        progress: newProject.progress,
        icon: newProject.icon,
        color: newProject.color,
      }).then();
    }

    showToast('Projeto criado com sucesso!', 'success');
    return newProject;
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    const now = new Date().toISOString().split('T')[0];
    setProjects(prev => prev.map(p => (p.id === id ? { ...p, ...updates, updatedAt: now } : p)));

    if (user) {
      supabase.from('projects').update(updates).eq('id', id).then();
    }

    showToast('Projeto atualizado', 'info');
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    setTasks(prev => prev.map(t => (t.projectId === id ? { ...t, projectId: undefined } : t)));
    setNotes(prev => prev.map(n => (n.projectId === id ? { ...n, projectId: undefined } : n)));
    if (selectedProjectDetailId === id) setSelectedProjectDetailId(null);

    if (user) {
      supabase.from('projects').delete().eq('id', id).then();
    }

    showToast('Projeto excluído', 'info');
  };

  // Habit Operations
  const toggleHabitToday = (habitId: string) => {
    const today = getRelativeDate(0);
    setHabits(prev => prev.map(h => {
      if (h.id !== habitId) return h;
      const isCompleted = h.completedDates.includes(today);
      let newCompletedDates: string[];
      let newStreak = h.streak;

      if (isCompleted) {
        newCompletedDates = h.completedDates.filter(d => d !== today);
        newStreak = Math.max(0, newStreak - 1);
      } else {
        newCompletedDates = [...h.completedDates, today];
        newStreak += 1;
        showToast(`Hábito completado! Sequência de ${newStreak} dias`, 'success');
      }

      if (user) {
        supabase.from('habits').update({
          completed_dates: newCompletedDates,
          streak: newStreak
        }).eq('id', habitId).then();
      }

      return {
        ...h,
        completedDates: newCompletedDates,
        streak: newStreak
      };
    }));
  };

  // Reset & Backup
  const resetDemoData = () => {
    setTasks(INITIAL_TASKS);
    setNotes(INITIAL_NOTES);
    setProjects(INITIAL_PROJECTS);
    setHabits(INITIAL_HABITS);
    showToast('Dados de demonstração restaurados', 'info');
  };

  const clearAllData = () => {
    setTasks([]);
    setNotes([]);
    setProjects([]);
    setHabits([]);
    showToast('Todos os dados foram limpos', 'warning');
  };

  const exportData = () => {
    const fullBackup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      userName,
      tasks,
      notes,
      projects,
      habits,
    };
    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `myspace-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup exportado com sucesso!', 'success');
  };

  const importData = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.tasks && Array.isArray(parsed.tasks)) setTasks(parsed.tasks);
      if (parsed.notes && Array.isArray(parsed.notes)) setNotes(parsed.notes);
      if (parsed.projects && Array.isArray(parsed.projects)) setProjects(parsed.projects);
      if (parsed.habits && Array.isArray(parsed.habits)) setHabits(parsed.habits);
      if (parsed.userName) setUserName(parsed.userName);
      showToast('Dados importados com sucesso!', 'success');
      return true;
    } catch {
      showToast('Falha ao importar arquivo JSON inválido', 'warning');
      return false;
    }
  };

  // Calculated stats for Today
  const today = getRelativeDate(0);
  const todayTasks = tasks.filter(t => t.date === today && !t.archived);
  const completedTodayCount = todayTasks.filter(t => t.status === 'concluida').length;
  const todayProgressPercentage = todayTasks.length > 0 
    ? Math.round((completedTodayCount / todayTasks.length) * 100) 
    : 0;

  return (
    <AppContext.Provider value={{
      activeTab,
      setActiveTab,
      searchQuery,
      setSearchQuery,
      isSearchOpen,
      setIsSearchOpen,
      isQuickAddOpen,
      setIsQuickAddOpen,
      quickAddType,
      setQuickAddType,
      isShortcutsOpen,
      setIsShortcutsOpen,
      isSettingsOpen,
      setIsSettingsOpen,
      isAuthOpen,
      setIsAuthOpen,
      user,
      isSyncing,
      signIn,
      signUp,
      signOut,
      syncLocalToCloud,
      selectedProjectDetailId,
      setSelectedProjectDetailId,
      selectedNoteId,
      setSelectedNoteId,
      editingTaskId,
      setEditingTaskId,
      userName,
      setUserName,
      tasks,
      notes,
      projects,
      habits,
      addTask,
      updateTask,
      deleteTask,
      toggleTaskStatus,
      archiveTask,
      addNote,
      updateNote,
      deleteNote,
      restoreNote,
      permanentDeleteNote,
      togglePinNote,
      toggleArchiveNote,
      addProject,
      updateProject,
      deleteProject,
      toggleHabitToday,
      notification,
      showToast,
      resetDemoData,
      clearAllData,
      exportData,
      importData,
      todayTasks,
      completedTodayCount,
      todayProgressPercentage,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
