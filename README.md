# Diamond Duel ⚾

A turn-based baseball strategy game with draft, pitch guessing, dice mechanics, playoff mode, and online multiplayer.

## Features
- **Vs AI** — Full game against the computer
- **Play Online** — Create a room code, share with a friend, play in real time via Supabase
- **Playoff Mode** — 4 or 8 team brackets with sim, stats leaderboard, and persistent saves
- **Draft** — Tier-limited snake draft (2S + 3A + 3B) with auto-fill bench
- **Animated diamond** — Colored infield, pixel-art runner heads, sliding animations

## Deploy to Vercel (~2 minutes, free)

### Step 1 — Push to GitHub
1. Go to [github.com](https://github.com) → sign in or create a free account
2. Click **+** → **New repository** → name it `diamond-duel` → **Create repository**
3. Click **uploading an existing file**, drag all contents of this folder in, commit

### Step 2 — Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) → **Sign Up with GitHub**
2. Click **Add New → Project** → select `diamond-duel` → **Deploy**
3. Live at `diamond-duel-xxx.vercel.app` in ~60 seconds

## Local development
```bash
npm install
npm run dev
```

## Online mode
Uses Supabase for real-time state sync. The credentials are already baked in — no extra setup needed. Rooms auto-expire after 24 hours.
