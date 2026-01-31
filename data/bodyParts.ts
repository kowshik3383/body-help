import { BodyPart } from '@/types/medical';

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
    skull: ['Skull', 'Head', 'Cranium', 'skull', 'head', 'cranium'],
    spine: ['Spine', 'Vertebrae', 'SpinalColumn', 'spine', 'vertebrae', 'spinal_column'],
    leftKnee: ['LeftKnee', 'KneeLeft', 'L_Knee', 'left_knee', 'knee_left', 'Knee_L'],
    rightKnee: ['RightKnee', 'KneeRight', 'R_Knee', 'right_knee', 'knee_right', 'Knee_R'],
    leftShoulder: ['LeftShoulder', 'ShoulderLeft', 'L_Shoulder', 'left_shoulder', 'shoulder_left', 'Shoulder_L'],
    rightShoulder: ['RightShoulder', 'ShoulderRight', 'R_Shoulder', 'right_shoulder', 'shoulder_right', 'Shoulder_R'],
    ribs: ['Ribs', 'RibCage', 'Thorax', 'ribs', 'rib_cage', 'thorax'],
  };

  return variants[bodyPartId] || [bodyParts[bodyPartId]?.meshName];
}
