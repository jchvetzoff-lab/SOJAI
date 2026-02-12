'use client';

interface FilterOption {
  key: string;
  label: string;
  count?: number;
  color?: string;
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
        return (
          <button
            key={opt.key}
            onClick={() => toggle(opt.key)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
              active
                ? 'border-[#4A39C0] bg-[#E4E1FF] text-[#4A39C0]'
                : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
            }`}
          >
            {opt.color && (
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: opt.color }} />
            )}
            {opt.label}
            {opt.count !== undefined && (
              <span className={`text-[10px] ${active ? 'text-[#4A39C0]/70' : 'text-gray-400'}`}>
                {opt.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
