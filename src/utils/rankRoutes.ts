import { RouteResult, RoutePreference } from '@/types/railway';

/**
 * Pure client-side ranking of candidate routes according to user preference.
 * Does not mutate input routes or network graphs.
 */
export function rankRoutes(
  routes: RouteResult[],
  preference: RoutePreference = 'fastest'
): RouteResult[] {
  if (!routes || routes.length <= 1) return routes;

  const sorted = [...routes].sort((a, b) => {
    const aTransfers = a.transfers.length;
    const bTransfers = b.transfers.length;
    const aStations = a.totalStations;
    const bStations = b.totalStations;
    const aMinutes = a.estimatedMinutes;
    const bMinutes = b.estimatedMinutes;

    if (preference === 'fastest') {
      // 1. Time -> 2. Transfers -> 3. Station count
      if (aMinutes !== bMinutes) return aMinutes - bMinutes;
      if (aTransfers !== bTransfers) return aTransfers - bTransfers;
      return aStations - bStations;
    } else if (preference === 'fewest-transfers') {
      // 1. Transfers -> 2. Time -> 3. Station count
      if (aTransfers !== bTransfers) return aTransfers - bTransfers;
      if (aMinutes !== bMinutes) return aMinutes - bMinutes;
      return aStations - bStations;
    } else {
      // Fewest Stations: 1. Station count -> 2. Transfers -> 3. Time
      if (aStations !== bStations) return aStations - bStations;
      if (aTransfers !== bTransfers) return aTransfers - bTransfers;
      return aMinutes - bMinutes;
    }
  });

  // Update tag and recommendation indicator on sorted list
  return sorted.map((route, idx) => ({
    ...route,
    isRecommended: idx === 0,
    tag:
      idx === 0
        ? preference === 'fastest'
          ? '⚡ FASTEST'
          : preference === 'fewest-transfers'
          ? '🔄 FEWEST TRANSFERS'
          : '🚉 FEWEST STATIONS'
        : `ALTERNATIVE #${idx + 1}`,
  }));
}
