export type Priority = 'baixa' | 'media' | 'alta';

export type TaskStatus = 'pendente' | 'em_andamento' | 'concluida';

export interface Task {
  id: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  priority: Priority;
  category: string;
  status: TaskStatus;
  projectId?: string;
  createdAt: string;
  completedAt?: string;
  archived?: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  folder?: string;
  pinned: boolean;
  archived: boolean;
  deleted: boolean;
  deletedAt?: string;
  isQuickNote?: boolean;
  isInbox?: boolean;
  projectId?: string;
  createdAt: string;
  updatedAt: string;
}

export type ProjectStatus = 'planejado' | 'em_andamento' | 'em_pausa' | 'concluido';

export interface Project {
  id: string;
  name: string;
  description: string;
  category: string;
  deadline: string; // YYYY-MM-DD
  status: ProjectStatus;
  progress: number; // 0 to 100 (auto-calculated from tasks or manual)
  icon: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoutineHabit {
  id: string;
  title: string;
  timeOfDay: 'manha' | 'tarde' | 'noite';
  daysOfWeek: number[]; // 0-6 (Sun-Sat)
  completedDates: string[]; // YYYY-MM-DD list
  streak: number;
}

export type NavTab = 
  | 'home' 
  | 'routine' 
  | 'tasks' 
  | 'notes' 
  | 'projects' 
  | 'calendar' 
  | 'archive';

export interface AppNotification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  timestamp: string;
}
