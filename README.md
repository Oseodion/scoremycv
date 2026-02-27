# ScoreMyCV — Deployment Guide

## Files
- `index.html` — Frontend
- `api/analyze.js` — Serverless function (keeps your Groq key secret)
- `vercel.json` — Vercel routing config

## Deploy Steps

### 1. Get your free Groq API key
- Go to https://console.groq.com
- Sign up (free, no credit card)
- Click API Keys → Create API Key
- Copy the key (starts with gsk_)

### 2. Push to GitHub
- Create a new GitHub repo called `scoremycv`
- Upload all 3 files (index.html, api/analyze.js, vercel.json)

### 3. Deploy to Vercel
- Go to https://vercel.com
- Click "Add New Project" → Import your GitHub repo
- Before clicking Deploy, click "Environment Variables"
- Add: Name = `GROQ_API_KEY`, Value = your gsk_ key
- Click Deploy

Done! Users can now analyze CVs without needing any API key.
