'use client';

import { PATHOLOGY_CATEGORIES, PathologyCategory } from '@/lib/platform-constants';

interface PathologyBadgeProps {
  category: PathologyCategory;
  size?: 'sm' | 'md';
  variant?: 'subtle' | 'solid';
}

export default function PathologyBadge({ category, size = 'sm', variant = 'subtle' }: PathologyBadgeProps) {
  const cat = PATHOLOGY_CATEGORIES[category];
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';

  const isSolid = variant === 'solid';

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${sizeClasses}`}
      style={{
        backgroundColor: isSolid ? cat.solidBg : cat.bg,
        color: isSolid ? cat.textOnSolid : cat.color,
      }}
    >
      {cat.label}
    </span>
  );
}
