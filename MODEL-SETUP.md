# 3D Model Setup Instructions

## Required Models

This application requires two types of 3D anatomical models:

### 1. Full Human Skeleton Model
**Location**: `body-help/public/models/skeleton-full.glb`

**Requirements**:
- Realistic human anatomy
- Proper proportions
- Each body part as a separate mesh/node with identifiable names
- Optimized for web (< 5MB recommended)

**Recommended Sources**:
- [Sketchfab - Human Anatomy](https://sketchfab.com/search?q=human+anatomy&type=models)
  - Search for "human skeleton anatomy" with downloadable license
  - Look for models with separate meshes for each bone
  
- [Poly Haven](https://polyhaven.com/) - High-quality free models

- [Free3D](https://free3d.com/3d-models/skeleton) - Free skeletal models

**Required mesh names in the model**:
- `Skull` or `Head` or `Cranium`
- `Spine` or `Vertebrae` or `SpinalColumn`
- `LeftKnee` or `KneeLeft` or `L_Knee`
- `RightKnee` or `KneeRight` or `R_Knee`
- `LeftShoulder` or `ShoulderLeft` or `L_Shoulder`
- `RightShoulder` or `ShoulderRight` or `R_Shoulder`
- `Ribs` or `RibCage` or `Thorax`

### 2. Individual Body Part Models
**Location**: `body-help/public/models/parts/[part-name].glb`

Each body part needs its own detailed model:
- `body-help/public/models/parts/skull.glb`
- `body-help/public/models/parts/spine.glb`
- `body-help/public/models/parts/leftKnee.glb`
- `body-help/public/models/parts/rightKnee.glb`
- `body-help/public/models/parts/leftShoulder.glb`
- `body-help/public/models/parts/rightShoulder.glb`
- `body-help/public/models/parts/ribs.glb`

## How to Download and Add Models

### Option 1: Sketchfab (Recommended)

1. Go to [Sketchfab](https://sketchfab.com)
2. Search for "human skeleton anatomy"
3. Filter by:
   - Downloadable
   - Free license (CC BY or CC0)
4. Look for models with "Low Poly" tag for better performance
5. Download as `.glb` format
6. Place in `body-help/public/models/`

### Option 2: Use Placeholder Models

If you cannot find suitable models immediately, the app includes fallback primitive geometry that will be used until proper models are added.

## Model Requirements Checklist

- [ ] Full skeleton model downloaded
- [ ] Model is in GLB format
- [ ] Model size is reasonable (< 10MB)
- [ ] Individual body part models downloaded
- [ ] All models placed in correct directories
- [ ] Mesh names match the expected names (or update `bodyParts.ts`)

## Testing Models

After adding models, run the dev server and check:
1. Models load without errors (check browser console)
2. Body parts are clickable
3. Camera focuses correctly on parts
4. Individual part pages display the correct isolated model

## Fallback Behavior

The application will:
- Use primitive geometry if models are not found
- Log warnings in console about missing models
- Continue to function with reduced visual quality
