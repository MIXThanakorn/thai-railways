import { STATIONS } from '@/data/stations';

export interface RouteBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  centerX: number;
  centerY: number;
  viewBox: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

/**
 * Calculates optimal viewport bounding box and center coordinate for a given list of station IDs.
 * Adds a 15% - 25% padding margin to ensure Origin, Destination and Transfers are clearly visible.
 */
export function calculateRouteBounds(stationIds: string[]): RouteBounds | null {
  if (!stationIds || stationIds.length === 0) return null;

  const validStations = stationIds.map((id) => STATIONS[id]).filter(Boolean);
  if (validStations.length === 0) return null;

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  validStations.forEach((st) => {
    if (st.x < minX) minX = st.x;
    if (st.x > maxX) maxX = st.x;
    if (st.y < minY) minY = st.y;
    if (st.y > maxY) maxY = st.y;
  });

  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  const spanX = maxX - minX;
  const spanY = maxY - minY;
  const maxSpan = Math.max(spanX, spanY);

  // Minimum bounding box dimension with 20% margin
  const dimension = Math.max(maxSpan * 1.35 + 160, 480);

  return {
    minX,
    maxX,
    minY,
    maxY,
    centerX,
    centerY,
    viewBox: {
      x: centerX - dimension / 2,
      y: centerY - dimension / 2,
      w: dimension,
      h: dimension,
    },
  };
}
