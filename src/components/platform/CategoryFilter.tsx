'use client';

interface FilterOption {
  key: string;
  label: string;
  count?: number;
  color?: string;
  solidBg?: string;
  textOnSolid?: string;
  bg?: string;
}

interface CategoryFilterProps {
  options: FilterOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export default function CategoryFilter({ options, selected, onChange }: CategoryFilterProps) {
  const toggle = (key: string) => {
    onChange(
      selected.includes(key) ? selected.filter((k) => k !== key) : [...selected, key]
    );
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = selected.includes(opt.key);
        const solidBg = opt.solidBg || opt.color || '#4A39C0';
        const subtleBg = opt.bg || `${solidBg}15`;

        return (
          <button
            key={opt.key}
            onClick={() => toggle(opt.key)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all"
            style={
              active
                ? { backgroundColor: solidBg, color: '#FFFFFF' }
                : { backgroundColor: subtleBg, color: solidBg }
            }
          >
            {opt.label}
            {opt.count !== undefined && (
              <span
                className="text-xs ml-0.5"
                style={{ opacity: active ? 0.8 : 0.6 }}
              >
                {opt.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
