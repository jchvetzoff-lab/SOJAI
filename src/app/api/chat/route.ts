import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import type { ChatCommandInput, ChatMessage } from '@/features/ai/chat/types';

function isLiveChatEnabled(): boolean {
  return process.env.SOJAI_ENABLE_LIVE_CHAT === 'true';
}

function extractLastUserMessage(messages: ChatMessage[]): string {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    if (messages[index].role === 'user') {
      return messages[index].content;
    }
  }
  return '';
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as ChatCommandInput;
    const sessionId = payload.sessionId ?? `chat-${Date.now()}`;

    if (!isLiveChatEnabled()) {
      return NextResponse.json(
        {
          error: 'Live chat is disabled. Set SOJAI_ENABLE_LIVE_CHAT=true to enable provider calls.',
        },
        { status: 503 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY is not configured.' },
        { status: 503 }
      );
    }

    const anthropic = new Anthropic({ apiKey });
    const userMessage = extractLastUserMessage(payload.messages ?? []);

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 800,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `You are SOJAI assistant. Use concise healthcare-safe wording and avoid personal data. User: ${userMessage}`,
            },
          ],
        },
      ],
    });

    const textBlock = response.content.find((entry) => entry.type === 'text');
    const message = textBlock && textBlock.type === 'text'
      ? textBlock.text
      : 'No textual response available.';

    return NextResponse.json({
      sessionId,
      provider: 'anthropic',
      message,
      toolCalls: [],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Chat failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
