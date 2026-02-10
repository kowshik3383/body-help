import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getCached, setCached } from '@/src/utils/cache';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export async function POST(request: NextRequest) {
  try {
    const { message, bodyPart, language, conversationHistory } = await request.json();

    if (!message || !bodyPart) {
      return NextResponse.json(
        { error: 'Message and body part are required' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

    // Persistent cache key (normalize message to reduce dupes)
    const normMsg = String(message).trim().toLowerCase().replace(/\s+/g, ' ');
    const lang = language || 'en';
    const cacheKey = `chat:${bodyPart}:${lang}:${normMsg}`;

    const cached = await getCached<{ response: string }>(cacheKey, TTL_MS);
    if (cached) {
      return NextResponse.json(cached);
    }

    // Build context-aware prompt in target language without fallback
    const sysLang = lang;
    const sysLangName = {
      en: 'English', hi: 'Hindi', ta: 'Tamil', te: 'Telugu', kn: 'Kannada', ml: 'Malayalam', bn: 'Bengali', mr: 'Marathi', gu: 'Gujarati', pa: 'Punjabi', or: 'Odia', as: 'Assamese'
    } as Record<string, string>;

    const systemPrompt = `You are a helpful medical assistant for the Body Help application.
You provide accurate, helpful, and easy-to-understand information about human anatomy and health.
Current context: The user is asking about the ${bodyPart}.
Language preference: ${sysLangName[sysLang] || 'English'}.
Respond ONLY in ${sysLangName[sysLang] || 'English'}. Do not include any other language.`;

    // Format conversation history
    const historyText = conversationHistory
      ?.map((msg: any) => `${msg.role}: ${msg.content}`)
      .join('\n') || '';

    const fullPrompt = `${systemPrompt}\n\nConversation history:\n${historyText}\n\nUser: ${message}\n\nAssistant:`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    const payload = { response: text };
    await setCached(cacheKey, payload);

    return NextResponse.json(payload);
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
