'use client';

import { BodyPartMesh } from './BodyPartMesh';
import { bodyParts } from '@/data/bodyParts';

interface Skeleton3DProps {
  selectedBodyPart: string | null;
  onSelectBodyPart: (id: string) => void;
}

export function Skeleton3D({ selectedBodyPart, onSelectBodyPart }: Skeleton3DProps) {
  return (
    <group>
      {/* Ambient lighting for overall illumination */}
      <ambientLight intensity={0.5} />
      
      {/* Directional light for depth and shadows */}
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <directionalLight position={[-5, 5, -5]} intensity={0.5} />

      {/* Render all body parts */}
      {Object.values(bodyParts).map((bodyPart) => (
        <BodyPartMesh
          key={bodyPart.id}
          bodyPart={bodyPart}
          isSelected={selectedBodyPart === bodyPart.id}
          onClick={onSelectBodyPart}
        />
      ))}

      {/* Connection lines between body parts for visual continuity */}
      {selectedBodyPart === null && (
        <>
          {/* Neck connection */}
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([0, 1.38, 0, 0, 1.1, 0])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#d1cfc9" linewidth={2} />
          </line>

          {/* Left arm connection */}
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([0, 1.1, 0, -0.4, 1.1, 0])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#d1cfc9" linewidth={2} />
          </line>

          {/* Right arm connection */}
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([0, 1.1, 0, 0.4, 1.1, 0])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#d1cfc9" linewidth={2} />
          </line>

          {/* Left leg connection */}
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([0, 0.2, 0, -0.2, -0.8, 0])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#d1cfc9" linewidth={2} />
          </line>

          {/* Right leg connection */}
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([0, 0.2, 0, 0.2, -0.8, 0])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#d1cfc9" linewidth={2} />
          </line>
        </>
      )}
    </group>
  );
}
