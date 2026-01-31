# Body Help - 3D Medical Visualization System

## Setup Instructions

### 1. Install Required Dependencies

The following packages need to be installed in the `body-help` directory:

```bash
cd body-help
pnpm add @react-three/fiber @react-three/drei three @types/three @svgr/webpack
```

Or if using npm:

```bash
npm install @react-three/fiber @react-three/drei three @types/three @svgr/webpack
```

### 2. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Features Implemented

### ✅ 3D Skeleton Viewer
- Interactive 3D skeleton with clickable body parts (skull, spine, knees, shoulders, ribs)
- Smooth rotation, zoom, and pan controls using OrbitControls
- Hover effects with emissive glow on body parts

### ✅ Body Part Selection
- Click any body part to highlight it
- Camera smoothly animates to focus on selected part
- Visual connections between body parts for skeletal structure

### ✅ Disease Mapping
- Each body part has associated medical conditions
- Disease list displays when a body part is selected
- Comprehensive disease information including:
  - Name and description
  - Symptoms
  - Causes
  - Related treatments

### ✅ Treatment Information
- Multiple treatment types:
  - 💊 Medication
  - ❤️ Lifestyle
  - 🩺 Therapy
  - ✂️ Surgical
- Color-coded treatment cards with icons
- Detailed treatment descriptions

### ✅ UI/UX Features
- Slide-out info panel with smooth animations
- Dark mode support
- Responsive design (mobile-friendly)
- Loading states
- Reset view button
- Instructional overlay for first-time users

## Architecture

### Component Structure
```
app/
├── page.tsx                    # Main page with state management
├── components/
│   ├── SkeletonViewer.tsx      # 3D Canvas wrapper
│   ├── Skeleton3D.tsx          # Skeleton mesh & lighting
│   ├── BodyPartMesh.tsx        # Individual clickable body parts
│   ├── CameraController.tsx    # Camera animation handler
│   ├── InfoPanel.tsx           # Slide-out information panel
│   ├── DiseaseList.tsx         # Disease selector
│   ├── DiseaseDetail.tsx       # Disease information display
│   └── TreatmentList.tsx       # Treatment options display
├── data/
│   ├── bodyParts.ts            # Body parts configuration
│   ├── diseases.ts             # Disease database
│   └── treatments.ts           # Treatment database
├── types/
│   └── medical.ts              # TypeScript interfaces
└── hooks/
    └── useSelection.ts         # State management hook
```

### Data Structure

The system uses a normalized data structure for easy expansion:

- **Body Parts**: Map to diseases
- **Diseases**: Map to treatments
- **Treatments**: Categorized by type

## Expandability

### Adding New Body Parts

Edit `data/bodyParts.ts`:

```typescript
newBodyPart: {
  id: 'newBodyPart',
  name: 'New Body Part',
  meshName: 'newBodyPart',
  position: [x, y, z], // Camera focus position
  diseases: ['diseaseId1', 'diseaseId2'],
  color: '#e8e6e3',
}
```

Update `BodyPartMesh.tsx` to add geometry for the new part.

### Adding New Diseases

Edit `data/diseases.ts`:

```typescript
newDisease: {
  id: 'newDisease',
  name: 'Disease Name',
  description: 'Detailed description',
  symptoms: ['symptom1', 'symptom2'],
  causes: ['cause1', 'cause2'],
  treatments: ['treatmentId1', 'treatmentId2'],
}
```

### Adding New Treatments

Edit `data/treatments.ts`:

```typescript
newTreatment: {
  id: 'newTreatment',
  name: 'Treatment Name',
  type: 'medication' | 'lifestyle' | 'therapy' | 'surgical',
  description: 'Treatment details',
}
```

## Current Data Coverage

### Body Parts (7)
- Skull
- Spine
- Left Knee
- Right Knee
- Left Shoulder
- Right Shoulder
- Ribs

### Diseases (15)
- **Skull**: Migraine, Concussion, Sinusitis
- **Spine**: Herniated Disc, Scoliosis, Spinal Stenosis
- **Knee**: ACL Tear, Knee Osteoarthritis, Bursitis
- **Shoulder**: Rotator Cuff Tear, Frozen Shoulder
- **Ribs**: Fractured Rib, Costochondritis

### Treatments (25+)
- Medications (Ibuprofen, Antibiotics, NSAIDs, etc.)
- Lifestyle changes (Rest, RICE protocol, Saline rinse, etc.)
- Therapies (Physical therapy, Vestibular rehabilitation, etc.)
- Surgical options (ACL reconstruction, Joint replacement, etc.)

## Performance Optimizations

- React Three Fiber for efficient 3D rendering
- Lazy loading with Suspense
- Memoized geometry calculations
- Throttled raycasting for click detection
- CSS-based animations with Framer Motion

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Requires WebGL support

## Technologies Used

- **Framework**: Next.js 16 (App Router)
- **3D Rendering**: React Three Fiber + Three.js
- **3D Helpers**: @react-three/drei
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Language**: TypeScript
