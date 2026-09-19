'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { STATIONS } from '@/data/stations';
import { RAILWAY_LINES } from '@/data/lines';
import { Station, RouteResult, JourneyState, RoutePreference, SystemFilter } from '@/types/railway';
import { calculateRoute } from '@/utils/calculateRoute';
import { rankRoutes } from '@/utils/rankRoutes';
import { Header } from '@/components/Header';
import { RailwayMap } from '@/components/map/RailwayMap';
import { StationSelector } from '@/components/planner/StationSelector';
import { RoutePreferenceSelector } from '@/components/planner/RoutePreference';
import { RouteComparison } from '@/components/planner/RouteComparison';
import { RouteSummary } from '@/components/planner/RouteSummary';
import { RouteTimeline } from '@/components/planner/RouteTimeline';
import { JourneyControls } from '@/components/planner/JourneyControls';
import { MobileBottomSheet } from '@/components/mobile/MobileBottomSheet';
import { TransferAlertModal } from '@/components/planner/TransferAlertModal';
import { StationDetailsModal } from '@/components/details/StationDetailsModal';
import { LinesDrawer } from '@/components/details/LinesDrawer';
import { AboutModal } from '@/components/details/AboutModal';
import confetti from 'canvas-confetti';
import { AlertCircle } from 'lucide-react';

export default function HomePage() {
  // Navigation & Modal States
  const [isLinesOpen, setIsLinesOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [selectedStationDetails, setSelectedStationDetails] = useState<Station | null>(null);

  // Origin and Destination Selection
  const [originStation, setOriginStation] = useState<Station | null>(null);
  const [destStation, setDestStation] = useState<Station | null>(null);
  const [sameStationError, setSameStationError] = useState(false);

  // Focus & Synchronization States between Timeline and Map
  const [focusedStationId, setFocusedStationId] = useState<string | null>(null);
  const [hoveredTimelineStationId, setHoveredTimelineStationId] = useState<string | null>(null);

  // Preference and System Filter States (Session-only Client State)
  const [routePreference, setRoutePreference] = useState<RoutePreference>('fastest');
  const [systemFilter, setSystemFilter] = useState<SystemFilter>('all');

  // Route Calculation Results
  const [routes, setRoutes] = useState<RouteResult[]>([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  // Journey Simulation State
  const [journeyState, setJourneyState] = useState<JourneyState>({
    currentStationIndex: 0,
    currentStationId: '',
    isPlaying: false,
    speed: 1,
    progress: 0,
    isTransferring: false,
    activeTransfer: null,
    isCompleted: false,
  });

  const activeRoute = routes[selectedRouteIndex] || null;

  // Perform route calculation
  const handleFindRoute = useCallback(() => {
    if (!originStation || !destStation) return;
    if (originStation.id === destStation.id) {
      setSameStationError(true);
      return;
    }
    setSameStationError(false);

    const calculated = calculateRoute(originStation.id, destStation.id);
    const ranked = rankRoutes(calculated, routePreference);
    setRoutes(ranked);
    setSelectedRouteIndex(0);
    setHasSearched(true);
    setFocusedStationId(null);

    if (ranked.length > 0) {
      setJourneyState({
        currentStationIndex: 0,
        currentStationId: ranked[0].stations[0],
        isPlaying: false,
        speed: 1,
        progress: 0,
        isTransferring: false,
        activeTransfer: null,
        isCompleted: false,
      });
    }
  }, [originStation, destStation, routePreference]);

  // Handle Route Preference Change
  const handlePreferenceChange = (newPref: RoutePreference) => {
    setRoutePreference(newPref);
    if (routes.length > 0) {
      const reRanked = rankRoutes(routes, newPref);
      setRoutes(reRanked);
      setSelectedRouteIndex(0);
      setJourneyState((prev) => ({
        ...prev,
        currentStationIndex: 0,
        currentStationId: reRanked[0]?.stations[0] || '',
        progress: 0,
        isPlaying: false,
        isCompleted: false,
        isTransferring: false,
        activeTransfer: null,
      }));
    }
  };

  // Preset Selection Helper
  const handleSelectPreset = (originId: string, destId: string) => {
    const orig = STATIONS[originId];
    const dest = STATIONS[destId];
    if (orig && dest) {
      setOriginStation(orig);
      setDestStation(dest);
      setSameStationError(false);
      setFocusedStationId(null);
      const calculated = calculateRoute(orig.id, dest.id);
      const ranked = rankRoutes(calculated, routePreference);
      setRoutes(ranked);
      setSelectedRouteIndex(0);
      setHasSearched(true);
      setJourneyState({
        currentStationIndex: 0,
        currentStationId: orig.id,
        isPlaying: false,
        speed: 1,
        progress: 0,
        isTransferring: false,
        activeTransfer: null,
        isCompleted: false,
      });
    }
  };

  // Clear / New Journey Action
  const handleNewJourney = () => {
    setOriginStation(null);
    setDestStation(null);
    setRoutes([]);
    setSelectedRouteIndex(0);
    setHasSearched(false);
    setSameStationError(false);
    setFocusedStationId(null);
    setHoveredTimelineStationId(null);
    setJourneyState({
      currentStationIndex: 0,
      currentStationId: '',
      isPlaying: false,
      speed: 1,
      progress: 0,
      isTransferring: false,
      activeTransfer: null,
      isCompleted: false,
    });
  };

  // Swap Origin and Destination
  const handleSwap = () => {
    const temp = originStation;
    setOriginStation(destStation);
    setDestStation(temp);
    setSameStationError(false);
    setFocusedStationId(null);
    if (destStation && temp) {
      const calculated = calculateRoute(destStation.id, temp.id);
      const ranked = rankRoutes(calculated, routePreference);
      setRoutes(ranked);
      setSelectedRouteIndex(0);
      setJourneyState({
        currentStationIndex: 0,
        currentStationId: destStation.id,
        isPlaying: false,
        speed: 1,
        progress: 0,
        isTransferring: false,
        activeTransfer: null,
        isCompleted: false,
      });
    }
  };

  // Journey Animation Loop
  useEffect(() => {
    if (!journeyState.isPlaying || !activeRoute || journeyState.isTransferring) return;

    let animFrame: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      setJourneyState((prev) => {
        if (!prev.isPlaying || prev.isTransferring || prev.isCompleted) return prev;

        const hopDuration = 1.6 / prev.speed;
        let newProgress = prev.progress + delta / hopDuration;

        if (newProgress >= 1) {
          const nextIdx = prev.currentStationIndex + 1;

          if (nextIdx >= activeRoute.stations.length - 1) {
            confetti({
              particleCount: 70,
              spread: 60,
              origin: { y: 0.6 },
            });
            return {
              ...prev,
              currentStationIndex: activeRoute.stations.length - 1,
              currentStationId: activeRoute.stations[activeRoute.stations.length - 1],
              progress: 0,
              isPlaying: false,
              isCompleted: true,
            };
          }

          const currentStationId = activeRoute.stations[nextIdx];
          const transfer = activeRoute.transfers.find((t) => t.stationId === currentStationId);

          if (transfer) {
            return {
              ...prev,
              currentStationIndex: nextIdx,
              currentStationId,
              progress: 0,
              isTransferring: true,
              activeTransfer: transfer,
            };
          }

          return {
            ...prev,
            currentStationIndex: nextIdx,
            currentStationId: activeRoute.stations[nextIdx],
            progress: 0,
          };
        }

        return {
          ...prev,
          progress: newProgress,
        };
      });

      animFrame = requestAnimationFrame(loop);
    };

    animFrame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrame);
  }, [journeyState.isPlaying, journeyState.isTransferring, activeRoute]);

  // Jump to station index
  const handleSeekStation = (index: number) => {
    if (!activeRoute) return;
    setJourneyState((prev) => ({
      ...prev,
      currentStationIndex: index,
      currentStationId: activeRoute.stations[index],
      progress: 0,
      isCompleted: index === activeRoute.stations.length - 1,
      isTransferring: false,
      activeTransfer: null,
    }));
  };

  const handleStartJourney = () => {
    setJourneyState((prev) => ({
      ...prev,
      currentStationIndex: 0,
      currentStationId: activeRoute ? activeRoute.stations[0] : '',
      progress: 0,
      isPlaying: true,
      isCompleted: false,
      isTransferring: false,
      activeTransfer: null,
    }));
  };

  // Route selection change from comparison cards
  const handleSelectRouteIndex = (idx: number) => {
    setSelectedRouteIndex(idx);
    setFocusedStationId(null);
    if (routes[idx]) {
      setJourneyState((prev) => ({
        ...prev,
        currentStationIndex: 0,
        currentStationId: routes[idx].stations[0],
        progress: 0,
        isPlaying: false,
        isCompleted: false,
        isTransferring: false,
        activeTransfer: null,
      }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7F9] font-sans">
      {/* Header */}
      <Header
        onOpenLines={() => setIsLinesOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        onSelectPreset={handleSelectPreset}
        stationCount={Object.keys(STATIONS).length}
        lineCount={Object.keys(RAILWAY_LINES).length}
      />

      {/* Main Content Layout */}
      <main className="flex-1 max-w-[1800px] w-full mx-auto p-0 lg:p-4 flex flex-col lg:flex-row gap-4 relative lg:h-[calc(100dvh-56px)] lg:min-h-[680px] lg:overflow-hidden">
        {/* Desktop Left Column (410px width, hidden on mobile in favor of BottomSheet) */}
        <aside className="hidden lg:flex w-[390px] xl:w-[410px] shrink-0 space-y-3.5 flex-col overflow-y-auto overscroll-contain pr-1 pb-6">
          {/* Station Selector / Route Input */}
          <StationSelector
            origin={originStation}
            destination={destStation}
            onSelectOrigin={(st) => {
              setOriginStation(st);
              setSameStationError(false);
              setFocusedStationId(null);
            }}
            onSelectDestination={(st) => {
              setDestStation(st);
              setSameStationError(false);
              setFocusedStationId(null);
            }}
            onSwap={handleSwap}
            onFindRoute={handleFindRoute}
            onSelectPreset={handleSelectPreset}
            onNewJourney={handleNewJourney}
            hasSearched={hasSearched}
          />

          {/* Same station validation notice */}
          {sameStationError && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>กรุณาเลือกสถานีต้นทางและปลายทางที่แตกต่างกัน (Please select different stations)</span>
            </div>
          )}

          {/* Route Preference Selector */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider px-0.5">
              เกณฑ์การค้นหา (Preference)
            </span>
            <RoutePreferenceSelector
              value={routePreference}
              onChange={handlePreferenceChange}
            />
          </div>

          {/* Route Comparison Cards */}
          {routes.length > 1 && (
            <RouteComparison
              routes={routes}
              selectedIndex={selectedRouteIndex}
              onSelectRoute={handleSelectRouteIndex}
            />
          )}

          {/* Active Simulation Controls Bar */}
          {activeRoute && (journeyState.isPlaying || journeyState.isCompleted || journeyState.currentStationIndex > 0) && (
            <JourneyControls
              journeyState={journeyState}
              activeRoute={activeRoute}
              onPlay={() => setJourneyState((prev) => ({ ...prev, isPlaying: true }))}
              onPause={() => setJourneyState((prev) => ({ ...prev, isPlaying: false }))}
              onRestart={handleStartJourney}
              onChangeSpeed={(spd) => setJourneyState((prev) => ({ ...prev, speed: spd }))}
              onSeekStation={handleSeekStation}
            />
          )}

          {/* Route Summary */}
          {activeRoute && (
            <RouteSummary
              routes={routes}
              selectedRouteIndex={selectedRouteIndex}
              onSelectRouteIndex={handleSelectRouteIndex}
              onStartJourney={handleStartJourney}
              isJourneyActive={journeyState.isPlaying}
            />
          )}

          {/* High-density Station Timeline */}
          {activeRoute && (
            <div>
              <RouteTimeline
                route={activeRoute}
                journeyState={journeyState}
                onSeekStation={handleSeekStation}
                onSelectStation={(st) => setSelectedStationDetails(st)}
                onFocusStation={(stId) => setFocusedStationId(stId)}
                onHoverStation={(stId) => setHoveredTimelineStationId(stId)}
                hoveredStationId={hoveredTimelineStationId}
              />
            </div>
          )}
        </aside>

        {/* Right Column: Full-height / Seamless Map Canvas */}
        <section className="flex-1 flex flex-col min-w-0 fixed inset-x-0 top-14 bottom-0 lg:static lg:h-full lg:min-h-0">
          <div className="w-full h-full">
            <RailwayMap
              activeRoute={activeRoute}
              journeyState={journeyState.isPlaying || journeyState.isCompleted ? journeyState : null}
              originStation={originStation}
              destStation={destStation}
              onSelectStation={(st) => setSelectedStationDetails(st)}
              selectedStation={selectedStationDetails}
              systemFilter={systemFilter}
              onFilterChange={setSystemFilter}
              focusedStationId={focusedStationId}
              hoveredTimelineStationId={hoveredTimelineStationId}
            />
          </div>
        </section>

        {/* Mobile Floating Bottom Sheet (Interactive Transit Sheet) */}
        <MobileBottomSheet
          originStation={originStation}
          destStation={destStation}
          onSelectOrigin={(st) => {
            setOriginStation(st);
            setSameStationError(false);
            setFocusedStationId(null);
          }}
          onSelectDestination={(st) => {
            setDestStation(st);
            setSameStationError(false);
            setFocusedStationId(null);
          }}
          onSwap={handleSwap}
          onFindRoute={handleFindRoute}
          onSelectPreset={handleSelectPreset}
          onNewJourney={handleNewJourney}
          hasSearched={hasSearched}
          sameStationError={sameStationError}
          routePreference={routePreference}
          onPreferenceChange={handlePreferenceChange}
          routes={routes}
          selectedRouteIndex={selectedRouteIndex}
          onSelectRouteIndex={handleSelectRouteIndex}
          activeRoute={activeRoute}
          journeyState={journeyState}
          onStartJourney={handleStartJourney}
          onPlay={() => setJourneyState((prev) => ({ ...prev, isPlaying: true }))}
          onPause={() => setJourneyState((prev) => ({ ...prev, isPlaying: false }))}
          onChangeSpeed={(spd) => setJourneyState((prev) => ({ ...prev, speed: spd }))}
          onSeekStation={handleSeekStation}
          onSelectStationDetails={(st) => setSelectedStationDetails(st)}
          onFocusStation={(stId) => setFocusedStationId(stId)}
        />
      </main>

      {/* Modals and Drawers */}
      <StationDetailsModal
        station={selectedStationDetails}
        onClose={() => setSelectedStationDetails(null)}
        onSetAsOrigin={(st) => {
          setSameStationError(false);
          setOriginStation(st);
          setFocusedStationId(null);
          if (destStation && destStation.id !== st.id) {
            const calculated = calculateRoute(st.id, destStation.id);
            const ranked = rankRoutes(calculated, routePreference);
            setRoutes(ranked);
            setSelectedRouteIndex(0);
          }
        }}
        onSetAsDestination={(st) => {
          setSameStationError(false);
          setDestStation(st);
          setFocusedStationId(null);
          if (originStation && originStation.id !== st.id) {
            const calculated = calculateRoute(originStation.id, st.id);
            const ranked = rankRoutes(calculated, routePreference);
            setRoutes(ranked);
            setSelectedRouteIndex(0);
          }
        }}
        onSelectLine={() => {
          setSelectedStationDetails(null);
          setIsLinesOpen(true);
        }}
      />

      <TransferAlertModal
        transfer={journeyState.activeTransfer}
        onContinue={() => {
          setJourneyState((prev) => ({
            ...prev,
            isTransferring: false,
            activeTransfer: null,
            isPlaying: true,
          }));
        }}
      />

      <LinesDrawer
        isOpen={isLinesOpen}
        onClose={() => setIsLinesOpen(false)}
        onSelectStation={(st) => setSelectedStationDetails(st)}
      />

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
    </div>
  );
}
