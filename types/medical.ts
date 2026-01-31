export interface BodyPart {
  id: string;
  name: string;
  meshName: string; // Name of the mesh in the 3D model
  modelPath: string; // Path to individual body part model
  position: [number, number, number]; // Camera focus position [x, y, z]
  color: string; // Default color for the mesh
}

export interface Disease {
  id: string;
  name: string;
  description: string;
  symptoms: string[];
  causes: string[];
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

// API Response types
export interface DiseasesResponse {
  diseases: Disease[];
}

export interface TreatmentsResponse {
  treatments: Treatment[];
}
