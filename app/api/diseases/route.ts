/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// In-memory cache
const diseaseCache = new Map<string, any>();

export async function GET(request: NextRequest) {
  const bodyPart = request.nextUrl.searchParams.get("bodyPart");

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
      model: "gemini-2.5-flash-lite",
      generationConfig: {
        temperature: 0.4,
        responseMimeType: "application/json",
      },
    });

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
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const parsed = JSON.parse(text);

    if (!parsed?.diseases || !Array.isArray(parsed.diseases)) {
      throw new Error("Unexpected response structure");
    }

    // ✅ Save successful response to cache
    diseaseCache.set(bodyPart, parsed.diseases);

    return NextResponse.json({
      diseases: parsed.diseases,
      cached: false,
      fallback: false,
    });

  } catch (error: any) {
    console.error("Gemini diseases error:", error);

    // 🔥 Fallback to cache if available
    if (diseaseCache.has(bodyPart)) {
      return NextResponse.json({
        diseases: diseaseCache.get(bodyPart),
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
