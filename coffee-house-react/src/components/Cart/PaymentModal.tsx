import React, { useState } from "react";
import "../../styles/components/_payment-modal.scss";

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

  const handlePayment = async () => {
    setIsProcessing(true);

    // Simulate payment delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await onConfirm();
    setIsProcessing(false);
  };

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        <h3>Payment</h3>
        <p>Total: ${totalPrice.toFixed(2)}</p>

        <input
          type="text"
          placeholder="Cardholder Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Card Number"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
        />
        <div className="payment-row">
          <input
            type="text"
            placeholder="MM/YY"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
          />
          <input
            type="text"
            placeholder="CVV"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
          />
        </div>

        <div className="payment-actions">
          <button
            onClick={handlePayment}
            disabled={isProcessing || !cardNumber || !name || !expiry || !cvv}
            className="button button--secondary"
          >
            {isProcessing ? "Processing..." : "Pay Now"}
          </button>
          <button onClick={onClose} className="button button--outline">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
