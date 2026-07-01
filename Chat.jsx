import { useEffect, useRef, useState } from "react";
import { socket } from "./socket";

function formatTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function Chat({ username, onLogout }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typingUser, setTypingUser] = useState(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    socket.connect();
    socket.emit("user_join", username);

    socket.on("chat_history", (history) => {
      setMessages(history);
    });

    socket.on("receive_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("system_message", (message) => {
      setMessages((prev) => [...prev, { ...message, system: true, id: `sys-${Date.now()}` }]);
    });

    socket.on("user_typing", (name) => {
      setTypingUser(name);
    });

    socket.on("user_stop_typing", () => {
      setTypingUser(null);
    });

    return () => {
      socket.off("chat_history");
      socket.off("receive_message");
      socket.off("system_message");
      socket.off("user_typing");
      socket.off("user_stop_typing");
      socket.disconnect();
    };
  }, [username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    socket.emit("send_message", { username, text: input.trim() });
    socket.emit("stop_typing");
    setInput("");
  };

  const handleTyping = (e) => {
    setInput(e.target.value);
    socket.emit("typing", username);

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing");
    }, 1000);
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h2>💬 Chat App</h2>
        <div className="header-right">
          <span>Logged in as <strong>{username}</strong></span>
          <button onClick={onLogout}>Logout</button>
        </div>
      </header>

      <main className="messages-list">
        {messages.map((msg) =>
          msg.system ? (
            <div key={msg.id} className="system-message">
              {msg.text}
            </div>
          ) : (
            <div
              key={msg.id}
              className={`message ${msg.username === username ? "own" : "other"}`}
            >
              {msg.username !== username && (
                <span className="msg-username">{msg.username}</span>
              )}
              <div className="msg-bubble">
                <span className="msg-text">{msg.text}</span>
                <span className="msg-time">{formatTime(msg.timestamp)}</span>
              </div>
            </div>
          )
        )}
        <div ref={messagesEndRef} />
      </main>

      {typingUser && <div className="typing-indicator">{typingUser} is typing...</div>}

      <form className="message-input-form" onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={handleTyping}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
