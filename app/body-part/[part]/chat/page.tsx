"use client";

import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import { ChatPanel } from '@/src/components/ChatPanel';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { LanguageSelector } from '@/src/components/LanguageSelector';
import { ColorThemeSelector } from '@/src/components/ColorThemeSelector';

interface ChatPageProps {
  params: Promise<{ part: string }>;
}

export default function BodyPartChatPage({ params }: ChatPageProps) {
  const { part } = use(params);
  const router = useRouter();
  const { content, language } = useLanguage();

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/30">
      {/* Header */}
      <header className="sticky top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-3 lg:gap-4">
            <button
              onClick={() => router.push(`/body-part/${encodeURIComponent(part)}?tab=diseases`) }
              className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all group"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-x-1" />
              <span className="hidden xs:inline font-medium text-sm sm:text-base">{content.ui.back}</span>
            </button>

            <h1 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent flex-1 text-center bg-[length:200%_auto] animate-gradient truncate px-2">
              {content.ui.aiChat}
            </h1>

            <div className="flex items-center gap-1 sm:gap-1.5 lg:gap-2">
              <ColorThemeSelector />
              <LanguageSelector />
            </div>
          </div>
        </div>
      </header>

      {/* Full-screen chat area */}
      <div className="h-[calc(100vh-60px)] sm:h-[calc(100vh-73px)] lg:h-[calc(100vh-81px)]">
        <ChatPanel bodyPart={part} language={language} />
      </div>

      <style jsx global>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}
