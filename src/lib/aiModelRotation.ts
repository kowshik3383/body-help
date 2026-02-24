/**
 * AI Model Rotation Strategy
 * Rotates through available Gemini models to prevent quota exhaustion
 */

const MODELS = [
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-1.0-pro',
  'gemini-1.5-flash-8b',
] as const;

let currentIndex = 0;

export function getNextModel(): string {
  const model = MODELS[currentIndex];
  currentIndex = (currentIndex + 1) % MODELS.length;
  return model;
}

export function getFallbackModel(currentModel: string): string {
  // Get next model different from current
  const currentIdx = MODELS.indexOf(currentModel as typeof MODELS[number]);
  const nextIdx = currentIdx >= 0 ? (currentIdx + 1) % MODELS.length : 0;
  return MODELS[nextIdx];
}

export function getAllModels(): readonly string[] {
  return MODELS;
}
