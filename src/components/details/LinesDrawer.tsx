'use client';

import React, { useState } from 'react';
import { RAILWAY_LINES } from '@/data/lines';
import { STATIONS } from '@/data/stations';
import { Station, RailwayLine } from '@/types/railway';
import { X, Layers, ChevronDown, ChevronUp, ArrowRight, Train, CheckCircle } from 'lucide-react';

interface LinesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStation: (station: Station) => void;
}

export const LinesDrawer: React.FC<LinesDrawerProps> = ({
  isOpen,
  onClose,
  onSelectStation,
}) => {
  const [expandedLineId, setExpandedLineId] = useState<string | null>('bts-sukhumvit');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">สายรถไฟฟ้าทั้งหมด</h3>
              <p className="text-xs text-slate-500">10 เส้นทางในระบบโครงข่ายกรุงเทพและปริมณฑล</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lines List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {Object.values(RAILWAY_LINES).map((line) => {
            const isExpanded = expandedLineId === line.id;
            const firstStation = STATIONS[line.stations[0]];
            const lastStation = STATIONS[line.stations[line.stations.length - 1]];

            return (
              <div
                key={line.id}
                className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs transition-all"
              >
                {/* Line Card Header / Accordion Trigger */}
                <button
                  onClick={() => setExpandedLineId(isExpanded ? null : line.id)}
                  className="w-full p-3.5 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-10 rounded-full shrink-0"
                      style={{ backgroundColor: line.color }}
                    />
                    <div>
                      <div className="font-extrabold text-sm text-slate-900">{line.nameTh}</div>
                      <div className="text-xs text-slate-500 font-medium">{line.name} ({line.operator})</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {firstStation?.nameTh} ➔ {lastStation?.nameTh} ({line.stations.length} สถานี)
                      </div>
                    </div>
                  </div>

                  <div className="p-1 rounded-lg text-slate-400">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {/* Expanded Station List */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 bg-slate-50/60 border-t border-slate-100 space-y-2">
                    {line.description && (
                      <p className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200/80 mb-3">
                        {line.description}
                      </p>
                    )}

                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      รายชื่อสถานีตามลำดับ ({line.stations.length}):
                    </div>

                    <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                      {line.stations.map((stId, sIdx) => {
                        const st = STATIONS[stId];
                        if (!st) return null;
                        const isInterchange = st.type === 'interchange' || st.lines.length > 1;

                        return (
                          <div
                            key={`drawer-st-${stId}`}
                            onClick={() => {
                              onSelectStation(st);
                              onClose();
                            }}
                            className="p-2 rounded-xl bg-white hover:bg-blue-50 border border-slate-200/60 hover:border-blue-200 flex items-center justify-between text-xs cursor-pointer transition-all"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[10px] text-slate-400 font-semibold w-4 text-right">
                                {sIdx + 1}.
                              </span>
                              <span className="font-bold text-slate-800">{st.nameTh}</span>
                              <span className="text-slate-400">({st.nameEn})</span>
                            </div>

                            <div className="flex items-center gap-1">
                              {st.code && (
                                <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-slate-100 text-slate-600">
                                  {st.code}
                                </span>
                              )}
                              {isInterchange && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">
                                  เปลี่ยนสาย
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
