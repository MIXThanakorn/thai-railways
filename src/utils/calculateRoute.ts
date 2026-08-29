import { STATIONS } from '@/data/stations';
import { RAILWAY_LINES } from '@/data/lines';
import { RouteResult, RouteSegment, TransferInfo } from '@/types/railway';
import { estimateTravelTime, estimateFare } from './calculateTravelTime';

interface GraphEdge {
  fromNode: string;
  toNode: string;
  lineId: string;
  weight: number; // in seconds/cost
}

// Known physical walk interchange pairs between stations that may have separate station IDs
const INTERCHANGE_PAIRS: [string, string][] = [
  ['mo-chit', 'chatuchak-park'],
  ['ha-yaek-lat-phrao', 'phahon-yothin-mrt'],
  ['asok', 'sukhumvit'],
  ['sala-daeng', 'si-lom'],
  ['bang-wa', 'bang-wa-mrt'],
  ['bang-sue', 'krung-thep-aphiwat'],
  ['makkasan', 'phetchaburi'],
  ['hua-mak-arl', 'hua-mak-yellow'],
];

class TransitGraph {
  private adjacency: Map<string, GraphEdge[]> = new Map();

  constructor() {
    this.buildGraph();
  }

  private addEdge(from: string, to: string, lineId: string, weight: number) {
    if (!this.adjacency.has(from)) {
      this.adjacency.set(from, []);
    }
    this.adjacency.get(from)!.push({ fromNode: from, toNode: to, lineId, weight });
  }

  private buildGraph() {
    // 1. Add sequential line edges
    Object.values(RAILWAY_LINES).forEach((line) => {
      for (let i = 0; i < line.stations.length - 1; i++) {
        const u = line.stations[i];
        const v = line.stations[i + 1];
        if (STATIONS[u] && STATIONS[v]) {
          // Standard station-to-station weight = 2.5 minutes (150 sec)
          this.addEdge(u, v, line.id, 150);
          this.addEdge(v, u, line.id, 150);
        }
      }
    });

    // 2. Add interchange links between stations with different IDs
    INTERCHANGE_PAIRS.forEach(([st1, st2]) => {
      if (STATIONS[st1] && STATIONS[st2]) {
        // Transfer walk weight = 5 minutes (300 sec)
        this.addEdge(st1, st2, 'transfer-walk', 300);
        this.addEdge(st2, st1, 'transfer-walk', 300);
      }
    });
  }

  public findRoutes(originId: string, destId: string): RouteResult[] {
    if (!STATIONS[originId] || !STATIONS[destId]) return [];
    if (originId === destId) return [];

    // Canonicalize if user selected interchange partner
    const startStations = [originId];
    const targetStations = [destId];

    // Find paths using modified Dijkstra with transfer penalty
    const routes: RouteResult[] = [];

    // Path 1: Optimal (balanced fewest transfers & time)
    const bestPath = this.dijkstra(originId, destId, 360); // 6 min transfer penalty
    if (bestPath && bestPath.length > 0) {
      routes.push(this.formatRoute('recommended', 'Recommended Route', true, bestPath));
    }

    // Path 2: Alternative (e.g., shortest station count or different line choice)
    const minDistancePath = this.dijkstra(originId, destId, 60, bestPath); // low transfer penalty, avoid identical
    if (minDistancePath && minDistancePath.length > 0 && !this.arePathsEqual(bestPath, minDistancePath)) {
      routes.push(this.formatRoute('alternative', 'Alternative Route', false, minDistancePath));
    }

    return routes;
  }

  private dijkstra(
    start: string,
    target: string,
    transferPenaltySec: number,
    excludePath?: string[] | null
  ): string[] | null {
    // State: { node, currentLineId }
    interface PriorityItem {
      node: string;
      lineId: string;
      cost: number;
      path: string[];
    }

    const distances = new Map<string, number>();
    const queue: PriorityItem[] = [{ node: start, lineId: 'start', cost: 0, path: [start] }];
    distances.set(`${start}|start`, 0);

    // Track excluded edges if trying to find alternative
    const excludedEdges = new Set<string>();
    if (excludePath && excludePath.length > 3) {
      // Exclude a middle edge of the best path to force detour
      const mid = Math.floor(excludePath.length / 2);
      excludedEdges.add(`${excludePath[mid - 1]}->${excludePath[mid]}`);
      excludedEdges.add(`${excludePath[mid]}->${excludePath[mid - 1]}`);
    }

    while (queue.length > 0) {
      // Sort priority queue
      queue.sort((a, b) => a.cost - b.cost);
      const current = queue.shift()!;

      if (current.node === target) {
        return current.path;
      }

      const currentKey = `${current.node}|${current.lineId}`;
      if (current.cost > (distances.get(currentKey) ?? Infinity)) {
        continue;
      }

      const neighbors = this.adjacency.get(current.node) || [];
      for (const edge of neighbors) {
        if (excludedEdges.has(`${current.node}->${edge.toNode}`)) {
          continue;
        }

        // Calculate transfer penalty if switching lines
        let addCost = edge.weight;
        if (current.lineId !== 'start' && current.lineId !== edge.lineId && edge.lineId !== 'transfer-walk') {
          addCost += transferPenaltySec;
        }

        const newCost = current.cost + addCost;
        const neighborKey = `${edge.toNode}|${edge.lineId}`;

        if (newCost < (distances.get(neighborKey) ?? Infinity)) {
          distances.set(neighborKey, newCost);
          queue.push({
            node: edge.toNode,
            lineId: edge.lineId,
            cost: newCost,
            path: [...current.path, edge.toNode]
          });
        }
      }
    }

    return null;
  }

  private arePathsEqual(path1: string[] | null, path2: string[] | null): boolean {
    if (!path1 || !path2) return false;
    if (path1.length !== path2.length) return false;
    return path1.every((val, idx) => val === path2[idx]);
  }

  private formatRoute(id: string, name: string, isRecommended: boolean, stationIds: string[]): RouteResult {
    const segments: RouteSegment[] = [];
    const transfers: TransferInfo[] = [];

    // Identify which line each hop belongs to
    interface Hop {
      from: string;
      to: string;
      lineId: string;
    }

    const hops: Hop[] = [];
    for (let i = 0; i < stationIds.length - 1; i++) {
      const u = stationIds[i];
      const v = stationIds[i + 1];

      // Find edge between u and v
      const edges = this.adjacency.get(u) || [];
      const matchingEdge = edges.find((e) => e.toNode === v);
      let lineId = matchingEdge ? matchingEdge.lineId : 'unknown';

      // If lineId is transfer-walk, keep it as transfer-walk
      hops.push({ from: u, to: v, lineId });
    }

    // Group contiguous hops by line
    let currentSegmentStations: string[] = [stationIds[0]];
    let currentLineId: string | null = null;

    hops.forEach((hop, idx) => {
      let activeLine = hop.lineId;
      if (activeLine === 'transfer-walk') {
        // If it's a walk transfer, finish previous segment if exists
        if (currentLineId && currentSegmentStations.length > 1) {
          const line = RAILWAY_LINES[currentLineId];
          segments.push({
            lineId: currentLineId,
            lineName: line ? line.name : currentLineId,
            lineNameTh: line ? line.nameTh : currentLineId,
            lineColor: line ? line.color : '#64748B',
            fromStationId: currentSegmentStations[0],
            toStationId: currentSegmentStations[currentSegmentStations.length - 1],
            stations: [...currentSegmentStations],
            stationCount: currentSegmentStations.length,
            estimatedMinutes: Math.round((currentSegmentStations.length - 1) * 2.5)
          });
        }
        currentSegmentStations = [hop.to];
        currentLineId = null;
        return;
      }

      if (!currentLineId) {
        currentLineId = activeLine;
        currentSegmentStations = [hop.from, hop.to];
      } else if (currentLineId === activeLine) {
        currentSegmentStations.push(hop.to);
      } else {
        // Line changed!
        const line = RAILWAY_LINES[currentLineId];
        segments.push({
          lineId: currentLineId,
          lineName: line ? line.name : currentLineId,
          lineNameTh: line ? line.nameTh : currentLineId,
          lineColor: line ? line.color : '#64748B',
          fromStationId: currentSegmentStations[0],
          toStationId: currentSegmentStations[currentSegmentStations.length - 1],
          stations: [...currentSegmentStations],
          stationCount: currentSegmentStations.length,
          estimatedMinutes: Math.round((currentSegmentStations.length - 1) * 2.5)
        });

        transfers.push({
          stationId: hop.from,
          fromLineId: currentLineId,
          toLineId: activeLine,
          estimatedMinutes: 5
        });

        currentLineId = activeLine;
        currentSegmentStations = [hop.from, hop.to];
      }
    });

    if (currentLineId && currentSegmentStations.length > 0) {
      const line = RAILWAY_LINES[currentLineId];
      segments.push({
        lineId: currentLineId,
        lineName: line ? line.name : currentLineId,
        lineNameTh: line ? line.nameTh : currentLineId,
        lineColor: line ? line.color : '#64748B',
        fromStationId: currentSegmentStations[0],
        toStationId: currentSegmentStations[currentSegmentStations.length - 1],
        stations: [...currentSegmentStations],
        stationCount: currentSegmentStations.length,
        estimatedMinutes: Math.round((currentSegmentStations.length - 1) * 2.5)
      });
    }

    // Determine unique lines used
    const linesUsed = Array.from(new Set(segments.map((s) => s.lineId)));
    const totalMinutes = estimateTravelTime(stationIds.length, transfers.length);
    const fare = estimateFare(stationIds.length, linesUsed);

    return {
      id,
      name,
      isRecommended,
      stations: stationIds,
      segments,
      transfers,
      totalStations: stationIds.length,
      estimatedMinutes: totalMinutes,
      fareThb: fare
    };
  }
}

export const transitGraph = new TransitGraph();

export function calculateRoute(originId: string, destinationId: string): RouteResult[] {
  return transitGraph.findRoutes(originId, destinationId);
}
