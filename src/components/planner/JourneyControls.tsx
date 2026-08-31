'use client';

import React from 'react';
import { Play, Pause, RotateCcw, ArrowRight, CheckCircle2 } from 'lucide-react';
import { JourneyState, RouteResult } from '@/types/railway';
import { STATIONS } from '@/data/stations';

interface JourneyControlsProps {
  journeyState: JourneyState;
  activeRoute: RouteResult;
  onPlay: () => void;
  onPause: () => void;
  onRestart: () => void;
  onChangeSpeed: (speed: number) => void;
  onSeekStation: (index: number) => void;
}

export const JourneyControls: React.FC<JourneyControlsProps> = ({
  journeyState,
  activeRoute,
  onPlay,
  onPause,
  onRestart,
  onChangeSpeed,
}) => {
  const currentStationId = activeRoute.stations[journeyState.currentStationIndex];
  const nextStationId = activeRoute.stations[journeyState.currentStationIndex + 1];

  const currentStation = STATIONS[currentStationId];
  const nextStation = nextStationId ? STATIONS[nextStationId] : null;

  const totalStops = activeRoute.stations.length;
  const remainingStops = Math.max(0, totalStops - (journeyState.currentStationIndex + 1));
  const progressPercent = Math.round(
    ((journeyState.currentStationIndex + journeyState.progress) / Math.max(1, totalStops - 1)) * 100
  );

  return (
    <div className="bg-[#17202A] text-white rounded-xl p-4 border border-slate-800 space-y-3 shadow-md">
      {/* Top Row: Status & Station Counter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              journeyState.isCompleted
                ? 'bg-[#22C55E]'
                : journeyState.isPlaying
                ? 'bg-[#3B82F6] animate-pulse'
                : 'bg-[#EAB308]'
            }`}
          />
          <span className="text-xs font-bold text-slate-200">
            {journeyState.isCompleted
              ? "🎉 ถึงจุดหมายแล้ว (Arrived)"
              : journeyState.isPlaying
              ? "🚆 ขบวนรถกำลังเคลื่อนที่ (Running)"
              : "⏸️ หยุดชั่วคราว (Paused)"}
          </span>
        </div>

        <span className="text-[11px] font-mono text-slate-400 font-semibold">
          {journeyState.currentStationIndex + 1} / {totalStops} สถานี
        </span>
      </div>

      {/* Live Current & Next Stop Banner */}
      <div className="bg-slate-800/90 rounded-xl p-3 border border-slate-700/70 space-y-2">
        {/* Current Station */}
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <span>● สถานีปัจจุบัน (CURRENT):</span>
            </span>
            <div className="font-bold text-sm text-white truncate flex items-center gap-1.5 mt-0.5">
              <span>{currentStation ? currentStation.nameTh : currentStationId}</span>
              {currentStation && (
                <span className="text-xs font-normal text-slate-400">({currentStation.nameEn})</span>
              )}
            </div>
          </div>
          {currentStation?.code && (
            <span className="text-[11px] font-bold px-2 py-0.5 bg-slate-700 rounded-md text-slate-200 border border-slate-600 shrink-0 ml-2">
              {currentStation.code}
            </span>
          )}
        </div>

        {/* Next Station & Remaining Countdown */}
        {!journeyState.isCompleted && nextStation && (
          <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-300 truncate">
              <ArrowRight className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="text-slate-400">สถานีถัดไป:</span>
              <span className="font-bold text-white truncate">{nextStation.nameTh}</span>
            </div>
            <span className="text-[11px] text-blue-300 bg-blue-900/50 px-2 py-0.5 rounded shrink-0 font-medium">
              อีก {remainingStops} สถานี
            </span>
          </div>
        )}
      </div>

      {/* Slim Progress Bar */}
      <div className="space-y-1">
        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-[#2E9B68] h-full transition-all duration-150 rounded-full"
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          />
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800">
        <div className="flex items-center gap-1.5">
          {journeyState.isCompleted ? (
            <button
              onClick={onRestart}
              className="px-3 py-1.5 bg-[#2E9B68] hover:bg-[#258256] text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1 shadow-xs"
            >
              <RotateCcw className="w-3 h-3" />
              <span>เริ่มใหม่ (Restart)</span>
            </button>
          ) : journeyState.isPlaying ? (
            <button
              onClick={onPause}
              className="px-3 py-1.5 bg-[#D99A24] hover:bg-[#B8811C] text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1 shadow-xs"
            >
              <Pause className="w-3 h-3" />
              <span>หยุด (Pause)</span>
            </button>
          ) : (
            <button
              onClick={onPlay}
              className="px-3 py-1.5 bg-[#3155D9] hover:bg-[#2643B5] text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1 shadow-xs"
            >
              <Play className="w-3 h-3 fill-white" />
              <span>เล่นต่อ (Resume)</span>
            </button>
          )}

          <button
            onClick={onRestart}
            title="รีสตาร์ต (Restart)"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Speed Multiplier */}
        <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-[10px]">
          <span className="px-1.5 text-slate-400 font-semibold">Speed:</span>
          {[0.5, 1, 2, 4].map((spd) => (
            <button
              key={spd}
              onClick={() => onChangeSpeed(spd)}
              className={`px-1.5 py-0.5 rounded font-bold transition-all ${
                journeyState.speed === spd
                  ? 'bg-[#3155D9] text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
