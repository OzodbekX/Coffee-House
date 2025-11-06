import React, { useState } from "react";
import "../../styles/components/_payment-modal.scss";
import "../../styles/components/_registration.scss";

interface PaymentModalProps {
  totalPrice: number;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  totalPrice,
  onConfirm,
  onClose,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error" | "";
  }>({
    text: "",
    type: "",
  });

  // --- Validation functions (mirroring Registration style) ---
  const validateName = (v: string): string | null => {
    if (v.trim().length < 2) return "Name must be at least 2 characters long.";
    if (!/^[A-Za-z\s]+$/.test(v))
      return "Name can only contain letters and spaces.";
    return null;
  };

  const validateCardNumber = (v: string): string | null => {
    const cleaned = v.replace(/\s+/g, "");
    if (!/^\d{16}$/.test(cleaned)) return "Card number must be 16 digits.";
    return null;
  };

  const validateExpiry = (v: string): string | null => {
    if (!/^\d{2}\/\d{2}$/.test(v)) return "Expiry must be in MM/YY format.";
    const [month, year] = v.split("/").map(Number);
    if (month < 1 || month > 12) return "Invalid month.";
    const now = new Date();
    const expiryDate = new Date(2000 + year, month - 1);
    if (expiryDate < new Date(now.getFullYear(), now.getMonth()))
      return "Card is expired.";
    return null;
  };

  const validateCVV = (v: string): string | null => {
    if (!/^\d{3,4}$/.test(v)) return "CVV must be 3 or 4 digits.";
    return null;
  };

  const handleBlur = (field: string) => {
    let error = "";
    switch (field) {
      case "name":
        error = validateName(name) || "";
        break;
      case "cardNumber":
        error = validateCardNumber(cardNumber) || "";
        break;
      case "expiry":
        error = validateExpiry(expiry) || "";
        break;
      case "cvv":
        error = validateCVV(cvv) || "";
        break;
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleFocus = (field: string) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setMessage({ text: "", type: "" });
  };

  const isFormValid =
    !validateName(name) &&
    !validateCardNumber(cardNumber) &&
    !validateExpiry(expiry) &&
    !validateCVV(cvv);

  const handlePayment = async () => {
    const nameErr = validateName(name);
    const cardErr = validateCardNumber(cardNumber);
    const expiryErr = validateExpiry(expiry);
    const cvvErr = validateCVV(cvv);

    if (nameErr || cardErr || expiryErr || cvvErr) {
      setErrors({
        name: nameErr || "",
        cardNumber: cardErr || "",
        expiry: expiryErr || "",
        cvv: cvvErr || "",
      });
      setMessage({
        text: "Please fix the errors before proceeding.",
        type: "error",
      });
      return;
    }

    try {
      setIsProcessing(true);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate delay
      await onConfirm();
      setMessage({ text: "Payment successful!", type: "success" });
    } catch {
      setMessage({ text: "Payment failed. Please try again.", type: "error" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        <h3 className="heading-2">Payment</h3>
        <p className="text-medium">Total: ${totalPrice.toFixed(2)}</p>

        {/* Cardholder Name */}
        <div className="form-field">
          <label htmlFor="card-name" className="text-medium">
            Cardholder Name
          </label>
          <input
            id="card-name"
            type="text"
            value={name}
            placeholder="Enter name"
            onChange={(e) => setName(e.target.value)}
            onBlur={() => handleBlur("name")}
            onFocus={() => handleFocus("name")}
            style={{ border: errors.name ? "1px solid #b00020" : undefined }}
          />
          {errors.name && (
            <div className="text-caption" style={{ color: "#b00020" }}>
              ❗ {errors.name}
            </div>
          )}
        </div>

        {/* Card Number */}
        <div className="form-field">
          <label htmlFor="card-number" className="text-medium">
            Card Number
          </label>
          <input
            id="card-number"
            type="text"
            maxLength={19}
            value={cardNumber}
            placeholder="1234 5678 9012 3456"
            onChange={(e) =>
              setCardNumber(
                e.target.value
                  .replace(/\D/g, "")
                  .replace(/(\d{4})(?=\d)/g, "$1 "),
              )
            }
            onBlur={() => handleBlur("cardNumber")}
            onFocus={() => handleFocus("cardNumber")}
            style={{
              border: errors.cardNumber ? "1px solid #b00020" : undefined,
            }}
          />
          {errors.cardNumber && (
            <div className="text-caption" style={{ color: "#b00020" }}>
              ❗ {errors.cardNumber}
            </div>
          )}
        </div>

        {/* Expiry + CVV */}
        <div className="payment-row">
          <div className="form-field">
            <label htmlFor="expiry" className="text-medium">
              Expiry (MM/YY)
            </label>
            <input
              id="expiry"
              type="text"
              value={expiry}
              maxLength={5}
              placeholder="MM/YY"
              onChange={(e) =>
                setExpiry(
                  e.target.value
                    .replace(/[^\d/]/g, "")
                    .replace(/^(\d{2})(\d{1,2})$/, "$1/$2"),
                )
              }
              onBlur={() => handleBlur("expiry")}
              onFocus={() => handleFocus("expiry")}
              style={{
                border: errors.expiry ? "1px solid #b00020" : undefined,
              }}
            />
            {errors.expiry && (
              <div className="text-caption" style={{ color: "#b00020" }}>
                ❗ {errors.expiry}
              </div>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="cvv" className="text-medium">
              CVV
            </label>
            <input
              id="cvv"
              type="text"
              value={cvv}
              maxLength={4}
              placeholder="123"
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
              onBlur={() => handleBlur("cvv")}
              onFocus={() => handleFocus("cvv")}
              style={{ border: errors.cvv ? "1px solid #b00020" : undefined }}
            />
            {errors.cvv && (
              <div className="text-caption" style={{ color: "#b00020" }}>
                ❗ {errors.cvv}
              </div>
            )}
          </div>
        </div>

        <div className="payment-actions">
          <button
            onClick={handlePayment}
            disabled={isProcessing || !isFormValid}
            className="button button--secondary"
          >
            {isProcessing ? "Processing..." : "Pay Now"}
          </button>
          <button onClick={onClose} className="button button--outline">
            Cancel
          </button>
        </div>

        {message.text && (
          <div
            style={{
              marginTop: "12px",
              color: message.type === "error" ? "#b00020" : "green",
            }}
          >
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
};
