export type LanguageCode = 'en' | 'hi' | 'ta' | 'te' | 'kn' | 'ml' | 'bn' | 'mr' | 'gu' | 'pa' | 'or' | 'as';

export type SpeechStatus = 'idle' | 'speaking' | 'paused';

export type MessageRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
}

export interface BodyPartContent {
  name: string;
  description: string;
  commonIssues: string[];
  careInstructions: string[];
}

export interface UILabels {
  language: string;
  listen: string;
  stop: string;
  send: string;
  back: string;
  backToSkeleton: string;
  relatedConditions: string;
  treatments: string;
  symptoms: string;
  causes: string;
  typeQuestion: string;
  askAbout: string;
  noConditions: string;
  aiThinking: string;
  loading: string;
  error: string;
  bodyPartNotFound: string;
  returnHome: string;
  retry: string;
  backToConditions: string;
  gettingStarted: string;
  gettingStartedDesc: string;
  diseases: string;
  aiChat: string;
  speakToType: string;
  listening: string;
  stopListening: string;
}

export interface Messages {
  aiThinking: string;
  loading: string;
  error: string;
  noConditions: string;
}

export interface LanguageContent {
  code: LanguageCode;
  name: string;
  nativeName: string;
  voiceCode: string; // For TTS and STT
  bodyParts: Record<string, BodyPartContent>;
  ui: UILabels;
}
