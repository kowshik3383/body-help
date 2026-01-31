import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const disease = searchParams.get('disease');

    if (!disease) {
      return NextResponse.json(
        { error: 'Missing disease parameter' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Call OpenAI to get treatments for the disease
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a medical information assistant specializing in treatment options. Provide accurate, evidence-based treatment information. Always structure your responses as valid JSON.`,
        },
        {
          role: 'user',
          content: `Provide comprehensive treatment options for ${disease}. Include treatments across these categories:
- Medication: prescription drugs, over-the-counter medications
- Lifestyle: diet changes, exercise, home remedies, rest protocols
- Therapy: physical therapy, occupational therapy, rehabilitation programs
- Surgical: surgical interventions (if applicable)

For each treatment, provide:
- id: a unique kebab-case identifier
- name: the treatment name
- type: one of "medication", "lifestyle", "therapy", or "surgical"
- description: detailed description including dosage/duration/method (2-3 sentences)

Return 6-10 treatments total as a JSON array. Prioritize evidence-based, commonly prescribed treatments. Use clear, patient-friendly language.`,
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
    
    // Ensure the response has a treatments array
    const treatments = data.treatments || data.options || Object.values(data)[0];

    return NextResponse.json({ treatments: Array.isArray(treatments) ? treatments : [treatments] });
  } catch (error) {
    console.error('Error fetching treatments:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch treatments',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
