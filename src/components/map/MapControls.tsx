'use client';

import React from 'react';
import { Plus, Minus, RotateCcw, Crosshair, Maximize2, Minimize2 } from 'lucide-react';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onFocusRoute?: () => void;
  hasActiveRoute: boolean;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export const MapControls: React.FC<MapControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onReset,
  onFocusRoute,
  hasActiveRoute,
  isFullscreen,
  onToggleFullscreen,
}) => {
  return (
    <div className="absolute top-3 right-3 z-20 flex flex-col bg-white border border-[#DDE2E7] rounded-lg shadow-xs overflow-hidden">
      <button
        onClick={onZoomIn}
        title="ซูมเข้า (Zoom In)"
        className="w-8 h-8 flex items-center justify-center text-slate-700 hover:bg-slate-50 hover:text-[#3155D9] transition-colors border-b border-[#DDE2E7]"
        aria-label="Zoom In"
      >
        <Plus className="w-4 h-4" />
      </button>

      <button
        onClick={onZoomOut}
        title="ซูมออก (Zoom Out)"
        className="w-8 h-8 flex items-center justify-center text-slate-700 hover:bg-slate-50 hover:text-[#3155D9] transition-colors border-b border-[#DDE2E7]"
        aria-label="Zoom Out"
      >
        <Minus className="w-4 h-4" />
      </button>

      {hasActiveRoute && onFocusRoute && (
        <button
          onClick={onFocusRoute}
          title="โฟกัสเส้นทาง (Focus Route)"
          className="w-8 h-8 flex items-center justify-center text-[#3155D9] bg-blue-50/60 hover:bg-blue-100 transition-colors border-b border-[#DDE2E7]"
          aria-label="Focus Route"
        >
          <Crosshair className="w-4 h-4" />
        </button>
      )}

      <button
        onClick={onReset}
        title="รีเซ็ตมุมมอง (Reset)"
        className="w-8 h-8 flex items-center justify-center text-slate-700 hover:bg-slate-50 hover:text-[#3155D9] transition-colors"
        aria-label="Reset View"
      >
        <RotateCcw className="w-3.5 h-3.5" />
      </button>

      {onToggleFullscreen && (
        <button
          onClick={onToggleFullscreen}
          title="เต็มจอ (Fullscreen)"
          className="w-8 h-8 flex items-center justify-center text-slate-700 hover:bg-slate-50 hover:text-[#3155D9] transition-colors border-t border-[#DDE2E7]"
          aria-label="Fullscreen"
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      )}
    </div>
  );
};
