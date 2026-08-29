'use client';

import React from 'react';
import { RouteResult } from '@/types/railway';
import { Play, ArrowRight, RefreshCw, Check } from 'lucide-react';
import { RAILWAY_LINES } from '@/data/lines';
import { STATIONS } from '@/data/stations';

interface RouteSummaryProps {
  routes: RouteResult[];
  selectedRouteIndex: number;
  onSelectRouteIndex: (idx: number) => void;
  onStartJourney: () => void;
  isJourneyActive: boolean;
}

export const RouteSummary: React.FC<RouteSummaryProps> = ({
  routes,
  selectedRouteIndex,
  onSelectRouteIndex,
  onStartJourney,
  isJourneyActive,
}) => {
  const currentRoute = routes[selectedRouteIndex];
  if (!currentRoute) return null;

  return (
    <div className="bg-white rounded-xl p-4 border border-[#DDE2E7] space-y-4">
      {/* 1. Selectable Route Rows (Section 6) */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold uppercase tracking-wider text-[#66717D]">
          ผลการค้นหาเส้นทาง ({routes.length} เส้นทาง)
        </div>

        <div className="space-y-2">
          {routes.map((rt, idx) => {
            const isSelected = selectedRouteIndex === idx;
            const originSt = STATIONS[rt.stations[0]];
            const destSt = STATIONS[rt.stations[rt.stations.length - 1]];

            return (
              <button
                key={rt.id}
                onClick={() => onSelectRouteIndex(idx)}
                className={`w-full p-3 rounded-lg text-left border transition-all ${
                  isSelected
                    ? 'border-[#3155D9] bg-blue-50/40 ring-1 ring-[#3155D9]'
                    : 'border-[#DDE2E7] bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                      rt.isRecommended
                        ? 'bg-emerald-100 text-[#2E9B68]'
                        : 'bg-slate-100 text-[#66717D]'
                    }`}
                  >
                    {rt.isRecommended ? 'เส้นทางแนะนำ / FASTEST' : `ทางเลือก (${idx + 1}) / ALTERNATIVE`}
                  </span>

                  <span className="text-xs font-bold text-[#17202A]">
                    ฿{rt.fareThb || 25}
                  </span>
                </div>

                {/* Station path summary */}
                <div className="text-xs font-semibold text-[#17202A] mt-1 flex items-center gap-1.5 truncate">
                  <span>{originSt?.nameTh}</span>
                  <span className="text-slate-400">→</span>
                  {rt.transfers.length > 0 && (
                    <>
                      <span className="text-amber-700">
                        {STATIONS[rt.transfers[0].stationId]?.nameTh}
                      </span>
                      <span className="text-slate-400">→</span>
                    </>
                  )}
                  <span>{destSt?.nameTh}</span>
                </div>

                {/* High-density metadata line */}
                <div className="text-[11px] text-[#66717D] mt-1 flex items-center gap-1.5">
                  <strong className="text-[#17202A] font-semibold">{rt.estimatedMinutes} นาที</strong>
                  <span>·</span>
                  <span>{rt.totalStations} สถานี</span>
                  <span>·</span>
                  <span>{rt.transfers.length === 0 ? 'ต่อเดียว (0 เปลี่ยนสาย)' : `${rt.transfers.length} เปลี่ยนสาย`}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Typography-Led Route Metric Display (Section 7) */}
      <div className="bg-[#F8FAFC] border border-[#DDE2E7] rounded-lg p-3.5 space-y-2">
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#66717D]">
              เวลาเดินทางโดยประมาณ
            </div>
            <div className="text-2xl font-bold text-[#17202A] tracking-tight">
              ~{currentRoute.estimatedMinutes}{' '}
              <span className="text-xs font-normal text-[#66717D]">นาที (min)</span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#66717D]">
              ค่าโดยสารประมาณ
            </div>
            <div className="text-lg font-bold text-[#2E9B68]">
              ฿{currentRoute.fareThb || 20}
            </div>
          </div>
        </div>

        {/* Compact Metadata Row */}
        <div className="text-xs text-[#66717D] pt-1 border-t border-slate-200 flex items-center justify-between">
          <span>{currentRoute.totalStations} สถานีตลอดเส้นทาง</span>
          <span>
            {currentRoute.transfers.length === 0 ? '✓ ไม่ต้องเปลี่ยนขบวน' : `↔ เปลี่ยนสาย ${currentRoute.transfers.length} ครั้ง`}
          </span>
        </div>

        {/* Connecting Lines Sequence */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {currentRoute.segments.map((seg, sIdx) => (
            <React.Fragment key={`seg-pill-${sIdx}`}>
              <span
                className="px-2 py-0.5 rounded text-[11px] font-semibold text-white flex items-center gap-1"
                style={{ backgroundColor: seg.lineColor }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                <span>{seg.lineNameTh}</span>
              </span>

              {sIdx < currentRoute.segments.length - 1 && (
                <span className="text-[10px] text-amber-700 font-bold px-1 py-0.5 rounded bg-amber-50 border border-amber-200">
                  เปลี่ยนสาย
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 3. Simulation Action Button (Section 17) */}
      {!isJourneyActive && (
        <button
          onClick={onStartJourney}
          className="w-full py-2.5 px-4 bg-[#17202A] hover:bg-black active:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>จำลองการเดินทาง (Start Journey Simulation)</span>
        </button>
      )}
    </div>
  );
};
