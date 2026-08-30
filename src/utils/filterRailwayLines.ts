import { SystemFilter } from '@/types/railway';
import { RAILWAY_LINES } from '@/data/lines';

export const SYSTEM_CATEGORIES: Record<SystemFilter, { labelEn: string; labelTh: string; lineIds: string[] }> = {
  all: {
    labelEn: 'All Lines',
    labelTh: 'ทุกสาย',
    lineIds: Object.keys(RAILWAY_LINES),
  },
  bts: {
    labelEn: 'BTS',
    labelTh: 'บีทีเอส',
    lineIds: ['bts-sukhumvit', 'bts-silom', 'bts-gold'],
  },
  mrt: {
    labelEn: 'MRT',
    labelTh: 'เอ็มอาร์ที',
    lineIds: ['mrt-blue', 'mrt-purple', 'mrt-yellow', 'mrt-pink'],
  },
  arl: {
    labelEn: 'ARL',
    labelTh: 'แอร์พอร์ตลิงก์',
    lineIds: ['arl'],
  },
  srt: {
    labelEn: 'SRT Red',
    labelTh: 'สายสีแดง',
    lineIds: ['srt-dark-red', 'srt-light-red'],
  },
};

/**
 * Checks if a railway line is active under the current system filter.
 */
export function isLineInFilter(lineId: string, filter: SystemFilter): boolean {
  if (filter === 'all') return true;
  const category = SYSTEM_CATEGORIES[filter];
  return category ? category.lineIds.includes(lineId) : true;
}

/**
 * Checks if a station has any line matching the current system filter.
 */
export function isStationInFilter(stationLines: string[], filter: SystemFilter): boolean {
  if (filter === 'all') return true;
  const category = SYSTEM_CATEGORIES[filter];
  if (!category) return true;
  return stationLines.some((l) => category.lineIds.includes(l));
}
