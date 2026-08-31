import { TransferInfo } from '@/types/railway';
import { STATIONS } from '@/data/stations';
import { RAILWAY_LINES } from '@/data/lines';

export interface FormattedTransferInstruction {
  stationNameTh: string;
  stationNameEn: string;
  fromLineNameTh: string;
  toLineNameTh: string;
  fromLineColor: string;
  toLineColor: string;
  instructionTh: string;
  instructionEn: string;
}

export function formatTransferInstruction(transfer: TransferInfo): FormattedTransferInstruction {
  const station = STATIONS[transfer.stationId];
  const fromLine = RAILWAY_LINES[transfer.fromLineId];
  const toLine = RAILWAY_LINES[transfer.toLineId];

  const stTh = station ? station.nameTh : transfer.stationId;
  const stEn = station ? station.nameEn : transfer.stationId;
  const fromTh = fromLine ? fromLine.nameTh : transfer.fromLineId;
  const toTh = toLine ? toLine.nameTh : transfer.toLineId;
  const fromEn = fromLine ? fromLine.name : transfer.fromLineId;
  const toEn = toLine ? toLine.name : transfer.toLineId;

  return {
    stationNameTh: stTh,
    stationNameEn: stEn,
    fromLineNameTh: fromTh,
    toLineNameTh: toTh,
    fromLineColor: fromLine?.color || '#64748B',
    toLineColor: toLine?.color || '#3155D9',
    instructionTh: `เปลี่ยนขบวนที่สถานี ${stTh}: ลงจาก ${fromTh} → ไปยัง ${toTh}`,
    instructionEn: `Change trains at ${stEn}: Alight from ${fromEn} → Transfer to ${toEn}`,
  };
}
