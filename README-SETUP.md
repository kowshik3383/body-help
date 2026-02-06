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

### 2. Add 3D Model Files (.glb)

Place your `.glb` model files in the `body-help/public/models/parts/` directory. The following files are expected:

**Human Component Parts:**
- `head.glb`
- `orbit.glb`
- `neck.glb`
- `chest.glb`
- `right-shoulder.glb`
- `right-arm.glb`
- `right-hand.glb`
- `left-shoulder.glb`
- `left-arm.glb`
- `left-hand.glb`
- `abdomen.glb`
- `right-leg.glb`
- `right-foot.glb`
- `left-leg.glb`
- `left-foot.glb`

**Legacy Skeleton Viewer Parts:**
- `skull.glb`
- `spine.glb`
- `leftKnee.glb`
- `rightKnee.glb`
- `leftShoulder.glb`
- `rightShoulder.glb`
- `ribs.glb`

> **Note:** If a `.glb` file is missing, the system will display a fallback cube geometry instead.

### 3. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Features Implemented

### ✅ Interactive Human Body Map
- **2D SVG Human Component**: Click on any of 15 body parts to navigate to detailed view
- **Body Parts Available**: head, orbit (eyes), neck, chest, shoulders (left/right), arms (left/right), hands (left/right), abdomen, legs (left/right), feet (left/right)
- **Hover Effects**: Visual feedback when hovering over body parts
- **Navigation**: Automatic routing to `/body-part/[part]` on selection

### ✅ 3D Body Part Models
- **Individual 3D Models**: Each body part can have its own detailed `.glb` 3D model
- **Toggle View**: Switch between 2D body map and 3D model on the body part detail page
- **Interactive Controls**: Rotate, zoom, and pan the 3D model
- **Auto-rotation**: Models slowly rotate for better visualization
- **Fallback Display**: Shows placeholder geometry if `.glb` file is missing

### ✅ 3D Skeleton Viewer (Legacy)
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
├── page.tsx                     # Main page with SkeletonViewer
├── body-part/
│   └── [part]/
│       └── page.tsx             # Individual body part detail page with 3D model
├── components/
│   ├── Human.tsx                # 2D SVG body map with clickable parts
│   ├── BodyPartModel.tsx        # 3D model viewer for individual parts
│   ├── SkeletonViewer.tsx       # 3D Canvas wrapper (legacy skeleton)
│   ├── Skeleton3D.tsx           # Skeleton mesh & lighting
│   ├── BodyPartMesh.tsx         # Individual clickable body parts
│   ├── CameraController.tsx     # Camera animation handler
│   ├── ChatPanel.tsx            # AI chat interface
│   ├── DiseaseDetail.tsx        # Disease information display
│   ├── TabBar.tsx               # Tab navigation component
│   └── ...                      # Other UI components
├── data/
│   ├── bodyParts.ts             # Body parts configuration & .glb mappings
│   ├── diseases.ts              # Disease database
│   └── treatments.ts            # Treatment database
├── types/
│   └── medical.ts               # TypeScript interfaces
└── hooks/
    ├── useSelection.ts          # State management hook
    ├── useChat.ts               # Chat functionality
    └── useSpeech.ts             # Text-to-speech
```

### Data Structure

The system uses a normalized data structure for easy expansion:

- **Body Parts**: Map to diseases
- **Diseases**: Map to treatments
- **Treatments**: Categorized by type

## Expandability

### Adding New Body Parts

#### Step 1: Update the Human Component
Edit `src/components/Human.tsx` and add your new body part to the `bodyParts` array:

```typescript
const bodyParts = [
  'head', 'orbit', 'neck', 'chest', 
  'right-shoulder', 'right-arm', 'right-hand',
  'left-shoulder', 'left-arm', 'left-hand', 
  'abdomen', 'right-leg', 'right-foot',
  'left-leg', 'left-foot',
  'new-body-part' // Add your new part here
];
```

Then add the corresponding SVG element with click and hover handlers.

#### Step 2: Update Body Parts Data
Edit `data/bodyParts.ts`:

```typescript
'new-body-part': {
  id: 'new-body-part',
  name: 'New Body Part',
  meshName: 'NewBodyPart',
  modelPath: '/models/parts/new-body-part.glb',
  position: [x, y, z], // 3D position for camera focus
  color: '#e8e6e3',
}
```

#### Step 3: Add 3D Model
Place your `.glb` file at: `public/models/parts/new-body-part.glb`

#### Step 4: Add Internationalization (Optional)
Update language files in `src/i18n/` to add translations for the new body part.

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

### Body Parts (22 total)

**Human Component Parts (15)**
- Head
- Orbit (Eyes)
- Neck
- Chest
- Right Shoulder
- Right Arm
- Right Hand
- Left Shoulder
- Left Arm
- Left Hand
- Abdomen
- Right Leg
- Right Foot
- Left Leg
- Left Foot

**Legacy Skeleton Parts (7)**
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

## How It Works

### User Flow

1. **Home Page (`/`)**: Displays the full 3D skeleton viewer with clickable parts
2. **Click on Human Component**: User clicks any of the 15 body parts in the SVG human map
3. **Navigation**: Automatically routes to `/body-part/[part]` (e.g., `/body-part/head`)
4. **Body Part Page**: Shows:
   - **Left Panel**: Toggle between 2D body map and 3D model of the selected part
   - **Right Panel**: Related medical information, diseases, and AI chat
5. **3D Model Interaction**: Rotate, zoom, and pan the individual body part model

### URL Routing

- `/` - Home page with full skeleton
- `/body-part/head` - Head detail page
- `/body-part/right-arm` - Right arm detail page
- `/body-part/[any-part]` - Dynamic route for any body part

### Data Flow

```
Human Component (SVG)
    ↓ (click event)
router.push('/body-part/[partId]')
    ↓
Body Part Page
    ↓
Loads: bodyParts[partId] from data/bodyParts.ts
    ↓
Displays: BodyPartModel with modelPath
    ↓
useGLTF(modelPath) loads .glb file from /public/models/parts/
```

## Technologies Used

- **Framework**: Next.js 16 (App Router)
- **3D Rendering**: React Three Fiber + Three.js
- **3D Helpers**: @react-three/drei
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Language**: TypeScript
- **AI Integration**: Google Generative AI & OpenAI
