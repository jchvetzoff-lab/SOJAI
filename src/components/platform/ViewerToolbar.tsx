'use client';

interface ToolbarItem {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

interface ViewerToolbarProps {
  tools: ToolbarItem[];
  className?: string;
}

export default function ViewerToolbar({ tools, className = '' }: ViewerToolbarProps) {
  return (
    <div className={`flex items-center gap-0.5 bg-[#141416] rounded-md border border-white/[0.06] p-0.5 ${className}`}>
      {tools.map((tool, i) => (
        <button
          key={i}
          onClick={tool.onClick}
          title={tool.label}
          className={`p-1.5 rounded transition-colors ${
            tool.active
              ? 'bg-[#5B5BD6] text-white'
              : 'text-[#5C5C5F] hover:bg-white/[0.06] hover:text-[#EDEDEF]'
          }`}
        >
          {tool.icon}
        </button>
      ))}
    </div>
  );
}
