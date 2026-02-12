import Sidebar from '@/components/platform/Sidebar';
import PlatformHeader from '@/components/platform/PlatformHeader';
import DemoBannerWrapper from './DemoBannerWrapper';

export const metadata = {
  title: 'SOJAI Platform',
  description: 'AI-Powered Dental Diagnostics Platform',
};

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F5F4FA]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <PlatformHeader />
        <main className="flex-1 p-8 lg:p-10 xl:p-12 overflow-y-auto">
          <DemoBannerWrapper />
          {children}
        </main>
      </div>
    </div>
  );
}
