'use client';

import React from 'react';
import { Station } from '@/types/railway';

interface TrainMarkerProps {
  currentStation: Station;
  nextStation: Station | null;
  progress: number; // 0 to 1
  lineColor: string;
}

export const TrainMarker: React.FC<TrainMarkerProps> = ({
  currentStation,
  nextStation,
  progress,
  lineColor,
}) => {
  // If no next station, train is at current station
  let x = currentStation.x;
  let y = currentStation.y;
  let angle = 0;

  if (nextStation) {
    x = currentStation.x + (nextStation.x - currentStation.x) * progress;
    y = currentStation.y + (nextStation.y - currentStation.y) * progress;
    const dx = nextStation.x - currentStation.x;
    const dy = nextStation.y - currentStation.y;
    angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  }

  return (
    <g transform={`translate(${x}, ${y})`} className="pointer-events-none z-30">
      {/* Outer Pulse Glow */}
      <circle
        r="22"
        fill={lineColor}
        opacity="0.25"
        className="animate-ping"
        style={{ transformOrigin: '0 0' }}
      />

      {/* Halo Background */}
      <circle r="16" fill="#FFFFFF" stroke={lineColor} strokeWidth="3" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.25))' }} />

      {/* Train Direction Oriented Group */}
      <g transform={`rotate(${angle})`}>
        {/* Train Body */}
        <rect
          x="-10"
          y="-6"
          width="20"
          height="12"
          rx="4"
          fill={lineColor}
          stroke="#FFFFFF"
          strokeWidth="1.5"
        />
        {/* Headlight */}
        <circle cx="8" cy="-2.5" r="1.5" fill="#FEF08A" />
        <circle cx="8" cy="2.5" r="1.5" fill="#FEF08A" />
        {/* Windows */}
        <rect x="-4" y="-3.5" width="4" height="7" rx="1" fill="#FFFFFF" opacity="0.9" />
        <rect x="-8" y="-3.5" width="3" height="7" rx="1" fill="#FFFFFF" opacity="0.7" />
      </g>

      {/* Live Status Tag */}
      <g transform="translate(0, -22)">
        <rect
          x="-24"
          y="-12"
          width="48"
          height="14"
          rx="4"
          fill="#0F172A"
          opacity="0.9"
        />
        <text
          x="0"
          y="-2"
          fill="#FFFFFF"
          fontSize="9"
          fontWeight="bold"
          textAnchor="middle"
          fontFamily="sans-serif"
        >
          🚆 TRAIN
        </text>
      </g>
    </g>
  );
};
