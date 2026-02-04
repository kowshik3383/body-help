/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function GET(request: NextRequest) {
  try {
    const disease = request.nextUrl.searchParams.get('disease');

    if (!disease) {
      return NextResponse.json({ error: 'Missing disease parameter' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-3-flash-preview',
      generationConfig: {
        temperature: 0.7,
        responseMimeType: 'application/json',
      },
    });

    const prompt = `
Provide 6–10 evidence-based treatments for ${disease}.

Each treatment must include:
- id (kebab-case)
- name
- type ("medication" | "lifestyle" | "therapy" | "surgical")
- description (2–3 sentences)

Return ONLY valid JSON in this shape:
{
  "treatments": [ ... ]
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const data = JSON.parse(text);

    return NextResponse.json({ treatments: data.treatments });
  } catch (error: any) {
    console.error('Gemini treatments error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch treatments', message: error.message },
      { status: 500 }
    );
  }
}
