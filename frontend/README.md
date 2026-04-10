# FlashChat Frontend

React + Vite frontend for the FlashChat assignment.

## Features

- Join chat with display name
- Friendly duplicate-name prompt
- Real-time messaging with Socket.io
- Users online count
- Message timestamps
- Message history from backend persistence

## Setup

1. Install dependencies:
   `npm install`
2. Create env file:
   `cp .env.example .env`
3. Start frontend:
   `npm run dev`

Default backend URL:
- `VITE_API_URL=http://localhost:4000`

## Run order

1. Start backend first (`backend/npm run dev`)
2. Start frontend (`frontend/npm run dev`)
3. Open frontend URL from Vite output (usually `http://localhost:5173`)

## Deploy on Render.com (Static Site)

1. Deploy the **backend** Web Service first and note its URL (e.g. `https://flashchat-backend.onrender.com`).
2. Create a **Static Site** and connect the same repo.
3. Set **Root Directory** to `frontend`.
4. **Build command:** `npm install && npm run build`
5. **Publish directory:** `dist`
6. **Environment** (required at **build** time for Vite):
   - `VITE_API_URL` = your backend URL (same value you use locally for the API/Socket.io server), **no trailing slash**

7. After the static site URL is live, set the backend env **`CLIENT_ORIGIN`** to that exact frontend URL (scheme + host, no trailing slash) and **redeploy the backend** so CORS and Socket.io match.

If you add client-side routes later, configure a **rewrite** in the Render Static Site settings (e.g. `/*` → `/index.html`) so refreshes work.

## Backend events consumed

- `join_success`
- `join_name_taken`
- `join_error`
- `chat_history`
- `chat_message`
- `users_online`
- `message_error`

## How to explain this in interview

- `App.jsx` holds all UI state with plain React hooks.
- Join form emits `join_chat`; backend confirms with `join_success`.
- Messages are initialized from `chat_history` and updated with `chat_message`.
- Online users are updated from `users_online`.
- `socket.js` centralizes backend connection URL and socket instance.
