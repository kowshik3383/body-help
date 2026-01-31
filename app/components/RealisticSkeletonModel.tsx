'use client';

import { useRef, useState, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { Mesh, Object3D } from 'three';
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
  const [modelError, setModelError] = useState(false);

  // Try to load the realistic model, fallback to null if not available
  let gltf;
  try {
    gltf = useGLTF('/models/skeleton-full.glb', true);
  } catch (error) {
    console.warn('Realistic skeleton model not found. Using fallback geometry.');
    // Don't call setModelError here - it causes infinite renders
    gltf = null;
  }

  // Set model error state in useEffect to avoid render loop
  useEffect(() => {
    if (!gltf) {
      setModelError(true);
    }
  }, [gltf]);

  useEffect(() => {
    if (!gltf?.scene || !groupRef.current) return;

    // Find and setup clickable meshes for each body part
    Object.values(bodyParts).forEach((bodyPart) => {
      const variants = getMeshNameVariants(bodyPart.id);
      let mesh: Mesh | null = null;

      // Try to find mesh by name variants
      for (const variant of variants) {
        const found = gltf.scene.getObjectByName(variant);
        if (found && found instanceof Mesh) {
          mesh = found;
          break;
        }
      }

      if (mesh) {
        // Enable interaction
        mesh.userData.bodyPartId = bodyPart.id;
        
        // Store original material for restoration
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
          // Clone material if needed to avoid modifying shared materials
          if (!object.userData.modifiedMaterial) {
            object.material = object.material.clone();
            object.userData.modifiedMaterial = true;
          }

          const material = object.material as any;

          if (isSelected) {
            material.emissive?.setHex(0x3b82f6); // blue-500
            material.emissiveIntensity = 0.5;
          } else if (isHovered) {
            material.emissive?.setHex(0x60a5fa); // blue-400
            material.emissiveIntensity = 0.3;
          } else {
            material.emissive?.setHex(0x000000);
            material.emissiveIntensity = 0;
          }
        }
      }
    });
  }, [gltf, selectedBodyPart, hoveredPart]);

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    const bodyPartId = e.object.userData.bodyPartId;
    if (bodyPartId) {
      setHoveredPart(bodyPartId);
      document.body.style.cursor = 'pointer';
    }
  };

  const handlePointerOut = () => {
    setHoveredPart(null);
    document.body.style.cursor = 'auto';
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    const bodyPartId = e.object.userData.bodyPartId;
    if (bodyPartId) {
      onSelectBodyPart(bodyPartId);
    }
  };

  if (modelError || !gltf) {
    // Fallback to primitive geometry if model not loaded
    return (
      <group ref={groupRef}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        
        {Object.values(bodyParts).map((bodyPart) => {
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
        })}
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

// Preload the model
useGLTF.preload('/models/skeleton-full.glb');
