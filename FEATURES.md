# Diagnova - Feature Documentation

## Overview

Diagnova is a production-grade, AI-powered multilingual medical platform that provides personalized health insights based on user demographics.

---

## Core Features

### 1. Premium First-Time User Onboarding ✅

**What it does:**
- Shows 3-screen onboarding flow for new users
- Collects essential demographic data
- Saves to MongoDB with `onboarded` status
- Redirects to dashboard after completion

**Screens:**

**Screen 1 - Welcome to Diagnova**
- Clean hero UI with gradient background
- Feature highlights (Multilingual, AI-Powered, Personalized)
- Step indicator (1/3)
- CTA: "Start Assessment"

**Screen 2 - Personal Details**
- Modern card UI with soft shadows
- Collects:
  - Name (required)
  - Age (required, 1-150)
  - Gender (male/female/other)
  - Preferred Language (10+ options)
  - Health Goal (optional)
- Framer Motion transitions
- Mobile-first responsive design

**Screen 3 - Review & Confirm**
- Summary card showing all entered data
- Final CTA: "Complete Setup"
- Saves to MongoDB
- Sets `onboarded: true`
- Redirects to dashboard

**Technical Details:**
- Route: `/onboarding`
- API: `POST /api/users`
- Validation: Client-side and server-side
- Animation: Framer Motion (slide transitions)

---

### 2. MongoDB Database Integration ✅

**What it does:**
- Stores user profiles persistently
- Caches AI-generated diseases with TTL
- Optimized with indexes for performance

**Collections:**

**users**
```typescript
{
  _id: ObjectId,
  name: string,
  age: number,
  gender: "male" | "female" | "other",
  language: string,
  healthGoal?: string,
  onboarded: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `_id` (primary)
- `language` (for filtering)
- `createdAt` (for sorting)
- `onboarded` (for queries)

**disease_cache**
```typescript
{
  _id: ObjectId,
  age: number,
  gender: string,
  bodyPart: string,
  language: string,
  response: object,
  createdAt: Date
}
```

**Indexes:**
- `{age, gender, bodyPart, language}` (unique composite)
- `createdAt` (TTL index, 24 hours)

**Technical Details:**
- Connection: Singleton pattern with pooling
- Driver: Official MongoDB Node.js driver
- Location: `src/lib/mongodb.ts`
- Models: `src/lib/models/User.ts`, `src/lib/models/DiseaseCache.ts`

---

### 3. Next.js App Router API Architecture ✅

**What it does:**
- Provides RESTful API endpoints
- Follows clean code principles
- Strict TypeScript typing (no `any`)
- Proper error handling

**Endpoints:**

**POST /api/users**
- Creates a new user
- Validates all inputs
- Returns user object with ID

**GET /api/users?id=xxx**
- Fetches user by ID
- Returns 404 if not found

**PATCH /api/users**
- Updates user's `onboarded` status
- Used after onboarding completion

**GET /api/profile?userId=xxx**
- Gets user profile
- Returns all user data

**PUT /api/profile**
- Updates user profile
- Validates age (1-150)
- Validates gender (male/female/other)
- Updates language and health goal

**GET /api/diseases**
- **Demographic-aware** disease generation
- Required params: `bodyPart`, `language`
- Optional params: `age`, `gender`
- Uses AI model rotation
- Returns cached data if available

**Technical Details:**
- HTTP methods: GET, POST, PUT, PATCH
- Error codes: 400 (Bad Request), 404 (Not Found), 429 (Rate Limit), 500 (Server Error)
- Response format: `{ success: boolean, data: object, error?: string }`

---

### 4. Demographic-Aware AI Disease Generation ✅

**What it does:**
- Generates diseases **relevant** to user's age and gender
- Prioritizes statistically likely conditions
- Explains why this demographic is at risk

**How it works:**

1. **User selects body part** (e.g., knee)
2. **System includes demographics** (age: 44, gender: female)
3. **AI generates targeted diseases**:
   - Osteoarthritis (common in 40+ females)
   - Rheumatoid arthritis (hormonal factors)
   - Vitamin D deficiency (age-related)
   - NOT random unrelated conditions

**Prompt Template:**
```
You are a medical AI assistant for Diagnova.

Generate likely diseases based on:
Age: {age}
Gender: {gender}
Body Part: {bodyPart}
Language: {language}

Instructions:
1. Prioritize diseases statistically common for this age group and gender
2. Explain WHY this demographic is at higher risk
3. List top 5 most likely diseases

Return: Disease name, description, symptoms, causes (all in {language})
```

**Examples:**

| Age | Gender | Body Part | Top Diseases                                                                 |
|-----|--------|-----------|------------------------------------------------------------------------------|
| 44  | Female | Knee      | Osteoarthritis, Rheumatoid arthritis, Hormonal joint degeneration            |
| 25  | Male   | Chest     | Costochondritis, Anxiety-related chest pain, Muscle strain                   |
| 65  | Male   | Heart     | Coronary artery disease, Heart failure, Arrhythmias                          |
| 30  | Female | Abdomen   | Endometriosis, IBS, Ovarian cysts                                            |

**Technical Details:**
- API: `GET /api/diseases?bodyPart=knee&age=44&gender=female&language=hi`
- Model: Google Gemini (rotating)
- Cache: MongoDB (24-hour TTL)
- Language: Dynamic (10+ languages supported)

---

### 5. Instant Multilingual Updates ✅

**What it does:**
- Changes language globally **instantly**
- Clears disease cache
- Re-fetches all data in new language
- No stale translations

**How it works:**

1. **User changes language** (Profile or Language Selector)
2. **Global context updates** (LanguageContext)
3. **Cache clears** (localStorage + custom event)
4. **Custom event fires** (`language-changed`)
5. **All components re-fetch** (automatic via event listeners)
6. **UI updates** in selected language

**Supported Languages:**
- English (en)
- हिंदी (hi)
- தமிழ் (ta)
- తెలుగు (te)
- ಕನ್ನಡ (kn)
- മലയാളം (ml)
- বাংলা (bn)
- मराठी (mr)
- ગુજરાતી (gu)
- ਪੰਜਾਬੀ (pa)

**Technical Details:**
- Context: `LanguageContext` (with cache clearing)
- Event: `window.dispatchEvent(new CustomEvent('language-changed'))`
- Hooks: `useDiseases`, `useTreatments` (auto re-fetch)

---

### 6. AI Model Rotation Strategy ✅

**What it does:**
- Rotates through 4 Gemini models
- Prevents quota exhaustion
- Auto-fallback on rate limits

**Model Pool:**
1. `gemini-1.5-flash` (fast, cheap)
2. `gemini-1.5-pro` (balanced)
3. `gemini-1.0-pro` (legacy)
4. `gemini-1.5-flash-8b` (ultra-fast)

**Rotation Logic:**
```typescript
let currentIndex = 0;
const MODELS = ['gemini-1.5-flash', 'gemini-1.5-pro', ...];

function getNextModel() {
  const model = MODELS[currentIndex];
  currentIndex = (currentIndex + 1) % MODELS.length; // Circular
  return model;
}
```

**Fallback on 429 (Rate Limit):**
1. Catch 429 error
2. Switch to next model
3. Retry request (max 4 attempts)
4. Return cached data if all fail

**Technical Details:**
- Location: `src/lib/aiModelRotation.ts`
- Used in: `/api/diseases`, `/api/chat`
- Max attempts: 4 (one per model)

---

### 7. MongoDB Caching Strategy (Quota Protection) ✅

**What it does:**
- Caches AI responses in MongoDB
- Reduces API calls by ~60-80%
- Automatic expiration (24 hours)

**Flow:**

```
User requests diseases
      ↓
Check MongoDB cache
      ↓
   Found?
   ├── Yes → Return cached (instant)
   └── No  → Generate with AI
              ↓
         Store in cache
              ↓
         Return response
```

**Cache Key:**
- `age` + `gender` + `bodyPart` + `language`
- Example: `{age: 44, gender: "female", bodyPart: "knee", language: "hi"}`

**TTL (Time To Live):**
- 24 hours (automatic deletion via MongoDB TTL index)
- Can be adjusted in schema

**Benefits:**
- **Cost savings**: Fewer AI API calls
- **Faster responses**: Cached data returns instantly
- **Quota protection**: Reduces risk of hitting limits

**Technical Details:**
- Collection: `disease_cache`
- Index: TTL on `createdAt` (24 hours)
- Upsert: Prevents duplicates

---

### 8. My Profile in Navbar ✅

**What it does:**
- New navigation item for profile management
- Shows user info and account details
- Allows editing language and health goal

**Navigation Items:**
1. Home
2. Diseases
3. AI Chat
4. Map
5. **My Profile** ← NEW!

**Profile Page Sections:**

**1. Profile Header**
- User avatar (placeholder)
- Name and age
- Gender
- Gradient background

**2. Non-Editable Info**
- Full Name
- Age
- Gender
- Member Since (account creation date)

**3. Editable Preferences**
- Preferred Language (dropdown)
- Health Goal (textarea)
- Edit/Save buttons

**Changing Language:**
- Updates global context
- Clears disease cache
- Re-fetches all data in new language

**Technical Details:**
- Route: `/profile`
- API: `GET /api/profile`, `PUT /api/profile`
- Context: `UserContext`, `LanguageContext`

---

### 9. Premium UI/UX Standards ✅

**What it does:**
- Provides Apple-inspired, modern health-tech SaaS UI

**Design Principles:**

**Colors:**
- Soft gradients (blue-to-purple, green-to-emerald)
- Clean backgrounds (white/gray)
- Minimal borders
- Subtle shadows

**Typography:**
- Font: Urbanist (Google Fonts)
- Weights: 400 (regular), 600 (semibold), 700 (bold), 800 (extrabold)
- Hierarchy: Clear heading sizes

**Transitions:**
- Framer Motion animations
- Smooth hover effects
- Page transitions (slide, fade)

**Responsive:**
- Mobile-first design
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Touch-friendly buttons

**Components:**
- Rounded corners (xl, 2xl, 3xl)
- Card-based layouts
- No clutter
- Generous whitespace

**Feels Like:**
- Apple Health
- Headspace
- Calm (meditation app)
- Modern SaaS dashboards

---

## Custom Hooks

### `useDiseases(bodyPart)`

**Purpose:** Fetch diseases with user demographics

**Returns:**
- `diseases` (array)
- `isLoading` (boolean)
- `error` (string | null)
- `refetch` (function)

**Features:**
- Auto-includes user age and gender
- Auto-refetches on language change
- Handles loading and error states

**Usage:**
```typescript
const { diseases, isLoading, error, refetch } = useDiseases('knee');
```

### `useTreatments(bodyPart, diseaseId)`

**Purpose:** Fetch treatments with demographics

**Returns:**
- `treatments` (array)
- `isLoading` (boolean)
- `error` (string | null)
- `refetch` (function)

**Usage:**
```typescript
const { treatments, isLoading } = useTreatments('knee', 'osteoarthritis');
```

---

## Security Features

1. **Input Validation** (client + server)
2. **No exposed secrets** (environment variables)
3. **Rate limiting** (via AI model rotation)
4. **Sanitized errors** (no sensitive data in responses)
5. **MongoDB authentication**
6. **HTTPS only** (production)

---

## Performance Optimizations

1. **MongoDB connection pooling** (max 10, min 2)
2. **AI response caching** (24-hour TTL)
3. **Lazy loading** (components)
4. **Image optimization** (Next.js Image)
5. **Code splitting** (automatic)

---

## Accessibility

1. **Semantic HTML**
2. **ARIA labels**
3. **Keyboard navigation**
4. **Focus indicators**
5. **Color contrast** (WCAG AA compliant)

---

## Analytics & Monitoring (Recommended)

- **User Onboarding**: Track completion rate
- **Language Usage**: Most popular languages
- **Disease Queries**: Most searched body parts
- **Cache Hit Rate**: MongoDB cache effectiveness
- **API Errors**: Track 429, 500 errors

---

## Future Enhancements

- [ ] Email/phone authentication
- [ ] Social login (Google, Facebook)
- [ ] Family profiles
- [ ] Appointment scheduling
- [ ] Doctor consultations
- [ ] Medication reminders
- [ ] Health tracking
- [ ] Export reports (PDF)
- [ ] Voice input (speech-to-text)
- [ ] Offline mode

---

**Diagnova - Where AI meets healthcare.** 🏥✨
