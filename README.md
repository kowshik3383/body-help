
# Definition of Done

- [ ] Interactive 3D skeleton fully rendered with rotation, zoom, and body part selection
- [ ] Smooth camera transitions when focusing on selected body parts
- [ ] Disease list displays for each body part with detailed information (name, description, symptoms, causes)
- [ ] Treatment options shown for each disease (medications, lifestyle, therapies, surgical options)
- [ ] Responsive UI with modular, reusable components following Next.js App Router patterns
- [ ] Performance-optimized 3D rendering with proper loading states

---

# Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    Main Page                         │
│  ┌───────────────────────────────────────────────┐  │
│  │         3D Skeleton Viewer (Canvas)           │  │
│  │     - OrbitControls (rotate/zoom)             │  │
│  │     - Clickable body parts                    │  │
│  │     - Camera animation on selection           │  │
│  └───────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────┐  │
│  │          Info Panel (Slide-out)               │  │
│  │  ┌─────────────────────────────────────────┐  │  │
│  │  │  Selected: Skull                        │  │  │
│  │  │  Diseases: [Migraine, Concussion, ...]  │  │  │
│  │  └─────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────┐  │  │
│  │  │  Disease: Migraine                      │  │  │
│  │  │  Symptoms: [Headache, Nausea, ...]      │  │  │
│  │  │  Treatments: [Ibuprofen, Rest, ...]     │  │  │
│  │  └─────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

# Data Structure

## Body Parts Schema
| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier (e.g., "skull", "spine") |
| name | string | Display name |
| meshName | string | 3D model mesh reference |
| position | Vector3 | Camera focus position |
| diseases | string[] | Array of disease IDs |

## Disease Schema
| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| name | string | Disease name |
| description | string | Detailed description |
| symptoms | string[] | List of symptoms |
| causes | string[] | Optional causes |
| treatments | string[] | Array of treatment IDs |

## Treatment Schema
| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| name | string | Treatment name |
| type | enum | "medication" \| "lifestyle" \| "therapy" \| "surgical" |
| description | string | Treatment details |

---

# Component Breakdown

```
app/
├── page.tsx                    # Main container
├── components/
│   ├── SkeletonViewer.tsx      # 3D Canvas wrapper (client)
│   ├── Skeleton3D.tsx          # Skeleton mesh & interactions
│   ├── BodyPartMesh.tsx        # Individual clickable parts
│   ├── CameraController.tsx    # Camera animation handler
│   ├── InfoPanel.tsx           # Slide-out panel
│   ├── DiseaseList.tsx         # Disease selector
│   ├── DiseaseDetail.tsx       # Disease info card
│   └── TreatmentList.tsx       # Treatment options
├── data/
│   ├── bodyParts.ts            # Body parts data
│   ├── diseases.ts             # Diseases data
│   └── treatments.ts           # Treatments data
├── types/
│   └── medical.ts              # TypeScript interfaces
└── hooks/
    └── useSelection.ts         # Selection state management
```

---

# 3D Implementation Strategy

## Model Sourcing
- Use royalty-free skeleton GLB/GLTF from Sketchfab or create simplified geometry
- Separate meshes for each body part for individual interaction
- Optimize poly count for web performance

## React Three Fiber Setup
| Feature | Implementation |
|---------|----------------|
| Canvas | Transparent background, shadows enabled |
| Camera | PerspectiveCamera with OrbitControls |
| Lighting | Ambient + Directional for depth |
| Raycasting | Pointer events on meshes for clicks |
| Animation | useSpring for smooth camera transitions |

## Interaction Flow
1. **Hover**: Mesh emissive glow (outline effect)
2. **Click**: Camera animates to focus position, highlight selected part
3. **Info Load**: Fetch diseases from data map, display in panel
4. **Reset**: Button to return to full skeleton view

---

# UI/UX Design

## Color Palette
| Token | Value | Usage |
|-------|-------|-------|
| --color-skeleton | #e8e6e3 | Bone color |
| --color-highlight | #3b82f6 | Selected part |
| --color-hover | #60a5fa | Hover state |
| --color-panel-bg | rgba(255,255,255,0.95) | Info panel |
| --color-accent | #10b981 | Action buttons |

## Animation Strategy
- **Canvas**: Rotate skeleton slowly on idle (optional)
- **Camera**: Framer Motion spring transitions (duration: 1s)
- **Panel**: Slide-in from right with fade
- **Cards**: Stagger animation for disease list items

---

# Implementation Phases

| Phase | Components | Features |
|-------|-----------|----------|
| **1. Foundation** | page.tsx, SkeletonViewer.tsx, data files | Basic 3D canvas, skeleton model loading, data structure setup |
| **2. Interactions** | Skeleton3D.tsx, BodyPartMesh.tsx, CameraController.tsx | Clickable parts, hover effects, camera animation |
| **3. Info System** | InfoPanel.tsx, DiseaseList.tsx, useSelection.ts | Panel UI, disease display, state management |
| **4. Details** | DiseaseDetail.tsx, TreatmentList.tsx | Full disease info, treatment options, navigation |
| **5. Polish** | All components | Loading states, error handling, responsive design, performance optimization |

---

# Technical Decisions

## State Management
Use React useState/useContext for:
- Selected body part ID
- Selected disease ID
- Panel open/close state
- Camera animation status

## Performance Optimization
- `useMemo` for geometry computations
- Lazy load disease data on selection
- Throttle raycasting checks
- Use `<Suspense>` for async model loading

## Accessibility
- Keyboard navigation for body part selection
- ARIA labels on 3D objects
- Screen reader announcements for selections
- High contrast mode support

---

# Required Assets

## 3D Models
- Human skeleton GLB/GLTF (separate meshes per body part)
- Fallback: Procedural geometry using Three.js primitives

## Icons (Lucide)
- Activity (symptoms)
- Pill (medications)
- Heart (lifestyle)
- Stethoscope (therapy)
- Scissors (surgical)
- RotateCw (reset view)
- ZoomIn/ZoomOut

---

# Data Population Strategy

Start with sample data for 3-5 body parts:
1. **Skull** → Migraine, Concussion, Sinusitis
2. **Spine** → Herniated Disc, Scoliosis, Spinal Stenosis
3. **Knee** → ACL Tear, Arthritis, Bursitis
4. **Shoulder** → Rotator Cuff Tear, Frozen Shoulder
5. **Ribs** → Fractured Rib, Costochondritis

Structure allows easy expansion to full skeleton coverage.

---

# Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| 3D model complexity | Use low-poly models, implement LOD system |
| Browser compatibility | Fallback to 2D diagram if WebGL unavailable |
| Large data files | Lazy load disease/treatment data per part |
| Mobile performance | Reduce quality settings on small screens |

---
# To-dos (7)
- [ ] **Setup Phase**: Install @react-three/fiber, @react-three/drei, three packages, configure TypeScript types
- [ ] **Data Foundation**: Create TypeScript interfaces, populate sample data for body parts/diseases/treatments
- [ ] **3D Viewer**: Build canvas, load skeleton model, implement orbit controls and basic rendering
- [ ] **Interactions**: Add raycasting for clicks, hover effects, camera focus animations
- [ ] **Info System**: Build slide-out panel, disease list, state management hooks
- [ ] **Disease Details**: Implement disease detail view, treatment display, navigation flow
- [ ] **Polish & Testing**: Add loading states, optimize performance, responsive design, error handling