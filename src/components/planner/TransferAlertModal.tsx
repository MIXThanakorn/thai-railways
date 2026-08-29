'use client';

import React from 'react';
import { RefreshCw, ArrowRight, Clock, X } from 'lucide-react';
import { TransferInfo } from '@/types/railway';
import { STATIONS } from '@/data/stations';
import { RAILWAY_LINES } from '@/data/lines';

interface TransferAlertModalProps {
  transfer: TransferInfo | null;
  onContinue: () => void;
}

export const TransferAlertModal: React.FC<TransferAlertModalProps> = ({
  transfer,
  onContinue,
}) => {
  if (!transfer) return null;

  const station = STATIONS[transfer.stationId];
  const fromLine = RAILWAY_LINES[transfer.fromLineId];
  const toLine = RAILWAY_LINES[transfer.toLineId];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-5 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-inner">
            <RefreshCw className="w-6 h-6 animate-spin" style={{ animationDuration: '4s' }} />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              สถานีเปลี่ยนสาย (Interchange Station)
            </span>
            <h3 className="text-lg font-extrabold text-slate-900">
              {station ? station.nameTh : 'สถานีเปลี่ยนขบวน'}
            </h3>
            <p className="text-xs text-slate-500">{station?.nameEn}</p>
          </div>
        </div>

        {/* Transfer Visual Direction */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
          <div className="text-xs font-semibold text-slate-500">กรุณาเปลี่ยนขบวนรถไฟฟ้า:</div>

          <div className="flex items-center justify-between gap-2">
            {/* From Line */}
            <div
              className="flex-1 p-2.5 rounded-xl text-white text-xs font-bold shadow-xs text-center"
              style={{ backgroundColor: fromLine?.color || '#64748B' }}
            >
              <div>{fromLine?.nameTh}</div>
              <div className="text-[10px] opacity-80 font-normal">{fromLine?.name}</div>
            </div>

            <ArrowRight className="w-5 h-5 text-slate-400 shrink-0" />

            {/* To Line */}
            <div
              className="flex-1 p-2.5 rounded-xl text-white text-xs font-bold shadow-xs text-center"
              style={{ backgroundColor: toLine?.color || '#64748B' }}
            >
              <div>{toLine?.nameTh}</div>
              <div className="text-[10px] opacity-80 font-normal">{toLine?.name}</div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium pt-1">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>เวลาเดินเปลี่ยนชานชาลาโดยประมาณ: <strong>~5 นาที</strong></span>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={onContinue}
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
        >
          <span>เดินทางต่อบนสายใหม่ (Continue)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
