# OMNI — Tactile Futures

A high-end product website for the OMNI macro pad device.

## Stack
- React 18 + TypeScript + Vite 5
- Tailwind CSS with custom glass design system
- Framer Motion animations
- Firebase (Auth + Firestore cart/orders)
- OpenRouter Elephant AI chatbot
- React Three Fiber (3D model)

## Local Setup

```bash
npm install --legacy-peer-deps
npm run dev
```

Open http://localhost:3000

## Environment Variables

Create `.env.local` in the project root:

```
VITE_OPENROUTER_API_KEY=your_key_here
```

Get a free key at https://openrouter.ai/keys

> The chatbot has a fallback key built in for demo purposes.

## Deploy to Vercel

1. Push to GitHub
2. Import at vercel.com/new
3. Add env var `VITE_OPENROUTER_API_KEY` in Vercel settings
4. Deploy

**Build settings:**
- Build Command: `npm install --legacy-peer-deps && npm run build`
- Output Directory: `dist`
- Node.js: 20.x

## Firebase Setup

1. Enable Google Sign-In in Firebase Console → Authentication
2. Add your Vercel domain to authorized domains
3. Publish Firestore rules from `firestore.rules`

## Features
- 🛒 Cart (works with login, persists in Firestore)
- 🔐 Google Sign-In
- 🤖 AI Chatbot (OpenRouter Elephant)
- 🎨 Live product configurator with 16 chassis+keycap combos
- ✉️ Contact form (saves to Firestore)
- ✨ Particle field + mouse spotlight effects
