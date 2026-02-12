'use client';

import { useState } from 'react';
import { TOOTH_STATUS, ToothStatus } from '@/lib/platform-constants';
import { FDI_UPPER_RIGHT, FDI_UPPER_LEFT, FDI_LOWER_LEFT, FDI_LOWER_RIGHT } from '@/lib/dental-utils';
import { dentalChartData, ToothData } from '@/lib/mock-data/dental-chart';

interface DentalChartProps {
  onToothClick?: (tooth: number) => void;
  selectedTooth?: number | null;
  highlightTeeth?: number[];
  compact?: boolean;
}

function ToothShape({
  tooth,
  x,
  y,
  size,
  selected,
  highlighted,
  onClick,
}: {
  tooth: ToothData;
  x: number;
  y: number;
  size: number;
  selected: boolean;
  highlighted: boolean;
  onClick: () => void;
}) {
  const status = TOOTH_STATUS[tooth.status];
  const isMissing = tooth.status === 'missing';
  const fill = isMissing ? '#F3F4F6' : selected ? '#4A39C0' : highlighted ? '#FF3254' : status.color;
  const textColor = selected || highlighted ? '#fff' : isMissing ? '#ccc' : '#fff';

  return (
    <g onClick={onClick} className="cursor-pointer" role="button" tabIndex={0}>
      <rect
        x={x - size / 2}
        y={y - size / 2}
        width={size}
        height={size}
        rx={size * 0.2}
        fill={fill}
        opacity={isMissing ? 0.5 : 0.9}
        stroke={selected ? '#1A1A2E' : 'transparent'}
        strokeWidth={selected ? 2 : 0}
        className="transition-all duration-150"
      />
      {tooth.hasPathology && !selected && !highlighted && (
        <circle
          cx={x + size / 2 - 3}
          cy={y - size / 2 + 3}
          r={3}
          fill="#FF3254"
        />
      )}
      <text
        x={x}
        y={y + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={textColor}
        fontSize={size * 0.38}
        fontWeight={600}
        fontFamily="Inter, sans-serif"
      >
        {tooth.number}
      </text>
    </g>
  );
}

export default function DentalChart({ onToothClick, selectedTooth, highlightTeeth = [], compact = false }: DentalChartProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  const svgWidth = compact ? 400 : 560;
  const svgHeight = compact ? 100 : 140;
  const toothSize = compact ? 22 : 30;
  const gap = compact ? 2 : 4;
  const rowGap = compact ? 10 : 16;

  const renderRow = (teeth: number[], y: number, reverse: boolean) => {
    const totalWidth = teeth.length * (toothSize + gap) - gap;
    const startX = reverse
      ? svgWidth / 2 + gap + (toothSize + gap) * 0 // right side
      : svgWidth / 2 - gap - totalWidth; // left side

    return teeth.map((num, i) => {
      const data = dentalChartData[num];
      if (!data) return null;
      const x = reverse
        ? svgWidth / 2 + gap + i * (toothSize + gap) + toothSize / 2
        : svgWidth / 2 - gap - (teeth.length - 1 - i) * (toothSize + gap) - toothSize / 2;

      return (
        <ToothShape
          key={num}
          tooth={data}
          x={x}
          y={y}
          size={toothSize}
          selected={selectedTooth === num}
          highlighted={highlightTeeth.includes(num)}
          onClick={() => onToothClick?.(num)}
        />
      );
    });
  };

  const upperY = toothSize / 2 + 8;
  const lowerY = svgHeight - toothSize / 2 - 8;

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full"
        onMouseLeave={() => setHovered(null)}
      >
        {/* Center line */}
        <line
          x1={svgWidth / 2}
          y1={4}
          x2={svgWidth / 2}
          y2={svgHeight - 4}
          stroke="#E5E7EB"
          strokeWidth={1}
          strokeDasharray="4,4"
        />
        <line
          x1={16}
          y1={svgHeight / 2}
          x2={svgWidth - 16}
          y2={svgHeight / 2}
          stroke="#E5E7EB"
          strokeWidth={1}
          strokeDasharray="4,4"
        />

        {/* Quadrant labels */}
        {!compact && (
          <>
            <text x={svgWidth / 4} y={upperY - toothSize / 2 - 4} textAnchor="middle" fill="#9CA3AF" fontSize={10} fontFamily="Inter, sans-serif">Q1 (UR)</text>
            <text x={svgWidth * 3 / 4} y={upperY - toothSize / 2 - 4} textAnchor="middle" fill="#9CA3AF" fontSize={10} fontFamily="Inter, sans-serif">Q2 (UL)</text>
            <text x={svgWidth / 4} y={lowerY + toothSize / 2 + 12} textAnchor="middle" fill="#9CA3AF" fontSize={10} fontFamily="Inter, sans-serif">Q4 (LR)</text>
            <text x={svgWidth * 3 / 4} y={lowerY + toothSize / 2 + 12} textAnchor="middle" fill="#9CA3AF" fontSize={10} fontFamily="Inter, sans-serif">Q3 (LL)</text>
          </>
        )}

        {/* Upper arch */}
        {renderRow(FDI_UPPER_RIGHT, upperY, false)}
        {renderRow(FDI_UPPER_LEFT, upperY, true)}

        {/* Lower arch */}
        {renderRow(FDI_LOWER_RIGHT, lowerY, true)}
        {renderRow(FDI_LOWER_LEFT, lowerY, false)}
      </svg>

      {/* Legend */}
      {!compact && (
        <div className="flex flex-wrap gap-3 mt-3 justify-center">
          {Object.entries(TOOTH_STATUS).map(([key, { label, color }]) => (
            <div key={key} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: color }} />
              <span className="text-[10px] text-gray-500">{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
