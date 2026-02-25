import { clinicRepo } from '@/services/clinicRepo';
import { patientsRepo } from '@/services/patientsRepo';
import type {
  ChatCommandInput,
  ChatCommandResult,
  ChatMessage,
  ToolCallRecord,
} from '@/features/ai/chat/types';

const NOTE_MEMORY = new Map<string, string[]>();

function getLastUserMessage(messages: ChatMessage[]): string {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    if (messages[index].role === 'user') {
      return messages[index].content.trim();
    }
  }
  return '';
}

function normalize(text: string): string {
  return text.toLowerCase();
}

function extractPatientId(text: string): string | null {
  const match = text.match(/\bP\d{3}\b/i);
  return match ? match[0].toUpperCase() : null;
}

async function callGetPatientSummary(patientId: string): Promise<ToolCallRecord> {
  const patient = await patientsRepo.getById(patientId);
  const insights = await patientsRepo.getAIInsights(patientId);

  if (!patient || !insights) {
    return {
      name: 'getPatientSummary',
      input: { patientId },
      result: `No mock patient found for ${patientId}.`,
    };
  }

  return {
    name: 'getPatientSummary',
    input: { patientId },
    result: `${patient.name}, ${patient.age}y, status ${patient.status}, ${patient.pathologyCount} finding(s). ${insights.summary}`,
  };
}

async function callListAppointments(patientId: string | null): Promise<ToolCallRecord> {
  const appointments = await clinicRepo.listAppointments();
  const filtered = patientId
    ? appointments.filter((item) => item.patientId === patientId)
    : appointments.slice(0, 5);

  const result = filtered.length === 0
    ? 'No mock appointments found.'
    : filtered
      .map((item) => `${item.id}: ${item.patientId} at ${new Date(item.startsAt).toLocaleString()} (${item.status})`)
      .join(' | ');

  return {
    name: 'listAppointments',
    input: patientId ? { patientId } : {},
    result,
  };
}

async function callCreateNote(patientId: string, note: string): Promise<ToolCallRecord> {
  const patient = await patientsRepo.getById(patientId);
  if (!patient) {
    return {
      name: 'createNote',
      input: { patientId },
      result: `Cannot create note. Unknown patient ${patientId}.`,
    };
  }

  const notes = NOTE_MEMORY.get(patientId) ?? [];
  notes.push(note);
  NOTE_MEMORY.set(patientId, notes);

  return {
    name: 'createNote',
    input: { patientId, text: note.slice(0, 80) },
    result: `Demo note saved in volatile memory for ${patient.name} (${notes.length} total).`,
  };
}

async function callRunAnalysis(patientId: string): Promise<ToolCallRecord> {
  const patient = await patientsRepo.getById(patientId);
  if (!patient) {
    return {
      name: 'runAnalysis',
      input: { patientId },
      result: `Cannot queue analysis. Unknown patient ${patientId}.`,
    };
  }

  const jobId = `ANL-${Date.now()}`;
  return {
    name: 'runAnalysis',
    input: { patientId },
    result: `Analysis queued for ${patient.name}. Job: ${jobId} (demo).`,
  };
}

export async function runMockChatCommand(input: ChatCommandInput): Promise<ChatCommandResult> {
  const userText = getLastUserMessage(input.messages);
  const normalized = normalize(userText);
  const patientId = extractPatientId(userText) ?? 'P001';
  const toolCalls: ToolCallRecord[] = [];

  if (!userText) {
    return {
      sessionId: input.sessionId ?? 'chat-mock-session',
      provider: 'mock',
      message: 'Ask for a patient summary, appointments, note creation, or analysis run.',
      toolCalls,
    };
  }

  if (normalized.includes('summary') || normalized.includes('resume') || normalized.includes('dossier')) {
    toolCalls.push(await callGetPatientSummary(patientId));
  }
  if (normalized.includes('appointment') || normalized.includes('rdv') || normalized.includes('agenda')) {
    toolCalls.push(await callListAppointments(patientId));
  }
  if (normalized.includes('note')) {
    const noteText = userText.length > 180 ? `${userText.slice(0, 180)}...` : userText;
    toolCalls.push(await callCreateNote(patientId, noteText));
  }
  if (normalized.includes('analysis') || normalized.includes('analyse') || normalized.includes('scan')) {
    toolCalls.push(await callRunAnalysis(patientId));
  }

  if (toolCalls.length === 0) {
    toolCalls.push(await callGetPatientSummary(patientId));
  }

  const message = toolCalls
    .map((tool) => `${tool.name}: ${tool.result}`)
    .join('\n');

  return {
    sessionId: input.sessionId ?? 'chat-mock-session',
    provider: 'mock',
    message,
    toolCalls,
  };
}
