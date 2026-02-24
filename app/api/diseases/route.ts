import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getNextModel, getFallbackModel } from '@/src/lib/aiModelRotation';
import { diseaseCacheModel } from '@/src/lib/models/DiseaseCache';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface Disease {
  id: string;
  name: string;
  description: string;
  symptoms: string[];
  causes: string[];
}

export async function GET(request: NextRequest) {
  const bodyPart = request.nextUrl.searchParams.get('bodyPart');
  const language = request.nextUrl.searchParams.get('language') || 'en';
  const ageParam = request.nextUrl.searchParams.get('age');
  const gender = request.nextUrl.searchParams.get('gender');

  if (!bodyPart) {
    return NextResponse.json(
      { error: 'Missing bodyPart parameter' },
      { status: 400 }
    );
  }

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: 'Gemini API key not configured' },
      { status: 500 }
    );
  }

  try {
    // Parse demographics
    const age = ageParam ? parseInt(ageParam, 10) : 30; // Default age
    const userGender = gender || 'other';

    // Check MongoDB cache first
    const cached = await diseaseCacheModel.find({
      age,
      gender: userGender,
      bodyPart,
      language,
    });

    if (cached && cached.response) {
      return NextResponse.json({
        diseases: (cached.response as { diseases: Disease[] }).diseases,
        cached: true,
        fallback: false,
      });
    }

    // Generate with demographic-aware prompt
    let currentModel = getNextModel();
    let attempts = 0;
    const maxAttempts = 4;

    while (attempts < maxAttempts) {
      try {
        const model = genAI.getGenerativeModel({
          model: currentModel,
          generationConfig: {
            temperature: 0.4,
            responseMimeType: 'application/json',
          },
        });

        const prompt = generateDemographicPrompt(
          age,
          userGender,
          bodyPart,
          language
        );

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const parsed = JSON.parse(text);

        if (!parsed?.diseases || !Array.isArray(parsed.diseases)) {
          throw new Error('Unexpected response structure');
        }

        // Store in MongoDB cache
        await diseaseCacheModel.store(
          { age, gender: userGender, bodyPart, language },
          parsed
        );

        return NextResponse.json({
          diseases: parsed.diseases,
          cached: false,
          fallback: false,
          model: currentModel,
        });
      } catch (error: unknown) {
        const err = error as { status?: number; message?: string };
        console.error(`Model ${currentModel} failed:`, err);

        // If 429 (rate limit), try fallback model
        if (err?.status === 429 && attempts < maxAttempts - 1) {
          currentModel = getFallbackModel(currentModel);
          attempts++;
          continue;
        }

        throw error;
      }
    }

    throw new Error('All models exhausted');
  } catch (error: unknown) {
    const err = error as { status?: number; message?: string };
    console.error('Diseases API error:', err);

    // Return 429 if rate limited
    if (err?.status === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to fetch diseases',
        message: err.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Generate demographic-aware AI prompt
 */
function generateDemographicPrompt(
  age: number,
  gender: string,
  bodyPart: string,
  language: string
): string {
  const languageNames: Record<string, string> = {
    en: 'English',
    hi: 'Hindi',
    ta: 'Tamil',
    te: 'Telugu',
    kn: 'Kannada',
    ml: 'Malayalam',
    bn: 'Bengali',
    mr: 'Marathi',
    gu: 'Gujarati',
    pa: 'Punjabi',
    or: 'Odia',
    as: 'Assamese',
  };

  const langName = languageNames[language] || 'English';

  return `You are a medical AI assistant for Diagnova, a multilingual health platform.

Generate likely diseases based on the following demographic profile:

Age: ${age} years
Gender: ${gender}
Body Part: ${bodyPart}
Language: ${langName}

Instructions:
1. Prioritize diseases that are statistically more common for this age group and gender
2. For example:
   - Age 44, Female, Knee → Focus on osteoarthritis, rheumatoid arthritis, hormonal joint degeneration, vitamin D deficiency
   - Age 25, Male, Chest → Focus on costochondritis, anxiety-related chest pain, muscle strain
   - Age 65, Male, Heart → Focus on coronary artery disease, heart failure, arrhythmias
3. Explain WHY this age/gender demographic is at higher risk
4. List top 5 most likely diseases/conditions

For each disease provide:
- id (kebab-case string, e.g., "osteoarthritis")
- name (disease name in ${langName})
- description (2-3 sentences explaining the condition and why it's relevant to this demographic, in ${langName})
- symptoms (array of 4-6 symptoms in ${langName})
- causes (array of 3-5 causes, including age/gender-specific risk factors, in ${langName})

Return strictly valid JSON in this format:
{
  "diseases": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "symptoms": ["string"],
      "causes": ["string"]
    }
  ]
}

CRITICAL: All text content (name, description, symptoms, causes) MUST be in ${langName} only. Do not mix languages.`;
}
