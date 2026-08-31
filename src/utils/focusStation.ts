import { STATIONS } from '@/data/stations';

export interface StationFocusViewBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Calculates a comfortable viewBox to center and focus on a specific station
 * while keeping contextual surrounding stations in view (span approx 420-500px).
 */
export function calculateStationBounds(stationId: string): StationFocusViewBox | null {
  const st = STATIONS[stationId];
  if (!st) return null;

  const dimension = 460;
  return {
    x: st.x - dimension / 2,
    y: st.y - dimension / 2,
    w: dimension,
    h: dimension,
  };
}
