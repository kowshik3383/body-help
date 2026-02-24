'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { useUser } from '@/src/contexts/UserContext';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { OnboardingData } from '@/src/types/user';
import { PersonalDetailsScreen } from '@/src/components/onboarding/PersonalDetailsScreen';
import { ReviewScreen } from '@/src/components/onboarding/ReviewScreen';
import { WelcomeScreen } from '@/src/components/onboarding/WelcomeScreen';
import { Preloader } from '@/src/components/Preloader';

const STEPS = 3;

export default function OnboardingPage() {
  const router = useRouter();
  const { setUser } = useUser();
  const { setLanguage } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<OnboardingData>({
    name: '',
    age: 25,
    gender: 'other',
    language: 'en',
    healthGoal: 'nothing',
  });

  const handleNext = () => {
    if (currentStep < STEPS) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to create user');

      const data = await res.json();

      // Mark as onboarded
      await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: data.user.id, onboarded: true }),
      });

      // Update global user context
      setUser({ ...data.user, onboarded: true });

      // Update global language
      setLanguage(formData.language as any);

      // Redirect to home
      router.push('/');
    } catch (error) {
      console.error('Onboarding error:', error);
      alert('Failed to complete onboarding. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [currentStep]);


  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center ">
      <div className="w-full ">
        {/* Progress Indicator */}
        <Preloader variant="scale-fade-center" />

        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <WelcomeScreen
              key="step1"
              onNext={handleNext}
              step={currentStep}
              total={STEPS}
            />
          )}
          {currentStep === 2 && (
            <PersonalDetailsScreen
              key="step2"
              formData={formData}
              setFormData={setFormData}
              onNext={handleNext}
              step={currentStep}
              total={STEPS}
            />
          )}
          {currentStep === 3 && (
            <ReviewScreen
              key="step3"
              formData={formData}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              step={currentStep}
              total={STEPS}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}




