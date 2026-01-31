'use client';

import { SkeletonViewer } from './components/SkeletonViewer';
import { useRouter } from 'next/navigation';
import { Info } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null);

  const handleSelectBodyPart = (bodyPartId: string) => {
    setSelectedBodyPart(bodyPartId);
    // Navigate to the dedicated body part page
    router.push(`/body-part/${bodyPartId}`);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Body Help
            </h1>
            <p className="text-slate-300 mt-1">
              Interactive 3D Medical Visualization
            </p>
          </div>
        </div>
      </header>

      {/* Instructions overlay */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-6 py-4 shadow-lg max-w-md">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              Getting Started
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Click on any body part to explore AI-powered medical insights. 
              Use your mouse to rotate, zoom, and pan the 3D skeleton.
            </p>
          </div>
        </div>
      </div>

      {/* 3D Skeleton Viewer */}
      <SkeletonViewer
        selectedBodyPart={selectedBodyPart}
        onSelectBodyPart={handleSelectBodyPart}
      />
    </div>
  );
}
