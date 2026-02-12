'use client';

interface ConfidenceBarProps {
  value: number;
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md';
}

export default function ConfidenceBar({ value, label, showValue = true, size = 'md' }: ConfidenceBarProps) {
  const barColor = value >= 90 ? '#30A46C' : value >= 75 ? '#E5A836' : '#E5484D';
  const height = size === 'sm' ? 'h-1' : 'h-1.5';

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-1">
          {label && <span className="text-[11px] text-[#5C5C5F]">{label}</span>}
          {showValue && <span className="text-[11px] font-medium" style={{ color: barColor }}>{value}%</span>}
        </div>
      )}
      <div className={`w-full bg-white/[0.06] rounded-full ${height}`}>
        <div className={`${height} rounded-full transition-all duration-500`} style={{ width: `${value}%`, backgroundColor: barColor }} />
      </div>
    </div>
  );
}
