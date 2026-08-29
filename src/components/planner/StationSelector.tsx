'use client';

import React, { useState } from 'react';
import { Station } from '@/types/railway';
import { PRESET_ROUTES } from '@/data/network';
import { ArrowUpDown, Search, MapPin, X, Navigation2 } from 'lucide-react';
import { StationSearchModal } from './StationSearchModal';

interface StationSelectorProps {
  origin: Station | null;
  destination: Station | null;
  onSelectOrigin: (st: Station | null) => void;
  onSelectDestination: (st: Station | null) => void;
  onSwap: () => void;
  onFindRoute: () => void;
  onSelectPreset: (originId: string, destId: string) => void;
  hasSearched: boolean;
}

export const StationSelector: React.FC<StationSelectorProps> = ({
  origin,
  destination,
  onSelectOrigin,
  onSelectDestination,
  onSwap,
  onFindRoute,
  onSelectPreset,
  hasSearched,
}) => {
  const [modalMode, setModalMode] = useState<'origin' | 'destination' | null>(null);

  return (
    <div className="bg-white rounded-xl p-4 border border-[#DDE2E7] space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-[#17202A] flex items-center gap-1.5">
          <span>วางแผนการเดินทาง</span>
          <span className="text-xs font-normal text-[#66717D]">/ Journey Planner</span>
        </h2>
      </div>

      {/* Connected Transit Route Input Module */}
      <div className="relative bg-[#F8FAFC] border border-[#DDE2E7] rounded-lg p-3 space-y-2">
        {/* Visual vertical connector line */}
        <div className="absolute left-[23px] top-[26px] bottom-[26px] w-[2px] bg-slate-300 pointer-events-none" />

        {/* Origin Input */}
        <div className="relative pl-7">
          <div className="absolute left-0 top-3 -translate-y-1/2 w-3 h-3 rounded-full bg-[#2E9B68] ring-4 ring-[#2E9B68]/15 z-10" />

          <button
            type="button"
            onClick={() => setModalMode('origin')}
            className={`w-full text-left py-2 px-3 rounded-md border transition-all ${
              origin
                ? 'bg-white border-[#DDE2E7] text-[#17202A]'
                : 'bg-white border-dashed border-slate-300 text-slate-400 hover:border-slate-400'
            }`}
          >
            <div className="text-[10px] font-bold text-[#2E9B68] uppercase tracking-wider">
              ต้นทาง / FROM
            </div>
            {origin ? (
              <div className="flex items-center justify-between mt-0.5">
                <div className="font-semibold text-sm text-[#17202A] flex items-center gap-1.5 truncate">
                  <span>{origin.nameTh}</span>
                  <span className="text-xs font-normal text-[#66717D]">({origin.nameEn})</span>
                </div>
                {origin.code && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 shrink-0 ml-2">
                    {origin.code}
                  </span>
                )}
              </div>
            ) : (
              <div className="text-xs text-slate-400 font-normal">เลือกสถานีต้นทาง...</div>
            )}
          </button>
        </div>

        {/* Swap Button In-Between */}
        <div className="relative flex justify-end pr-2 -my-1 z-20">
          <button
            onClick={onSwap}
            type="button"
            disabled={!origin && !destination}
            className="w-7 h-7 rounded-full bg-white border border-[#DDE2E7] text-slate-600 hover:text-[#3155D9] hover:border-[#3155D9] shadow-xs active:scale-95 transition-all flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
            title="สลับต้นทาง-ปลายทาง"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Destination Input */}
        <div className="relative pl-7">
          <div className="absolute left-0 top-3 -translate-y-1/2 w-3 h-3 rounded-full bg-[#D94A55] ring-4 ring-[#D94A55]/15 z-10" />

          <button
            type="button"
            onClick={() => setModalMode('destination')}
            className={`w-full text-left py-2 px-3 rounded-md border transition-all ${
              destination
                ? 'bg-white border-[#DDE2E7] text-[#17202A]'
                : 'bg-white border-dashed border-slate-300 text-slate-400 hover:border-slate-400'
            }`}
          >
            <div className="text-[10px] font-bold text-[#D94A55] uppercase tracking-wider">
              ปลายทาง / TO
            </div>
            {destination ? (
              <div className="flex items-center justify-between mt-0.5">
                <div className="font-semibold text-sm text-[#17202A] flex items-center gap-1.5 truncate">
                  <span>{destination.nameTh}</span>
                  <span className="text-xs font-normal text-[#66717D]">({destination.nameEn})</span>
                </div>
                {destination.code && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 shrink-0 ml-2">
                    {destination.code}
                  </span>
                )}
              </div>
            ) : (
              <div className="text-xs text-slate-400 font-normal">เลือกสถานีปลายทาง...</div>
            )}
          </button>
        </div>
      </div>

      {/* Flat Solid Primary Action Button */}
      <button
        onClick={onFindRoute}
        disabled={!origin || !destination || origin.id === destination.id}
        className="w-full py-2.5 px-4 bg-[#3155D9] hover:bg-[#2643B5] active:bg-[#1E3799] text-white font-semibold text-xs rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Navigation2 className="w-4 h-4 fill-white" />
        <span>ค้นหาเส้นทาง (Find Route)</span>
      </button>

      {/* Compact Quick Suggestions Row (Section 6) */}
      <div className="space-y-1.5 pt-2 border-t border-slate-100">
        <div className="text-[11px] font-semibold text-[#66717D]">
          เส้นทางตัวอย่างยอดนิยม:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {PRESET_ROUTES.slice(0, 4).map((p, idx) => (
            <button
              key={idx}
              onClick={() => onSelectPreset(p.originId, p.destId)}
              className="p-2 rounded-md text-left text-xs bg-[#F8FAFC] hover:bg-slate-100 border border-[#DDE2E7] text-[#17202A] transition-colors flex items-center justify-between"
            >
              <span className="truncate">{p.labelTh}</span>
              <span className="text-[10px] text-[#66717D] shrink-0 ml-1">→</span>
            </button>
          ))}
        </div>
      </div>

      {/* Station Search Modal */}
      <StationSearchModal
        isOpen={modalMode !== null}
        onClose={() => setModalMode(null)}
        title={modalMode === 'origin' ? 'เลือกสถานีต้นทาง' : 'เลือกสถานีปลายทาง'}
        currentSelectedId={modalMode === 'origin' ? origin?.id : destination?.id}
        onSelectStation={(st) => {
          if (modalMode === 'origin') {
            onSelectOrigin(st);
          } else {
            onSelectDestination(st);
          }
        }}
      />
    </div>
  );
};
