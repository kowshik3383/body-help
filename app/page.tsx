'use client';

import { useRouter } from 'next/navigation';
import { Info } from 'lucide-react';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { LanguageSelector } from '@/src/components/LanguageSelector';
import { ColorThemeSelector } from '@/src/components/ColorThemeSelector';
import Human from '@/src/components/Human';

export default function Home() {
  const router = useRouter();
  const { content } = useLanguage();

  return (
    <div className="relative w-full min-h-screen overflow-auto bg-surface text-gray-900 dark:text-white transition-colors duration-300">

      {/* Header */}
      <header className="sticky top-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-sm border-b border-primary/20 transition-colors">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-primary">
                Body Help
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                Interactive Medical Body Map
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <ColorThemeSelector />
              <LanguageSelector />
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Instructions Card */}


        {/* Human Body Map */}
        <div className="flex items-center justify-center">
          <Human />
        </div>
    
      </main>

      {/* Footer */}
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
