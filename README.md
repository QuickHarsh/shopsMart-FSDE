# ShopSmart Price Comparison Engine

A compact full-stack starter for ShopSmart's price comparison workflow.

## What it includes

- React frontend with a search-driven comparison dashboard
- Express backend with mock multi-platform pricing data
- Price history snapshots and alert creation flow
- Smart recommendation and review summary sections

## Project structure

- `backend/` - Express API and mock catalog
- `frontend/` - React + Vite dashboard
- `idea.md` - original feature brief

## Run locally

Install dependencies in each app, then start both servers:

```bash
cd backend
npm install
npm run dev
```

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` and proxies API calls to the backend on `http://localhost:4000`.

## API endpoints

- `GET /api/health`
- `GET /api/products/search?q=iPhone%2013`
- `GET /api/products/:productId/history`
- `GET /api/alerts`
- `POST /api/alerts`

## Notes

- The catalog is currently mock data so the UI can be demonstrated without scraping or external APIs.
- The backend is structured so real marketplace integrations can be plugged in later.
