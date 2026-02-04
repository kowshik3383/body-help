import { BodyPart } from '@/src/types/medical';

export const bodyParts: Record<string, BodyPart> = {
  skull: {
    id: 'skull',
    name: 'Skull',
    meshName: 'Skull', // Will try variants: Skull, Head, Cranium
    modelPath: '/models/parts/skull.glb',
    position: [0, 1.5, 0],
    color: '#e8e6e3',
  },
  spine: {
    id: 'spine',
    name: 'Spine',
    meshName: 'Spine', // Will try variants: Spine, Vertebrae, SpinalColumn
    modelPath: '/models/parts/spine.glb',
    position: [0, 0.5, 0],
    color: '#e8e6e3',
  },
  leftKnee: {
    id: 'leftKnee',
    name: 'Left Knee',
    meshName: 'LeftKnee', // Will try variants: LeftKnee, KneeLeft, L_Knee
    modelPath: '/models/parts/leftKnee.glb',
    position: [-0.2, -0.8, 0],
    color: '#e8e6e3',
  },
  rightKnee: {
    id: 'rightKnee',
    name: 'Right Knee',
    meshName: 'RightKnee', // Will try variants: RightKnee, KneeRight, R_Knee
    modelPath: '/models/parts/rightKnee.glb',
    position: [0.2, -0.8, 0],
    color: '#e8e6e3',
  },
  leftShoulder: {
    id: 'leftShoulder',
    name: 'Left Shoulder',
    meshName: 'LeftShoulder', // Will try variants: LeftShoulder, ShoulderLeft, L_Shoulder
    modelPath: '/models/parts/leftShoulder.glb',
    position: [-0.4, 1.1, 0],
    color: '#e8e6e3',
  },
  rightShoulder: {
    id: 'rightShoulder',
    name: 'Right Shoulder',
    meshName: 'RightShoulder', // Will try variants: RightShoulder, ShoulderRight, R_Shoulder
    modelPath: '/models/parts/rightShoulder.glb',
    position: [0.4, 1.1, 0],
    color: '#e8e6e3',
  },
  ribs: {
    id: 'ribs',
    name: 'Ribs',
    meshName: 'Ribs', // Will try variants: Ribs, RibCage, Thorax
    modelPath: '/models/parts/ribs.glb',
    position: [0, 0.8, 0],
    color: '#e8e6e3',
  },
};

// Helper function to get mesh name variants for flexible matching
export function getMeshNameVariants(bodyPartId: string): string[] {
  const variants: Record<string, string[]> = {
    skull: ['Skull', ],
    spine: ['Spine'],
    leftKnee: ['LeftKnee'],
    rightKnee: ['RightKnee'],
    leftShoulder: ['LeftShoulder', ],
    rightShoulder: ['RightShoulder', ],
    ribs: ['Ribs',]
  };

  return variants[bodyPartId] || [bodyParts[bodyPartId]?.meshName];
}
