'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BodyPartModel } from '@/src/components/BodyPartModel';
import { bodyParts } from '@/data/bodyParts';
import { Disease, Treatment } from '@/src/types/medical';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { DiseaseDetail } from '@/src/components/DiseaseDetail';

interface BodyPartPageProps {
  params: Promise<{ part: string }>;
}

export default function BodyPartPage({ params }: BodyPartPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const bodyPart = bodyParts[resolvedParams.part];

  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loadingDiseases, setLoadingDiseases] = useState(true);
  const [loadingTreatments, setLoadingTreatments] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bodyPart) return;

    const controller = new AbortController();

    const fetchDiseases = async () => {
      try {
        setLoadingDiseases(true);
        const response = await fetch(
          `/api/diseases?bodyPart=${encodeURIComponent(bodyPart.name)}`,
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
    return () => controller.abort(); // Cleanup prevents state updates on unmounted components
  }, [bodyPart]);
  useEffect(() => {
    if (!selectedDisease) {
      setTreatments([]);
      return;
    }

    // Fetch treatments for selected disease
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

  if (!bodyPart) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Body Part Not Found</h1>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 p-6">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-medium">Back to Full Skeleton</span>
        </button>
        <h1 className="text-3xl font-bold text-white mt-4">
          {bodyPart.name}
        </h1>
      </header>

      <div className="flex h-full pt-24">
        {/* 3D Model Viewer - Left Side */}
        <div className="flex-1 relative">
          <BodyPartModel
            modelPath={bodyPart.modelPath}
            bodyPartName={bodyPart.name}
          />
        </div>

        {/* Info Panel - Right Side */}
        <div className="w-full md:w-[480px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm overflow-y-auto p-6">
          {loadingDiseases ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-800 dark:text-red-200">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
              >
                Retry
              </button>
            </div>
          ) : selectedDisease ? (
            <div>
              <button
                onClick={() => setSelectedDisease(null)}
                className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors mb-6"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="font-medium">Back to conditions</span>
              </button>

              <DiseaseDetail
                disease={selectedDisease}
                treatments={treatments}
                loadingTreatments={loadingTreatments}
              />
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Related Conditions
              </h2>

              {diseases.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-300">
                  No conditions found for this body part.
                </p>
              ) : (
                <div className="space-y-3">
                  {diseases.map((disease) => (
                    <button
                      key={disease.id}
                      onClick={() => setSelectedDisease(disease)}
                      className="w-full text-left bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md transition-all"
                    >  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {disease.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {disease.description}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
