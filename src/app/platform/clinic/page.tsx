'use client';

import { useEffect, useState } from 'react';
import { clinicRepo } from '@/services/clinicRepo';
import type { ActivityItem, Appointment, ClinicProfile } from '@/features/clinic';

export default function ClinicPage() {
  const [profile, setProfile] = useState<ClinicProfile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);

  useEffect(() => {
    let active = true;
    Promise.all([
      clinicRepo.getProfile(),
      clinicRepo.listAppointments(),
      clinicRepo.listActivity(),
    ]).then(([clinicProfile, clinicAppointments, clinicActivity]) => {
      if (!active) return;
      setProfile(clinicProfile);
      setAppointments(clinicAppointments);
      setActivity(clinicActivity);
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      <div>
        <h1 className="text-xl tracking-tight font-bold text-[#EDEDEF]">Cabinet</h1>
        <p className="text-[13px] text-[#5C5C5F] mt-1">Operational cockpit for clinic workload and activity.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2 bg-[#141416] border border-white/[0.06] rounded-lg p-5">
          <div className="text-[12px] uppercase tracking-wide text-[#8B8B8E]">Clinic Profile</div>
          {profile ? (
            <div className="mt-2 space-y-1">
              <div className="text-[16px] font-semibold text-[#EDEDEF]">{profile.name}</div>
              <div className="text-[13px] text-[#5C5C5F]">Timezone: {profile.timezone}</div>
              <div className="text-[13px] text-[#5C5C5F]">Country: {profile.country}</div>
            </div>
          ) : (
            <div className="text-[13px] text-[#5C5C5F] mt-2">Loading profile...</div>
          )}
        </div>

        <div className="bg-[#141416] border border-white/[0.06] rounded-lg p-5">
          <div className="text-[12px] uppercase tracking-wide text-[#8B8B8E]">Today</div>
          <div className="mt-2 text-[24px] font-bold text-[#EDEDEF]">{appointments.filter((a) => a.status === 'scheduled').length}</div>
          <div className="text-[12px] text-[#5C5C5F]">scheduled appointments</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="bg-[#141416] border border-white/[0.06] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-white/[0.06] text-[13px] font-semibold text-[#EDEDEF]">Appointments</div>
          <div className="divide-y divide-white/[0.04]">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="px-4 py-3">
                <div className="text-[13px] text-[#EDEDEF]">{new Date(appointment.startsAt).toLocaleString()}</div>
                <div className="text-[12px] text-[#5C5C5F] mt-0.5">{appointment.reason} • {appointment.practitioner}</div>
                <div className="text-[11px] text-[#8B8B8E] mt-1">{appointment.status}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#141416] border border-white/[0.06] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-white/[0.06] text-[13px] font-semibold text-[#EDEDEF]">Activity Feed</div>
          <div className="divide-y divide-white/[0.04]">
            {activity.map((item) => (
              <div key={item.id} className="px-4 py-3">
                <div className="text-[13px] text-[#EDEDEF]">{item.text}</div>
                <div className="text-[11px] text-[#5C5C5F] mt-0.5">{item.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
