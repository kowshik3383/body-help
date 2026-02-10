/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// Optimizations: Fixed useEffect state update issues, improved material handling, added cleanup
'use client';

import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { Mesh, Object3D, Material } from 'three';
import { bodyParts, getMeshNameVariants } from '@/data/bodyParts';

interface RealisticSkeletonModelProps {
  selectedBodyPart: string | null;
  onSelectBodyPart: (id: string) => void;
}

export function RealisticSkeletonModel({
  selectedBodyPart,
  onSelectBodyPart,
}: RealisticSkeletonModelProps) {
  const groupRef = useRef<Object3D>(null);
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  // Try to load the realistic model
  let gltf = null;
  let modelError = false;
  
  try {
    gltf = useGLTF('/models/skeleton-full.glb', true);
  } catch (error) {
    console.warn('Realistic skeleton model not found. Using fallback geometry.');
    modelError = true;
  }

  // Setup clickable meshes
  useEffect(() => {
    if (!gltf?.scene || !groupRef.current) return;

    Object.values(bodyParts).forEach((bodyPart) => {
      const variants = getMeshNameVariants(bodyPart.id);
      let mesh: Mesh | null = null;

      for (const variant of variants) {
        const found = gltf.scene.getObjectByName(variant);
        if (found && found instanceof Mesh) {
          mesh = found;
          break;
        }
      }

      if (mesh) {
        mesh.userData.bodyPartId = bodyPart.id;
        
        if (!mesh.userData.originalMaterial) {
          mesh.userData.originalMaterial = mesh.material;
        }
      } else {
        console.warn(`Mesh not found for body part: ${bodyPart.id}. Tried variants:`, variants);
      }
    });
  }, [gltf]);

  // Update materials based on hover and selection
  useEffect(() => {
    if (!gltf?.scene) return;

    gltf.scene.traverse((object) => {
      if (object instanceof Mesh && object.userData.bodyPartId) {
        const bodyPartId = object.userData.bodyPartId;
        const isSelected = bodyPartId === selectedBodyPart;
        const isHovered = bodyPartId === hoveredPart;

        if (object.material) {
          if (!object.userData.modifiedMaterial) {
            object.material = (object.material as Material).clone();
            object.userData.modifiedMaterial = true;
          }

          const material = object.material as any;

          if (isSelected) {
            material.emissive?.setHex(0x3b82f6);
            material.emissiveIntensity = 0.5;
          } else if (isHovered) {
            material.emissive?.setHex(0x60a5fa);
            material.emissiveIntensity = 0.3;
          } else {
            material.emissive?.setHex(0x000000);
            material.emissiveIntensity = 0;
          }
        }
      }
    });
  }, [gltf, selectedBodyPart, hoveredPart]);

  const handlePointerOver = useCallback((e: any) => {
    e.stopPropagation();
    const bodyPartId = e.object.userData.bodyPartId;
    if (bodyPartId) {
      setHoveredPart(bodyPartId);
      document.body.style.cursor = 'pointer';
    }
  }, []);

  const handlePointerOut = useCallback(() => {
    setHoveredPart(null);
    document.body.style.cursor = 'auto';
  }, []);

  const handleClick = useCallback((e: any) => {
    e.stopPropagation();
    const bodyPartId = e.object.userData.bodyPartId;
    if (bodyPartId) {
      onSelectBodyPart(bodyPartId);
    }
  }, [onSelectBodyPart]);

  // Cleanup cursor on unmount
  useEffect(() => {
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, []);

  const bodyPartComponents = useMemo(() => {
    return Object.values(bodyParts).map((bodyPart) => {
      const isSelected = selectedBodyPart === bodyPart.id;
      const isHovered = hoveredPart === bodyPart.id;
      
      return (
        <mesh
          key={bodyPart.id}
          position={bodyPart.position}
          onClick={() => onSelectBodyPart(bodyPart.id)}
          onPointerOver={() => {
            setHoveredPart(bodyPart.id);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            setHoveredPart(null);
            document.body.style.cursor = 'auto';
          }}
        >
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshStandardMaterial
            color={isSelected ? '#3b82f6' : isHovered ? '#60a5fa' : bodyPart.color}
            emissive={isSelected || isHovered ? '#3b82f6' : '#000000'}
            emissiveIntensity={isSelected ? 0.5 : isHovered ? 0.3 : 0}
          />
        </mesh>
      );
    });
  }, [selectedBodyPart, hoveredPart, onSelectBodyPart]);

  if (modelError || !gltf) {
    return (
      <group ref={groupRef}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        {bodyPartComponents}
      </group>
    );
  }

  return (
    <group ref={groupRef}>
      <primitive
        object={gltf.scene}
        scale={1}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      />
    </group>
  );
}

useGLTF.preload('/models/skeleton-full.glb');
