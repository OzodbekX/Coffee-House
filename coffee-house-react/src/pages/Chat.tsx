import React, { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
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

  // For now, simulate unique user ID (later you can use Firebase Auth or random localStorage ID)
  const chatId = user?.login || Math.random().toString(36).substr(2);

  useEffect(() => {
    const q = query(
      collection(db, `chats/${chatId}/messages`),
      orderBy("createdAt"),
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [chatId]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    // ensure chat doc exists or update metadata
    await setDoc(
      doc(db, "chats", chatId),
      {
        userId: chatId,
        lastMessage: text,
        lastUpdated: serverTimestamp(),
      },
      { merge: true },
    );

    // add new message
    await addDoc(collection(db, `chats/${chatId}/messages`), {
      text,
      sender: user?.login,
      createdAt: serverTimestamp(),
    });

    setText("");
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
              textAlign: msg.sender === "admin" ? "left" : "right",
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
          className={"button button--secondary"}
          style={{ marginLeft: 8 }}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
