import { STATIONS } from './stations';
import { RAILWAY_LINES } from './lines';
import { Station } from '@/types/railway';

export interface PresetRoute {
  originId: string;
  destId: string;
  labelEn: string;
  labelTh: string;
  highlight: string;
}

export const PRESET_ROUTES: PresetRoute[] = [
  {
    originId: 'siam',
    destId: 'phrom-phong',
    labelEn: 'Siam → Phrom Phong',
    labelTh: 'สยาม → พร้อมพงษ์',
    highlight: 'Direct BTS Sukhumvit'
  },
  {
    originId: 'don-mueang',
    destId: 'suvarnabhumi',
    labelEn: 'Don Mueang (DMK) → Suvarnabhumi (BKK)',
    labelTh: 'สนามบินดอนเมือง → สนามบินสุวรรณภูมิ',
    highlight: 'Airport to Airport link'
  },
  {
    originId: 'mo-chit',
    destId: 'si-lom',
    labelEn: 'Mo Chit → Si Lom',
    labelTh: 'หมอชิต → สีลม',
    highlight: 'BTS or MRT loop route'
  },
  {
    originId: 'khlong-bang-phai',
    destId: 'samrong',
    labelEn: 'Khlong Bang Phai → Samrong',
    labelTh: 'คลองบางไผ่ → สำโรง',
    highlight: 'Northwest to Southeast cross-city'
  },
  {
    originId: 'national-stadium',
    destId: 'charoen-nakhon',
    labelEn: 'National Stadium → ICONSIAM',
    labelTh: 'สนามกีฬาแห่งชาติ → ไอคอนสยาม',
    highlight: 'BTS Silom + Gold Line'
  }
];

export function searchStations(query: string): Station[] {
  if (!query || query.trim() === '') {
    return Object.values(STATIONS).slice(0, 10);
  }
  const clean = query.trim().toLowerCase();

  return Object.values(STATIONS).filter((st) => {
    return (
      st.nameEn.toLowerCase().includes(clean) ||
      st.nameTh.toLowerCase().includes(clean) ||
      (st.code && st.code.toLowerCase().includes(clean)) ||
      st.lines.some((l) => {
        const line = RAILWAY_LINES[l];
        return (
          line &&
          (line.name.toLowerCase().includes(clean) ||
            line.nameTh.toLowerCase().includes(clean) ||
            line.operator.toLowerCase().includes(clean))
        );
      })
    );
  });
}
