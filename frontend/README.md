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
