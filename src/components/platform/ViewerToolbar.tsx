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
    <div className={`flex items-center gap-1 bg-[#111C32] rounded-xl border border-white/[0.06] p-1 ${className}`}>
      {tools.map((tool, i) => (
        <button
          key={i}
          onClick={tool.onClick}
          title={tool.label}
          className={`p-2 rounded-lg transition-colors ${
            tool.active
              ? 'bg-[#3B82F6] text-white'
              : 'text-[#64748B] hover:bg-white/[0.06] hover:text-[#E2E8F0]'
          }`}
        >
          {tool.icon}
        </button>
      ))}
    </div>
  );
}
