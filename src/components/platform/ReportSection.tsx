'use client';

interface ReportSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function ReportSection({ title, children, className = '' }: ReportSectionProps) {
  return (
    <div className={`mb-6 ${className}`}>
      <h3 className="text-sm font-bold text-[#1A1A2E] uppercase tracking-wider mb-3 pb-2 border-b border-gray-200">
        {title}
      </h3>
      {children}
    </div>
  );
}
