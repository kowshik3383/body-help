// Optimizations: Improved loading fallback positioning, better performance with useMemo
'use client';

import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { RealisticSkeletonModel } from './RealisticSkeletonModel';
import { CameraController } from './CameraController';
import { bodyParts } from '@/data/bodyParts';
import { Loader2 } from 'lucide-react';

interface SkeletonViewerProps {
  selectedBodyPart: string | null;
  onSelectBodyPart: (id: string) => void;
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#3b82f6" wireframe />
    </mesh>
  );
}

export function SkeletonViewer({ selectedBodyPart, onSelectBodyPart }: SkeletonViewerProps) {
  const targetPosition = useMemo(() => {
    return selectedBodyPart && bodyParts[selectedBodyPart]
      ? bodyParts[selectedBodyPart].position
      : null;
  }, [selectedBodyPart]);

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0.5, 3], fov: 50 }}
        shadows
        className="bg-linear-to-b from-slate-900 to-slate-800"
      >
        <Suspense fallback={<LoadingFallback />}>
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
            enablePan
            enableZoom
            enableRotate
            minDistance={1}
            maxDistance={5}
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 6}
          />
        </Suspense>
      </Canvas>
      
      {/* Loading indicator overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center text-white opacity-0 animate-pulse">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p className="text-lg">Loading 3D Model...</p>
        </div>
      </div>
    </div>
  );
}
