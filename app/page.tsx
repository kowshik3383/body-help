'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { useUser } from '@/src/contexts/UserContext';
import { LanguageSelector } from '@/src/components/LanguageSelector';
import { ColorThemeSelector } from '@/src/components/ColorThemeSelector';
import { Navigation } from '@/src/components/Navigation';
import Human from '@/src/components/Human';
import { Preloader } from '@/src/components/Preloader';

export default function Home() {
  const router = useRouter();
  const { content } = useLanguage();
  const { user, isLoading } = useUser();

  // Check onboarding status
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // No user, redirect to onboarding
        router.push('/onboarding');
      } else if (!user.onboarded) {
        // User exists but not onboarded
        router.push('/onboarding');
      }
    }
  }, [user, isLoading, router]);

  // Show loading while checking user status
  if (isLoading || !user || !user.onboarded) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading Diagnova...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen overflow-auto bg-surface text-gray-900 dark:text-white transition-colors duration-300">
      <Preloader variant="3d-flip" />
      <header className="sticky top-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-sm border-b border-primary/20 transition-colors">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-primary">
                Diagnova
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                AI-Powered Health Platform
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <ColorThemeSelector />
              <LanguageSelector />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Welcome, {user.name}!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Select a body part to explore health insights
          </p>
        </div>

        <div className="flex items-center justify-center">
          <Human />
        </div>
      </main>

      <footer className="border-t border-primary/20 fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            {content.ui.gettingStartedDesc}
          </p>
        </div>
      </footer>
    </div>
  );
}
