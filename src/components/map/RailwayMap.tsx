'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { STATIONS } from '@/data/stations';
import { RAILWAY_LINES } from '@/data/lines';
import { CHAO_PHRAYA_RIVER_PATH, KHLONG_BANGKOK_YAI_PATH } from '@/data/river';
import { Station, RouteResult, JourneyState, SystemFilter } from '@/types/railway';
import { isLineInFilter, isStationInFilter } from '@/utils/filterRailwayLines';
import { calculateRouteBounds } from '@/utils/calculateRouteBounds';
import { calculateStationBounds } from '@/utils/focusStation';
import { MapControls } from './MapControls';
import { MapLineFilter } from './MapLineFilter';
import { TrainMarker } from './TrainMarker';

interface RailwayMapProps {
  activeRoute: RouteResult | null;
  journeyState: JourneyState | null;
  originStation: Station | null;
  destStation: Station | null;
  onSelectStation: (station: Station) => void;
  selectedStation: Station | null;
  systemFilter?: SystemFilter;
  onFilterChange?: (filter: SystemFilter) => void;
  focusedStationId?: string | null;
  hoveredTimelineStationId?: string | null;
}

interface ViewBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

const DEFAULT_VIEWBOX: ViewBox = {
  x: 0,
  y: 0,
  w: 1440,
  h: 1440,
};

export const RailwayMap: React.FC<RailwayMapProps> = ({
  activeRoute,
  journeyState,
  originStation,
  destStation,
  onSelectStation,
  selectedStation,
  systemFilter = 'all',
  onFilterChange,
  focusedStationId,
  hoveredTimelineStationId,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewBox, setViewBox] = useState<ViewBox>(DEFAULT_VIEWBOX);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ clientX: 0, clientY: 0, vbX: 0, vbY: 0 });
  const [hoveredStation, setHoveredStation] = useState<Station | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Active Route Stations set
  const activeStationIds = new Set(activeRoute ? activeRoute.stations : []);

  // Zoom Controls
  const handleZoom = useCallback((factor: number) => {
    setViewBox((prev) => {
      const nw = Math.min(Math.max(280, prev.w * factor), 2200);
      const nh = Math.min(Math.max(280, prev.h * factor), 2200);
      return {
        x: prev.x + (prev.w - nw) / 2,
        y: prev.y + (prev.h - nh) / 2,
        w: nw,
        h: nh,
      };
    });
  }, []);

  const handleReset = useCallback(() => {
    setViewBox(DEFAULT_VIEWBOX);
  }, []);

  // Focus Route
  const handleFocusRoute = useCallback(() => {
    if (!activeRoute || activeRoute.stations.length === 0) {
      handleReset();
      return;
    }

    const bounds = calculateRouteBounds(activeRoute.stations);
    if (bounds) {
      setViewBox(bounds.viewBox);
    } else {
      handleReset();
    }
  }, [activeRoute, handleReset]);

  // Focus on specific station when triggered from timeline
  useEffect(() => {
    if (focusedStationId) {
      const bounds = calculateStationBounds(focusedStationId);
      if (bounds) {
        setViewBox(bounds);
      }
    }
  }, [focusedStationId]);

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 0.88 : 1.14;
    handleZoom(factor);
  };

  // Mouse Pan Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({
      clientX: e.clientX,
      clientY: e.clientY,
      vbX: viewBox.x,
      vbY: viewBox.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    const cw = containerRef.current.clientWidth || 1;
    const ch = containerRef.current.clientHeight || 1;

    const dx = ((e.clientX - dragStart.clientX) / cw) * viewBox.w;
    const dy = ((e.clientY - dragStart.clientY) / ch) * viewBox.h;

    setViewBox((prev) => ({
      ...prev,
      x: dragStart.vbX - dx,
      y: dragStart.vbY - dy,
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch Handlers for Mobile Pan & Pinch
  const touchStartRef = useRef<{ clientX: number; clientY: number; vbX: number; vbY: number; dist?: number }>({
    clientX: 0,
    clientY: 0,
    vbX: 0,
    vbY: 0,
  });

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      touchStartRef.current = {
        clientX: e.touches[0].clientX,
        clientY: e.touches[0].clientY,
        vbX: viewBox.x,
        vbY: viewBox.y,
      };
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStartRef.current.dist = dist;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!containerRef.current) return;
    const cw = containerRef.current.clientWidth || 1;
    const ch = containerRef.current.clientHeight || 1;

    if (e.touches.length === 1 && isDragging) {
      const dx = ((e.touches[0].clientX - touchStartRef.current.clientX) / cw) * viewBox.w;
      const dy = ((e.touches[0].clientY - touchStartRef.current.clientY) / ch) * viewBox.h;

      setViewBox((prev) => ({
        ...prev,
        x: touchStartRef.current.vbX - dx,
        y: touchStartRef.current.vbY - dy,
      }));
    } else if (e.touches.length === 2 && touchStartRef.current.dist) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = touchStartRef.current.dist / dist;
      if (ratio > 0.85 && ratio < 1.15) {
        handleZoom(ratio);
        touchStartRef.current.dist = dist;
      }
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    touchStartRef.current.dist = undefined;
  };

  // Train animation state
  let currentStationObj: Station | null = null;
  let nextStationObj: Station | null = null;
  let currentTrainLineColor = '#3155D9';

  if (journeyState && activeRoute) {
    const currId = activeRoute.stations[journeyState.currentStationIndex];
    const nextId = activeRoute.stations[journeyState.currentStationIndex + 1];
    currentStationObj = STATIONS[currId] || null;
    nextStationObj = nextId ? STATIONS[nextId] || null : null;

    const activeSeg = activeRoute.segments.find((s) => s.stations.includes(currId));
    if (activeSeg) {
      currentTrainLineColor = activeSeg.lineColor;
    }
  }

  // Label coordinates calculation
  const getLabelCoords = (st: Station): { lx: number; ly: number; textAnchor: 'start' | 'end' | 'middle' } => {
    const pos = st.labelPos || 'right';
    let lx = st.x + 14;
    let ly = st.y + 4;
    let textAnchor: 'start' | 'end' | 'middle' = 'start';

    if (pos === 'left') {
      lx = st.x - 14;
      textAnchor = 'end';
    } else if (pos === 'top') {
      lx = st.x;
      ly = st.y - 16;
      textAnchor = 'middle';
    } else if (pos === 'bottom') {
      lx = st.x;
      ly = st.y + 17;
      textAnchor = 'middle';
    } else if (pos === 'top-left') {
      lx = st.x - 14;
      ly = st.y - 11;
      textAnchor = 'end';
    } else if (pos === 'top-right') {
      lx = st.x + 14;
      ly = st.y - 11;
      textAnchor = 'start';
    } else if (pos === 'bottom-left') {
      lx = st.x - 14;
      ly = st.y + 16;
      textAnchor = 'end';
    } else if (pos === 'bottom-right') {
      lx = st.x + 14;
      ly = st.y + 16;
      textAnchor = 'start';
    }

    return { lx, ly, textAnchor };
  };

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`relative w-full h-full bg-white lg:border lg:border-[#D9DEE5] rounded-none lg:rounded-lg overflow-hidden select-none cursor-grab active:cursor-grabbing ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen min-h-screen' : ''
      }`}
    >
      {/* System Filter Pill Bar */}
      {onFilterChange && (
        <MapLineFilter
          currentFilter={systemFilter}
          onFilterChange={onFilterChange}
        />
      )}

      {/* Map Controls Toolbar */}
      <MapControls
        onZoomIn={() => handleZoom(0.8)}
        onZoomOut={() => handleZoom(1.25)}
        onReset={handleReset}
        onFocusRoute={activeRoute ? handleFocusRoute : undefined}
        hasActiveRoute={!!activeRoute}
        isFullscreen={isFullscreen}
        onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
      />

      {/* Map Status Tag */}
      <div className="absolute bottom-[9.5rem] sm:bottom-3 left-3 z-20 pointer-events-none bg-white/95 px-2 py-1 border border-[#DDE2E7] text-[9px] text-[#7A848E]">
        <span className="font-semibold text-[#4F5964]">BANGKOK RAIL NETWORK</span> · ลากเพื่อเลื่อน · แตะสถานีเพื่อดูข้อมูล
      </div>

      {/* Scalable SVG Canvas with Native ViewBox */}
      <svg
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
        preserveAspectRatio="xMidYMid meet"
        width="100%"
        height="100%"
        className="w-full h-full block"
        style={{ touchAction: 'none' }}
      >
        {/* Clean paper-like background. The reference map uses a plain white canvas. */}
        <rect x="-1000" y="-1000" width="4000" height="4000" fill="#FFFFFF" />

        {/* Chao Phraya River */}
        <g opacity="0.95">
          <path
            d={CHAO_PHRAYA_RIVER_PATH}
            fill="none"
            stroke="#EAF5FC"
            strokeWidth="28"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={CHAO_PHRAYA_RIVER_PATH}
            fill="none"
            stroke="#D6ECF8"
            strokeWidth="17"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={KHLONG_BANGKOK_YAI_PATH}
            fill="none"
            stroke="#D6ECF8"
            strokeWidth="9"
            strokeLinecap="round"
          />
          <text
            x="390"
            y="760"
            fill="#A5C8DE"
            fontSize="10"
            fontWeight="bold"
            opacity="0.6"
            transform="rotate(90 390 760)"
            fontFamily="sans-serif"
          >
            CHAO PHRAYA RIVER
          </text>
        </g>

        {/* 1. All Railway Lines Layer */}
        {Object.values(RAILWAY_LINES).map((line) => {
          const hasRoute = activeRoute !== null;
          const isLineInActiveRoute = activeRoute?.segments.some((s) => s.lineId === line.id);
          const isLineFiltered = isLineInFilter(line.id, systemFilter);

          let lineOpacity = 1;
          if (hasRoute) {
            lineOpacity = isLineInActiveRoute ? 1 : isLineFiltered ? 0.38 : 0.10;
          } else {
            lineOpacity = isLineFiltered ? 1 : 0.12;
          }

          const points = line.stations
            .map((stId) => {
              const st = STATIONS[stId];
              return st ? `${st.x},${st.y}` : null;
            })
            .filter(Boolean)
            .join(' ');

          return (
            <g key={line.id} opacity={lineOpacity} className="transition-opacity duration-300">
              {/* White casing */}
              <polyline
                points={points}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="11"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Colored track */}
              <polyline
                points={points}
                fill="none"
                stroke={line.color}
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          );
        })}

        {/* 2. Active Route Highlight Overlay */}
        {activeRoute && (
          <g className="pointer-events-none">
            {activeRoute.segments.map((segment, sIdx) => {
              const segPoints = segment.stations
                .map((stId) => {
                  const st = STATIONS[stId];
                  return st ? `${st.x},${st.y}` : null;
                })
                .filter(Boolean)
                .join(' ');

              return (
                <g key={`hl-seg-${sIdx}`}>
                  {/* Quiet route emphasis, kept schematic like the source map. */}
                  <polyline
                    points={segPoints}
                    fill="none"
                    stroke={segment.lineColor}
                    strokeWidth="14"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.18"
                  />
                  {/* White track base */}
                  <polyline
                    points={segPoints}
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="11"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Core Line */}
                  <polyline
                    points={segPoints}
                    fill="none"
                    stroke={segment.lineColor}
                    strokeWidth="7.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              );
            })}
          </g>
        )}

        {/* 3. Physical Interchange Walkway Capsules */}
        <g opacity={activeRoute ? 0.35 : 0.95}>
          {/* Krung Thep Aphiwat (SRT) <-> Bang Sue (MRT) Walkway Link */}
          <rect x="591" y="491" width="18" height="118" rx="9" fill="#FFFFFF" stroke="#17202A" strokeWidth="2" />
          <line x1="600" y1="500" x2="600" y2="600" stroke="#17202A" strokeWidth="2" strokeDasharray="2 2" />

          {/* Mo Chit <-> Chatuchak Park Capsule Link */}
          <rect x="631" y="571" width="78" height="18" rx="9" fill="#FFFFFF" stroke="#17202A" strokeWidth="2" />
          <line x1="640" y1="580" x2="700" y2="580" stroke="#17202A" strokeWidth="2" strokeDasharray="2 2" />
          
          {/* Ha Yaek Lat Phrao <-> Phahon Yothin Capsule Link */}
          <rect x="691" y="531" width="78" height="18" rx="9" fill="#FFFFFF" stroke="#17202A" strokeWidth="2" />
          <line x1="700" y1="540" x2="760" y2="540" stroke="#17202A" strokeWidth="2" strokeDasharray="2 2" />
        </g>

        {/* 4. Station Nodes & Labels */}
        {Object.values(STATIONS).map((st) => {
          const isInRoute = activeStationIds.has(st.id);
          const isInterchange = st.type === 'interchange' || st.lines.length > 1;
          const isSelected = selectedStation?.id === st.id;
          const isHovered = hoveredStation?.id === st.id || hoveredTimelineStationId === st.id;
          const isStationFiltered = isStationInFilter(st.lines, systemFilter);

          const primaryLine = RAILWAY_LINES[st.lines[0]];
          const primaryColor = primaryLine ? primaryLine.color : '#64748B';

          let nodeOpacity = 1;
          if (activeRoute) {
            nodeOpacity = isInRoute || isHovered ? 1 : isStationFiltered ? 0.68 : 0.24;
          } else {
            nodeOpacity = isStationFiltered || isHovered ? 1 : 0.20;
          }

          const { lx, ly, textAnchor } = getLabelCoords(st);

          return (
            <g
              key={st.id}
              opacity={nodeOpacity}
              onClick={(e) => {
                e.stopPropagation();
                onSelectStation(st);
              }}
              onMouseEnter={() => setHoveredStation(st)}
              onMouseLeave={() => setHoveredStation(null)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectStation(st);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`${st.nameTh} (${st.nameEn})${st.code ? ` ${st.code}` : ''}`}
              className="cursor-pointer"
            >
              {/* Highlight Aura if Hovered from Timeline or Map */}
              {isHovered && (
                <circle
                  cx={st.x}
                  cy={st.y}
                  r="14"
                  fill="#3155D9"
                  opacity="0.18"
                  className="animate-pulse"
                />
              )}

              {/* Every coded station is a white roundel with its line-coloured border,
                  matching the visual language of the official schematic. */}
              <g transform={`translate(${st.x}, ${st.y})`} aria-hidden="true">
                {isInterchange && (
                  <circle
                    r={isSelected || isHovered ? 12.5 : 11}
                    fill="#FFFFFF"
                    stroke="#FFFFFF"
                    strokeWidth="4"
                  />
                )}
                <circle
                  r={isInterchange ? (isSelected || isHovered ? 10.5 : 9.5) : (isSelected || isHovered ? 8.5 : 7.5)}
                  fill="#FFFFFF"
                  stroke={primaryColor}
                  strokeWidth={isInterchange ? 2.8 : 2.1}
                />
                {st.code ? (
                  <text
                    x="0"
                    y={isInterchange ? 2.4 : 2.1}
                    fill={primaryColor}
                    fontSize={isInterchange ? "6.2" : "5.6"}
                    fontWeight="800"
                    textAnchor="middle"
                    fontFamily="Arial, sans-serif"
                  >
                    {st.code}
                  </text>
                ) : (
                  <circle r="2.4" fill={primaryColor} />
                )}
                {isInterchange && st.lines.slice(1, 4).map((lineId, index) => (
                  <circle
                    key={lineId}
                    cx={(index - (Math.min(st.lines.length - 1, 3) - 1) / 2) * 5}
                    cy="12.5"
                    r="2"
                    fill={RAILWAY_LINES[lineId]?.color || '#17202A'}
                    stroke="#FFFFFF"
                    strokeWidth="0.8"
                  />
                ))}
              </g>

              {/* Station Labels */}
              <g transform={`translate(${lx}, ${ly})`} aria-hidden="true">
                {/* White Halo */}
                <text
                  x="0"
                  y="0"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="3"
                  strokeLinejoin="round"
                  fontSize={isInterchange ? '10' : '8.6'}
                  fontWeight={isInterchange ? '700' : '500'}
                  textAnchor={textAnchor}
                  fontFamily="'Prompt', sans-serif"
                >
                  <tspan>{st.nameTh}</tspan>
                </text>
                <text
                  x="0"
                  y="0"
                  fill={isInRoute || !activeRoute || isHovered ? '#1F2933' : '#7B858F'}
                  fontSize={isInterchange ? '10' : '8.6'}
                  fontWeight={isInterchange || isHovered ? 'bold' : '600'}
                  textAnchor={textAnchor}
                  fontFamily="'Prompt', sans-serif"
                >
                  <tspan>{st.nameTh}</tspan>
                </text>

                {/* English Label */}
                <text
                  x="0"
                  y="10"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  fontSize={isInterchange ? '7.7' : '6.8'}
                  fontWeight="400"
                  textAnchor={textAnchor}
                  fontFamily="'Plus Jakarta Sans', sans-serif"
                >
                  <tspan>{st.nameEn}</tspan>
                </text>
                <text
                  x="0"
                  y="10"
                  fill={isInRoute || !activeRoute || isHovered ? '#7B858F' : '#A3ABB3'}
                  fontSize={isInterchange ? '7.7' : '6.8'}
                  fontWeight="400"
                  textAnchor={textAnchor}
                  fontFamily="'Plus Jakarta Sans', sans-serif"
                >
                  <tspan>{st.nameEn}</tspan>
                </text>
              </g>
            </g>
          );
        })}

        {/* 5. Origin Marker (Green Pin) */}
        {originStation && (
          <g transform={`translate(${originStation.x}, ${originStation.y})`} className="pointer-events-none z-20">
            <circle r="14" fill="none" stroke="#16835B" strokeWidth="3" />
            <g transform="translate(0, -23)">
              <rect x="-23" y="-9" width="46" height="13" rx="2" fill="#16835B" />
              <text x="0" y="0" fill="#FFFFFF" fontSize="6.5" fontWeight="800" textAnchor="middle">
                ต้นทาง
              </text>
            </g>
          </g>
        )}

        {/* 6. Destination Marker (Red Pin) */}
        {destStation && (
          <g transform={`translate(${destStation.x}, ${destStation.y})`} className="pointer-events-none z-20">
            <circle r="14" fill="none" stroke="#CB3045" strokeWidth="3" />
            <g transform="translate(0, -23)">
              <rect x="-25" y="-9" width="50" height="13" rx="2" fill="#CB3045" />
              <text x="0" y="0" fill="#FFFFFF" fontSize="6.5" fontWeight="800" textAnchor="middle">
                ปลายทาง
              </text>
            </g>
          </g>
        )}

        {/* 7. Train Marker */}
        {journeyState && currentStationObj && (
          <TrainMarker
            currentStation={currentStationObj}
            nextStation={nextStationObj}
            progress={journeyState.progress}
            lineColor={currentTrainLineColor}
          />
        )}
      </svg>
    </div>
  );
};
