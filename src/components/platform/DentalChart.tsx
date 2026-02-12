'use client';

import { useState } from 'react';
import { TOOTH_STATUS, ToothStatus } from '@/lib/platform-constants';
import { FDI_UPPER_RIGHT, FDI_UPPER_LEFT, FDI_LOWER_LEFT, FDI_LOWER_RIGHT } from '@/lib/dental-utils';
import { dentalChartData, ToothData } from '@/lib/mock-data/dental-chart';
import { getToothSvg } from '@/lib/tooth-svg-paths';

interface DentalChartProps {
  onToothClick?: (tooth: number) => void;
  selectedTooth?: number | null;
  highlightTeeth?: number[];
  compact?: boolean;
  chartData?: Record<number, ToothData>;
}

function ToothShape({
  tooth,
  x,
  y,
  size,
  selected,
  highlighted,
  onClick,
  isUpper,
}: {
  tooth: ToothData;
  x: number;
  y: number;
  size: number;
  selected: boolean;
  highlighted: boolean;
  onClick: () => void;
  isUpper: boolean;
}) {
  const status = TOOTH_STATUS[tooth.status];
  const isMissing = tooth.status === 'missing';

  const fill = isMissing
    ? '#1C1C1F'
    : selected
    ? '#5B5BD6'
    : highlighted
    ? '#E5484D'
    : status.color;

  const strokeColor = selected ? '#0A0A0B' : highlighted ? '#E5484D' : 'transparent';

  const svg = getToothSvg(tooth.number);
  const scaleX = size / svg.width;
  const scaleY = (size * 1.3) / svg.height;

  // Number position: below for upper teeth, above for lower teeth
  const numberY = isUpper ? y + size * 0.75 : y - size * 0.6;

  return (
    <g onClick={onClick} className="cursor-pointer" role="button" tabIndex={0}>
      <g transform={`translate(${x - size / 2}, ${y - size * 0.65}) scale(${scaleX}, ${scaleY})`}>
        <path
          d={svg.path}
          fill={fill}
          opacity={isMissing ? 0.4 : 0.85}
          stroke={strokeColor}
          strokeWidth={selected ? 2 / scaleX : 0}
          className="transition-all duration-150"
        />
        {/* Missing X overlay */}
        {isMissing && (
          <>
            <line x1="6" y1="6" x2="18" y2="26" stroke="#9CA3AF" strokeWidth={2} opacity={0.6} />
            <line x1="18" y1="6" x2="6" y2="26" stroke="#9CA3AF" strokeWidth={2} opacity={0.6} />
          </>
        )}
      </g>
      {/* Red pathology dot */}
      {tooth.hasPathology && !selected && !highlighted && (
        <circle
          cx={x + size / 2 - 2}
          cy={isUpper ? y - size * 0.55 : y - size * 0.55}
          r={3}
          fill="#EF4444"
        />
      )}
      {/* Tooth number below the shape */}
      <text
        x={x}
        y={numberY}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={selected ? '#3B82F6' : highlighted ? '#EF4444' : '#5C5C5F'}
        fontSize={size * 0.36}
        fontWeight={selected || highlighted ? 700 : 500}
        fontFamily="Inter, sans-serif"
      >
        {tooth.number}
      </text>
    </g>
  );
}

export default function DentalChart({ onToothClick, selectedTooth, highlightTeeth = [], compact = false, chartData }: DentalChartProps) {
  const data = chartData || dentalChartData;
  const [hovered, setHovered] = useState<number | null>(null);

  const svgWidth = compact ? 420 : 580;
  const svgHeight = compact ? 130 : 180;
  const toothSize = compact ? 20 : 26;
  const gap = compact ? 2 : 3;

  const renderRow = (teeth: number[], y: number, reverse: boolean, isUpper: boolean) => {
    return teeth.map((num, i) => {
      const toothInfo = data[num];
      if (!toothInfo) return null;
      const x = reverse
        ? svgWidth / 2 + gap + i * (toothSize + gap) + toothSize / 2
        : svgWidth / 2 - gap - (teeth.length - 1 - i) * (toothSize + gap) - toothSize / 2;

      return (
        <ToothShape
          key={num}
          tooth={toothInfo}
          x={x}
          y={y}
          size={toothSize}
          selected={selectedTooth === num}
          highlighted={highlightTeeth.includes(num)}
          onClick={() => onToothClick?.(num)}
          isUpper={isUpper}
        />
      );
    });
  };

  const upperY = toothSize * 0.8 + 14;
  const lowerY = svgHeight - toothSize * 0.8 - 14;

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
          y1={8}
          x2={svgWidth / 2}
          y2={svgHeight - 8}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={1}
          strokeDasharray="4,4"
        />
        <line
          x1={20}
          y1={svgHeight / 2}
          x2={svgWidth - 20}
          y2={svgHeight / 2}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={1}
          strokeDasharray="4,4"
        />

        {/* Quadrant labels */}
        {!compact && (
          <>
            <text x={svgWidth / 4} y={10} textAnchor="middle" fill="#5C5C5F" fontSize={9} fontFamily="Inter, sans-serif">Upper Right</text>
            <text x={svgWidth * 3 / 4} y={10} textAnchor="middle" fill="#5C5C5F" fontSize={9} fontFamily="Inter, sans-serif">Upper Left</text>
            <text x={svgWidth / 4} y={svgHeight - 4} textAnchor="middle" fill="#5C5C5F" fontSize={9} fontFamily="Inter, sans-serif">Lower Right</text>
            <text x={svgWidth * 3 / 4} y={svgHeight - 4} textAnchor="middle" fill="#5C5C5F" fontSize={9} fontFamily="Inter, sans-serif">Lower Left</text>
          </>
        )}

        {/* Upper arch */}
        {renderRow(FDI_UPPER_RIGHT, upperY, false, true)}
        {renderRow(FDI_UPPER_LEFT, upperY, true, true)}

        {/* Lower arch */}
        {renderRow(FDI_LOWER_RIGHT, lowerY, true, false)}
        {renderRow(FDI_LOWER_LEFT, lowerY, false, false)}
      </svg>

      {/* Legend */}
      {!compact && (
        <div className="flex flex-wrap gap-4 mt-4 justify-center">
          {Object.entries(TOOTH_STATUS).map(([key, { label, color }]) => {
            const isMissing = key === 'missing';
            return (
              <div key={key} className="flex items-center gap-1.5">
                <svg width="12" height="16" viewBox="0 0 24 32">
                  <path
                    d="M8 28 C8 28 6 18 7 10 C7.5 6 9 3 12 2 C15 3 16.5 6 17 10 C18 18 16 28 16 28 C14 30 10 30 8 28Z"
                    fill={color}
                    opacity={isMissing ? 0.4 : 0.85}
                  />
                  {isMissing && (
                    <>
                      <line x1="6" y1="6" x2="18" y2="26" stroke="#9CA3AF" strokeWidth={2} opacity={0.6} />
                      <line x1="18" y1="6" x2="6" y2="26" stroke="#9CA3AF" strokeWidth={2} opacity={0.6} />
                    </>
                  )}
                </svg>
                <span className="text-xs text-[#5C5C5F]">{label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
