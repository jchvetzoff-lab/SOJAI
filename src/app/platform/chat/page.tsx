'use client';

import { FormEvent, useMemo, useState } from 'react';
import { flags } from '@/config/flags';
import { chatCommand } from '@/services/aiClient';
import type { ChatRole, ToolCallRecord } from '@/features/ai/chat/types';

interface UIMessage {
  id: string;
  role: ChatRole;
  text: string;
  toolCalls?: ToolCallRecord[];
}

const AVAILABLE_TOOLS: Array<{ name: string; description: string }> = [
  { name: 'getPatientSummary', description: 'Return mock summary for fixture patient id.' },
  { name: 'listAppointments', description: 'List mock clinic appointments from fixtures.' },
  { name: 'createNote', description: 'Create demo note in volatile memory.' },
  { name: 'runAnalysis', description: 'Queue demo analysis job for patient.' },
];

async function streamIntoMessage(
  fullText: string,
  onChunk: (nextText: string) => void
): Promise<void> {
  const chunkSize = 6;
  let cursor = 0;
  while (cursor < fullText.length) {
    cursor += chunkSize;
    onChunk(fullText.slice(0, cursor));
    await new Promise((resolve) => setTimeout(resolve, 28));
  }
}

export default function ChatPage() {
  const [sessionId, setSessionId] = useState<string>('chat-session-1');
  const [messages, setMessages] = useState<UIMessage[]>([
    {
      id: 'intro',
      role: 'assistant',
      text: 'SOJAI assistant ready. Demo uses fixture data only. Try: "summary P001", "list appointments P002", "create note P003 ...", "run analysis P004".',
    },
  ]);
  const [draft, setDraft] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const modeBadge = useMemo(() => {
    if (flags.isDemo || flags.aiProvider === 'mock') return 'Demo local';
    return 'Live via /api/chat';
  }, []);

  const sendMessage = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || pending) return;

    const userMessage: UIMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
    };

    const historyForRequest = [
      ...messages.map((item) => ({ role: item.role, content: item.text })),
      { role: 'user' as const, content: text },
    ];

    setMessages((prev) => [...prev, userMessage]);
    setDraft('');
    setPending(true);
    setError(null);

    const assistantId = `assistant-${Date.now()}`;
    setMessages((prev) => [...prev, { id: assistantId, role: 'assistant', text: '' }]);

    try {
      const result = await chatCommand({
        sessionId,
        messages: historyForRequest,
      });
      setSessionId(result.sessionId);

      await streamIntoMessage(result.message, (nextText) => {
        setMessages((prev) =>
          prev.map((item) => (item.id === assistantId ? { ...item, text: nextText } : item))
        );
      });

      if (result.toolCalls.length > 0) {
        setMessages((prev) =>
          prev.map((item) =>
            item.id === assistantId ? { ...item, toolCalls: result.toolCalls } : item
          )
        );
      }
    } catch (sendError) {
      const message = sendError instanceof Error ? sendError.message : 'Chat failed.';
      setError(message);
      setMessages((prev) =>
        prev.map((item) =>
          item.id === assistantId
            ? {
                ...item,
                text: 'Request failed. Switch to demo mode or enable live backend.',
              }
            : item
        )
      );
    } finally {
      setPending(false);
    }
  };

  const resetConversation = (): void => {
    setMessages([
      {
        id: 'intro-reset',
        role: 'assistant',
        text: 'Conversation reset. Demo tools are available with fixture data.',
      },
    ]);
    setError(null);
    setSessionId(`chat-session-${Date.now()}`);
  };

  return (
    <div className="max-w-[1500px] mx-auto space-y-4">
      <div className="rounded-md border border-[#E5A836]/25 bg-[#E5A836]/10 px-3 py-2 text-[12px] text-[#F8D27A]">
        <span className="font-semibold">DEMO DATA</span> - No sensitive content is stored. Responses use fixtures and transient mock state.
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl tracking-tight font-bold text-[#EDEDEF]">AI Chat Console</h1>
          <p className="text-[13px] text-[#5C5C5F] mt-1">Tool-calling mock with streaming preview.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md text-[11px] border border-white/[0.1] text-[#8B8B8E]">{modeBadge}</span>
          <button
            onClick={resetConversation}
            className="px-3 py-1.5 rounded-md border border-white/[0.1] text-[12px] text-[#C2C2C5] hover:bg-white/[0.04]"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr] gap-3 min-h-[70vh]">
        <aside className="bg-[#141416] border border-white/[0.06] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-white/[0.06] text-[13px] font-semibold text-[#EDEDEF]">
            Mock Tools
          </div>
          <div className="p-3 space-y-2">
            {AVAILABLE_TOOLS.map((tool) => (
              <div key={tool.name} className="rounded-md border border-white/[0.08] bg-white/[0.02] p-3">
                <div className="text-[12px] font-medium text-[#EDEDEF]">{tool.name}</div>
                <div className="text-[11px] text-[#7D7D80] mt-1">{tool.description}</div>
              </div>
            ))}
          </div>
        </aside>

        <section className="bg-[#141416] border border-white/[0.06] rounded-lg overflow-hidden flex flex-col">
          <div className="border-b border-white/[0.06] px-4 py-3 text-[12px] text-[#8B8B8E]">
            Session: {sessionId}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div key={message.id} className={message.role === 'user' ? 'ml-auto max-w-[80%]' : 'max-w-[85%]'}>
                <div
                  className={`rounded-md px-3 py-2 text-[13px] whitespace-pre-wrap ${
                    message.role === 'user'
                      ? 'bg-[#5B5BD6]/20 text-[#D8D7FF]'
                      : 'bg-white/[0.04] text-[#EDEDEF]'
                  }`}
                >
                  {message.text || (pending && message.role === 'assistant' ? '...' : '')}
                </div>
                {message.toolCalls && message.toolCalls.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {message.toolCalls.map((tool, index) => (
                      <div key={`${message.id}-${tool.name}-${index}`} className="rounded-md border border-white/[0.08] bg-[#0F0F10] px-2.5 py-2">
                        <div className="text-[11px] text-[#8B8B8E]">tool: {tool.name}</div>
                        <div className="text-[11px] text-[#5C5C5F] mt-0.5">{tool.result}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <form onSubmit={sendMessage} className="border-t border-white/[0.06] p-3 flex items-center gap-2">
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Type a command..."
              className="flex-1 bg-[#0F0F10] border border-white/[0.08] rounded-md px-3 py-2 text-[13px] text-[#EDEDEF] outline-none"
            />
            <button
              type="submit"
              disabled={pending || !draft.trim()}
              className="px-3.5 py-2 rounded-md bg-[#5B5BD6] text-white text-[13px] font-medium disabled:opacity-50"
            >
              {pending ? 'Sending...' : 'Send'}
            </button>
          </form>
          {error && (
            <div className="px-3 pb-3 text-[12px] text-[#FF9DA1]">{error}</div>
          )}
        </section>
      </div>
    </div>
  );
}
