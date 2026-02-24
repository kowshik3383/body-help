# Diagnova Setup Guide

## Production-Grade AI-Powered Medical Platform

This guide will help you set up Diagnova, a multilingual medical platform with MongoDB integration, AI model rotation, and demographic-aware disease generation.

---

## Prerequisites

1. **Node.js** v20 or higher
2. **pnpm** package manager
3. **MongoDB** database (MongoDB Atlas recommended)
4. **Google Gemini API Key**

---

## Installation Steps

### 1. Install Dependencies

```bash
cd body-help
pnpm install
```

**Note:** If `mongodb` is not installed, run:
```bash
pnpm add mongodb
```

### 2. Set Up MongoDB

#### Option A: MongoDB Atlas (Recommended for Production)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user with read/write permissions
4. Get your connection string (should look like):
   ```
   mongodb+srv://username:password@cluster.mongodb.net/diagnova?retryWrites=true&w=majority
   ```

#### Option B: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Connection string:
   ```
   mongodb://localhost:27017/diagnova
   ```

### 3. Get Google Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key

### 4. Configure Environment Variables

1. Copy the example file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your credentials:
   ```env
   MONGODB_URI=your_mongodb_connection_string_here
   GEMINI_API_KEY=your_gemini_api_key_here
   NODE_ENV=development
   ```

### 5. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Features Overview

### ✅ First-Time User Onboarding

- **3-screen onboarding flow** with Framer Motion animations
- Collects: Name, Age, Gender, Language, Health Goal
- Saves to MongoDB with `onboarded` status
- Premium gradient UI with step indicators

### ✅ MongoDB Integration

- **Centralized connection utility** (`src/lib/mongodb.ts`)
- **User Schema** with indexes on language, createdAt, onboarded
- **Disease Cache Schema** with TTL index (24 hours)
- Production-ready with connection pooling

### ✅ API Architecture (Next.js App Router)

- `POST /api/users` - Create user
- `GET /api/users?id=xxx` - Get user by ID
- `PATCH /api/users` - Update onboarding status
- `GET /api/profile?userId=xxx` - Get profile
- `PUT /api/profile` - Update profile
- `GET /api/diseases` - Get diseases (with demographics)

### ✅ Demographic-Aware AI Prompts

Every disease request includes:
- **Age** (e.g., 44)
- **Gender** (male/female/other)
- **Body Part** (e.g., knee)
- **Language** (e.g., Hindi)

AI prioritizes diseases relevant to the demographic. Example:
- **Age 44, Female, Knee** → Osteoarthritis, Rheumatoid arthritis, Hormonal degeneration

### ✅ AI Model Rotation

- **Model Pool**: `gemini-1.5-flash`, `gemini-1.5-pro`, `gemini-1.0-pro`, `gemini-1.5-flash-8b`
- **Circular rotation** on every API call
- **Auto-fallback** on 429 errors (rate limiting)
- Prevents quota exhaustion

### ✅ Instant Multilingual Updates

When language changes:
1. **Global context updates**
2. **Disease cache clears**
3. **Custom event triggers** (`language-changed`)
4. **Components re-fetch** in new language

No stale translations!

### ✅ MongoDB Caching Strategy

Before calling AI:
1. Check MongoDB `disease_cache` collection
2. Query by: `{age, gender, bodyPart, language}`
3. If exists → return cached response
4. Else → generate → store → return

**TTL**: 24 hours (automatic expiration)

### ✅ Profile Management

- **View**: Name, Age, Gender, Language, Health Goal, Account Created
- **Edit**: Language, Health Goal
- **Instant sync**: Changing language updates global context
- Clean card-based UI

### ✅ Navigation

New navbar items:
- Home
- Diseases
- AI Chat
- Map
- **My Profile** (new!)

---

## Project Structure

```
body-help/
├── app/
│   ├── api/
│   │   ├── users/route.ts          # User CRUD
│   │   ├── profile/route.ts        # Profile management
│   │   ├── diseases/route.ts       # Demographic-aware diseases
│   │   └── chat/route.ts           # AI chat
│   ├── onboarding/page.tsx         # 3-screen onboarding
│   ├── profile/page.tsx            # Profile page
│   ├── layout.tsx                  # Root layout with providers
│   └── page.tsx                    # Home (with onboarding check)
├── src/
│   ├── contexts/
│   │   ├── UserContext.tsx         # User state management
│   │   └── LanguageContext.tsx     # Language + cache clearing
│   ├── lib/
│   │   ├── mongodb.ts              # MongoDB connection
│   │   ├── aiModelRotation.ts      # AI model rotation
│   │   └── models/
│   │       ├── User.ts             # User schema & methods
│   │       └── DiseaseCache.ts     # Disease cache schema
│   ├── types/
│   │   └── user.ts                 # User types
│   └── components/
│       └── Navigation.tsx          # Top navigation
└── .env.local                      # Environment variables (create this!)
```

---

## Architecture Highlights

### Clean TypeScript Patterns

- **No `any` types** (strict typing)
- **Proper error handling** with try-catch
- **HTTP method validation**
- **Structured JSON responses**

### Scalable Design

- **Centralized DB connection** (singleton pattern)
- **Model-based data access** (separation of concerns)
- **Context-based state management**
- **API route organization**

### Production Best Practices

- **Connection pooling** (MongoDB)
- **Index optimization** (language, createdAt, TTL)
- **Upsert operations** (avoid duplicates)
- **Graceful error handling** (fallbacks, caching)
- **Environment-based configuration**

---

## Premium UI Features

- **Soft gradients** (blue-to-purple)
- **Clean typography** (Urbanist font)
- **Smooth transitions** (Framer Motion)
- **No heavy borders**
- **Mobile-first responsive**
- **Apple-inspired design**

---

## Troubleshooting

### MongoDB Connection Issues

1. Check your connection string in `.env.local`
2. Ensure IP whitelist in MongoDB Atlas
3. Verify database user credentials

### Gemini API Errors

1. Verify API key is correct
2. Check quota limits
3. Model rotation will auto-fallback on 429 errors

### Onboarding Not Showing

1. Clear `localStorage` (key: `diagnova-user-id`)
2. Restart dev server
3. Check browser console for errors

---

## Next Steps

1. **Test the onboarding flow**: Visit `/onboarding`
2. **Create a user**: Complete the 3-step process
3. **Explore diseases**: Select a body part
4. **Edit profile**: Change language and see instant updates
5. **Check MongoDB**: Verify data in `users` and `disease_cache` collections

---

## Support

For issues or questions:
- Check the [Next.js documentation](https://nextjs.org/docs)
- Review [MongoDB Node.js Driver docs](https://www.mongodb.com/docs/drivers/node/)
- Consult [Google Gemini API docs](https://ai.google.dev/docs)

---

**Diagnova** - Production-grade AI-powered multilingual medical platform.
Built with ❤️ using Next.js 16, MongoDB, Google Gemini, and Framer Motion.
