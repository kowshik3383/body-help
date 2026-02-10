/* eslint-disable @typescript-eslint/no-unused-vars */
// Optimizations: Removed unused className prop, improved error handling, added proper TypeScript types
'use client';

import { Suspense, memo } from 'react';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

interface BodyPartModelProps {
  modelPath: string;
  bodyPartName: string;
}

interface ModelProps {
  modelPath: string;
}

const Model = memo(function Model({ modelPath }: ModelProps) {
  let gltf;
  try {
    gltf = useGLTF(modelPath, true);
  } catch (error) {
    console.warn(`Model not found at ${modelPath}. Using fallback.`);
    
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#e8e6e3" />
      </mesh>
    );
  }

  if (!gltf?.scene) {
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#e8e6e3" />
      </mesh>
    );
  }

  return <primitive object={gltf.scene} scale={1.5} />;
});

export const BodyPartModel = memo(function BodyPartModel({ 
  modelPath, 
  bodyPartName 
}: BodyPartModelProps) {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <directionalLight position={[-10, -10, -5]} intensity={0.5} />
          
          {/* Environment for better reflections */}
          <Environment preset="studio" />
          
          {/* 3D Model */}
          <Model modelPath={modelPath} />
          
          {/* Controls */}
          <OrbitControls
            enablePan
            enableZoom
            enableRotate
            minDistance={2}
            maxDistance={4}
            autoRotate
            autoRotateSpeed={12}
          />
        </Suspense>
      </Canvas>
    </div>
  );
});
