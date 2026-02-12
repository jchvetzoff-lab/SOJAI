'use client';

import { PATHOLOGY_CATEGORIES, PathologyCategory } from '@/lib/platform-constants';

interface PathologyBadgeProps {
  category: PathologyCategory;
  size?: 'sm' | 'md';
}

export default function PathologyBadge({ category, size = 'sm' }: PathologyBadgeProps) {
  const cat = PATHOLOGY_CATEGORIES[category];
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${sizeClasses}`}
      style={{ backgroundColor: cat.bg, color: cat.color }}
    >
      {cat.label}
    </span>
  );
}
