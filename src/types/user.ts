export type Gender = 'male' | 'female' | 'other';

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  language: string;
  healthGoal?: string;
  onboarded: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface OnboardingData {
  name: string;
  age: number;
  gender: Gender;
  language: string;
  healthGoal?: string;
}
