'use client';

interface ConfidenceBarProps {
  value: number; // 0-100
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md';
}

export default function ConfidenceBar({ value, label, showValue = true, size = 'md' }: ConfidenceBarProps) {
  const barColor = value >= 90 ? '#10B981' : value >= 75 ? '#F59E0B' : '#FF3254';
  const height = size === 'sm' ? 'h-1.5' : 'h-2';

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-1">
          {label && <span className="text-xs text-[#64748B]">{label}</span>}
          {showValue && <span className="text-xs font-semibold" style={{ color: barColor }}>{value}%</span>}
        </div>
      )}
      <div className={`w-full bg-white/[0.06] rounded-full ${height}`}>
        <div
          className={`${height} rounded-full transition-all duration-500`}
          style={{ width: `${value}%`, backgroundColor: barColor }}
        />
      </div>
    </div>
  );
}
