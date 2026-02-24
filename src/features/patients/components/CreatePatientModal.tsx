'use client';

import { useState, type FormEvent } from 'react';
import type { PatientCreateInput, PatientGender } from '@/features/patients';

interface CreatePatientModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (input: PatientCreateInput) => Promise<void>;
}

export default function CreatePatientModal({ open, onClose, onCreate }: CreatePatientModalProps) {
  const [name, setName] = useState('');
  const [age, setAge] = useState(35);
  const [gender, setGender] = useState<PatientGender>('F');
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    try {
      await onCreate({ name: name.trim(), age, gender });
      setName('');
      setAge(35);
      setGender('F');
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-[#141416] border border-white/[0.08] rounded-lg p-5 space-y-4">
        <div>
          <h2 className="text-[16px] font-semibold text-[#EDEDEF]">Créer patient</h2>
          <p className="text-[12px] text-[#5C5C5F] mt-1">Demo modal. Data persists via patientsRepo mock.</p>
        </div>

        <label className="block">
          <span className="text-[12px] text-[#8B8B8E]">Nom</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-1 w-full bg-[#0F0F10] border border-white/[0.08] rounded-md px-3 py-2 text-[13px] text-[#EDEDEF] outline-none focus:border-[#5B5BD6]/60"
            placeholder="Ex: Claire Bernard"
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-[12px] text-[#8B8B8E]">Âge</span>
            <input
              type="number"
              min={1}
              max={120}
              value={age}
              onChange={(event) => setAge(Number(event.target.value))}
              className="mt-1 w-full bg-[#0F0F10] border border-white/[0.08] rounded-md px-3 py-2 text-[13px] text-[#EDEDEF] outline-none focus:border-[#5B5BD6]/60"
            />
          </label>

          <label className="block">
            <span className="text-[12px] text-[#8B8B8E]">Genre</span>
            <select
              value={gender}
              onChange={(event) => setGender(event.target.value as PatientGender)}
              className="mt-1 w-full bg-[#0F0F10] border border-white/[0.08] rounded-md px-3 py-2 text-[13px] text-[#EDEDEF] outline-none focus:border-[#5B5BD6]/60"
            >
              <option value="F">F</option>
              <option value="M">M</option>
            </select>
          </label>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 rounded-md bg-white/[0.04] text-[#8B8B8E] text-[13px] hover:bg-white/[0.08]"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={submitting || !name.trim()}
            className="px-3 py-2 rounded-md bg-[#5B5BD6] text-white text-[13px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Création...' : 'Créer'}
          </button>
        </div>
      </form>
    </div>
  );
}
