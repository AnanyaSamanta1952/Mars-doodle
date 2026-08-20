<b>Introduction</b>

Real-time multiplayer drawing-and-guessing game (Skribbl.io-style). One player draws a secret word live; others guess via chat. MERN stack + Socket.IO.

**Tech stack:** React (Vite), Node/Express, MongoDB/Mongoose, Socket.IO, JWT + bcrypt

<b>Project Summary</b>

*Situation:* Wanted a portfolio project beyond basic CRUD — something that required real-time, event-driven communication across many concurrent users, not just request/response APIs.

*Task:* Build a full multiplayer game: secure auth, shareable game rooms, a live shared canvas, chat-based guessing, automatic scoring, and turn rotation between players.

*Action:* Built a hybrid REST + WebSocket backend — Express/MongoDB for durable data (accounts, rooms, authorization), Socket.IO for real-time events (drawing strokes, chat, round transitions). Implemented JWT auth with bcrypt-hashed passwords and server-side authorization checks (e.g., only the host can start a game).

*Result:* A fully playable multiplayer game with live canvas sync, real-time chat-guessing, automatic scoring, and turn rotation — no polling or refresh needed anywhere.

<b>Getting Started</b>

```
        cd mars-doodle/backend && npm install && npm run dev 
        cd mars-doodle/frontend && npm install && npm run dev
```
