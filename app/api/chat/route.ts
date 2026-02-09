import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

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

    // Build context-aware prompt
    const systemPrompt = `You are a helpful medical assistant for the Body Help application. 
You provide accurate, helpful, and easy-to-understand information about human anatomy and health.
Current context: The user is asking about the ${bodyPart}.
Language preference: ${language === 'hi' ? 'Hindi' : 'English'}
${language === 'hi' ? 'Please respond in Hindi.' : 'Please respond in English.'}

Guidelines:
- Provide clear, concise, and medically accurate information
- Use simple language that elderly users can understand
- Be empathetic and supportive
- If you don't know something, say so
- Encourage users to consult healthcare professionals for serious concerns
- Keep responses focused and under 200 words`;

    // Format conversation history
    const historyText = conversationHistory
      ?.map((msg: any) => `${msg.role}: ${msg.content}`)
      .join('\n') || '';

    const fullPrompt = `${systemPrompt}\n\nConversation history:\n${historyText}\n\nUser: ${message}\n\nAssistant:`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
