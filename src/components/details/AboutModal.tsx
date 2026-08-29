'use client';

import React from 'react';
import { Info, X, Train, CreditCard, Sparkles, Navigation2, Check } from 'lucide-react';
import { RAILWAY_LINES } from '@/data/lines';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
              <Train className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900">เกี่ยวกับ ThaiTransit</h3>
              <p className="text-xs text-slate-500">ระบบจำลองและค้นหาเส้นทางรถไฟฟ้ากรุงเทพมหานคร</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs text-slate-600 leading-relaxed">
          {/* Intro Box */}
          <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-blue-900 text-sm">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Bangkok Mass Rapid Transit Network</span>
            </div>
            <p className="text-blue-950">
              ThaiTransit คือเว็บแอปพลิเคชันสำหรับค้นหาเส้นทาง คำนวณเวลาเดินทาง และจำลองการเคลื่อนที่ของขบวนรถไฟฟ้าในเขตกรุงเทพมหานครและปริมณฑล โดยรวบรวมสายรถไฟฟ้าทั้ง 10 เส้นทางในระบบโครงข่ายเข้าด้วยกันอย่างสมบูรณ์
            </p>
          </div>

          {/* Lines & Operators Legend */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider">
              สัญลักษณ์สีสายรถไฟฟ้าในระบบ
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(RAILWAY_LINES).map((line) => (
                <div
                  key={line.id}
                  className="p-2.5 rounded-xl border flex items-center gap-2 bg-white"
                  style={{ borderColor: `${line.color}40` }}
                >
                  <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: line.color }} />
                  <div className="truncate">
                    <div className="font-bold text-slate-900 truncate">{line.nameTh}</div>
                    <div className="text-[10px] text-slate-500">{line.operator}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Travel Tips */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-indigo-600" />
              <span>คำแนะนำการเดินทางและตั๋วโดยสาร</span>
            </h4>
            <ul className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>บัตร EMV Contactless:</strong> รองรับการแตะจ่ายด้วยบัตรเครดิต/เดบิตบน MRT สายสีน้ำเงิน, สายสีม่วง, สายสีเหลือง, สายสีชมพู และรถไฟฟ้าสายสีแดง
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>บัตร Rabbit:</strong> ใช้สำหรับ BTS สายสุขุมวิท, สายสีลม, สายสีทอง และ MRT สายสีเหลือง/ชมพู
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>เวลาเปลี่ยนสาย (Transfer Time):</strong> ระบบประมาณเวลาเดินระหว่างชานชาลาไว้เฉลี่ย 5 นาทีต่อการเปลี่ยนสายหนึ่งครั้ง
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-400">
          ThaiTransit — Modern Static Transit Visualizer
        </div>
      </div>
    </div>
  );
};
