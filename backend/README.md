# FlashChat Backend

Single-instance backend for FlashChat assignment using Express, Socket.io, and MongoDB.

## Features

- Real-time chat via Socket.io
- MongoDB message persistence
- Session-based display names (no passwords)
- Duplicate active-name prevention with friendly prompt
- Users online count broadcast
- Health endpoint and Docker support
- **Self health ping** (`src/lib/keepAlive.js`): on some hosts (e.g. Render free tier), the platform may treat idle HTTP as a signal to scale down. The server periodically `GET`s its own `/health` so the Node process continues to see HTTP traffic while it is running. This does **not** wake a fully cold instance; for that you still need an external uptime ping or a paid tier. There is no env flag to disable this behavior; you can change how often it runs with `KEEP_ALIVE_INTERVAL_MS` (default `120000`).

## Prerequisites

- Node.js 20+
- MongoDB (local or hosted)

## Setup

1. Install dependencies:
   npm install
2. Create env file:
   cp .env.example .env
3. Update `.env` with your Mongo connection string.
4. Start development server:
   npm run dev

## Run in production

npm start

## Deploy on Render.com

1. **New Web Service** → connect this repo.
2. Set **Root Directory** to `backend`.
3. **Build command:** `npm install`  
4. **Start command:** `npm start`  
5. **Health check path:** `/health` (optional).

**Environment variables** (Render dashboard):

| Key | Value |
|-----|--------|
| `MONGO_URI` | MongoDB Atlas connection string |
| `CLIENT_ORIGIN` | Deployed frontend URL (e.g. `https://your-frontend.onrender.com`) — must match the browser origin exactly for CORS and Socket.io |
| `KEEP_ALIVE_INTERVAL_MS` | Optional. How often the server requests its own `/health` (ms). Default `120000` (2 minutes). |

Do **not** set `PORT` on Render; the platform assigns it. The server listens on `0.0.0.0` and uses `process.env.PORT`.

After deploy, use the service URL (e.g. `https://flashchat-backend.onrender.com`) as **`VITE_API_URL`** when building the frontend (Render Static Site env). Then set **`CLIENT_ORIGIN`** on the backend to your **Static Site** URL and redeploy the backend so CORS allows the browser origin.

## Docker

Build image:

docker build -t flashchat-backend .

Run container:

docker run --rm -p 4000:4000 --env-file .env flashchat-backend

## Socket Events

Client -> Server:

- `join_chat` `{ displayName }`
- `chat_message` `{ text }`

Server -> Client:

- `join_success` `{ displayName }`
- `join_name_taken` `{ message }`
- `join_error` `{ message }`
- `chat_history` `{ messages: [...] }`
- `chat_message` `{ id, displayName, text, createdAt }`
- `users_online` `{ count }`
- `message_error` `{ message }`

## API

- `GET /health` -> `{ status: "ok", service: "flashchat-backend" }`
