'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Disease, Treatment } from '@/src/types/medical';
import { ChevronLeft, Loader2, Sparkles } from 'lucide-react';
import { DiseaseDetail } from '@/src/components/DiseaseDetail';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { LanguageSelector } from '@/src/components/LanguageSelector';
import { ColorThemeSelector } from '@/src/components/ColorThemeSelector';
import { SpeechButton } from '@/src/components/SpeechButton';
import { ChatPanel } from '@/src/components/ChatPanel';
import { TabBar } from '@/src/components/TabBar';
import { motion, AnimatePresence } from 'framer-motion';
import Human from '@/src/components/Human';
import { BodyPartModel } from '@/src/components/BodyPartModel';
import { bodyParts } from '@/data/bodyParts';
import ExerciseComponent from '@/src/components/ExerciseComponent';

interface BodyPartPageProps {
  params: Promise<{ part: string }>;
}

export default function BodyPartPage({ params }: BodyPartPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { content } = useLanguage();
  const bodyPartContent = content.bodyParts[resolvedParams.part];
  const bodyPartData = bodyParts[resolvedParams.part];

  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loadingDiseases, setLoadingDiseases] = useState(true);
  const [loadingTreatments, setLoadingTreatments] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'diseases' | 'chat' | 'exercise'>('diseases');
  const [showModel, setShowModel] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchDiseases = async () => {
      try {
        setLoadingDiseases(true);
        setError(null);

        const response = await fetch(
          `/api/diseases?bodyPart=${encodeURIComponent(resolvedParams.part)}`,
          { signal: controller.signal }
        );

        const data = await response.json();

        // Handle rate limit separately
        if (response.status === 429) {
          throw new Error("Too many requests. Please try again shortly.");
        }

        if (!response.ok) {
          throw new Error(data?.error || "Failed to fetch diseases");
        }

        setDiseases(data.diseases || []);

        // Optional: show small UI indicator if fallback happened
        if (data.fallback) {
          console.warn("Using cached data due to API failure.");
        }

      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Error fetching diseases:", err);
          setError(err.message);
          setDiseases([]); // clear stale UI state
        }
      } finally {
        setLoadingDiseases(false);
      }
    };

    if (resolvedParams.part) {
      fetchDiseases();
    }

    return () => controller.abort();
  }, [resolvedParams.part]);

  useEffect(() => {
    if (!selectedDisease) {
      setTreatments([]);
      return;
    }

    const fetchTreatments = async () => {
      try {
        setLoadingTreatments(true);

        const response = await fetch(`/api/treatments?disease=${encodeURIComponent(selectedDisease.name)}`);

        if (!response.ok) {
          throw new Error('Failed to fetch treatments');
        }

        const data = await response.json();
        setTreatments(data.treatments || []);
      } catch (err) {
        console.error('Error fetching treatments:', err);
        setError(err instanceof Error ? err.message : 'Failed to load treatments');
      } finally {
        setLoadingTreatments(false);
      }
    };

    fetchTreatments();
  }, [selectedDisease]);

  if (!bodyPartContent) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-6 sm:p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 max-w-md w-full"
        >
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {content.ui.bodyPartNotFound}
          </h1>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all transform hover:scale-105 shadow-lg font-medium w-full sm:w-auto"
          >
            {content.ui.returnHome}
          </button>
        </motion.div>
      </div>
    );
  }

  // Prepare content for speech
  const speechContent = `
    ${bodyPartContent.name}. 
    ${bodyPartContent.description}
    ${bodyPartContent.commonIssues.length > 0 ? `Common issues: ${bodyPartContent.commonIssues.join(', ')}.` : ''}
    ${bodyPartContent.careInstructions.length > 0 ? `Care instructions: ${bodyPartContent.careInstructions.join('. ')}.` : ''}
  `;

  return (
    <div className="relative font-poppins w-full min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/30">
      {/* Animated background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-blue-100/20 to-purple-100/20 dark:from-blue-900/10 dark:to-purple-900/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-purple-100/20 to-blue-100/20 dark:from-purple-900/10 dark:to-blue-900/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header */}
      <header className="sticky font-poppins top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-3 lg:gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/')}
              className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all group"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-x-1" />
              <span className="hidden xs:inline font-medium text-sm sm:text-base">{content.ui.backToSkeleton}</span>
            </motion.button>

            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent flex-1 text-center bg-[length:200%_auto] animate-gradient truncate px-2"
            >
              {bodyPartContent.name}
            </motion.h1>

            <div className="flex items-center gap-1 sm:gap-1.5 lg:gap-2">
              <ColorThemeSelector />
              <LanguageSelector />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative h-[calc(100vh-60px)] sm:h-[calc(100vh-73px)] lg:h-[calc(100vh-81px)]">
        <div className="flex flex-col lg:flex-row h-full">
          {/* Left Side - Toggle between Human SVG and 3D Model */}
          <div className="w-full lg:flex-1 relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50/30 to-purple-50/30 dark:from-gray-900/50 dark:to-blue-950/30 border-b lg:border-b-0 lg:border-r border-gray-200/50 dark:border-gray-800/50 h-[35vh] sm:h-[40vh] lg:h-full">
            {/* Decorative grid overlay */}
            <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]" style={{
              backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }} />

            {/* Toggle Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute top-2 sm:top-3 lg:top-4 left-2 sm:left-3 lg:left-4 z-10"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowModel(!showModel)}
                className="px-2.5 py-1.5 sm:px-3 sm:py-2 lg:px-4 lg:py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg sm:rounded-xl transition-all shadow-lg hover:shadow-xl text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2 backdrop-blur-sm"
              >
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" />
                <span className="hidden xs:inline">{showModel ? 'Body Map' : '3D Model'}</span>
                <span className="xs:hidden">{showModel ? 'Map' : '3D'}</span>
              </motion.button>
            </motion.div>

            {/* Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={showModel ? 'model' : 'map'}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full flex items-center justify-center p-3 sm:p-4 lg:p-6"
              >
                {showModel && bodyPartData ? (
                  <div className="w-full max-w-2xl h-full max-h-[400px] sm:max-h-[500px] lg:max-h-[600px] relative rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50">
                    <BodyPartModel
                      modelPath={bodyPartData.modelPath}
                      bodyPartName={bodyPartData.name}
                    />
                  </div>
                ) : (
                  <div className="relative w-full max-w-md">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/5 dark:to-purple-500/5 rounded-full blur-3xl scale-50" />
                    <Human />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Info Panel - Right Side */}
          <div className="w-full lg:w-[45%] xl:w-[520px] 2xl:w-[600px] bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl flex flex-col border-l border-gray-200/50 dark:border-gray-800/50 shadow-2xl h-[65vh] sm:h-[60vh] lg:h-full">
            {/* Content Area */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent min-h-0">
              {loadingDiseases ? (
                <div className="flex items-center justify-center h-full py-12 sm:py-16 lg:py-20">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 dark:text-blue-400" />
                  </motion.div>
                </div>
              ) : error ? (
                <div className="p-3 sm:p-4 lg:p-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200 dark:border-red-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 shadow-lg"
                  >
                    <p className="text-red-800 dark:text-red-200 text-xs sm:text-sm mb-3 sm:mb-4">{error}</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => window.location.reload()}
                      className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white rounded-lg sm:rounded-xl transition-all shadow-md text-xs sm:text-sm font-medium w-full sm:w-auto"
                    >
                      {content.ui.retry}
                    </motion.button>
                  </motion.div>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  {activeTab === "diseases" ? (
                    <motion.div
                      key="diseases"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="h-full"
                    >
                      {/* Existing Diseases UI (unchanged) */}
                      {selectedDisease ? (
                        <div className="p-3 sm:p-4 lg:p-6">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedDisease(null)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl 
              bg-gradient-to-r from-blue-50 to-purple-50 
              dark:from-blue-900/20 dark:to-purple-900/20
              text-blue-700 dark:text-blue-300
              transition-all mb-6"
                          >
                            <ChevronLeft className="w-5 h-5" />
                            <span className="font-medium text-sm">
                              {content.ui.backToConditions}
                            </span>
                          </motion.button>

                          <DiseaseDetail
                            disease={selectedDisease}
                            treatments={treatments}
                            loadingTreatments={loadingTreatments}
                          />
                        </div>
                      ) : (
                        <div className="p-3 sm:p-4 lg:p-6">
                          {/* Body Part Info Section */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            className="mb-6 sm:mb-7 lg:mb-8"
                          >
                            <div className="bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 border border-blue-200/30 dark:border-blue-800/30 shadow-sm">
                              <p className="text-gray-700 dark:text-gray-300 mb-4 sm:mb-5 leading-relaxed text-xs sm:text-sm lg:text-base">
                                {bodyPartContent.description}
                              </p>

                              {bodyPartContent.commonIssues.length > 0 && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.2 }}
                                  className="mb-4 sm:mb-5"
                                >
                                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 flex items-center gap-2">
                                    <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-gradient-to-r from-red-500 to-orange-500" />
                                    Common Issues
                                  </h3>
                                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                    {bodyPartContent.commonIssues.map((issue, idx) => (
                                      <motion.span
                                        key={idx}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.3 + idx * 0.05 }}
                                        className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 text-red-700 dark:text-red-300 rounded-full text-[10px] sm:text-xs font-medium border border-red-200/50 dark:border-red-800/50 shadow-sm"
                                      >
                                        {issue}
                                      </motion.span>
                                    ))}
                                  </div>
                                </motion.div>
                              )}

                              {bodyPartContent.careInstructions.length > 0 && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.3 }}
                                  className="mb-4 sm:mb-5"
                                >
                                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 flex items-center gap-2">
                                    <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
                                    Care Instructions
                                  </h3>
                                  <ul className="space-y-2 sm:space-y-2.5">
                                    {bodyPartContent.careInstructions.map((instruction, idx) => (
                                      <motion.li
                                        key={idx}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 + idx * 0.05 }}
                                        className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2 sm:gap-3 bg-white/50 dark:bg-gray-900/30 rounded-lg sm:rounded-xl p-2.5 sm:p-3 border border-gray-200/30 dark:border-gray-800/30"
                                      >
                                        <span className="text-emerald-500 mt-0.5 flex-shrink-0 text-sm sm:text-base">✓</span>
                                        <span className="leading-relaxed">{instruction}</span>
                                      </motion.li>
                                    ))}
                                  </ul>
                                </motion.div>
                              )}

                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                              >
                                <SpeechButton text={speechContent} className="w-full" />
                              </motion.div>
                            </div>
                          </motion.div>

                          {/* Diseases Section */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 sm:mb-5 flex items-center gap-2">
                              <span className="w-0.5 sm:w-1 h-5 sm:h-6 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full" />
                              {content.ui.relatedConditions}
                            </h2>

                            {diseases.length === 0 ? (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-8 sm:py-10 lg:py-12 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-800"
                              >
                                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
                                  {content.ui.noConditions}
                                </p>
                              </motion.div>
                            ) : (
                              <div className="space-y-2.5 sm:space-y-3 lg:space-y-4">
                                {diseases.map((disease, idx) => (
                                  <motion.button
                                    key={disease.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.4 + idx * 0.1 }}
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setSelectedDisease(disease)}
                                    className="w-full text-left bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-900 dark:to-blue-950/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 border border-gray-200/50 dark:border-gray-800/50 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-xl transition-all group overflow-hidden relative"
                                  >
                                    {/* Shine effect on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                                    <div className="relative">
                                      <h3 className="font-bold text-gray-900 dark:text-white mb-1.5 sm:mb-2 text-xs sm:text-sm lg:text-base flex items-center gap-1.5 sm:gap-2">
                                        <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 group-hover:scale-150 transition-transform" />
                                        {disease.name}
                                      </h3>
                                      <p className="text-[10px] sm:text-xs lg:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                                        {disease.description}
                                      </p>
                                    </div>
                                  </motion.button>
                                ))}
                              </div>
                            )}
                          </motion.div>
                        </div>
                      )}
                    </motion.div>
                  ) : activeTab === "exercise" ? (
                    <motion.div
                      key="exercise"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="h-full overflow-y-auto p-3 sm:p-4 lg:p-6"
                    >
                      <ExerciseComponent bodyPart={resolvedParams.part} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="chat"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="h-full flex flex-col"
                    >
                      <div className="flex-1 min-h-0 overflow-hidden">
                        <ChatPanel bodyPart={resolvedParams.part} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>

            {/* Tab Bar - Fixed at Bottom */}
            <div className="border-t border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl">
              <TabBar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                diseasesLabel={content.ui.diseases}
                chatLabel={content.ui.aiChat}
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }

        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }

        .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }

        .dark .scrollbar-thumb-gray-700::-webkit-scrollbar-thumb {
          background: #374151;
          border-radius: 3px;
        }

        .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }

        .dark .scrollbar-thumb-gray-700::-webkit-scrollbar-thumb:hover {
          background: #4b5563;
        }

        /* Custom breakpoint for extra small devices */
        @media (min-width: 380px) {
          .xs\:inline {
            display: inline;
          }
          .xs\:hidden {t
            display: none;
          }
        }
      `}</style>
    </div>
  );
}