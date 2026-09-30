import React, { useState } from 'react';
import { 
  Flame, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Sun, 
  CloudSun, 
  Moon, 
  Award,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getRelativeDate } from '../../data/initialData';

export const RoutineView: React.FC = () => {
  const { habits, toggleHabitToday } = useApp();

  const [newTitle, setNewTitle] = useState('');
  const [newTimeOfDay, setNewTimeOfDay] = useState<'manha' | 'tarde' | 'noite'>('manha');
  const [isAdding, setIsAdding] = useState(false);

  const todayStr = getRelativeDate(0);

  // Group by time of day
  const morningHabits = habits.filter(h => h.timeOfDay === 'manha');
  const afternoonHabits = habits.filter(h => h.timeOfDay === 'tarde');
  const eveningHabits = habits.filter(h => h.timeOfDay === 'noite');

  const totalCompletedToday = habits.filter(h => h.completedDates.includes(todayStr)).length;
  const routineScore = habits.length > 0 ? Math.round((totalCompletedToday / habits.length) * 100) : 0;

  // Last 7 days for consistency check
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    return getRelativeDate(i - 6);
  });

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2.5">
            <span>Minha Rotina & Hábitos</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
              {habits.length} rituais
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Construa consistência diária e acompanhe sequências de execução
          </p>
        </div>

        {/* Routine Score Card */}
        <div className="flex items-center space-x-3 bg-[#11131b] border border-[#1e2230] px-4 py-2 rounded-xl self-start sm:self-auto">
          <Flame className="w-5 h-5 text-amber-400" />
          <div>
            <span className="text-xs font-semibold text-zinc-200 block font-mono">
              {totalCompletedToday}/{habits.length} Feitos Hoje
            </span>
            <span className="text-[10px] text-zinc-500">Pontuação de Consistência</span>
          </div>
          <div className="w-14 h-2 bg-[#202436] rounded-full overflow-hidden ml-2">
            <div 
              className="h-full bg-amber-400 rounded-full transition-all duration-500" 
              style={{ width: `${routineScore}%` }} 
            />
          </div>
          <span className="text-xs font-mono font-bold text-amber-400">{routineScore}%</span>
        </div>
      </div>

      {/* Habits Sections: Manhã, Tarde, Noite */}
      <div className="space-y-6">
        {/* Manhã */}
        <div className="bg-[#11131a] border border-[#1f2230] rounded-2xl p-5 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-300 pb-2 border-b border-[#1b1e2a]">
            <Sun className="w-4 h-4 text-amber-400" />
            <span>Rotina da Manhã</span>
          </div>

          <div className="space-y-2">
            {morningHabits.map(habit => {
              const isDone = habit.completedDates.includes(todayStr);
              return (
                <div
                  key={habit.id}
                  className="flex items-center justify-between p-3 bg-[#141620] hover:bg-[#181a26] border border-[#202332] rounded-xl transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleHabitToday(habit.id)}
                      className="transition-colors"
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-amber-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-zinc-600 hover:text-amber-400" />
                      )}
                    </button>
                    <div>
                      <span className={`text-xs sm:text-sm font-medium ${
                        isDone ? 'text-zinc-400 line-through' : 'text-zinc-100'
                      }`}>
                        {habit.title}
                      </span>
                    </div>
                  </div>

                  {/* 7-day mini consistency dots */}
                  <div className="flex items-center space-x-3">
                    <div className="hidden sm:flex items-center space-x-1">
                      {last7Days.map(dStr => {
                        const hit = habit.completedDates.includes(dStr);
                        return (
                          <div
                            key={dStr}
                            className={`w-2 h-2 rounded-full ${
                              hit ? 'bg-amber-400' : 'bg-[#222536]'
                            }`}
                            title={dStr}
                          />
                        );
                      })}
                    </div>

                    <div className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono">
                      <Flame className="w-3 h-3" />
                      <span>{habit.streak}d</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tarde */}
        <div className="bg-[#11131a] border border-[#1f2230] rounded-2xl p-5 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-indigo-300 pb-2 border-b border-[#1b1e2a]">
            <CloudSun className="w-4 h-4 text-indigo-400" />
            <span>Rotina da Tarde</span>
          </div>

          <div className="space-y-2">
            {afternoonHabits.map(habit => {
              const isDone = habit.completedDates.includes(todayStr);
              return (
                <div
                  key={habit.id}
                  className="flex items-center justify-between p-3 bg-[#141620] hover:bg-[#181a26] border border-[#202332] rounded-xl transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleHabitToday(habit.id)}
                      className="transition-colors"
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-zinc-600 hover:text-indigo-400" />
                      )}
                    </button>
                    <div>
                      <span className={`text-xs sm:text-sm font-medium ${
                        isDone ? 'text-zinc-400 line-through' : 'text-zinc-100'
                      }`}>
                        {habit.title}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="hidden sm:flex items-center space-x-1">
                      {last7Days.map(dStr => {
                        const hit = habit.completedDates.includes(dStr);
                        return (
                          <div
                            key={dStr}
                            className={`w-2 h-2 rounded-full ${
                              hit ? 'bg-indigo-400' : 'bg-[#222536]'
                            }`}
                            title={dStr}
                          />
                        );
                      })}
                    </div>

                    <div className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono">
                      <Flame className="w-3 h-3" />
                      <span>{habit.streak}d</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Noite */}
        <div className="bg-[#11131a] border border-[#1f2230] rounded-2xl p-5 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-violet-300 pb-2 border-b border-[#1b1e2a]">
            <Moon className="w-4 h-4 text-violet-400" />
            <span>Rotina da Noite</span>
          </div>

          <div className="space-y-2">
            {eveningHabits.map(habit => {
              const isDone = habit.completedDates.includes(todayStr);
              return (
                <div
                  key={habit.id}
                  className="flex items-center justify-between p-3 bg-[#141620] hover:bg-[#181a26] border border-[#202332] rounded-xl transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleHabitToday(habit.id)}
                      className="transition-colors"
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-violet-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-zinc-600 hover:text-violet-400" />
                      )}
                    </button>
                    <div>
                      <span className={`text-xs sm:text-sm font-medium ${
                        isDone ? 'text-zinc-400 line-through' : 'text-zinc-100'
                      }`}>
                        {habit.title}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="hidden sm:flex items-center space-x-1">
                      {last7Days.map(dStr => {
                        const hit = habit.completedDates.includes(dStr);
                        return (
                          <div
                            key={dStr}
                            className={`w-2 h-2 rounded-full ${
                              hit ? 'bg-violet-400' : 'bg-[#222536]'
                            }`}
                            title={dStr}
                          />
                        );
                      })}
                    </div>

                    <div className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-mono">
                      <Flame className="w-3 h-3" />
                      <span>{habit.streak}d</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
