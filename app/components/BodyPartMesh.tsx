'use client';

import { useRef, useState } from 'react';
import { Mesh } from 'three';
import { BodyPart } from '@/types/medical';

interface BodyPartMeshProps {
  bodyPart: BodyPart;
  isSelected: boolean;
  onClick: (id: string) => void;
}

export function BodyPartMesh({ bodyPart, isSelected, onClick }: BodyPartMeshProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const getGeometry = () => {
    // Create simple geometric shapes for each body part
    switch (bodyPart.meshName) {
      case 'skull':
        return <sphereGeometry args={[0.12, 32, 32]} />;
      case 'spine':
        return <cylinderGeometry args={[0.03, 0.03, 0.6, 16]} />;
      case 'leftKnee':
      case 'rightKnee':
        return <sphereGeometry args={[0.06, 16, 16]} />;
      case 'leftShoulder':
      case 'rightShoulder':
        return <sphereGeometry args={[0.08, 16, 16]} />;
      case 'ribs':
        return <boxGeometry args={[0.25, 0.3, 0.15]} />;
      default:
        return <boxGeometry args={[0.1, 0.1, 0.1]} />;
    }
  };

  const getColor = () => {
    if (isSelected) return '#3b82f6'; // blue-500
    if (hovered) return '#60a5fa'; // blue-400
    return bodyPart.color;
  };

  return (
    <mesh
      ref={meshRef}
      position={bodyPart.position}
      onClick={(e) => {
        e.stopPropagation();
        onClick(bodyPart.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {getGeometry()}
      <meshStandardMaterial
        color={getColor()}
        emissive={hovered || isSelected ? '#3b82f6' : '#000000'}
        emissiveIntensity={hovered ? 0.3 : isSelected ? 0.5 : 0}
      />
    </mesh>
  );
}
