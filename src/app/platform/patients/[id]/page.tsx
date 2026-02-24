'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePlatformStore } from '@/hooks/usePlatformStore';
import { patientsRepo } from '@/services/patientsRepo';
import { clinicRepo } from '@/services/clinicRepo';
import type { Appointment } from '@/features/clinic';
import type { Patient } from '@/features/patients';

interface PatientByIdPageProps {
  params: { id: string };
}

export default function PatientByIdPage({ params }: PatientByIdPageProps) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const { setSelectedPatientId, setCurrentPatient } = usePlatformStore();

  useEffect(() => {
    let active = true;

    Promise.all([patientsRepo.getById(params.id), clinicRepo.listAppointments()]).then(([foundPatient, allAppointments]) => {
      if (!active) return;

      setLoading(false);
      setPatient(foundPatient);

      if (foundPatient) {
        setSelectedPatientId(foundPatient.id);
        setCurrentPatient({
          id: foundPatient.id,
          name: foundPatient.name,
          age: foundPatient.age,
          gender: foundPatient.gender,
        });
      }

      setAppointments(allAppointments.filter((appointment) => appointment.patientId === params.id));
    });

    return () => {
      active = false;
    };
  }, [params.id, setCurrentPatient, setSelectedPatientId]);

  const nextAppointment = useMemo(() => {
    const sorted = [...appointments].sort((a, b) => a.startsAt.localeCompare(b.startsAt));
    return sorted.find((appointment) => appointment.status === 'scheduled') ?? null;
  }, [appointments]);

  if (loading) {
    return <div className="max-w-6xl mx-auto text-[13px] text-[#5C5C5F]">Loading patient dossier...</div>;
  }

  if (!patient) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#141416] rounded-lg border border-white/[0.06] p-6">
          <h1 className="text-xl font-bold text-[#EDEDEF]">Patient not found</h1>
          <p className="text-[13px] text-[#5C5C5F] mt-2">No patient exists with id `{params.id}`.</p>
          <Link href="/platform/patients" className="inline-block mt-4 px-3 py-2 rounded-md bg-[#5B5BD6] text-white text-[13px]">
            Back to Patients
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl tracking-tight font-bold text-[#EDEDEF]">Patient Dossier</h1>
          <p className="text-[13px] text-[#5C5C5F] mt-1">Route: /platform/patients/{patient.id}</p>
        </div>
        <Link href="/platform/patients" className="text-[12px] px-3 py-2 rounded-md bg-white/[0.04] text-[#8B8B8E] hover:bg-white/[0.08]">
          Back to list
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2 bg-[#141416] border border-white/[0.06] rounded-lg p-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#5B5BD6]/20 text-[#C7C6FF] flex items-center justify-center font-semibold">
              {patient.avatar}
            </div>
            <div>
              <div className="text-[17px] font-semibold text-[#EDEDEF]">{patient.name}</div>
              <div className="text-[12px] text-[#5C5C5F]">{patient.id} • {patient.age}y • {patient.gender}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
            <Metric label="Scans" value={String(patient.scanCount)} />
            <Metric label="Findings" value={String(patient.pathologyCount)} />
            <Metric label="Last Visit" value={patient.lastVisit} />
            <Metric label="Status" value={patient.status} />
          </div>
        </div>

        <div className="bg-[#141416] border border-white/[0.06] rounded-lg p-5">
          <div className="text-[12px] uppercase tracking-wide text-[#8B8B8E]">Next appointment</div>
          {nextAppointment ? (
            <>
              <div className="text-[14px] font-semibold text-[#EDEDEF] mt-2">{new Date(nextAppointment.startsAt).toLocaleString()}</div>
              <div className="text-[12px] text-[#5C5C5F] mt-1">{nextAppointment.reason}</div>
              <div className="text-[12px] text-[#8B8B8E] mt-3">Practitioner: {nextAppointment.practitioner}</div>
            </>
          ) : (
            <div className="text-[13px] text-[#5C5C5F] mt-2">No scheduled appointment.</div>
          )}
        </div>
      </div>

      <div className="bg-[#141416] border border-white/[0.06] rounded-lg p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[14px] font-semibold text-[#EDEDEF]">Patient actions</h2>
          <Link href="/platform/viewer" className="text-[12px] text-[#C7C6FF] hover:text-white">New analysis</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Link href="/platform/viewer" className="p-3 rounded-md bg-white/[0.03] hover:bg-white/[0.05] text-[13px]">Open viewer</Link>
          <Link href="/platform/detection" className="p-3 rounded-md bg-white/[0.03] hover:bg-white/[0.05] text-[13px]">Review AI findings</Link>
          <Link href="/platform/report" className="p-3 rounded-md bg-white/[0.03] hover:bg-white/[0.05] text-[13px]">Generate report</Link>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-white/[0.03] border border-white/[0.04] p-3">
      <div className="text-[11px] text-[#5C5C5F]">{label}</div>
      <div className="text-[13px] font-medium text-[#EDEDEF] mt-1">{value}</div>
    </div>
  );
}
