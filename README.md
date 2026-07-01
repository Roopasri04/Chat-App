# Simple Chat App

A basic real-time chat application built with **React** (frontend) and **Node.js + Socket.io** (backend).

## Features
- Real-time messaging using Socket.io
- Dummy user login (any non-empty username works)
- Message timestamps
- Typing indicator (bonus)
- System messages when users join/leave
- Chat history for newly joined users

## Tech Stack
- Frontend: React + Vite, socket.io-client
- Backend: Node.js, Express, Socket.io

## Project Structure
```
chat-app/
├── backend/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── Login.jsx
│       ├── Chat.jsx
│       ├── socket.js
│       └── index.css
├── screenshots/
│   ├── login.png
│   ├── user1_chat.png
│   ├── user2_chat.png
└── README.md
```

## Screenshots

### Login Screen
![Login](https://raw.githubusercontent.com/Roopasri04/Chat-App/main/screenshots/login.png)

### Chat 1
![Chat1](https://raw.githubusercontent.com/Roopasri04/Chat-App/main/screenshots/user1_chat.png)

### Chat 2
![Chat2](https://raw.githubusercontent.com/Roopasri04/Chat-App/main/screenshots/user2_chat.png)

## How to Run (in VS Code)

### 1. Backend
Open a terminal in the `backend` folder:
```bash
cd backend
npm install
npm start
```

This starts the server at **http://localhost:5000**.

### 2. Frontend
Open a **second terminal** in the `frontend` folder:
```bash
cd frontend
npm install
npm run dev
```

This starts the React app at **http://localhost:3000**.

### 3. Try it out
- Open http://localhost:3000 in two different browser tabs (or two browsers).
- Enter a different username in each tab.
- Send messages back and forth — you'll see them appear in real time with timestamps.

## Notes
- No real database is used — login is a "dummy" login as instructed (any username works), and chat history lives in memory on the server (resets when the server restarts).
- If you want to record a demo video for submission, run both servers, open two tabs side-by-side, and screen record yourself chatting between them.
- If deploying separately, update the `SOCKET_URL` in `frontend/src/socket.js` and the CORS origin in `backend/server.js` to match your deployed backend/frontend URLs.
