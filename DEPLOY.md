# ARIA Dashboard — Vercel Deployment Guide
## angkorgreen-dashboard | Next.js 14 + Firebase + NextAuth

---

## Prerequisites

- Node.js 18+
- Vercel CLI: `npm i -g vercel`
- Firebase project already set up (same project as the bot)
- Bot deployed and running (dashboard reads the data bot writes)

---

## Step 1 — Get Firebase Client SDK Config

1. Go to Firebase Console → Project Settings → General
2. Scroll to **Your apps** → Web → `</> Add app` (if not created)
3. Copy the `firebaseConfig` object — you need all 6 values:
   - `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`

## Step 2 — Get Firebase Admin SDK Key

Same `serviceAccount.json` used for the bot. Extract:
- `project_id` → `FIREBASE_ADMIN_PROJECT_ID`
- `client_email` → `FIREBASE_ADMIN_CLIENT_EMAIL`
- `private_key` → `FIREBASE_ADMIN_PRIVATE_KEY`

## Step 3 — Generate NextAuth Secret

```bash
openssl rand -base64 32
# Copy the output — this is your NEXTAUTH_SECRET
```

---

## Step 4 — Local Development

```bash
# Install dependencies
npm install

# Copy env file
cp .env.local.example .env.local
# Edit .env.local with all your values

# Run dev server
npm run dev
# Visit http://localhost:3000
# Login at http://localhost:3000/login
```

---

## Step 5 — Deploy to Vercel

### Option A — Vercel CLI
```bash
# Login to Vercel
vercel login

# Link project (first time)
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (your account)
# - Link to existing project? No
# - Project name: angkorgreen-dashboard
# - Directory: ./
# - Override settings? No

# Deploy to production
vercel --prod
```

### Option B — Vercel Dashboard
1. Push code to GitHub
2. Go to https://vercel.com/new
3. Import your GitHub repo
4. Framework: Next.js (auto-detected)
5. Add all environment variables (see below)
6. Deploy

---

## Step 6 — Set Environment Variables in Vercel

Go to: Vercel Dashboard → Project → Settings → Environment Variables

Add ALL of these:

```
NEXTAUTH_SECRET          = [output of openssl rand -base64 32]
NEXTAUTH_URL             = https://your-dashboard.vercel.app
DASHBOARD_ADMIN_EMAIL    = admin@angkorgreen.com.kh
DASHBOARD_ADMIN_PASSWORD = [your strong password]

NEXT_PUBLIC_FIREBASE_API_KEY               = AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN           = your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID            = your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET        = your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID   = 1234567890
NEXT_PUBLIC_FIREBASE_APP_ID                = 1:...:web:...

FIREBASE_ADMIN_PROJECT_ID    = your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL  = firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY   = -----BEGIN RSA PRIVATE KEY-----\nMIIE...\n-----END RSA PRIVATE KEY-----\n
```

⚠️ **For `FIREBASE_ADMIN_PRIVATE_KEY`**: In Vercel, paste the raw key with actual newlines
(not `\n` literals). Vercel handles escaping automatically.

After adding env vars:
```bash
vercel --prod   # Redeploy with new vars
```

---

## Step 7 — Verify Dashboard

1. Visit `https://your-dashboard.vercel.app`
2. Redirected to `/login` → enter your admin credentials
3. Should land on `/dashboard` with overview charts
4. Send a few messages to the bot → refresh dashboard → data appears

---

## Step 8 — Add Firestore Indexes (if not done for bot)

In Firebase Console → Firestore → Indexes → Add index:

| Collection | Field 1 | Field 2 | Scope |
|---|---|---|---|
| conversations | `user_id` (ASC) | `timestamp` (DESC) | Collection |
| conversations | `group_id` (ASC) | `timestamp` (DESC) | Collection |
| conversations | `detected_topic` (ASC) | `timestamp` (DESC) | Collection |
| conversations | `timestamp` (DESC) | — | Collection |
| users | `message_count` (DESC) | — | Collection |
| groups | `message_count` (DESC) | — | Collection |

---

## Environment Variables Reference

| Variable | Scope | Description |
|---|---|---|
| `NEXTAUTH_SECRET` | Server | Random 32-byte secret for JWT signing |
| `NEXTAUTH_URL` | Server | Full URL of your dashboard |
| `DASHBOARD_ADMIN_EMAIL` | Server | Login email |
| `DASHBOARD_ADMIN_PASSWORD` | Server | Login password |
| `NEXT_PUBLIC_FIREBASE_*` | Client | Firebase web SDK config (6 values) |
| `FIREBASE_ADMIN_*` | Server | Firebase Admin SDK (3 values) |

---

## Troubleshooting

| Problem | Solution |
|---|---|
| Login not working | Check `NEXTAUTH_SECRET` and `NEXTAUTH_URL` match your domain |
| Charts show no data | Bot must have processed some messages first |
| Firebase Admin errors | Check private key has real newlines in Vercel env vars |
| `Module not found` on build | Run `npm install` locally to verify all packages |
| 500 errors on API routes | Check Vercel function logs in dashboard |
| Khmer text garbled | Noto Sans Khmer is loaded from Google Fonts — needs internet |

---

## Useful Commands

```bash
npm run dev           # Local development (http://localhost:3000)
npm run build         # Test production build locally
vercel --prod         # Deploy to production
vercel logs           # View recent logs
vercel env ls         # List env variables
vercel env pull       # Download env vars to .env.local
```
