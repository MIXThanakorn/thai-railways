'use client';

import React from 'react';
import { SystemFilter } from '@/types/railway';
import { Layers } from 'lucide-react';

interface MapLineFilterProps {
  currentFilter: SystemFilter;
  onFilterChange: (filter: SystemFilter) => void;
}

const FILTER_ITEMS: { id: SystemFilter; labelTh: string; labelEn: string; color?: string }[] = [
  { id: 'all', labelTh: 'ทั้งหมด', labelEn: 'All' },
  { id: 'bts', labelTh: 'BTS', labelEn: 'BTS', color: '#75B832' },
  { id: 'mrt', labelTh: 'MRT', labelEn: 'MRT', color: '#193E94' },
  { id: 'arl', labelTh: 'ARL', labelEn: 'ARL', color: '#7E1E2C' },
  { id: 'srt', labelTh: 'SRT สายสีแดง', labelEn: 'SRT Red', color: '#C8102E' },
];

export const MapLineFilter: React.FC<MapLineFilterProps> = ({
  currentFilter,
  onFilterChange,
}) => {
  return (
    <div className="absolute top-3 left-3 z-20 flex items-center gap-1 bg-white/95 backdrop-blur-sm p-1 rounded-xl border border-[#DDE2E7] shadow-sm max-w-[calc(100%-140px)] overflow-x-auto">
      <div className="flex items-center gap-1 px-2 text-[11px] font-bold text-[#64748B] hidden sm:flex">
        <Layers className="w-3.5 h-3.5 text-[#64748B]" />
        <span>ระบบ</span>
      </div>

      {FILTER_ITEMS.map((item) => {
        const isSelected = currentFilter === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onFilterChange(item.id)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 flex items-center gap-1.5 ${
              isSelected
                ? 'bg-[#17202A] text-white shadow-sm'
                : 'text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
            }`}
          >
            {item.color && (
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
            )}
            <span>{item.labelTh}</span>
          </button>
        );
      })}
    </div>
  );
};
