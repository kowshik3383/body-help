/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
import { getCached, setCached } from '@/src/utils/cache';

const TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export async function GET(request: NextRequest) {
  try {
    const disease = request.nextUrl.searchParams.get("disease");
    const language = request.nextUrl.searchParams.get("language") || 'en';

    if (!disease) {
      return NextResponse.json(
        { error: "Missing disease parameter" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    // 🔥 Cache check (persistent)
    const cacheKey = `treatments:${disease}:${language}`;
    const cached = await getCached<any>(cacheKey, TTL_MS);
    if (cached) {
      return NextResponse.json({
        treatments: cached,
        cached: true,
      });
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-3-flash-preview',
      generationConfig: {
        temperature: 0.5,
        responseMimeType: "application/json",
      },
    });

    const prompt = `
Provide 6–10 evidence-based treatments for ${disease}.

Each treatment must include:
- id (kebab-case)
- name
- type ("medication" | "lifestyle" | "therapy" | "surgical")
- description (2–3 sentences)

Return strictly valid JSON:
{
  "treatments": []
}

IMPORTANT: All human-readable fields (name, description) must be written in ${language} only. Do not use any other language.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new Error("Invalid JSON returned from Gemini");
    }

    if (!parsed?.treatments || !Array.isArray(parsed.treatments)) {
      throw new Error("Unexpected response structure");
    }

    // 🔥 Save to persistent cache
    await setCached(cacheKey, parsed.treatments);

    return NextResponse.json({
      treatments: parsed.treatments,
      cached: false,
    });

  } catch (error: any) {
    console.error("Gemini treatments error:", error);

    if (error?.status === 429) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again later." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch treatments", message: error.message },
      { status: 500 }
    );
  }
}
