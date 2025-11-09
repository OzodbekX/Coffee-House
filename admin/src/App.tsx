// src/App.tsx
import {useEffect, useState} from "react";
import {addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc,} from "firebase/firestore";
import {db} from "./firebase";
import "./index.css";

type Chat = {
    id: string;
    userId?: string;
    lastMessage?: string;
    lastUpdated?: any;
    unreadCount?: number;
};

type Message = {
    text: string;
    sender: "user" | "admin";
    createdAt?: any;
    adminName?: string;
};

const App: React.FC = () => {
    const [adminName, setAdminName] = useState(localStorage.getItem("adminName") || "");
    const [chats, setChats] = useState<Chat[]>([]);
    const [filter, setFilter] = useState("");
    const [activeChat, setActiveChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [reply, setReply] = useState("");

    // --- Listen to chats ---
    useEffect(() => {
        const q = query(collection(db, "chats"), orderBy("lastUpdated", "desc"));
        const unsub = onSnapshot(q, (snap) => {
            setChats(snap.docs.map((d) => ({id: d.id, ...d.data()} as Chat)));
        });
        return unsub;
    }, []);

    // --- Listen to messages for selected chat ---
    useEffect(() => {
        if (!activeChat) return;
        const msgsRef = collection(db, `chats/${activeChat.id}/messages`);
        const q = query(msgsRef, orderBy("createdAt", "asc"));
        const unsub = onSnapshot(q, (snap) => {
            setMessages(snap.docs.map((d) => d.data() as Message));
            setChatReadZero(activeChat.id);
        });
        return unsub;
    }, [activeChat]);

    const saveAdmin = () => {
        if (!adminName.trim()) return alert("Enter your admin name");
        localStorage.setItem("adminName", adminName);
    };

    const fmtTime = (ts: any): string => {
        if (!ts) return "";
        const d = ts.toDate ? ts.toDate() : new Date(ts);
        return d.toLocaleString();
    };

    const escapeHtml = (str?: string) =>
        (str || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    const setChatReadZero = async (chatId: string) => {
        try {
            await setDoc(doc(db, "chats", chatId), {unreadCount: 0}, {merge: true});
        } catch {
        }
    };

    const sendReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeChat) return alert("Select a chat first");
        if (!reply.trim()) return;

        const payload: Message = {
            text: reply,
            sender: "admin",
            adminName: adminName || "admin",
            createdAt: serverTimestamp(),
        };

        try {
            await addDoc(collection(db, `chats/${activeChat.id}/messages`), payload);
            await setDoc(
                doc(db, "chats", activeChat.id),
                {lastMessage: reply, lastUpdated: serverTimestamp()},
                {merge: true}
            );
            setReply("");
        } catch (err: any) {
            alert("Failed to send reply: " + err.message);
        }
    };

    const filteredChats = chats.filter((c) => {
        const id = (c.userId || c.id).toLowerCase();
        const msg = (c.lastMessage || "").toLowerCase();
        const f = filter.toLowerCase();
        return !f || id.includes(f) || msg.includes(f);
    });

    return (
        <div className="app">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="header">
                    <div className="brand">Support Admin (no-auth)</div>
                    <div className="small">Real-time multi-admin</div>
                </div>

                <div className="admin-name">
                    <input
                        value={adminName}
                        onChange={(e) => setAdminName(e.target.value)}
                        placeholder="Your admin name (persisted)"
                        style={{flex: 1, padding: 8, borderRadius: 8, border: "1px solid #e6e9ef"}}
                    />
                    <button onClick={saveAdmin}>Save</button>
                </div>

                <div style={{marginBottom: 8}}>
                    <input
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        placeholder="Filter by user id / last message..."
                        style={{width: "100%", padding: 8, borderRadius: 8, border: "1px solid #e6e9ef"}}
                    />
                </div>

                <div className="chats">
                    {filteredChats.length ? (
                        filteredChats.map((c) => (
                            <div
                                key={c.id}
                                className="chat-item"
                                onClick={() => setActiveChat(c)}
                            >
                                <div>
                                    <div style={{fontWeight: 600}}>{escapeHtml(c.userId || c.id)}</div>
                                    <div
                                        className="chat-meta"
                                        dangerouslySetInnerHTML={{
                                            __html: c.lastMessage
                                                ? escapeHtml(c.lastMessage.slice(0, 60))
                                                : "&lt;no messages&gt;",
                                        }}
                                    />
                                </div>
                                <div style={{textAlign: "right"}}>
                                    <div className="chat-meta">{fmtTime(c.lastUpdated)}</div>
                                    <div style={{fontSize: 12, color: "var(--muted)"}}>
                                        {c.unreadCount ? `${c.unreadCount} new` : ""}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="small" style={{padding: 8, color: "var(--muted)"}}>
                            No chats yet.
                        </div>
                    )}
                </div>
            </aside>

            {/* Main panel */}
            <main className="main">
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                    <div>
                        <h3 style={{margin: 0}}>
                            {activeChat ? `Chat: ${activeChat.userId || activeChat.id}` : "Select a chat"}
                        </h3>
                        <div className="small">
                            {activeChat ? `Chat ID: ${activeChat.id}` : "Open a conversation to see messages"}
                        </div>
                    </div>
                    <div className="small">{adminName ? `Admin: ${adminName}` : ""}</div>
                </div>

                <div className="panel">
                    <div className="messages">
                        {!activeChat ? (
                            <div className="center">No chat selected — pick a chat on the left.</div>
                        ) : (
                            messages.map((m, i) => (
                                <div key={i} className={`msg ${m.sender === "admin" ? "admin" : "user"}`}>
                                    <div className="meta">
                                        {m.sender === "admin"
                                            ? `${escapeHtml(m.adminName || "admin")} • admin`
                                            : `user • ${fmtTime(m.createdAt)}`}
                                    </div>
                                    <div>{escapeHtml(m.text)}</div>
                                </div>
                            ))
                        )}
                    </div>

                    {activeChat && (
                        <form onSubmit={sendReply} className="composer">
                            <input
                                value={reply}
                                onChange={(e) => setReply(e.target.value)}
                                placeholder="Write your reply..."
                                autoComplete="off"
                            />
                            <button type="submit">Send</button>
                        </form>
                    )}
                </div>
            </main>
        </div>
    );
};

export default App;
