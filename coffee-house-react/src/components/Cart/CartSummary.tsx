import React from "react";
import type { UserData } from "../../assets/types";

interface CartSummaryProps {
    user: UserData | null;
    totalHtml: string;
    onConfirm: () => void;
}

export const CartSummary: React.FC<CartSummaryProps> = ({ user, totalHtml, onConfirm }) => (
    <div className="cart-summary" id="cart-summary">
        <p>
            <strong className="heading-3">Total:</strong>
            <span dangerouslySetInnerHTML={{ __html: totalHtml }} />
        </p>
        <p>
            <strong className="heading-3">Address:</strong>
            <span>{user ? `${user.city}, ${user.street}, ${user.houseNumber}` : "-"}</span>
        </p>
        <p>
            <strong className="heading-3">Pay by:</strong>
            <span>{user ? user.paymentMethod : "-"}</span>
        </p>
    </div>
);
