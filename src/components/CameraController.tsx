'use client';

import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { Vector3 } from 'three';

interface CameraControllerProps {
  targetPosition: [number, number, number] | null;
  onComplete?: () => void;
}

export function CameraController({ targetPosition, onComplete }: CameraControllerProps) {
  const { camera } = useThree();
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!targetPosition) {
      // Reset to default position
      animateCamera(new Vector3(0, 0.5, 3), 1000);
      return;
    }

    // Focus on selected body part
    const target = new Vector3(...targetPosition);
    const offset = new Vector3(0, 0, 1.5); // Move camera closer for focus
    const cameraPosition = target.clone().add(offset);
    
    animateCamera(cameraPosition, 1000);
  }, [targetPosition]);

  const animateCamera = (targetPos: Vector3, duration: number) => {
    const startPos = camera.position.clone();
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      
      camera.position.lerpVectors(startPos, targetPos, eased);
      camera.lookAt(targetPosition ? new Vector3(...targetPosition) : new Vector3(0, 0.5, 0));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        onComplete?.();
      }
    };

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    animate();
  };

  return null;
}
