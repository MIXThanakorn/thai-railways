'use client';

import React, { useState } from 'react';
import { Train, Layers, Info, Menu, X, Compass, Route } from 'lucide-react';

interface HeaderProps {
  onOpenLines: () => void;
  onOpenAbout: () => void;
  onSelectPreset: (originId: string, destId: string) => void;
  stationCount: number;
  lineCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenLines,
  onOpenAbout,
  onSelectPreset,
  stationCount,
  lineCount,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#DDE2E7]">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Brand Logo & Identifier */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#3155D9] text-white flex items-center justify-center font-black text-sm">
              <Train className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-[#17202A] tracking-tight">ThaiTransit</span>
              <span className="text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-[#66717D] border border-[#DDE2E7]">
                BMR METRO
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-2">
            <button
              onClick={() => onSelectPreset('siam', 'phrom-phong')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-[#3155D9] hover:bg-slate-50 border border-[#DDE2E7] transition-colors"
            >
              <Route className="w-3.5 h-3.5 text-slate-500" />
              <span>เส้นทางตัวอย่าง</span>
            </button>

            <button
              onClick={onOpenLines}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#17202A] hover:bg-slate-100 transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              <span>สายรถไฟฟ้า ({lineCount})</span>
            </button>

            <button
              onClick={onOpenAbout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#17202A] hover:bg-slate-100 transition-colors"
            >
              <Info className="w-3.5 h-3.5 text-slate-500" />
              <span>คู่มือและข้อมูล</span>
            </button>
          </nav>

          {/* Mobile Menu Trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => onSelectPreset('siam', 'phrom-phong')}
              className="px-2.5 py-1 rounded-md text-xs font-medium text-slate-700 bg-slate-100 border border-[#DDE2E7]"
            >
              ตัวอย่าง
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#DDE2E7] bg-white px-4 py-3 space-y-1.5 shadow-md">
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onOpenLines();
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-[#17202A] hover:bg-slate-50"
          >
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#3155D9]" />
              <span>สายรถไฟฟ้าทั้งหมด</span>
            </div>
            <span className="text-[11px] text-slate-500">{lineCount} สาย</span>
          </button>

          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onOpenAbout();
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-[#17202A] hover:bg-slate-50"
          >
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-slate-600" />
              <span>คู่มือและข้อมูลระบบ</span>
            </div>
          </button>
        </div>
      )}
    </header>
  );
};
