'use client';

import { useMemo, useState, useEffect } from 'react';
import { clinicRepo } from '@/services/clinicRepo';
import type {
  Appointment,
  BillingPlaceholder,
  ClinicProfile,
  ClinicSettings,
  TeamMember,
} from '@/features/clinic';

type ClinicTab = 'agenda' | 'team' | 'settings' | 'billing';
type AgendaMode = 'week' | 'day';

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

function getWeekdayIndex(isoDate: string): number {
  const jsDay = new Date(isoDate).getDay();
  return jsDay === 0 ? 6 : jsDay - 1;
}

export default function ClinicPage() {
  const [tab, setTab] = useState<ClinicTab>('agenda');
  const [agendaMode, setAgendaMode] = useState<AgendaMode>('week');

  const [profile, setProfile] = useState<ClinicProfile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [settings, setSettings] = useState<ClinicSettings | null>(null);
  const [billing, setBilling] = useState<BillingPlaceholder | null>(null);

  useEffect(() => {
    let active = true;

    Promise.all([
      clinicRepo.getProfile(),
      clinicRepo.listAppointments(),
      clinicRepo.listTeam(),
      clinicRepo.getSettings(),
      clinicRepo.getBillingPlaceholder(),
    ]).then(([clinicProfile, clinicAppointments, teamMembers, clinicSettings, billingPlaceholder]) => {
      if (!active) return;
      setProfile(clinicProfile);
      setAppointments(clinicAppointments);
      setTeam(teamMembers);
      setSettings(clinicSettings);
      setBilling(billingPlaceholder);
    });

    return () => {
      active = false;
    };
  }, []);

  const appointmentsByDay = useMemo(() => {
    const base = WEEK_DAYS.map(() => [] as Appointment[]);
    appointments.forEach((appointment) => {
      const dayIndex = getWeekdayIndex(appointment.startsAt);
      base[dayIndex].push(appointment);
    });
    base.forEach((list) => list.sort((a, b) => a.startsAt.localeCompare(b.startsAt)));
    return base;
  }, [appointments]);

  const todayIndex = useMemo(() => {
    const jsDay = new Date().getDay();
    return jsDay === 0 ? 6 : jsDay - 1;
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl tracking-tight font-bold text-[#EDEDEF]">Cabinet</h1>
          <p className="text-[13px] text-[#5C5C5F] mt-1">Clinic operations show-off: agenda, team, settings, billing placeholder.</p>
        </div>
        {profile && (
          <div className="text-right">
            <div className="text-[13px] text-[#EDEDEF] font-medium">{profile.name}</div>
            <div className="text-[11px] text-[#5C5C5F]">{profile.timezone} • {profile.country}</div>
          </div>
        )}
      </div>

      <div className="bg-[#141416] border border-white/[0.06] rounded-lg p-2 flex items-center gap-2 flex-wrap">
        <TabButton label="Agenda" active={tab === 'agenda'} onClick={() => setTab('agenda')} />
        <TabButton label="Team" active={tab === 'team'} onClick={() => setTab('team')} />
        <TabButton label="Settings" active={tab === 'settings'} onClick={() => setTab('settings')} />
        <TabButton label="Billing" active={tab === 'billing'} onClick={() => setTab('billing')} />
      </div>

      {tab === 'agenda' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[14px] font-semibold text-[#EDEDEF]">Mini agenda</h2>
            <div className="flex items-center gap-2">
              <TabButton label="Week" active={agendaMode === 'week'} onClick={() => setAgendaMode('week')} small />
              <TabButton label="Day" active={agendaMode === 'day'} onClick={() => setAgendaMode('day')} small />
            </div>
          </div>

          {agendaMode === 'week' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
              {WEEK_DAYS.map((day, index) => (
                <div key={day} className="bg-[#141416] border border-white/[0.06] rounded-lg p-3">
                  <div className="text-[12px] font-semibold text-[#EDEDEF] mb-2">{day}</div>
                  <div className="space-y-2">
                    {appointmentsByDay[index].slice(0, 3).map((appointment) => (
                      <AppointmentCard key={appointment.id} appointment={appointment} />
                    ))}
                    {appointmentsByDay[index].length === 0 && (
                      <div className="text-[11px] text-[#5C5C5F]">No slots</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#141416] border border-white/[0.06] rounded-lg p-4">
              <div className="text-[13px] font-semibold text-[#EDEDEF] mb-3">Today ({WEEK_DAYS[todayIndex]})</div>
              <div className="space-y-2">
                {appointmentsByDay[todayIndex].map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))}
                {appointmentsByDay[todayIndex].length === 0 && (
                  <div className="text-[12px] text-[#5C5C5F]">No appointment for today (mock).</div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'team' && (
        <div className="bg-[#141416] border border-white/[0.06] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-white/[0.06] text-[13px] font-semibold text-[#EDEDEF]">Équipe & rôles (placeholder RBAC)</div>
          <div className="divide-y divide-white/[0.04]">
            {team.map((member) => (
              <div key={member.id} className="px-4 py-3 flex items-center justify-between gap-3">
                <div>
                  <div className="text-[13px] text-[#EDEDEF] font-medium">{member.name}</div>
                  <div className="text-[11px] text-[#5C5C5F]">{member.role} • {member.id}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 rounded-full text-[11px] bg-white/[0.05] text-[#8B8B8E]">{member.rbacRole}</span>
                  <span className={`px-2 py-1 rounded-full text-[11px] ${member.active ? 'bg-[#30A46C]/15 text-[#6EE7B7]' : 'bg-[#E5484D]/15 text-[#FF9DA1]'}`}>
                    {member.active ? 'active' : 'inactive'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="lg:col-span-2 bg-[#141416] border border-white/[0.06] rounded-lg p-4">
            <h3 className="text-[13px] font-semibold text-[#EDEDEF] mb-3">Heures d'ouverture</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {settings?.openingHours.map((entry) => (
                <div key={entry.day} className="rounded-md bg-white/[0.03] border border-white/[0.04] px-3 py-2 flex items-center justify-between">
                  <span className="text-[12px] text-[#8B8B8E]">{entry.day}</span>
                  <span className="text-[12px] text-[#EDEDEF]">{entry.closed ? 'Closed' : `${entry.open} - ${entry.close}`}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#141416] border border-white/[0.06] rounded-lg p-4">
            <h3 className="text-[13px] font-semibold text-[#EDEDEF] mb-3">Préférences IA</h3>
            {settings && (
              <div className="space-y-2 text-[12px]">
                <div className="flex justify-between"><span className="text-[#8B8B8E]">Auto analyze</span><span className="text-[#EDEDEF]">{settings.aiPreferences.autoAnalyzeOnUpload ? 'On' : 'Off'}</span></div>
                <div className="flex justify-between"><span className="text-[#8B8B8E]">Provider</span><span className="text-[#EDEDEF]">{settings.aiPreferences.defaultProvider}</span></div>
                <div className="flex justify-between"><span className="text-[#8B8B8E]">Confidence threshold</span><span className="text-[#EDEDEF]">{settings.aiPreferences.confidenceThreshold}%</span></div>
              </div>
            )}
            <h4 className="text-[12px] font-semibold text-[#EDEDEF] mt-4 mb-2">Templates</h4>
            <div className="space-y-1">
              {settings?.templates.map((template) => (
                <div key={template} className="text-[12px] text-[#8B8B8E]">• {template}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'billing' && (
        <div className="bg-[#141416] border border-white/[0.06] rounded-lg p-5">
          <h3 className="text-[14px] font-semibold text-[#EDEDEF]">Billing (placeholder)</h3>
          {billing && (
            <div className="mt-3 space-y-2 text-[13px]">
              <div className="flex justify-between"><span className="text-[#8B8B8E]">Plan</span><span className="text-[#EDEDEF]">{billing.plan}</span></div>
              <div className="flex justify-between"><span className="text-[#8B8B8E]">Renewal</span><span className="text-[#EDEDEF]">{billing.renewalDate}</span></div>
              <div className="flex justify-between"><span className="text-[#8B8B8E]">Seats</span><span className="text-[#EDEDEF]">{billing.seatsUsed}/{billing.seatsTotal}</span></div>
              <p className="text-[12px] text-[#5C5C5F] pt-2">{billing.note}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TabButton({
  label,
  active,
  onClick,
  small = false,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  small?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md transition-colors ${small ? 'px-2.5 py-1 text-[12px]' : 'px-3 py-2 text-[13px]'} ${
        active ? 'bg-[#5B5BD6]/20 text-[#C7C6FF]' : 'bg-white/[0.03] text-[#8B8B8E] hover:bg-white/[0.06]'
      }`}
    >
      {label}
    </button>
  );
}

function AppointmentCard({ appointment }: { appointment: Appointment }) {
  return (
    <div className="rounded-md bg-white/[0.03] border border-white/[0.04] px-3 py-2">
      <div className="text-[12px] text-[#EDEDEF]">{appointment.reason}</div>
      <div className="text-[11px] text-[#5C5C5F] mt-0.5">{new Date(appointment.startsAt).toLocaleString()}</div>
      <div className="text-[11px] text-[#8B8B8E] mt-1">{appointment.practitioner} • {appointment.status}</div>
    </div>
  );
}
