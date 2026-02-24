'use client';

import { FormEvent, useMemo, useState } from 'react';
import { chat } from '@/services/aiClient';
import { flags } from '@/config/flags';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

export default function AICenterPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm0',
      role: 'assistant',
      text: 'Jarvis ready. Ask me for a scan summary, risk triage, or patient-friendly report notes.',
    },
  ]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);

  const providerBadge = useMemo(() => {
    const provider = flags.aiProvider;
    return provider === 'anthropic' ? 'Anthropic' : 'Mock AI';
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || loading) return;

    const userMessage: ChatMessage = { id: `u-${Date.now()}`, role: 'user', text };
    setMessages((prev) => [...prev, userMessage]);
    setDraft('');
    setLoading(true);

    try {
      const response = await chat({ message: text });
      const assistantMessage: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        text: response.message,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl tracking-tight font-bold text-[#EDEDEF]">AI Center</h1>
          <p className="text-[13px] text-[#5C5C5F] mt-1">Jarvis assistant playground with feature-flagged providers.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md text-[11px] border border-white/[0.1] text-[#8B8B8E]">Provider: {providerBadge}</span>
          <span className={`px-2.5 py-1 rounded-md text-[11px] border ${flags.enableJarvis ? 'text-[#30A46C] border-[#30A46C]/30 bg-[#30A46C]/10' : 'text-[#E5484D] border-[#E5484D]/30 bg-[#E5484D]/10'}`}>
            Jarvis {flags.enableJarvis ? 'enabled' : 'disabled'}
          </span>
        </div>
      </div>

      <div className="bg-[#141416] border border-white/[0.06] rounded-lg h-[60vh] flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((message) => (
            <div key={message.id} className={`max-w-[80%] rounded-md px-3 py-2 text-[13px] ${message.role === 'user' ? 'ml-auto bg-[#5B5BD6]/20 text-[#D8D7FF]' : 'bg-white/[0.04] text-[#EDEDEF]'}`}>
              {message.text}
            </div>
          ))}
          {loading && (
            <div className="text-[12px] text-[#5C5C5F]">Jarvis is thinking...</div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="border-t border-white/[0.06] p-3 flex items-center gap-2">
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Ask Jarvis..."
            className="flex-1 bg-[#0F0F10] border border-white/[0.08] rounded-md px-3 py-2 text-[13px] text-[#EDEDEF] outline-none focus:border-[#5B5BD6]/60"
          />
          <button
            type="submit"
            disabled={loading || !draft.trim()}
            className="px-3 py-2 rounded-md bg-[#5B5BD6] text-white text-[13px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
