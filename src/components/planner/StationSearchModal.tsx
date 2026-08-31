'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, X, MapPin, ArrowRight, CornerDownLeft } from 'lucide-react';
import { STATIONS } from '@/data/stations';
import { RAILWAY_LINES } from '@/data/lines';
import { Station } from '@/types/railway';

interface StationSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStation: (station: Station) => void;
  title: string;
  currentSelectedId?: string;
}

export const StationSearchModal: React.FC<StationSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectStation,
  title,
  currentSelectedId,
}) => {
  const [query, setQuery] = useState('');
  const [selectedFilterLine, setSelectedFilterLine] = useState<string>('all');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setActiveIndex(0);
    } else {
      setQuery('');
      setSelectedFilterLine('all');
      setActiveIndex(0);
    }
  }, [isOpen]);

  const filteredStations = useMemo(() => {
    const clean = query.trim().toLowerCase();
    return Object.values(STATIONS).filter((st) => {
      // Line filter
      if (selectedFilterLine !== 'all' && !st.lines.includes(selectedFilterLine)) {
        return false;
      }
      if (!clean) return true;

      const matchEn = st.nameEn.toLowerCase().includes(clean);
      const matchTh = st.nameTh.toLowerCase().includes(clean);
      const matchCode = st.code && st.code.toLowerCase().includes(clean);
      const matchLines = st.lines.some((lId) => {
        const l = RAILWAY_LINES[lId];
        return l && (l.name.toLowerCase().includes(clean) || l.nameTh.toLowerCase().includes(clean));
      });

      return matchEn || matchTh || matchCode || matchLines;
    });
  }, [query, selectedFilterLine]);

  // Reset activeIndex on query change
  useEffect(() => {
    setActiveIndex(0);
  }, [filteredStations.length]);

  // Keyboard navigation handler
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev < filteredStations.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredStations[activeIndex]) {
        onSelectStation(filteredStations[activeIndex]);
        onClose();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  // Auto scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeElement = listRef.current.children[activeIndex] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [activeIndex]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150"
      onKeyDown={handleKeyDown}
    >
      <div
        className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ค้นหาชื่อสถานี (ไทย/English) หรือรหัสสถานี เช่น Siam, อโศก, CEN..."
              className="w-full pl-11 pr-9 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery('');
                  inputRef.current?.focus();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"
                title="ล้างข้อความ"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Line Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-0.5 text-xs scrollbar-none">
            <button
              onClick={() => setSelectedFilterLine('all')}
              className={`px-3 py-1 rounded-full whitespace-nowrap font-medium transition-all ${
                selectedFilterLine === 'all'
                  ? 'bg-slate-800 text-white shadow-xs font-bold'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              ทุกสาย (All)
            </button>
            {Object.values(RAILWAY_LINES).map((line) => (
              <button
                key={line.id}
                onClick={() => setSelectedFilterLine(line.id)}
                className={`px-3 py-1 rounded-full whitespace-nowrap flex items-center gap-1.5 font-medium transition-all ${
                  selectedFilterLine === line.id
                    ? 'border-2 border-slate-800 shadow-xs font-bold text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
                style={
                  selectedFilterLine === line.id
                    ? { backgroundColor: line.color, color: line.textColor || '#FFF' }
                    : {}
                }
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{
                    backgroundColor: selectedFilterLine === line.id ? '#FFFFFF' : line.color,
                  }}
                />
                <span>{line.name.replace('Line', '').replace('BTS', '').replace('MRT', '').trim()}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Station List Results */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-2 divide-y divide-slate-100">
          {filteredStations.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <p className="text-sm font-medium text-slate-600">ไม่พบสถานีที่ตรงกับคำค้นหา "{query}"</p>
              <p className="text-xs text-slate-400">ลองค้นหาด้วยชื่อภาษาไทย ภาษาอังกฤษ หรือรหัสสถานี (เช่น CEN, BL15, E4)</p>
            </div>
          ) : (
            filteredStations.map((st, idx) => {
              const isSelected = currentSelectedId === st.id;
              const isInterchange = st.type === 'interchange' || st.lines.length > 1;
              const isItemActive = idx === activeIndex;

              return (
                <button
                  key={st.id}
                  onClick={() => {
                    onSelectStation(st);
                    onClose();
                  }}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={`w-full p-3 flex items-center justify-between rounded-xl text-left transition-all ${
                    isItemActive
                      ? 'bg-blue-50/90 ring-1 ring-blue-300'
                      : isSelected
                      ? 'bg-emerald-50/70'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Station Code Badge */}
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex flex-col items-center justify-center text-slate-700 font-bold border border-slate-200 shrink-0">
                      <span className="text-[11px] font-extrabold tracking-tight">
                        {st.code || 'STN'}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{st.nameTh}</span>
                        {isInterchange && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                            จุดเปลี่ยนสาย
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-medium truncate">{st.nameEn}</p>

                      {/* Line Badges */}
                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        {st.lines.map((lineId) => {
                          const line = RAILWAY_LINES[lineId];
                          if (!line) return null;
                          return (
                            <span
                              key={lineId}
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-2xs"
                              style={{
                                backgroundColor: `${line.color}18`,
                                color: line.color,
                                border: `1px solid ${line.color}40`,
                              }}
                            >
                              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: line.color }} />
                              {line.name}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    {isItemActive && (
                      <span className="text-[10px] text-blue-600 font-semibold hidden sm:flex items-center gap-0.5 bg-blue-100/70 px-1.5 py-0.5 rounded">
                        <CornerDownLeft className="w-3 h-3" />
                        <span>Enter</span>
                      </span>
                    )}
                    <ArrowRight className={`w-4 h-4 ${isItemActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>พบ {filteredStations.length} สถานี</span>
          <span className="text-slate-400 hidden sm:inline">ใช้ลูกศร ↑ ↓ เพื่อเลื่อน และกด Enter เพื่อเลือก</span>
        </div>
      </div>
    </div>
  );
};
