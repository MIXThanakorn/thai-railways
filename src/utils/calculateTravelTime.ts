export const MINUTES_PER_STATION = 2.5;
export const MINUTES_PER_TRANSFER = 5.0;

export function estimateTravelTime(stationCount: number, transferCount: number): number {
  if (stationCount <= 1) return 0;
  const transitTime = (stationCount - 1) * MINUTES_PER_STATION;
  const transferTime = transferCount * MINUTES_PER_TRANSFER;
  return Math.round(transitTime + transferTime);
}

export function estimateFare(stationCount: number, linesUsed: string[]): number {
  if (stationCount <= 1) return 0;
  // Approximation of Bangkok Mass Transit joint fares:
  // Base fare approx 17-20 THB + ~2-4 THB per station, max ~60 per network
  let baseFare = 17;
  let perStation = 2.5;
  let total = baseFare + (stationCount - 1) * perStation;
  // Extra surcharge if multiple operators
  if (linesUsed.length > 1) {
    total += (linesUsed.length - 1) * 15;
  }
  return Math.min(Math.round(total), 110);
}
