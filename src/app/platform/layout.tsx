import Sidebar from '@/components/platform/Sidebar';
import PlatformHeader from '@/components/platform/PlatformHeader';
import DemoBannerWrapper from './DemoBannerWrapper';

export const metadata = {
  title: 'SOJAI Platform',
  description: 'AI-Powered Dental Diagnostics Platform',
};

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0A0A0B]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <PlatformHeader />
        <main className="flex-1 px-6 py-5 lg:px-8 lg:py-6 overflow-y-auto">
          <DemoBannerWrapper />
          {children}
        </main>
      </div>
    </div>
  );
}
