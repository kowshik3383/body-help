# Body Help - Interactive 3D Medical Visualization System

> **Medical-grade 3D anatomical visualization powered by OpenAI**

A production-ready Next.js application featuring realistic human anatomy models with AI-powered disease and treatment information.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![OpenAI](https://img.shields.io/badge/OpenAI-Powered-green)

---

## 🎯 Features

### ✅ Realistic 3D Anatomy
- High-quality GLTF/GLB anatomical models
- Interactive full human skeleton
- Isolated body part viewers
- Smooth camera animations
- Professional medical visualization

### ✅ AI-Powered Insights
- Dynamic disease information via OpenAI
- Real-time treatment recommendations
- Medical-grade accuracy
- Always up-to-date content

### ✅ Intuitive Navigation
- Click any body part to explore
- Dedicated pages for each anatomical region
- Smooth transitions and loading states
- Responsive design for all devices

### ✅ Production Architecture
- Server-side API routes
- Secure OpenAI integration
- Type-safe TypeScript
- Error handling and fallbacks

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd body-help
pnpm install
```

### 2. Configure Environment

Create `.env.local` file:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Add 3D Models

Place realistic anatomical models in:
- `public/models/skeleton-full.glb` - Full skeleton
- `public/models/parts/[part-name].glb` - Individual parts

See [MODEL-SETUP.md](./MODEL-SETUP.md) for sourcing instructions.

### 4. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🏗️ Architecture

```
┌─────────────────────────┐
│   Main Page (/)         │
│   Full 3D Skeleton      │
│   Click to select part  │
└──────────┬──────────────┘
           │
           ↓
┌─────────────────────────────────┐
│  /body-part/[part]              │
│  • Isolated 3D model            │
│  • OpenAI: Fetch diseases       │
│  • Display condition list       │
└──────────┬──────────────────────┘
           │
           ↓
┌─────────────────────────────────┐
│  Disease Detail                 │
│  • Symptoms & causes            │
│  • OpenAI: Fetch treatments     │
│  • Show treatment options       │
└─────────────────────────────────┘
```

---

## 📁 Project Structure

```
body-help/
├── app/
│   ├── page.tsx                       # Main skeleton viewer
│   ├── body-part/[part]/page.tsx     # Dynamic body part pages
│   ├── api/
│   │   ├── diseases/route.ts         # Disease API (OpenAI)
│   │   └── treatments/route.ts       # Treatment API (OpenAI)
│   └── components/
│       ├── RealisticSkeletonModel.tsx
│       ├── BodyPartModel.tsx
│       ├── SkeletonViewer.tsx
│       ├── DiseaseDetail.tsx
│       └── TreatmentList.tsx
├── data/
│   └── bodyParts.ts                  # Body part configuration
├── types/
│   └── medical.ts                    # TypeScript interfaces
├── public/
│   └── models/                       # 3D GLTF/GLB models
│       ├── skeleton-full.glb
│       └── parts/
│           ├── skull.glb
│           ├── spine.glb
│           └── ...
└── .env.local                        # Environment variables
```

---

## 🔌 API Endpoints

### GET `/api/diseases?bodyPart=Skull`

Returns AI-generated disease information for a body part.

**Response:**
```json
{
  "diseases": [
    {
      "id": "migraine",
      "name": "Migraine",
      "description": "...",
      "symptoms": ["...", "..."],
      "causes": ["...", "..."]
    }
  ]
}
```

### GET `/api/treatments?disease=Migraine`

Returns AI-generated treatment options for a disease.

**Response:**
```json
{
  "treatments": [
    {
      "id": "ibuprofen",
      "name": "Ibuprofen",
      "type": "medication",
      "description": "..."
    }
  ]
}
```

---

## 🎨 Technology Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **3D Rendering** | React Three Fiber + Three.js |
| **3D Helpers** | @react-three/drei |
| **AI Provider** | OpenAI (GPT-4) |
| **Styling** | Tailwind CSS v4 |
| **Language** | TypeScript |
| **Icons** | Lucide React |
| **Animations** | Framer Motion |

---

## 📚 Documentation

- [**UPGRADE Guide**](./README-UPGRADE.md) - What changed and why
- [**MODEL Setup**](./MODEL-SETUP.md) - 3D model sourcing guide
- [**SETUP Guide**](./README-SETUP.md) - Original setup instructions

---

## 🎯 Supported Body Parts

| Body Part | Diseases | Status |
|-----------|----------|--------|
| Skull | AI-Generated | ✅ |
| Spine | AI-Generated | ✅ |
| Left Knee | AI-Generated | ✅ |
| Right Knee | AI-Generated | ✅ |
| Left Shoulder | AI-Generated | ✅ |
| Right Shoulder | AI-Generated | ✅ |
| Ribs | AI-Generated | ✅ |

*Easily extensible to support all anatomical regions*

---

## 🔒 Security

- ✅ OpenAI API key never exposed to client
- ✅ All AI calls are server-side
- ✅ Environment variables for sensitive data
- ✅ Input validation and sanitization
- ✅ Error handling with safe fallbacks

---

## 🚧 Roadmap

### Current Version (2.0)
- [x] Realistic 3D models
- [x] OpenAI integration
- [x] Dynamic routing
- [x] Treatment categorization

### Planned Features
- [ ] Multi-language support
- [ ] Voice descriptions
- [ ] AR/VR mode
- [ ] Medical report export
- [ ] Treatment comparison tool
- [ ] Doctor finder integration

---

## 🤝 Contributing

This is a production medical visualization system. Contributions welcome!

### Areas for Improvement
1. **3D Models**: Higher quality anatomical models
2. **AI Prompts**: Enhanced medical accuracy
3. **Accessibility**: Screen reader improvements
4. **Performance**: Model optimization techniques

---

## 📄 License

MIT License - Feel free to use for educational and commercial purposes.

---

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- Three.js community
- React Three Fiber team
- Sketchfab for 3D models

---

## 📞 Support

- **Issues**: Open a GitHub issue
- **Questions**: Check documentation files
- **Models**: See MODEL-SETUP.md

---

**Built with ❤️ for medical education and patient care**
