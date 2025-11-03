# 📈 Stock Ticker Dashboard 

[![Demo Link](https://img.shields.io/badge/Live%20Demo-Vercel-000000?style=for-the-badge&logo=vercel)](https://stock-ticker-dashboard.vercel.app/)
[![GitHub Repo stars](https://img.shields.io/github/stars/YOUR_GITHUB_USER/YOUR_REPO_NAME?style=for-the-badge&color=yellow)](https://github.com/COMPILELINE/Stock-Ticker-Dashboard)

A real-time stock watchlist built with React, Vite, and Alpha Vantage.  
It rotates API requests to stay within free-tier limits, stores your watchlist locally, and flashes price changes for a live trading feel.

---

## 🌟 Features

- Real-time stock price polling (API-safe)
- Persistent watchlist via `localStorage`
- Green/Red flash animations for price moves
- Serverless proxy for secure API key handling
- Clean architecture with Context API + custom hooks
- Deployed with Vercel

---

## 🛠 Tech Stack

| Layer | Tools |
|---|---|
| Framework | React + Vite |
| State | Context API + `useReducer` |
| Hooks | `useLocalStorage`, `useInterval` |
| Style | Pure CSS |
| API | Alpha Vantage |
| Hosting | Vercel (Serverless Functions) |

---

## 🚀 Installation

### Requirements

- Node.js (LTS)
- Alpha Vantage API Key: https://www.alphavantage.co/support/#api-key
- Vercel CLI  
  ```bash
  npm install -g vercel
- Setup
  ```bash
  git clone YOUR_REPO_URL
  cd react-stock-ticker-dashboard
  npm install
- Environment Variables
  Create .env.local in project root:
  ```bash
  ALPHA_VANTAGE_API_KEY="YOUR_API_KEY_HERE"
  VITE_API_URL=/api

