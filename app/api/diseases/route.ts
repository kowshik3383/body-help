/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function GET(request: NextRequest) {
  try {
    const bodyPart = request.nextUrl.searchParams.get('bodyPart');

    if (!bodyPart) {
      return NextResponse.json({ error: 'Missing bodyPart parameter' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-3-flash-preview',
    });


    const prompt = `
List the 5 most common diseases or medical conditions that affect the ${bodyPart}.

For each disease return:
- id (kebab-case)
- name
- description (2–3 sentences)
- symptoms (array of 4–6)
- causes (array of 3–5)

Return ONLY valid JSON in this shape:
{
  "diseases": [ ... ]
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const data = JSON.parse(text);

    return NextResponse.json({ diseases: data.diseases });
  } catch (error: any) {
    console.error('Gemini diseases error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch diseases', message: error.message },
      { status: 500 }
    );
  }
}
