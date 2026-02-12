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
    <div className={`flex items-center gap-1 bg-white rounded-xl border border-gray-100 p-1 shadow-sm ${className}`}>
      {tools.map((tool, i) => (
        <button
          key={i}
          onClick={tool.onClick}
          title={tool.label}
          className={`p-2 rounded-lg transition-colors ${
            tool.active
              ? 'bg-[#4A39C0] text-white'
              : 'text-gray-500 hover:bg-gray-100 hover:text-[#1A1A2E]'
          }`}
        >
          {tool.icon}
        </button>
      ))}
    </div>
  );
}
