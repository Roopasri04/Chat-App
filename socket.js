import { io } from "socket.io-client";

// Change this if your backend runs on a different host/port
const SOCKET_URL = "http://localhost:5000";

// autoConnect: false lets us connect only after the user "logs in"
export const socket = io(SOCKET_URL, {
  autoConnect: false,
});
