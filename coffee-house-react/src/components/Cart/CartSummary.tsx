import React from "react";
import type {UserData} from "../../assets/types";
import {useTranslation} from "react-i18next";
import {useCart} from "../../../context/CartContext";

interface CartSummaryProps {
    user: UserData | null;
    totalHtml: string;
}

export const CartSummary: React.FC<CartSummaryProps> = ({ user, totalHtml }) => {
    const { t } = useTranslation();


    return <div className="cart-summary" id="cart-summary">
        <p>
            <strong className="heading-3">{t('productModal.total')}:</strong>
            <span dangerouslySetInnerHTML={{ __html: totalHtml }} />
        </p>
        <p>
            <strong className="heading-3">{t('address')}:</strong>
            <span>{user ? `${user.city}, ${user.street}, ${user.houseNumber}` : "-"}</span>
        </p>
        <p>
            <strong className="heading-3">{t('registration.labels.payBy')}:</strong>
            <span>{user ? user.paymentMethod : "-"}</span>
        </p>
    </div>
};
