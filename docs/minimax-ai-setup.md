# MiniMax AI Setup

This repository now includes a server-side MiniMax proxy and a frontend integration in the briefing screen.

## Local env

Add these values to the root `.env` file:

```env
MINIMAX_API_KEY=...
MINIMAX_MODEL=MiniMax-M2.7
MINIMAX_BASE_URL=https://api.minimaxi.com/v1
VITE_API_BASE_URL=http://localhost:3001
```

## Run locally

Start the AI proxy:

```bash
npm run ai:server
```

In a second terminal, start the frontend:

```bash
npm run dev
```

## Endpoint

`POST /api/ai/infer`

Request body:

```json
{
  "systemPrompt": "You are a concise market analyst.",
  "userPrompt": "Summarize the latest signals.",
  "model": "MiniMax-M2.7",
  "temperature": 1
}
```

Response body:

```json
{
  "ok": true,
  "model": "MiniMax-M2.7",
  "text": "..."
}
```
