export type StationType = 'normal' | 'interchange' | 'terminal';

export interface Station {
  id: string;
  nameEn: string;
  nameTh: string;
  code?: string;
  lines: string[];
  type: StationType;
  x: number; // Schematic coordinate on SVG canvas
  y: number; // Schematic coordinate on SVG canvas
  description?: string;
  facilities?: string[];
  interchanges?: string[]; // IDs of other stations or lines connected
  labelPos?: 'top' | 'bottom' | 'left' | 'right' | 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export interface RailwayLine {
  id: string;
  name: string;
  nameTh: string;
  operator: string;
  color: string;
  textColor?: string;
  stations: string[]; // Station IDs in sequential order
  description?: string;
}

export interface RouteSegment {
  lineId: string;
  lineName: string;
  lineNameTh: string;
  lineColor: string;
  fromStationId: string;
  toStationId: string;
  stations: string[]; // List of station IDs in this segment
  stationCount: number;
  estimatedMinutes: number;
}

export interface TransferInfo {
  stationId: string;
  fromLineId: string;
  toLineId: string;
  estimatedMinutes: number;
}

export interface RouteResult {
  id: string;
  name: string;
  isRecommended: boolean;
  stations: string[]; // All station IDs in order
  segments: RouteSegment[];
  transfers: TransferInfo[];
  totalStations: number;
  estimatedMinutes: number;
  totalDistanceKm?: number;
  fareThb?: number;
}

export interface JourneyState {
  currentStationIndex: number;
  currentStationId: string;
  isPlaying: boolean;
  speed: number; // 0.5, 1, 2, 4
  progress: number; // 0 to 1
  isTransferring: boolean;
  activeTransfer: TransferInfo | null;
  isCompleted: boolean;
}
