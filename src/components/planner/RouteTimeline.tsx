'use client';

import React from 'react';
import { RouteResult, JourneyState, Station } from '@/types/railway';
import { STATIONS } from '@/data/stations';
import { RAILWAY_LINES } from '@/data/lines';
import { CheckCircle2, Train, ChevronRight, RefreshCw } from 'lucide-react';

interface RouteTimelineProps {
  route: RouteResult;
  journeyState: JourneyState | null;
  onSeekStation: (index: number) => void;
  onSelectStation: (station: Station) => void;
}

export const RouteTimeline: React.FC<RouteTimelineProps> = ({
  route,
  journeyState,
  onSeekStation,
  onSelectStation,
}) => {
  const currentIdx = journeyState ? journeyState.currentStationIndex : -1;

  return (
    <div className="bg-white rounded-xl p-4 border border-[#DDE2E7] space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <h3 className="font-bold text-xs uppercase tracking-wider text-[#17202A] flex items-center gap-1.5">
          <Train className="w-3.5 h-3.5 text-[#3155D9]" />
          <span>ลำดับสถานีและการเดินทาง (Station Timeline)</span>
        </h3>
        <span className="text-[11px] text-[#66717D]">
          {route.totalStations} สถานี
        </span>
      </div>

      {/* Segments & Stations */}
      <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
        {route.segments.map((segment, segIdx) => {
          const line = RAILWAY_LINES[segment.lineId];
          const isLastSegment = segIdx === route.segments.length - 1;

          return (
            <div key={`seg-tl-${segIdx}`} className="space-y-2">
              {/* Segment Line Header */}
              <div
                className="flex items-center justify-between px-2.5 py-1.5 rounded-md text-white font-semibold text-xs"
                style={{ backgroundColor: segment.lineColor }}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  <span className="truncate">{segment.lineNameTh}</span>
                </div>
                <span className="text-[10px] opacity-90 shrink-0 font-normal">
                  {segment.stationCount} สถานี
                </span>
              </div>

              {/* Station sequence */}
              <div className="relative pl-5 space-y-2 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200">
                {segment.stations.map((stId) => {
                  const station = STATIONS[stId];
                  if (!station) return null;

                  const globalIdx = route.stations.indexOf(stId);
                  const isCompleted = currentIdx > globalIdx;
                  const isCurrent = currentIdx === globalIdx;
                  const isOrigin = globalIdx === 0;
                  const isDest = globalIdx === route.stations.length - 1;

                  return (
                    <div
                      key={`st-node-${stId}-${globalIdx}`}
                      onClick={() => onSeekStation(globalIdx)}
                      className={`relative flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                        isCurrent
                          ? 'bg-blue-50/70 border border-[#3155D9]'
                          : isCompleted
                          ? 'bg-slate-50/50 hover:bg-slate-100'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      {/* Node Indicator */}
                      <div className="absolute -left-[18px] top-1/2 -translate-y-1/2 bg-white p-0.5">
                        {isCurrent ? (
                          <div className="w-3.5 h-3.5 rounded-full bg-[#3155D9] ring-3 ring-[#3155D9]/20 flex items-center justify-center text-white" />
                        ) : isCompleted ? (
                          <div className="w-3 h-3 rounded-full bg-[#2E9B68] flex items-center justify-center text-white" />
                        ) : isOrigin ? (
                          <div className="w-3 h-3 rounded-full bg-[#2E9B68]" />
                        ) : isDest ? (
                          <div className="w-3 h-3 rounded-full bg-[#D94A55]" />
                        ) : (
                          <div
                            className="w-2.5 h-2.5 rounded-full border-2 bg-white"
                            style={{ borderColor: segment.lineColor }}
                          />
                        )}
                      </div>

                      {/* Station Info */}
                      <div className="flex items-center gap-2 truncate">
                        {station.code && (
                          <span className="text-[10px] font-mono font-bold px-1 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                            {station.code}
                          </span>
                        )}
                        <span
                          className={`text-xs font-semibold truncate ${
                            isCurrent ? 'text-[#3155D9] font-bold' : isCompleted ? 'text-slate-500' : 'text-[#17202A]'
                          }`}
                        >
                          {station.nameTh}
                        </span>
                        <span className="text-[11px] text-[#66717D] truncate">({station.nameEn})</span>
                      </div>

                      {/* Station Details Trigger */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectStation(station);
                        }}
                        className="text-slate-400 hover:text-[#3155D9] p-0.5"
                        title="รายละเอียดสถานี"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Transfer Alert */}
              {!isLastSegment && (
                <div className="my-1.5 p-2 rounded-md bg-amber-50/80 border border-amber-200 text-[11px] text-amber-900 flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>
                    <strong>เปลี่ยนสาย:</strong> เดินเปลี่ยนชานชาลา ~5 นาที
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
