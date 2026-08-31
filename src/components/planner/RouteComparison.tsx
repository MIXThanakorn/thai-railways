'use client';

import React, { useState } from 'react';
import { RouteResult } from '@/types/railway';
import { Clock, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

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
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

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
          const isExpanded = expandedIndex === idx;
          const transferCount = route.transfers.length;

          return (
            <div
              key={`route-card-${idx}`}
              className={`w-full rounded-xl border transition-all duration-200 overflow-hidden ${
                isSelected
                  ? 'bg-[#F0FDF4] border-[#86EFAC] ring-2 ring-[#22C55E]/40 shadow-xs'
                  : 'bg-white border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]'
              }`}
            >
              {/* Primary Clickable Header */}
              <button
                type="button"
                onClick={() => onSelectRoute(idx)}
                className="w-full text-left p-3 flex flex-col gap-2"
              >
                {/* Header: Tag & Selection Indicator */}
                <div className="flex items-center justify-between gap-2 w-full">
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

                  <div className="flex items-center gap-1.5">
                    {route.fareThb && (
                      <span className="text-xs font-bold text-[#0F172A] bg-[#F1F5F9] px-2 py-0.5 rounded">
                        ฿{route.fareThb}{' '}
                        <span className="text-[10px] font-normal text-[#64748B]">ประมาณการ</span>
                      </span>
                    )}
                    {isSelected && (
                      <span className="flex items-center gap-1 text-xs font-bold text-[#16A34A] bg-emerald-100/80 px-2 py-0.5 rounded-md">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>เลือกอยู่</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Stats Row */}
                <div className="flex items-center justify-between gap-2 w-full">
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
                        className="w-3.5 h-3.5 rounded-full border border-white shadow-xs flex items-center justify-center text-[8px] font-bold text-white shrink-0"
                        style={{ backgroundColor: seg.lineColor }}
                        title={seg.lineNameTh}
                      />
                    ))}
                  </div>
                </div>
              </button>

              {/* Progressive Disclosure Toggle Button */}
              <div className="px-3 pb-2 pt-0 flex items-center justify-between border-t border-slate-100/80 mt-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedIndex(isExpanded ? null : idx);
                  }}
                  className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 py-1"
                >
                  <span>{isExpanded ? 'ซ่อนรายละเอียด (Hide details)' : 'ดูรายละเอียดสาย (View details)'}</span>
                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>

                {!isSelected && (
                  <button
                    type="button"
                    onClick={() => onSelectRoute(idx)}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    เลือกเส้นทางนี้ →
                  </button>
                )}
              </div>

              {/* Collapsible Details Panel */}
              {isExpanded && (
                <div className="px-3 pb-3 pt-2 bg-slate-50/70 border-t border-slate-100 text-xs space-y-2">
                  <div className="font-semibold text-slate-700">ลำดับสายรถไฟฟ้า:</div>
                  <div className="space-y-1.5 pl-2 border-l-2 border-slate-300">
                    {route.segments.map((seg, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.lineColor }} />
                        <span className="font-semibold text-slate-900">{seg.lineNameTh}</span>
                        <span className="text-slate-500 text-[11px]">({seg.stationCount} สถานี ~{seg.estimatedMinutes} นาที)</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
