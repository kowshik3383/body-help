# 3D Body Part Models

This directory contains the `.glb` 3D model files for individual body parts.

## Required Model Files

Place your `.glb` files in this directory with the following names:

### Human Component Parts (Primary)
- ✅ `head.glb` - Head/skull model
- ✅ `orbit.glb` - Eye/orbit area model
- ✅ `neck.glb` - Neck model
- ✅ `chest.glb` - Chest/thorax model
- ✅ `right-shoulder.glb` - Right shoulder model
- ✅ `right-arm.glb` - Right arm model
- ✅ `right-hand.glb` - Right hand model
- ✅ `left-shoulder.glb` - Left shoulder model
- ✅ `left-arm.glb` - Left arm model
- ✅ `left-hand.glb` - Left hand model
- ✅ `abdomen.glb` - Abdomen/belly model
- ✅ `right-leg.glb` - Right leg model
- ✅ `right-foot.glb` - Right foot model
- ✅ `left-leg.glb` - Left leg model
- ✅ `left-foot.glb` - Left foot model

### Legacy Skeleton Parts (Optional)
- ✅ `skull.glb` - Skull bone model
- ✅ `spine.glb` - Spine/vertebrae model
- ✅ `leftKnee.glb` - Left knee joint model
- ✅ `rightKnee.glb` - Right knee joint model
- ✅ `leftShoulder.glb` - Left shoulder joint model
- ✅ `rightShoulder.glb` - Right shoulder joint model
- ✅ `ribs.glb` - Rib cage model

## File Format

- **Format**: `.glb` (Binary glTF)
- **Recommended Scale**: Models should be normalized (roughly 1-2 units in size)
- **Recommended Polygon Count**: < 50K polygons for optimal performance
- **Textures**: Embedded in the `.glb` file (preferred)

## Fallback Behavior

If a model file is missing, the application will display a simple cube as a placeholder. This allows the app to function even without all models present.

## How Models Are Used

1. User clicks a body part in the Human component (SVG)
2. App navigates to `/body-part/[part]`
3. Page loads the corresponding `.glb` file from this directory
4. Model is displayed with interactive 3D controls (rotate, zoom, pan)
5. User can toggle between 2D body map and 3D model view

## Example Model Sources

You can create or obtain `.glb` models from:
- Blender (export as glTF 2.0 Binary)
- SketchFab (download free medical models)
- TurboSquid
- CGTrader
- Create your own using 3D modeling software

## Testing

After adding a model file, test it by:
1. Running the development server: `pnpm dev`
2. Clicking the corresponding body part in the Human component
3. Toggling to "Show 3D Model" view
4. Verifying the model loads and displays correctly
