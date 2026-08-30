'use client';

import React from 'react';
import { RoutePreference } from '@/types/railway';
import { Zap, RefreshCw, Train } from 'lucide-react';

interface RoutePreferenceProps {
  value: RoutePreference;
  onChange: (preference: RoutePreference) => void;
}

const PREFERENCE_OPTIONS: {
  id: RoutePreference;
  labelTh: string;
  labelEn: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: 'fastest',
    labelTh: 'เร็วที่สุด',
    labelEn: 'Fastest',
    icon: Zap,
  },
  {
    id: 'fewest-transfers',
    labelTh: 'เปลี่ยนสายน้อย',
    labelEn: 'Fewest Transfers',
    icon: RefreshCw,
  },
  {
    id: 'fewest-stations',
    labelTh: 'สถานีน้อยที่สุด',
    labelEn: 'Fewest Stations',
    icon: Train,
  },
];

export const RoutePreferenceSelector: React.FC<RoutePreferenceProps> = ({ value, onChange }) => {
  return (
    <div className="w-full bg-[#F1F4F8] p-1 rounded-xl flex items-center gap-1 border border-[#E2E8F0]">
      {PREFERENCE_OPTIONS.map((opt) => {
        const Icon = opt.icon;
        const isSelected = value === opt.id;

        return (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all duration-200 ${
              isSelected
                ? 'bg-white text-[#17202A] shadow-sm font-semibold border border-[#DDE2E7]'
                : 'text-[#64748B] hover:text-[#17202A] hover:bg-white/50'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#2E9B68]' : 'text-[#94A3B8]'}`} />
            <span className="truncate">{opt.labelTh}</span>
          </button>
        );
      })}
    </div>
  );
};
