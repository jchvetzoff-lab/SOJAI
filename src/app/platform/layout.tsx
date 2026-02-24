import AppShell from '@/components/platform/AppShell';

export const metadata = {
  title: 'SOJAI Platform',
  description: 'AI-Powered Dental Diagnostics Platform',
};

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
