export type ChatRole = 'system' | 'user' | 'assistant' | 'tool';

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export type ChatToolName =
  | 'getPatientSummary'
  | 'listAppointments'
  | 'createNote'
  | 'runAnalysis';

export interface ToolCallRecord {
  name: ChatToolName;
  input: Record<string, string>;
  result: string;
}

export interface ChatCommandResult {
  sessionId: string;
  message: string;
  provider: 'mock' | 'anthropic';
  toolCalls: ToolCallRecord[];
}

export interface ChatCommandInput {
  sessionId?: string;
  messages: ChatMessage[];
}
