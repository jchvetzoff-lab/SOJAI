'use client';

import Link from 'next/link';
import { useMemo, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import DemoBanner from '@/components/platform/DemoBanner';
import { usePlatformStore } from '@/hooks/usePlatformStore';
import { patientsRepo } from '@/services/patientsRepo';
import type { Patient } from '@/features/patients';

interface AppShellProps {
  children: React.ReactNode;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/platform',
    icon: <rect x="3" y="3" width="7" height="7" rx="1" />,
  },
  {
    label: 'Patients',
    href: '/platform/patients',
    icon: <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />,
  },
  {
    label: 'Dossier Patient',
    href: '/platform/patients',
    icon: <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />,
  },
  {
    label: 'Cabinet',
    href: '/platform/clinic',
    icon: <path d="M3 10l9-7 9 7v10a1 1 0 0 1-1 1h-4v-7H8v7H4a1 1 0 0 1-1-1z" />,
  },
  {
    label: 'AI Center',
    href: '/platform/ai-center',
    icon: <path d="M12 2a3 3 0 0 0-3 3v1H8a3 3 0 0 0-3 3v2a3 3 0 0 0 3 3h1v1a3 3 0 0 0 6 0v-1h1a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3h-1V5a3 3 0 0 0-3-3z" />,
  },
  {
    label: 'Viewer',
    href: '/platform/viewer',
    icon: <rect x="2" y="3" width="20" height="14" rx="2" />,
  },
  {
    label: 'Report',
    href: '/platform/report',
    icon: <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />,
  },
];

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);

  const {
    isDemo,
    selectedPatientId,
    setSelectedPatientId,
    setCurrentPatient,
  } = usePlatformStore();

  useEffect(() => {
    let active = true;
    patientsRepo.list().then((items) => {
      if (active) setPatients(items);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if ((pathname === '/platform/patient' || pathname === '/platform/patient/') && !selectedPatientId) {
      router.replace('/platform/patients');
    }
  }, [pathname, selectedPatientId, router]);

  const filteredPatients = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return patients.slice(0, 6);
    return patients
      .filter((patient) => patient.name.toLowerCase().includes(normalized) || patient.id.toLowerCase().includes(normalized))
      .slice(0, 8);
  }, [patients, query]);

  const handleSelectPatient = (patient: Patient): void => {
    setSelectedPatientId(patient.id);
    setCurrentPatient({ id: patient.id, name: patient.name, age: patient.age, gender: patient.gender });
    setSearchOpen(false);
    setQuery('');
    router.push(`/platform/patients/${patient.id}`);
  };

  const dossierHref = selectedPatientId ? `/platform/patients/${selectedPatientId}` : '/platform/patients';

  return (
    <div className="flex min-h-screen bg-[#0A0A0B] text-[#EDEDEF]">
      <aside className="w-[248px] border-r border-white/[0.06] bg-[#0B0B0C] shrink-0">
        <div className="h-14 flex items-center px-4 border-b border-white/[0.06]">
          <Link href="/platform" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#5B5BD6] flex items-center justify-center text-white text-xs font-bold">S</div>
            <span className="text-sm font-semibold tracking-tight">SOJAI Platform</span>
          </Link>
        </div>
        <nav className="p-2 space-y-1">
          {NAV_ITEMS.map((item) => {
            const href = item.label === 'Dossier Patient' ? dossierHref : item.href;
            const active =
              pathname === href ||
              (item.label === 'Patients' && pathname === '/platform/patients');
            return (
              <Link
                key={item.label}
                href={href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] transition-colors ${
                  active
                    ? 'bg-[#5B5BD6]/20 text-[#C7C6FF] border border-[#5B5BD6]/40'
                    : 'text-[#8B8B8E] hover:text-[#EDEDEF] hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                <Icon>{item.icon}</Icon>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-14 border-b border-white/[0.06] px-6 flex items-center justify-between gap-4 bg-[#0A0A0B]/95">
          <div className="relative w-full max-w-md">
            <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-md px-3 py-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5C5C5F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
                placeholder="Search patient by name or ID"
                className="w-full bg-transparent text-[13px] text-[#EDEDEF] outline-none placeholder:text-[#5C5C5F]"
              />
            </div>

            {searchOpen && (
              <div className="absolute z-30 mt-2 w-full rounded-md border border-white/[0.08] bg-[#141416] shadow-2xl max-h-72 overflow-y-auto">
                {filteredPatients.length === 0 ? (
                  <div className="px-3 py-2 text-[12px] text-[#5C5C5F]">No patient found</div>
                ) : (
                  filteredPatients.map((patient) => (
                    <button
                      key={patient.id}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => handleSelectPatient(patient)}
                      className="w-full text-left px-3 py-2 hover:bg-white/[0.04] transition-colors"
                    >
                      <div className="text-[13px] text-[#EDEDEF] font-medium">{patient.name}</div>
                      <div className="text-[11px] text-[#5C5C5F]">{patient.id} • {patient.age}y • {patient.gender}</div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className={`text-[12px] px-2.5 py-1 rounded-md border ${isDemo ? 'text-[#E5A836] border-[#E5A836]/30 bg-[#E5A836]/10' : 'text-[#30A46C] border-[#30A46C]/30 bg-[#30A46C]/10'}`}>
              {isDemo ? 'Demo Mode' : 'Live Mode'}
            </span>
            <Link
              href="/platform/viewer"
              className="px-3.5 py-2 rounded-md bg-[#5B5BD6] text-white text-[13px] font-medium hover:bg-[#6E6ADE] transition-colors"
            >
              New analysis
            </Link>
          </div>
        </header>

        <main className="flex-1 px-6 py-5 lg:px-8 lg:py-6 overflow-y-auto" onClick={() => setSearchOpen(false)}>
          <DemoBanner />
          {children}
        </main>
      </div>
    </div>
  );
}
