export interface BodyPart {
  id: string;
  name: string;
  meshName: string;
  position: [number, number, number]; // Camera focus position [x, y, z]
  diseases: string[];
  color: string; // Default color for the mesh
}

export interface Disease {
  id: string;
  name: string;
  description: string;
  symptoms: string[];
  causes: string[];
  treatments: string[];
}

export interface Treatment {
  id: string;
  name: string;
  type: 'medication' | 'lifestyle' | 'therapy' | 'surgical';
  description: string;
}

export type SelectionState = {
  bodyPart: string | null;
  disease: string | null;
};
