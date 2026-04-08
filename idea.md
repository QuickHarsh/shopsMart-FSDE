# shopsMart-FSDE

# ShopSmart – Price Comparison Engine

## Overview

The Price Comparison Engine is a core feature of ShopSmart that helps users find the best price for any product across multiple ecommerce platforms.

Instead of manually checking different websites, users can:
- Compare prices instantly
- Track price history
- Get alerts when prices drop

---

## Problem Statement

Users face:
- Time waste switching between platforms
- Confusion due to multiple listings
- Missing best deals

---

## Solution

ShopSmart provides:
A unified platform to compare product prices across multiple ecommerce sites in real-time.

---

## Key Features

### 1. Multi-Platform Price Comparison

- Compare product prices across:
  - Amazon
  - Flipkart
  - Other platforms (future)

Example Output:

| Platform  | Price  | Rating | Link |
|----------|--------|--------|------|
| Amazon   | ₹19,999 | 4.3    | View |
| Flipkart | ₹18,499 | 4.2    | View |

---

### 2. Price History Tracking

- Visual graph of price changes over time
- Helps users decide the best time to buy

---

### 3. Price Drop Alerts

- Users can set alerts for products
- Notifications via:
  - Email
  - WhatsApp (future)

---

### 4. Smart Recommendation

- Suggests:
  - Best value product
  - Highest rated option
  - Budget alternative

---

### 5. Review Summary

- AI-based summary:
  - Pros
  - Cons

---

## Tech Stack

### Frontend
- React / Next.js
- Tailwind CSS

### Backend
- Node.js + Express

### Database
- MongoDB / PostgreSQL

### Data Collection
- APIs (if available)
- Web scraping (Puppeteer / Playwright)

### DevOps
- Docker
- CI/CD (GitHub Actions)

---

## Workflow

1. User searches product
2. Backend fetches data from multiple sources
3. Normalize product data
4. Store/update price in database
5. Return comparison to frontend

---

## Data Model (Simplified)

```json
{
  "product_name": "iPhone 13",
  "platform": "Amazon",
  "price": 49999,
  "rating": 4.5,
  "timestamp": "2026-04-08"
}
