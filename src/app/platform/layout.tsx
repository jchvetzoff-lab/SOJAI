import Sidebar from '@/components/platform/Sidebar';
import PlatformHeader from '@/components/platform/PlatformHeader';

export const metadata = {
  title: 'SOJAI Platform',
  description: 'AI-Powered Dental Diagnostics Platform',
};

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <PlatformHeader />
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
