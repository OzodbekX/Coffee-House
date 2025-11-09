import React, { useEffect, useState, useRef } from "react";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { Message } from "@assets/types";
import { useUser } from "../../context/UserContext";

// ⏱ Configurable polling interval (ms)
const POLL_INTERVAL = 5000; // fetch every 5 seconds

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const { user } = useUser();
  const chatId = user?.login || Math.random().toString(36).substr(2);

  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // ✅ Function to load messages periodically instead of real-time
  const loadMessages = async () => {
    try {
      const q = query(
        collection(db, `chats/${chatId}/messages`),
        orderBy("createdAt"),
      );
      const snapshot = await getDocs(q);
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];
      setMessages(msgs);
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  };

  useEffect(() => {
    // Initial load
    loadMessages();

    // Poll for new messages every few seconds
    pollingRef.current = setInterval(loadMessages, POLL_INTERVAL);

    // Cleanup interval on unmount or chat change
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [chatId]);

  // ✅ Send message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      // Ensure chat document exists
      await setDoc(
        doc(db, "chats", chatId),
        {
          userId: chatId,
          lastMessage: text,
          lastUpdated: serverTimestamp(),
        },
        { merge: true },
      );

      // Add new message
      await addDoc(collection(db, `chats/${chatId}/messages`), {
        text,
        sender: chatId,
        createdAt: serverTimestamp(),
      });

      setText("");
      await loadMessages(); // refresh immediately after sending
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <div
        style={{
          border: "1px solid #ccc",
          height: 400,
          overflowY: "auto",
          padding: 10,
        }}
      >
        {messages.map((msg) => (
          <p
            key={msg.id}
            style={{
              textAlign: msg.sender === chatId ? "right" : "left",
              margin: "5px 0",
            }}
          >
            <strong>{msg.sender}:</strong> {msg.text}
          </p>
        ))}
      </div>

      <form onSubmit={sendMessage} style={{ display: "flex", marginTop: 10 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1, padding: "8px" }}
        />
        <button
          type="submit"
          className="button button--secondary"
          style={{ marginLeft: 8 }}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
