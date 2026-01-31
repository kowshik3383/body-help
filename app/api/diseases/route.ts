import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const bodyPart = searchParams.get('bodyPart');

    if (!bodyPart) {
      return NextResponse.json(
        { error: 'Missing bodyPart parameter' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Call OpenAI to get diseases for the body part
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a medical information assistant. Provide accurate, concise information about diseases and medical conditions. Always structure your responses as valid JSON.`,
        },
        {
          role: 'user',
          content: `List the 5 most common diseases or medical conditions that affect the ${bodyPart}. For each disease, provide:
- id: a unique kebab-case identifier
- name: the medical name
- description: a brief description (2-3 sentences)
- symptoms: an array of 4-6 common symptoms
- causes: an array of 3-5 common causes

Return the response as a JSON array of disease objects. Ensure medical accuracy and use clear, patient-friendly language.`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const responseContent = completion.choices[0].message.content;
    if (!responseContent) {
      throw new Error('No response from OpenAI');
    }

    const data = JSON.parse(responseContent);
    
    // Ensure the response has a diseases array
    const diseases = data.diseases || data.conditions || Object.values(data)[0];

    return NextResponse.json({ diseases: Array.isArray(diseases) ? diseases : [diseases] });
  } catch (error) {
    console.error('Error fetching diseases:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch diseases',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
