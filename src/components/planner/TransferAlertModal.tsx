'use client';

import React, { useEffect, useState } from 'react';
import { RefreshCw, ArrowRight, Clock } from 'lucide-react';
import { TransferInfo } from '@/types/railway';
import { formatTransferInstruction } from '@/utils/getTransferInstruction';

interface TransferAlertModalProps {
  transfer: TransferInfo | null;
  onContinue: () => void;
}

export const TransferAlertModal: React.FC<TransferAlertModalProps> = ({
  transfer,
  onContinue,
}) => {
  const [timeLeft, setTimeLeft] = useState(2.5);

  // Auto resume after 2.5 seconds
  useEffect(() => {
    if (!transfer) {
      setTimeLeft(2.5);
      return;
    }

    setTimeLeft(2.5);
    const interval = 50; // update progress every 50ms
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.05) {
          clearInterval(timer);
          onContinue();
          return 0;
        }
        return prev - 0.05;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [transfer, onContinue]);

  if (!transfer) return null;

  const info = formatTransferInstruction(transfer);
  const progressPercent = Math.max(0, Math.min(100, ((2.5 - timeLeft) / 2.5) * 100));

  return (
    <div
      onClick={onContinue}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs cursor-pointer animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white max-w-sm w-full rounded-2xl shadow-2xl border border-[#DDE2E7] p-5 space-y-3.5 animate-in zoom-in-95 duration-200 overflow-hidden relative"
      >
        {/* Animated Top Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-100">
          <div
            className="h-full bg-[#3155D9] transition-all duration-75 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center gap-3 pt-1">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <RefreshCw className="w-5 h-5 animate-spin" style={{ animationDuration: '2.5s' }} />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
              จุดเปลี่ยนสาย (CHANGE LINE)
            </div>
            <h3 className="text-base font-bold text-[#17202A] truncate">
              {info.stationNameTh}
            </h3>
            <p className="text-xs text-[#66717D] truncate">{info.stationNameEn}</p>
          </div>
        </div>

        {/* Clear Transfer Direction Guidance */}
        <div className="bg-[#F8FAFC] p-3 rounded-xl border border-[#DDE2E7] space-y-2.5">
          <div className="text-xs font-semibold text-slate-700 leading-snug">
            {info.instructionTh}
          </div>

          <div className="flex items-center justify-between gap-1.5 text-xs">
            {/* From Line */}
            <div
              className="flex-1 p-2 rounded-lg text-white font-bold text-center truncate shadow-2xs"
              style={{ backgroundColor: info.fromLineColor }}
            >
              <div className="text-[11px] truncate">{info.fromLineNameTh}</div>
            </div>

            <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

            {/* To Line */}
            <div
              className="flex-1 p-2 rounded-lg text-white font-bold text-center truncate shadow-2xs"
              style={{ backgroundColor: info.toLineColor }}
            >
              <div className="text-[11px] truncate">{info.toLineNameTh}</div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#66717D] pt-0.5">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-600" />
              <span>เดินเปลี่ยนชานชาลา ~5 นาที</span>
            </span>
            <span className="text-[10px] font-semibold text-[#3155D9]">
              {Math.ceil(timeLeft)}s...
            </span>
          </div>
        </div>

        {/* Skip Button */}
        <button
          onClick={onContinue}
          className="w-full py-2.5 px-3 bg-[#17202A] hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
        >
          <span>ไปต่อทันที (Continue)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
