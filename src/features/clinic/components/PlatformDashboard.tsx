'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { patientsRepo } from '@/services/patientsRepo';
import { clinicRepo } from '@/services/clinicRepo';
import { usePlatformStore } from '@/hooks/usePlatformStore';
import type { ActivityItem, Appointment } from '@/features/clinic';
import type { Patient } from '@/features/patients';

interface UnifiedActivity {
  id: string;
  text: string;
  detail: string;
  kind: 'analysis' | 'appointment' | 'note';
}

function currentMonthKey(date: Date): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
}

export default function PlatformDashboard() {
  const router = useRouter();
  const { analysisHistory, setCurrentPatient, setSelectedPatientId } = usePlatformStore();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);

  useEffect(() => {
    let active = true;

    Promise.all([
      patientsRepo.list(),
      clinicRepo.listAppointments(),
      clinicRepo.listActivity(),
    ]).then(([loadedPatients, loadedAppointments, loadedActivity]) => {
      if (!active) return;
      setPatients(loadedPatients);
      setAppointments(loadedAppointments);
      setActivity(loadedActivity);
    });

    return () => {
      active = false;
    };
  }, []);

  const now = new Date();
  const monthToken = currentMonthKey(now);

  const activePatients = useMemo(() => {
    return patients.filter((patient) => patient.status === 'active').length;
  }, [patients]);

  const scansThisMonth = useMemo(() => {
    const fromHistory = analysisHistory.filter((entry) => entry.analyzedAt.startsWith(monthToken)).length;
    if (fromHistory > 0) return fromHistory;
    return patients.reduce((sum, patient) => sum + patient.scanCount, 0);
  }, [analysisHistory, monthToken, patients]);

  const aiAnalyses = useMemo(() => {
    if (analysisHistory.length > 0) return analysisHistory.length;
    return activity.filter((item) => item.type === 'analysis').length;
  }, [analysisHistory, activity]);

  const timeSavedHours = useMemo(() => {
    const minutesPerAnalysisSaved = 6;
    const minutes = aiAnalyses * minutesPerAnalysisSaved;
    return (minutes / 60).toFixed(1);
  }, [aiAnalyses]);

  const unifiedActivity = useMemo(() => {
    const fromHistory: UnifiedActivity[] = analysisHistory.slice(0, 5).map((entry) => ({
      id: `hist-${entry.id}`,
      text: `AI analysis for ${entry.patientName}`,
      detail: entry.analyzedAt,
      kind: 'analysis',
    }));

    const fromAppointments: UnifiedActivity[] = appointments.slice(0, 4).map((entry) => ({
      id: `apt-${entry.id}`,
      text: `Appointment ${entry.status}: ${entry.reason}`,
      detail: new Date(entry.startsAt).toLocaleString(),
      kind: 'appointment',
    }));

    const fromFeed: UnifiedActivity[] = activity.slice(0, 5).map((entry) => ({
      id: `feed-${entry.id}`,
      text: entry.text,
      detail: entry.time,
      kind: entry.type === 'analysis' ? 'analysis' : entry.type === 'schedule' ? 'appointment' : 'note',
    }));

    return [...fromHistory, ...fromAppointments, ...fromFeed].slice(0, 10);
  }, [analysisHistory, appointments, activity]);

  const handleCreatePatient = async (): Promise<void> => {
    const created = await patientsRepo.create({
      name: `New Patient ${patients.length + 1}`,
      age: 30,
      gender: 'F',
    });

    setPatients((prev) => [created, ...prev]);
    setSelectedPatientId(created.id);
    setCurrentPatient({ id: created.id, name: created.name, age: created.age, gender: created.gender });
    router.push('/platform/patient');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      <div>
        <h1 className="text-xl tracking-tight font-bold text-[#EDEDEF]">Dashboard</h1>
        <p className="text-[13px] text-[#5C5C5F] mt-1">Practice overview, AI throughput, and next actions.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard title="Patients actifs" value={String(activePatients)} tone="default" />
        <KpiCard title="Scans ce mois" value={String(scansThisMonth)} tone="violet" />
        <KpiCard title="Analyses IA" value={String(aiAnalyses)} tone="green" />
        <KpiCard title="Temps gagné" value={`${timeSavedHours}h`} tone="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2 bg-[#141416] border border-white/[0.06] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
            <h2 className="text-[13px] font-semibold text-[#EDEDEF]">Activity Feed</h2>
            <span className="text-[11px] text-[#5C5C5F]">Latest analyses, RDV, notes</span>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {unifiedActivity.map((item) => (
              <div key={item.id} className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    item.kind === 'analysis'
                      ? 'bg-[#5B5BD6]'
                      : item.kind === 'appointment'
                      ? 'bg-[#30A46C]'
                      : 'bg-[#E5A836]'
                  }`} />
                  <span className="text-[13px] text-[#EDEDEF]">{item.text}</span>
                </div>
                <div className="text-[11px] text-[#5C5C5F] mt-1">{item.detail}</div>
              </div>
            ))}
            {unifiedActivity.length === 0 && (
              <div className="px-4 py-8 text-center text-[13px] text-[#5C5C5F]">No activity yet.</div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-[#141416] border border-white/[0.06] rounded-lg p-4">
            <h2 className="text-[13px] font-semibold text-[#EDEDEF] mb-3">Quick actions</h2>
            <div className="space-y-2">
              <button
                onClick={handleCreatePatient}
                className="w-full text-left px-3 py-2.5 rounded-md bg-[#5B5BD6]/20 text-[#C7C6FF] hover:bg-[#5B5BD6]/30 text-[13px] transition-colors"
              >
                Créer patient
              </button>
              <Link
                href="/platform/viewer"
                className="block px-3 py-2.5 rounded-md bg-white/[0.03] text-[#EDEDEF] hover:bg-white/[0.05] text-[13px] transition-colors"
              >
                Importer scan
              </Link>
              <Link
                href="/platform/viewer"
                className="block px-3 py-2.5 rounded-md bg-[#30A46C]/15 text-[#7EF0B3] hover:bg-[#30A46C]/25 text-[13px] transition-colors"
              >
                Lancer analyse
              </Link>
            </div>
          </div>

          <div className="bg-[#141416] border border-white/[0.06] rounded-lg p-4">
            <h2 className="text-[13px] font-semibold text-[#EDEDEF] mb-3">Upcoming RDV</h2>
            <div className="space-y-2">
              {appointments.slice(0, 3).map((appointment) => (
                <div key={appointment.id} className="rounded-md bg-white/[0.03] px-3 py-2">
                  <div className="text-[12px] text-[#EDEDEF]">{appointment.reason}</div>
                  <div className="text-[11px] text-[#5C5C5F] mt-0.5">{new Date(appointment.startsAt).toLocaleString()}</div>
                </div>
              ))}
              {appointments.length === 0 && <div className="text-[12px] text-[#5C5C5F]">No appointments</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  title,
  value,
  tone,
}: {
  title: string;
  value: string;
  tone: 'default' | 'violet' | 'green' | 'amber';
}) {
  const toneClass =
    tone === 'violet'
      ? 'text-[#C7C6FF]'
      : tone === 'green'
      ? 'text-[#7EF0B3]'
      : tone === 'amber'
      ? 'text-[#FFD08A]'
      : 'text-[#EDEDEF]';

  return (
    <div className="bg-[#141416] border border-white/[0.06] rounded-lg p-4">
      <div className="text-[11px] uppercase tracking-wide text-[#5C5C5F]">{title}</div>
      <div className={`text-2xl font-bold mt-2 ${toneClass}`}>{value}</div>
    </div>
  );
}
