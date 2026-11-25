# Customer Loyalty Rewards System

A web app for a factory owner to reward customers who buy their boxed products.
Each box contains a unique one-time QR code. Customers scan it, sign in with Google,
earn points, and redeem them for rewards. The owner manages products, code batches,
rewards and redemption requests, and monitors activity and fraud from a dashboard.

> **Status:** Frontend complete with a temporary mock API (`client/src/api/mockApi.js`).
> Backend (Node.js + Express + MySQL) is next.

## Tech stack
- **Frontend:** React + Vite + Tailwind CSS + React Router
- **Backend (planned):** Node.js + Express + TypeScript + Prisma
- **Database (planned):** MySQL 8

## Run the frontend locally
```bash
cd client
npm install
npm run dev
```
Open http://localhost:5173

## Demo data (mock mode)
| What | Value |
|---|---|
| Owner login | `admin@factory.com` / `admin123` (at `/admin/login`) |
| Valid code | `DEMO-CODE-AAA2`, `DEMO-CODE-BBB3`, `DEMO-CODE-CCC4` |
| Already-used code | `DEMO-USED-XXX5` |
| Code from inactive batch | `DEMO-INAC-TVE6` |

QR link format: `http://localhost:5173/claim?code=DEMO-CODE-AAA2`

Use **Reset demo data** on the admin dashboard to restore the starting data.
