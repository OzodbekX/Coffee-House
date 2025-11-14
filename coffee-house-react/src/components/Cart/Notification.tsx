import React, { useEffect } from "react";

interface NotificationProps {
  text: string;
  type: "success" | "error";
  onClose: () => void;
}

export const Notification: React.FC<NotificationProps> = ({
  text,
  type,
  onClose,
}) => {
  useEffect(() => {
    const timeout = setTimeout(onClose, 4000);
    return () => clearTimeout(timeout);
  }, [onClose]);

  return (
    <div
      id="cart-top-notify"
      style={{
        position: "fixed",
        top: "0",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 2000,
        padding: "12px 20px",
        borderRadius: "0 0 12px 12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
        fontWeight: 600,
        backgroundColor: type === "error" ? "#b00020" : "#2e7d32",
        color: "white",
        transition: "opacity 0.4s ease, top 0.4s ease",
      }}
    >
      {text}
    </div>
  );
};
