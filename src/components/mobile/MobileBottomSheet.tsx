'use client';

import React, { useState } from 'react';
import { RouteResult, JourneyState, Station, RoutePreference } from '@/types/railway';
import { StationSelector } from '@/components/planner/StationSelector';
import { RoutePreferenceSelector } from '@/components/planner/RoutePreference';
import { RouteComparison } from '@/components/planner/RouteComparison';
import { RouteSummary } from '@/components/planner/RouteSummary';
import { RouteTimeline } from '@/components/planner/RouteTimeline';
import { JourneyControls } from '@/components/planner/JourneyControls';
import { ChevronUp, ChevronDown, Clock, Navigation, Play, Search, X } from 'lucide-react';

interface MobileBottomSheetProps {
  originStation: Station | null;
  destStation: Station | null;
  onSelectOrigin: (st: Station | null) => void;
  onSelectDestination: (st: Station | null) => void;
  onSwap: () => void;
  onFindRoute: () => void;
  onSelectPreset: (originId: string, destId: string) => void;
  hasSearched: boolean;
  sameStationError: boolean;
  routePreference: RoutePreference;
  onPreferenceChange: (pref: RoutePreference) => void;
  routes: RouteResult[];
  selectedRouteIndex: number;
  onSelectRouteIndex: (idx: number) => void;
  activeRoute: RouteResult | null;
  journeyState: JourneyState;
  onStartJourney: () => void;
  onPlay: () => void;
  onPause: () => void;
  onChangeSpeed: (speed: number) => void;
  onSeekStation: (index: number) => void;
  onSelectStationDetails: (st: Station) => void;
}

export const MobileBottomSheet: React.FC<MobileBottomSheetProps> = ({
  originStation,
  destStation,
  onSelectOrigin,
  onSelectDestination,
  onSwap,
  onFindRoute,
  onSelectPreset,
  hasSearched,
  sameStationError,
  routePreference,
  onPreferenceChange,
  routes,
  selectedRouteIndex,
  onSelectRouteIndex,
  activeRoute,
  journeyState,
  onStartJourney,
  onPlay,
  onPause,
  onChangeSpeed,
  onSeekStation,
  onSelectStationDetails,
}) => {
  // State: 'collapsed' | 'expanded'
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Dimmed backdrop when sheet is expanded */}
      {isExpanded && (
        <div
          onClick={() => setIsExpanded(false)}
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-xs lg:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Floating Bottom Sheet */}
      <div
        className={`fixed left-0 right-0 bottom-0 z-40 bg-white rounded-t-3xl border-t border-slate-200 shadow-2xl transition-all duration-300 ease-out lg:hidden flex flex-col ${
          isExpanded ? 'h-[85vh] max-h-[85vh]' : 'h-auto max-h-[170px]'
        }`}
      >
        {/* Drag Handle & Header Banner */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full pt-2.5 pb-2 px-4 flex flex-col items-center cursor-pointer select-none bg-slate-50/90 rounded-t-3xl border-b border-slate-100 hover:bg-slate-100/80 transition-colors"
        >
          {/* Handle bar */}
          <div className="w-12 h-1.5 bg-slate-300 rounded-full mb-1.5" />

          {/* Quick Peek Summary when Collapsed */}
          {!isExpanded ? (
            <div className="w-full flex items-center justify-between gap-2 py-0.5">
              <div className="flex-1 min-w-0">
                {activeRoute && originStation && destStation ? (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 truncate">
                      <span className="truncate">{originStation.nameTh}</span>
                      <span className="text-slate-400">→</span>
                      <span className="truncate">{destStation.nameTh}</span>
                    </div>
                    <span className="text-[11px] font-extrabold text-[#2E9B68] bg-emerald-50 px-1.5 py-0.5 rounded shrink-0">
                      ~{activeRoute.estimatedMinutes} นาที
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                    <Search className="w-3.5 h-3.5 text-slate-400" />
                    <span>แตะเพื่อวางแผนการเดินทาง (Tap to Plan)</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(true);
                  }}
                  className="px-2.5 py-1 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-lg shadow-xs hover:bg-slate-50 flex items-center gap-1"
                >
                  <span>รายละเอียด</span>
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">วางแผนการเดินทาง (Journey Planner)</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(false);
                }}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Collapsed Quick Actions Bar */}
        {!isExpanded && activeRoute && (
          <div className="px-4 py-2.5 flex items-center justify-between gap-2.5 bg-white">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="font-bold text-slate-900">{activeRoute.totalStations} สถานี</span>
              <span>·</span>
              <span>{activeRoute.transfers.length > 0 ? `เปลี่ยนสาย ${activeRoute.transfers.length} ครั้ง` : 'ต่อเดียว'}</span>
              {activeRoute.fareThb && (
                <>
                  <span>·</span>
                  <span className="font-extrabold text-slate-900">฿{activeRoute.fareThb}</span>
                </>
              )}
            </div>

            <button
              onClick={onStartJourney}
              className="py-1.5 px-3 bg-[#17202A] text-white hover:bg-slate-800 text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 shrink-0"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>จำลอง</span>
            </button>
          </div>
        )}

        {/* Expanded Scrollable Body */}
        {isExpanded && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-8">
            {/* Station Selector */}
            <StationSelector
              origin={originStation}
              destination={destStation}
              onSelectOrigin={onSelectOrigin}
              onSelectDestination={onSelectDestination}
              onSwap={onSwap}
              onFindRoute={() => {
                onFindRoute();
              }}
              onSelectPreset={onSelectPreset}
              hasSearched={hasSearched}
            />

            {/* Same Station Warning */}
            {sameStationError && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2">
                <span>กรุณาเลือกสถานีต้นทางและปลายทางที่แตกต่างกัน</span>
              </div>
            )}

            {/* Route Preference Selector */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider px-0.5">
                เกณฑ์การค้นหา (Preference)
              </span>
              <RoutePreferenceSelector
                value={routePreference}
                onChange={onPreferenceChange}
              />
            </div>

            {/* Route Comparison Cards */}
            {routes.length > 1 && (
              <RouteComparison
                routes={routes}
                selectedIndex={selectedRouteIndex}
                onSelectRoute={onSelectRouteIndex}
              />
            )}

            {/* Active Simulation Controls Bar */}
            {activeRoute && journeyState.isPlaying && (
              <JourneyControls
                journeyState={journeyState}
                activeRoute={activeRoute}
                onPlay={onPlay}
                onPause={onPause}
                onRestart={onStartJourney}
                onChangeSpeed={onChangeSpeed}
                onSeekStation={onSeekStation}
              />
            )}

            {/* Route Summary */}
            {activeRoute && (
              <RouteSummary
                routes={routes}
                selectedRouteIndex={selectedRouteIndex}
                onSelectRouteIndex={onSelectRouteIndex}
                onStartJourney={() => {
                  onStartJourney();
                  setIsExpanded(false); // Collapse bottom sheet so user can watch train on map!
                }}
                isJourneyActive={journeyState.isPlaying}
              />
            )}

            {/* Station Timeline */}
            {activeRoute && (
              <RouteTimeline
                route={activeRoute}
                journeyState={journeyState}
                onSeekStation={onSeekStation}
                onSelectStation={onSelectStationDetails}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
};
