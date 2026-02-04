'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Disease, Treatment } from '@/src/types/medical';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { DiseaseDetail } from '@/src/components/DiseaseDetail';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { LanguageSelector } from '@/src/components/LanguageSelector';
import { SpeechButton } from '@/src/components/SpeechButton';
import { ChatPanel } from '@/src/components/ChatPanel';
import { TabBar } from '@/src/components/TabBar';
import { motion, AnimatePresence } from 'framer-motion';
import Human from '@/src/components/Human';

interface BodyPartPageProps {
  params: Promise<{ part: string }>;
}

export default function BodyPartPage({ params }: BodyPartPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { content } = useLanguage();
  const bodyPartContent = content.bodyParts[resolvedParams.part];

  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loadingDiseases, setLoadingDiseases] = useState(true);
  const [loadingTreatments, setLoadingTreatments] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'diseases' | 'chat'>('diseases');

  useEffect(() => {
    const controller = new AbortController();

    const fetchDiseases = async () => {
      try {
        setLoadingDiseases(true);
        const response = await fetch(
          `/api/diseases?bodyPart=${encodeURIComponent(resolvedParams.part)}`,
          { signal: controller.signal }
        );

        if (!response.ok) throw new Error('Failed to fetch diseases');

        const data = await response.json();
        setDiseases(data.diseases || []);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Error fetching diseases:', err);
          setError(err.message);
        }
      } finally {
        setLoadingDiseases(false);
      }
    };

    fetchDiseases();
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">{content.ui.bodyPartNotFound}</h1>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            {content.ui.returnHome}
          </button>
        </div>
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
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 p-6 bg-gradient-to-b from-slate-900/95 to-transparent backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">{content.ui.backToSkeleton}</span>
          </button>
          <LanguageSelector />
        </div>
        <h1 className="text-3xl font-bold text-white mt-4">
          {bodyPartContent.name}
        </h1>
      </header>

      <div className="flex h-full pt-24">
        {/* Human SVG - Left Side */}
        <div className="flex-1 relative flex items-center justify-center overflow-y-auto">
          <Human />
        </div>

        {/* Info Panel - Right Side */}
        <div className="w-full md:w-[520px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm flex flex-col">
          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            {loadingDiseases ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : error ? (
              <div className="p-6">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-red-800 dark:text-red-200">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
                  >
                    {content.ui.retry}
                  </button>
                </div>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {activeTab === 'diseases' ? (
                  <motion.div
                    key="diseases"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                  >
                    {selectedDisease ? (
                      <div className="p-6">
                        <button
                          onClick={() => setSelectedDisease(null)}
                          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors mb-6"
                        >
                          <ChevronLeft className="w-5 h-5" />
                          <span className="font-medium">{content.ui.backToConditions}</span>
                        </button>

                        <DiseaseDetail
                          disease={selectedDisease}
                          treatments={treatments}
                          loadingTreatments={loadingTreatments}
                        />
                      </div>
                    ) : (
                      <div className="p-6">
                        {/* Body Part Info Section */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mb-6"
                        >
                          <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                            {bodyPartContent.description}
                          </p>

                          {bodyPartContent.commonIssues.length > 0 && (
                            <div className="mb-4">
                              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                Common Issues
                              </h3>
                              <div className="flex flex-wrap gap-2">
                                {bodyPartContent.commonIssues.map((issue, idx) => (
                                  <span
                                    key={idx}
                                    className="px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-full text-xs"
                                  >
                                    {issue}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {bodyPartContent.careInstructions.length > 0 && (
                            <div className="mb-4">
                              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                Care Instructions
                              </h3>
                              <ul className="space-y-1">
                                {bodyPartContent.careInstructions.map((instruction, idx) => (
                                  <li
                                    key={idx}
                                    className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2"
                                  >
                                    <span className="text-emerald-500 mt-1">•</span>
                                    <span>{instruction}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <SpeechButton text={speechContent} className="w-full" />
                        </motion.div>

                        {/* Diseases Section */}
                        <div>
                          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                            {content.ui.relatedConditions}
                          </h2>

                          {diseases.length === 0 ? (
                            <p className="text-gray-600 dark:text-gray-300">
                              {content.ui.noConditions}
                            </p>
                          ) : (
                            <div className="space-y-3">
                              {diseases.map((disease) => (
                                <motion.button
                                  key={disease.id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.2 }}
                                  onClick={() => setSelectedDisease(disease)}
                                  className="w-full text-left bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md transition-all"
                                >
                                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                    {disease.name}
                                  </h3>
                                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                                    {disease.description}
                                  </p>
                                </motion.button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="chat"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                  >
                    <ChatPanel bodyPart={resolvedParams.part} />
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>

          {/* Tab Bar - Fixed at Bottom */}
          <TabBar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            diseasesLabel={content.ui.diseases}
            chatLabel={content.ui.aiChat}
          />
        </div>
      </div>
    </div>
  );
}
