/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
import { getCached, setCached } from '@/src/utils/cache';

const TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export async function GET(request: NextRequest) {
  const bodyPart = request.nextUrl.searchParams.get("bodyPart");
  const language = request.nextUrl.searchParams.get("language") || 'en';

  if (!bodyPart) {
    return NextResponse.json(
      { error: "Missing bodyPart parameter" },
      { status: 400 }
    );
  }

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "Gemini API key not configured" },
      { status: 500 }
    );
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
      generationConfig: {
        temperature: 0.4,
        responseMimeType: "application/json",
      },
    });

    const cacheKey = `diseases:${bodyPart}:${language}`;
    const cached = await getCached<any>(cacheKey, TTL_MS);
    if (cached) {
      return NextResponse.json({ diseases: cached, cached: true, fallback: false });
    }

    const prompt = `
List the 5 most common diseases or medical conditions affecting the ${bodyPart}.

For each disease include:
- id (kebab-case string)
- name
- description (2–3 sentences)
- symptoms (array of 4–6 strings)
- causes (array of 3–5 strings)

Return strictly valid JSON in this format:
{
  "diseases": []
}

IMPORTANT: All human-readable fields (name, description, symptoms, causes) must be written in ${language} only. Do not use any other language.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const parsed = JSON.parse(text);

    if (!parsed?.diseases || !Array.isArray(parsed.diseases)) {
      throw new Error("Unexpected response structure");
    }

    await setCached(cacheKey, parsed.diseases);

    return NextResponse.json({
      diseases: parsed.diseases,
      cached: false,
      fallback: false,
    });

  } catch (error: any) {
    console.error("Gemini diseases error:", error);

    // 🔥 Fallback to cache if available (persistent)
    const cacheKey = `diseases:${bodyPart}:${language}`;
    const cached = await getCached<any>(cacheKey, TTL_MS);
    if (cached) {
      return NextResponse.json({
        diseases: cached,
        cached: true,
        fallback: true,
        message: "Returned cached data due to API error",
      });
    }

    // Proper 429 handling
    if (error?.status === 429) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again later." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to fetch diseases",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
