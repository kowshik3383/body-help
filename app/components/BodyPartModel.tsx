'use client';

import { Suspense } from 'react';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

interface BodyPartModelProps {
  modelPath: string;
  bodyPartName: string;
}

function Model({ modelPath }: { modelPath: string }) {
  let gltf;
  try {
    gltf = useGLTF(modelPath, true);
  } catch (error) {
    console.warn(`Model not found at ${modelPath}. Using fallback.`);
    
    // Fallback primitive geometry
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
}

export function BodyPartModel({ modelPath, bodyPartName }: BodyPartModelProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        shadows
        className="bg-gradient-to-b from-slate-900 to-slate-800"
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          <directionalLight position={[-10, -10, -5]} intensity={0.5} />
          
          {/* Environment for better reflections */}
          <Environment preset="studio" />
          
          {/* 3D Model */}
          <Model modelPath={modelPath} />
          
          {/* Controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={1}
            maxDistance={10}
            autoRotate={true}
            autoRotateSpeed={2}
          />
        </Suspense>
      </Canvas>

      {/* Model info overlay */}
      <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          3D Model: {bodyPartName}
        </p>
      </div>
    </div>
  );
}
