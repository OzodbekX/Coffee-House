import React, { useEffect, useState } from "react";
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

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const { user } = useUser();

  // use user.login if available, otherwise random id
  const chatId = user?.login || Math.random().toString(36).substr(2);

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
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  // ✅ Load messages every 5 seconds
  useEffect(() => {
    // load immediately
    loadMessages();

    // then every 5 seconds
    const interval = setInterval(loadMessages, 5000);

    // cleanup when component unmounts or chatId changes
    return () => clearInterval(interval);
  }, [chatId]);

  // ✅ send message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      // ensure chat document exists
      await setDoc(
        doc(db, "chats", chatId),
        {
          userId: chatId,
          lastMessage: text,
          lastUpdated: serverTimestamp(),
        },
        { merge: true },
      );

      // add message
      await addDoc(collection(db, `chats/${chatId}/messages`), {
        text,
        sender: chatId,
        createdAt: serverTimestamp(),
      });

      setText("");
      await loadMessages(); // instantly reload after sending
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
