import { useState } from "react";
import Login from "./Login.jsx";
import Chat from "./Chat.jsx";

export default function App() {
  const [username, setUsername] = useState(null);

  const handleLogin = (name) => setUsername(name);
  const handleLogout = () => setUsername(null);

  return username ? (
    <Chat username={username} onLogout={handleLogout} />
  ) : (
    <Login onLogin={handleLogin} />
  );
}
