import React from 'react';
import { ContinueRail } from './ContinueRail';
import { TodaySection } from './TodaySection';
import { WeekOutlook } from './WeekOutlook';
import { QuickAccess } from './QuickAccess';
import { QuickNotesPad } from './QuickNotesPad';

export const HomeView: React.FC = () => {
  return (
    <div className="space-y-8 pb-16 animate-fade-in">
      {/* 1. Continuar de onde parei (Netflix-inspired horizontal rail) */}
      <ContinueRail />

      {/* 2. Main Dashboard Grid: Hoje (left 7 cols) & Anotações Rápidas (right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <TodaySection />
        </div>
        <div className="lg:col-span-5">
          <QuickNotesPad />
        </div>
      </div>

      {/* 3. Minha semana (Compact 7-day outlook) */}
      <WeekOutlook />

      {/* 4. Acesso rápido (6 quick navigation cards) */}
      <QuickAccess />
    </div>
  );
};
