'use client';

import React from 'react';
import { RouteResult } from '@/types/railway';
import { Clock, ArrowRight, CheckCircle2 } from 'lucide-react';

interface RouteComparisonProps {
  routes: RouteResult[];
  selectedIndex: number;
  onSelectRoute: (index: number) => void;
}

export const RouteComparison: React.FC<RouteComparisonProps> = ({
  routes,
  selectedIndex,
  onSelectRoute,
}) => {
  if (!routes || routes.length <= 1) return null;

  return (
    <div className="w-full flex flex-col gap-2.5">
      <div className="flex items-center justify-between text-xs font-semibold text-[#64748B] px-0.5">
        <span>ตัวเลือกเส้นทาง ({routes.length} เส้นทาง)</span>
        <span>Route Options</span>
      </div>

      <div className="flex flex-col gap-2">
        {routes.map((route, idx) => {
          const isSelected = idx === selectedIndex;
          const transferCount = route.transfers.length;

          return (
            <button
              key={`route-card-${idx}`}
              onClick={() => onSelectRoute(idx)}
              className={`w-full text-left p-3 rounded-xl border transition-all duration-200 ${
                isSelected
                  ? 'bg-[#F0FDF4] border-[#86EFAC] ring-1 ring-[#22C55E]/30 shadow-sm'
                  : 'bg-white border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]'
              }`}
            >
              {/* Header: Tag & Selection Indicator */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                    route.isRecommended
                      ? 'bg-[#2E9B68] text-white'
                      : isSelected
                      ? 'bg-[#E2E8F0] text-[#1E293B]'
                      : 'bg-[#F1F5F9] text-[#64748B]'
                  }`}
                >
                  {route.tag || (route.isRecommended ? '⭐ แนะนำ' : `ทางเลือก #${idx + 1}`)}
                </span>

                <div className="flex items-center gap-1">
                  {route.fareThb && (
                    <span className="text-xs font-bold text-[#0F172A] bg-[#F1F5F9] px-2 py-0.5 rounded">
                      ฿{route.fareThb}{' '}
                      <span className="text-[10px] font-normal text-[#64748B]">ประมาณการ</span>
                    </span>
                  )}
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />}
                </div>
              </div>

              {/* Stats Row */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-sm font-extrabold text-[#1E293B]">
                    <Clock className="w-3.5 h-3.5 text-[#64748B]" />
                    <span>{route.estimatedMinutes} นาที</span>
                  </div>
                  <span className="text-xs text-[#64748B]">
                    {route.totalStations} สถานี · {transferCount > 0 ? `เปลี่ยนสาย ${transferCount} ครั้ง` : 'ต่อเดียว'}
                  </span>
                </div>

                {/* Line color pills */}
                <div className="flex items-center gap-1">
                  {route.segments.map((seg, sIdx) => (
                    <span
                      key={`seg-badge-${sIdx}`}
                      className="w-3.5 h-3.5 rounded-full border border-white shadow-sm flex items-center justify-center text-[8px] font-bold text-white"
                      style={{ backgroundColor: seg.lineColor }}
                      title={seg.lineNameTh}
                    />
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
