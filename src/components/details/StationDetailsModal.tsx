'use client';

import React from 'react';
import { Station } from '@/types/railway';
import { RAILWAY_LINES } from '@/data/lines';
import { MapPin, X, Navigation, CheckCircle2, ShieldCheck, CornerDownRight, ArrowRight } from 'lucide-react';

interface StationDetailsModalProps {
  station: Station | null;
  onClose: () => void;
  onSetAsOrigin: (station: Station) => void;
  onSetAsDestination: (station: Station) => void;
}

export const StationDetailsModal: React.FC<StationDetailsModalProps> = ({
  station,
  onClose,
  onSetAsOrigin,
  onSetAsDestination,
}) => {
  if (!station) return null;

  const isInterchange = station.type === 'interchange' || station.lines.length > 1;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex flex-col items-center justify-center shadow-md">
              <span className="text-[11px] font-extrabold">{station.code || 'STN'}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg text-slate-900">{station.nameTh}</h3>
                {isInterchange && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200">
                    สถานีเชื่อมต่อ
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium">{station.nameEn}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-5 overflow-y-auto">
          {/* Railway Lines Serving this Station */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              สายรถไฟฟ้าที่ผ่าน (Connecting Lines)
            </span>
            <div className="grid grid-cols-1 gap-2">
              {station.lines.map((lineId) => {
                const line = RAILWAY_LINES[lineId];
                if (!line) return null;
                return (
                  <div
                    key={lineId}
                    className="p-3 rounded-xl border flex items-center justify-between text-xs"
                    style={{
                      borderColor: `${line.color}40`,
                      backgroundColor: `${line.color}0D`,
                    }}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: line.color }} />
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{line.nameTh}</div>
                        <div className="text-slate-500">{line.name} ({line.operator})</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Description */}
          {station.description && (
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                ข้อมูลและสถานที่สำคัญใกล้เคียง
              </span>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                {station.description}
              </p>
            </div>
          )}

          {/* Facilities */}
          {station.facilities && station.facilities.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                สิ่งอำนวยความสะดวก (Facilities)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {station.facilities.map((fac, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 flex items-center gap-1 border border-slate-200"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>{fac}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              onSetAsOrigin(station);
              onClose();
            }}
            className="py-2.5 px-3 bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-50 active:scale-95 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>เริ่มจากที่นี่ (Origin)</span>
          </button>

          <button
            onClick={() => {
              onSetAsDestination(station);
              onClose();
            }}
            className="py-2.5 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 active:scale-95 font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>ไปที่นี่ (Destination)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
