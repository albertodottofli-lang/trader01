# Trader01 - Integrated Trading Simulator (SQLite + Prisma)

Features:
- Integrated single-page dashboard with Market Overview, Portfolio, Automation, Chart, History
- SQLite database via Prisma for persistence (data/trader.db)
- Yahoo Finance data via yahoo-finance2
- Automation runs every 30s (frontend triggers POST /api/trading)

## Setup (local)

1. Install dependencies

```bash
npm install
```

2. Initialize Prisma and apply migrations (run locally):

```bash
npx prisma generate
npx prisma migrate dev --name init
```

3. Run dev server

```bash
npm run dev
```

4. Open http://localhost:3000

Notes:
- The included `data/trader.db` file is an empty placeholder. After running `prisma migrate dev`, the SQLite file will be created.
- On Vercel, filesystem is ephemeral; consider using an external DB for production.
