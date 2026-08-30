'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { STATIONS } from '@/data/stations';
import { RAILWAY_LINES } from '@/data/lines';
import { CHAO_PHRAYA_RIVER_PATH, KHLONG_BANGKOK_YAI_PATH } from '@/data/river';
import { Station, RouteResult, JourneyState, SystemFilter } from '@/types/railway';
import { isLineInFilter, isStationInFilter } from '@/utils/filterRailwayLines';
import { calculateRouteBounds } from '@/utils/calculateRouteBounds';
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

  useEffect(() => {
    if (activeRoute) {
      handleFocusRoute();
    }
  }, [activeRoute, handleFocusRoute]);

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
      ly = st.y + 20;
      textAnchor = 'middle';
    } else if (pos === 'top-left') {
      lx = st.x - 14;
      ly = st.y - 12;
      textAnchor = 'end';
    } else if (pos === 'top-right') {
      lx = st.x + 14;
      ly = st.y - 12;
      textAnchor = 'start';
    } else if (pos === 'bottom-left') {
      lx = st.x - 14;
      ly = st.y + 18;
      textAnchor = 'end';
    } else if (pos === 'bottom-right') {
      lx = st.x + 14;
      ly = st.y + 18;
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
      className={`relative w-full h-full bg-[#FFFFFF] sm:border sm:border-[#DDE2E7] rounded-none sm:rounded-xl overflow-hidden select-none cursor-grab active:cursor-grabbing ${
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
      <div className="absolute bottom-24 sm:bottom-3 left-3 z-20 pointer-events-none bg-white/95 px-3 py-1.5 rounded-md border border-[#DDE2E7] text-[11px] text-[#66717D] shadow-sm">
        <span className="font-semibold text-[#17202A]">Bangkok Transit Map</span> · คลิกสถานีเพื่อดูข้อมูล
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
        <defs>
          <pattern id="subtleGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#F1F4F8" strokeWidth="0.75" />
          </pattern>

          <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Background Grid */}
        <rect x="-1000" y="-1000" width="4000" height="4000" fill="url(#subtleGrid)" />

        {/* Chao Phraya River */}
        <g opacity="0.95">
          <path
            d={CHAO_PHRAYA_RIVER_PATH}
            fill="none"
            stroke="#E0F2FE"
            strokeWidth="32"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={CHAO_PHRAYA_RIVER_PATH}
            fill="none"
            stroke="#BAE6FD"
            strokeWidth="20"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={KHLONG_BANGKOK_YAI_PATH}
            fill="none"
            stroke="#BAE6FD"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <text
            x="390"
            y="760"
            fill="#0369A1"
            fontSize="13"
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
            lineOpacity = isLineInActiveRoute ? 1 : isLineFiltered ? 0.20 : 0.08;
          } else {
            lineOpacity = isLineFiltered ? 1 : 0.18;
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
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Colored track */}
              <polyline
                points={points}
                fill="none"
                stroke={line.color}
                strokeWidth="6"
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
                  {/* Glowing outer aura */}
                  <polyline
                    points={segPoints}
                    fill="none"
                    stroke={segment.lineColor}
                    strokeWidth="14"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.35"
                    filter="url(#routeGlow)"
                  />
                  {/* White track base */}
                  <polyline
                    points={segPoints}
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Core Line */}
                  <polyline
                    points={segPoints}
                    fill="none"
                    stroke={segment.lineColor}
                    strokeWidth="6.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              );
            })}
          </g>
        )}

        {/* 3. Physical Interchange Walkway Capsules (Mo Chit / Chatuchak, Ha Yaek Lat Phrao / Phahon Yothin) */}
        <g opacity={activeRoute ? 0.35 : 0.95}>
          {/* Mo Chit <-> Chatuchak Park Capsule Link */}
          <rect x="690" y="571" width="50" height="18" rx="9" fill="#FFFFFF" stroke="#17202A" strokeWidth="2.5" />
          <line x1="700" y1="580" x2="730" y2="580" stroke="#17202A" strokeWidth="2" strokeDasharray="2 2" />
          
          {/* Ha Yaek Lat Phrao <-> Phahon Yothin Capsule Link */}
          <rect x="690" y="531" width="50" height="18" rx="9" fill="#FFFFFF" stroke="#17202A" strokeWidth="2.5" />
          <line x1="700" y1="540" x2="730" y2="540" stroke="#17202A" strokeWidth="2" strokeDasharray="2 2" />
        </g>

        {/* 4. Station Nodes & Labels */}
        {Object.values(STATIONS).map((st) => {
          const isOrigin = originStation?.id === st.id;
          const isDest = destStation?.id === st.id;
          const isInRoute = activeStationIds.has(st.id);
          const isInterchange = st.type === 'interchange' || st.lines.length > 1;
          const isSelected = selectedStation?.id === st.id;
          const isHovered = hoveredStation?.id === st.id;
          const isStationFiltered = isStationInFilter(st.lines, systemFilter);

          const primaryLine = RAILWAY_LINES[st.lines[0]];
          const primaryColor = primaryLine ? primaryLine.color : '#64748B';

          let nodeOpacity = 1;
          if (activeRoute) {
            nodeOpacity = isInRoute ? 1 : isStationFiltered ? 0.22 : 0.10;
          } else {
            nodeOpacity = isStationFiltered ? 1 : 0.20;
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
              className="cursor-pointer"
            >
              {/* Node Symbol */}
              {isInterchange ? (
                /* Interchange Node */
                <g>
                  <circle
                    cx={st.x}
                    cy={st.y}
                    r={isSelected || isHovered ? 11 : 9}
                    fill="#FFFFFF"
                    stroke="#17202A"
                    strokeWidth="3"
                  />
                  <circle
                    cx={st.x}
                    cy={st.y}
                    r="4"
                    fill={primaryColor}
                  />
                </g>
              ) : (
                /* Regular Station Node */
                <g>
                  <circle
                    cx={st.x}
                    cy={st.y}
                    r={isSelected || isHovered ? 7.5 : 5}
                    fill="#FFFFFF"
                    stroke={primaryColor}
                    strokeWidth="2.5"
                  />
                </g>
              )}

              {/* Station Code Badge */}
              {st.code && (isInterchange || viewBox.w < 1300) && (
                <g transform={`translate(${st.x}, ${st.y - 12})`}>
                  <rect
                    x="-13"
                    y="-9"
                    width="26"
                    height="11"
                    rx="3"
                    fill={primaryColor}
                  />
                  <text
                    x="0"
                    y="-1"
                    fill="#FFFFFF"
                    fontSize="7.5"
                    fontWeight="bold"
                    textAnchor="middle"
                    fontFamily="sans-serif"
                  >
                    {st.code}
                  </text>
                </g>
              )}

              {/* Station Labels */}
              <g transform={`translate(${lx}, ${ly})`}>
                {/* White Halo */}
                <text
                  x="0"
                  y="0"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="4"
                  strokeLinejoin="round"
                  fontSize={isInterchange ? '11' : '9.5'}
                  fontWeight={isInterchange ? 'bold' : '600'}
                  textAnchor={textAnchor}
                  fontFamily="'Prompt', sans-serif"
                >
                  {st.nameTh}
                </text>
                <text
                  x="0"
                  y="0"
                  fill={isInRoute || !activeRoute ? '#17202A' : '#66717D'}
                  fontSize={isInterchange ? '11' : '9.5'}
                  fontWeight={isInterchange ? 'bold' : '600'}
                  textAnchor={textAnchor}
                  fontFamily="'Prompt', sans-serif"
                >
                  {st.nameTh}
                </text>

                {/* English Label */}
                <text
                  x="0"
                  y="10"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="3"
                  strokeLinejoin="round"
                  fontSize={isInterchange ? '8.5' : '7.5'}
                  fontWeight="500"
                  textAnchor={textAnchor}
                  fontFamily="'Plus Jakarta Sans', sans-serif"
                >
                  {st.nameEn}
                </text>
                <text
                  x="0"
                  y="10"
                  fill={isInRoute || !activeRoute ? '#66717D' : '#8A949E'}
                  fontSize={isInterchange ? '8.5' : '7.5'}
                  fontWeight="500"
                  textAnchor={textAnchor}
                  fontFamily="'Plus Jakarta Sans', sans-serif"
                >
                  {st.nameEn}
                </text>
              </g>
            </g>
          );
        })}

        {/* 5. Origin Marker (Green Pin) */}
        {originStation && (
          <g transform={`translate(${originStation.x}, ${originStation.y})`} className="pointer-events-none z-20">
            <circle r="16" fill="#2E9B68" opacity="0.3" className="animate-ping" />
            <circle r="10" fill="#2E9B68" stroke="#FFFFFF" strokeWidth="2.5" />
            <g transform="translate(0, -26)">
              <rect x="-28" y="-11" width="56" height="16" rx="3" fill="#2E9B68" />
              <text x="0" y="1" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">
                ORIGIN
              </text>
            </g>
          </g>
        )}

        {/* 6. Destination Marker (Red Pin) */}
        {destStation && (
          <g transform={`translate(${destStation.x}, ${destStation.y})`} className="pointer-events-none z-20">
            <circle r="16" fill="#D94A55" opacity="0.3" className="animate-ping" />
            <circle r="10" fill="#D94A55" stroke="#FFFFFF" strokeWidth="2.5" />
            <g transform="translate(0, -26)">
              <rect x="-30" y="-11" width="60" height="16" rx="3" fill="#D94A55" />
              <text x="0" y="1" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">
                DESTINATION
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
