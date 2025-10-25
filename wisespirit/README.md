# 🧩 WiseSpirit by GateGroup

A full-stack MVP web app that automates alcohol bottle handling decisions for airline catering staff using AI and voice synthesis.

## 🎯 Overview

Different airlines have their own policies on what to do with half-full bottles of alcohol (reuse, combine, or discard). Employees currently decide manually, which causes inconsistency. WiseSpirit automates this process by:

- Taking bottle data input
- Fetching airline policies from the database
- Using AI to interpret policy text when needed
- Returning automated decisions
- Providing voice feedback via ElevenLabs

## ⚙️ Tech Stack

- **Frontend:** Next.js 14 + TailwindCSS
- **Backend:** Next.js API routes
- **Database:** PostgreSQL via Prisma ORM
- **AI:** Google Gemini API (policy interpretation)
- **Voice:** ElevenLabs API (spoken decision)
- **Deploy:** Vercel-ready

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (Note: Next.js 16 requires Node 20+, but the app will work with 18+)
- PostgreSQL running locally
- API keys for:
  - Google Gemini API
  - ElevenLabs API

### Installation

1. **Clone and install dependencies:**
   ```bash
   cd wisespirit
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

3. **Set up the database:**
   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Visit:** `http://localhost:3000`

## 🧪 Testing the App

Try these test cases:

1. **Aeromexico Test:**
   - Airline: `Aeromexico`
   - Bottle: `Whiskey`
   - Volume: `35`
   - Expected: **Decision: Discard** (below 40% reuse threshold)

2. **Lufthansa Test:**
   - Airline: `Lufthansa`
   - Bottle: `Vodka`
   - Volume: `60`
   - Expected: **Decision: Reuse** (above 50% threshold)

3. **British Airways Test:**
   - Airline: `British Airways`
   - Bottle: `Gin`
   - Volume: `45`
   - Expected: **Decision: Discard** (below 50% threshold)

## 📁 Project Structure

```
wisespirit/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── decision/route.ts    # Decision logic API
│   │   │   └── voice/route.ts       # Voice synthesis API
│   │   ├── page.tsx                 # Main UI component
│   │   └── layout.tsx
│   └── lib/
│       ├── prisma.ts                # Prisma client
│       └── ai.ts                    # Gemini AI integration
├── prisma/
│   ├── schema.prisma                # Database schema
│   └── seed.ts                      # Sample data
├── .env                             # Environment variables
├── vercel.json                      # Vercel deployment config
└── package.json
```

## 🗄️ Database Schema

### AirlinePolicy
- `airlineName` (unique): Name of the airline
- `minReusePercentage`: Minimum percentage to reuse bottle
- `discardBelow`: Percentage below which to discard
- `canCombine`: Whether bottles can be combined
- `policyText`: Raw policy text for AI interpretation

### DecisionLog
- `airlineName`: Airline that made the decision
- `bottleType`: Type of alcohol bottle
- `volume`: Remaining volume percentage
- `decision`: Final decision (Reuse/Discard/Combine/Hold for review)

## 🔧 API Endpoints

### POST `/api/decision`
Processes bottle data and returns a decision.

**Request:**
```json
{
  "airlineName": "Aeromexico",
  "bottleType": "Whiskey",
  "volume": 35
}
```

**Response:**
```json
{
  "decision": "Discard"
}
```

### POST `/api/voice`
Converts text to speech using ElevenLabs.

**Request:**
```json
{
  "text": "Action: Discard"
}
```

**Response:** Audio file (MP3)

## 🚀 Deployment

### Vercel Deployment

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial WiseSpirit MVP"
   git push origin main
   ```

2. **Deploy on Vercel:**
   - Connect your GitHub repo to Vercel
   - Add environment variables in Vercel dashboard:
     - `DATABASE_URL`: Your PostgreSQL connection string
     - `GEMINI_API_KEY`: Your Google Gemini API key
     - `ELEVENLABS_API_KEY`: Your ElevenLabs API key

3. **Set up database:**
   - Use Vercel Postgres or external PostgreSQL
   - Run migrations: `npx prisma migrate deploy`
   - Seed data: `npm run db:seed`

### Environment Variables

Create these in your Vercel project settings:

```bash
DATABASE_URL="postgresql://username:password@host:port/database"
GEMINI_API_KEY="your_gemini_api_key_here"
ELEVENLABS_API_KEY="your_elevenlabs_api_key_here"
```

## 🔑 API Keys Setup

### Google Gemini API
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add to environment variables

### ElevenLabs API
1. Sign up at [ElevenLabs](https://elevenlabs.io/)
2. Get your API key from the dashboard
3. Add to environment variables

## 🎯 Features

- ✅ **Automated Decision Making:** AI-powered policy interpretation
- ✅ **Voice Feedback:** Spoken decisions via ElevenLabs
- ✅ **Policy Management:** Flexible airline policy storage
- ✅ **Decision Logging:** Complete audit trail
- ✅ **Modern UI:** Clean, responsive interface
- ✅ **Production Ready:** Vercel deployment configuration

## 🛠️ Development

### Database Commands
```bash
# Generate Prisma client
npx prisma generate

# Create migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset

# Seed database
npm run db:seed

# View database
npx prisma studio
```

### Adding New Airlines

1. **Via Database:**
   ```sql
   INSERT INTO "AirlinePolicy" (airlineName, minReusePercentage, discardBelow, canCombine)
   VALUES ('New Airline', 45, 25, true);
   ```

2. **Via Seed File:**
   Add to `prisma/seed.ts` and run `npm run db:seed`

## 📝 License

This project is part of the GateGroup alcohol handling automation challenge.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Built with ❤️ for GateGroup**
