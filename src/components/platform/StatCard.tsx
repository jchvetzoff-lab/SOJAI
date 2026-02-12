'use client';

import { useEffect, useRef, useState } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  variant?: 'light' | 'dark';
  iconBg?: string;
}

function useCountUp(target: number, duration = 800) {
  const [count, setCount] = useState(0);
  const ref = useRef<number>(0);

  useEffect(() => {
    if (target === 0) { setCount(0); return; }
    const start = ref.current;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.round(start + (target - start) * eased);
      setCount(current);
      if (progress < 1) requestAnimationFrame(animate);
      else ref.current = target;
    };
    requestAnimationFrame(animate);
  }, [target, duration]);

  return count;
}

export default function StatCard({ title, value, change, changeType = 'neutral', icon, iconBg }: StatCardProps) {
  const numericValue = typeof value === 'string' ? parseInt(value.replace(/[^0-9]/g, ''), 10) : value;
  const isNumeric = !isNaN(numericValue) && numericValue > 0;
  const animatedValue = useCountUp(isNumeric ? numericValue : 0);

  const formatValue = () => {
    if (!isNumeric) return value;
    const str = typeof value === 'string' ? value : String(value);
    if (str.includes(',')) return animatedValue.toLocaleString();
    return String(animatedValue);
  };

  return (
    <div className="bg-[#141416] rounded-lg p-4 border border-white/[0.06] hover:border-white/[0.1] transition-all duration-200 group">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-8 h-8 rounded-md flex items-center justify-center ${iconBg || 'bg-[#5B5BD6]/15 text-[#5B5BD6]'}`}>
          {icon}
        </div>
        {change && (
          <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded ${
            changeType === 'positive' ? 'text-[#30A46C] bg-[#30A46C]/10' :
            changeType === 'negative' ? 'text-[#E5484D] bg-[#E5484D]/10' :
            'text-[#5C5C5F] bg-white/[0.04]'
          }`}>{change}</span>
        )}
      </div>
      <div className="text-2xl font-semibold text-[#EDEDEF] tracking-tight tabular-nums">{formatValue()}</div>
      <div className="text-[12px] text-[#5C5C5F] mt-0.5">{title}</div>
    </div>
  );
}
