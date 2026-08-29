'use client';

import React from 'react';
import { Play, Pause, RotateCcw, FastForward, CheckCircle2 } from 'lucide-react';
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
  const currentStation = STATIONS[activeRoute.stations[journeyState.currentStationIndex]];
  const totalStops = activeRoute.stations.length;
  const progressPercent = Math.round(((journeyState.currentStationIndex + journeyState.progress) / (totalStops - 1)) * 100);

  return (
    <div className="bg-[#17202A] text-white rounded-xl p-4 border border-slate-800 space-y-3">
      {/* Top Row: Status & Station Counter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              journeyState.isPlaying ? 'bg-[#2E9B68] animate-pulse' : journeyState.isCompleted ? 'bg-[#3155D9]' : 'bg-[#D99A24]'
            }`}
          />
          <span className="text-xs font-semibold text-slate-200">
            {journeyState.isCompleted
              ? 'ถึงสถานีปลายทางแล้ว'
              : journeyState.isPlaying
              ? 'กำลังจำลองการเดินทาง (Running)'
              : 'หยุดชั่วคราว (Paused)'}
          </span>
        </div>

        <span className="text-[11px] font-mono text-slate-400">
          {journeyState.currentStationIndex + 1} / {totalStops} สถานี
        </span>
      </div>

      {/* Current Station Info */}
      {currentStation && (
        <div className="bg-slate-800/90 rounded-lg p-2.5 border border-slate-700/60 flex items-center justify-between">
          <div className="truncate">
            <span className="text-[10px] uppercase font-bold text-slate-400">ตำแหน่งปัจจุบัน:</span>
            <div className="font-bold text-sm text-white flex items-center gap-1.5 truncate">
              <span>{currentStation.nameTh}</span>
              <span className="text-xs font-normal text-slate-300">({currentStation.nameEn})</span>
            </div>
          </div>
          {currentStation.code && (
            <span className="text-[11px] font-bold px-1.5 py-0.5 bg-slate-700 rounded text-slate-200 border border-slate-600 shrink-0 ml-2">
              {currentStation.code}
            </span>
          )}
        </div>
      )}

      {/* Progress Bar */}
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
              className="px-3 py-1.5 bg-[#2E9B68] hover:bg-[#258256] text-white font-semibold text-xs rounded-md transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>เริ่มใหม่</span>
            </button>
          ) : journeyState.isPlaying ? (
            <button
              onClick={onPause}
              className="px-3 py-1.5 bg-[#D99A24] hover:bg-[#B8811C] text-white font-semibold text-xs rounded-md transition-colors flex items-center gap-1"
            >
              <Pause className="w-3 h-3" />
              <span>หยุดชั่วคราว</span>
            </button>
          ) : (
            <button
              onClick={onPlay}
              className="px-3 py-1.5 bg-[#3155D9] hover:bg-[#2643B5] text-white font-semibold text-xs rounded-md transition-colors flex items-center gap-1"
            >
              <Play className="w-3 h-3 fill-white" />
              <span>เล่นต่อ</span>
            </button>
          )}

          <button
            onClick={onRestart}
            title="รีสตาร์ต"
            className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Speed Multiplier */}
        <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-md border border-slate-700 text-[10px]">
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
