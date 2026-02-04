'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { RealisticSkeletonModel } from './RealisticSkeletonModel';
import { CameraController } from './CameraController';
import { bodyParts } from '@/data/bodyParts';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

interface SkeletonViewerProps {
  selectedBodyPart: string | null;
  onSelectBodyPart: (id: string) => void;
}

function LoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center text-white">
        <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
        <p className="text-lg">Loading 3D Model...</p>
      </div>
    </div>
  );
}

export function SkeletonViewer({ selectedBodyPart, onSelectBodyPart }: SkeletonViewerProps) {
  const targetPosition = selectedBodyPart 
    ? bodyParts[selectedBodyPart]?.position 
    : null;

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0.5, 3], fov: 50 }}
        shadows
        className="bg-gradient-to-b from-slate-900 to-slate-800"
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          <directionalLight position={[-10, -10, -5]} intensity={0.5} />
          
          {/* Environment for better reflections and ambient lighting */}
          <Environment preset="studio" />
          
          {/* Realistic Skeleton Model */}
          <RealisticSkeletonModel
            selectedBodyPart={selectedBodyPart}
            onSelectBodyPart={onSelectBodyPart}
          />
          
          {/* Camera Animation Controller */}
          <CameraController targetPosition={targetPosition} />
          
          {/* Orbit Controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={1}
            maxDistance={5}
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 6}
          />
        </Suspense>
      </Canvas>
      
      <LoadingFallback />
    </div>
  );
}
