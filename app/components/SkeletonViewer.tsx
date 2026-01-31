'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Skeleton3D } from './Skeleton3D';
import { CameraController } from './CameraController';
import { bodyParts } from '@/data/bodyParts';
import { Suspense } from 'react';

interface SkeletonViewerProps {
  selectedBodyPart: string | null;
  onSelectBodyPart: (id: string) => void;
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
          <Skeleton3D
            selectedBodyPart={selectedBodyPart}
            onSelectBodyPart={onSelectBodyPart}
          />
          <CameraController targetPosition={targetPosition} />
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
    </div>
  );
}
