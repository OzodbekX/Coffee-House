import React, { useState } from "react";
import { CartItemType, UserData } from "../assets/types";
import { confirmOrder } from "../assets/api";
import {
    calculatePrice,
    getSelectedItems, getUserData,
    renderPrice,
    setShoppingItemCount,
} from "../assets/helpers";
import { CartItem } from "../components/Cart/CartItem";
import { Notification } from "../components/Cart/Notification";
import { CartSummary } from "../components/Cart/CartSummary";
import "../styles/components/_shopping-cart.scss";
import { useTranslation } from "react-i18next";



export const CartPage: React.FC = () => {
    const { t } = useTranslation();
    const [cartItems, setCartItems] = useState<CartItemType[]>(getSelectedItems());
    const [notify, setNotify] = useState<{ text: string; type: "success" | "error" } | null>(null);
    const [user] = useState<UserData | null>(getUserData());

    const handleRemove = (index: number) => {
        const updated = [...cartItems];
        updated.splice(index, 1);
        localStorage.setItem("selectedItems", JSON.stringify(updated));
        setCartItems(updated);
        setShoppingItemCount();
    };

    const handleConfirm = async () => {
        if (!cartItems.length) {
            setNotify({ text: t("cartPage.emptyCart"), type: "error" });
            return;
        }

        const payloadItems = cartItems.map(({ id, product, size, additives }) => {
            const sizeKey = size?.key as "s" | "m" | "l";
            return {
                productId: product.id,
                size: sizeKey,
                additives: additives?.map((i) => i?.name) || [],
                quantity: 1,
            };
        });

        const totalPrice = cartItems.reduce((acc, { id, product, size, additives }) => {
            const { total } = calculatePrice({
                size: size,
                additives: additives || [],
            });
            return acc + Number(total);
        }, 0);

        const ok = window.confirm(
            t("cartPage.confirmPrompt", { count: cartItems.length })
        );
        if (!ok) return;

        try {
            await confirmOrder({ items: payloadItems, totalPrice });
            localStorage.setItem("selectedItems", JSON.stringify([]));
            setCartItems([]);
            setShoppingItemCount();
            setNotify({ text: t("cartPage.success"), type: "success" });
        } catch {
            setNotify({ text: t("cartPage.error"), type: "error" });
        }
    };

    const renderedItems = cartItems
        .map((ci, index) => {
            const product = ci?.product;
            if (!product) return null;
            const { total, discounted } = calculatePrice({
                size: ci.size,
                additives: ci.additives || [],
            });
            const sizeLabel = ci?.size?.key || "s";
            const additivesLabel = ci.additives?.map((a) => a.name).join(", ") || "";

            return (
                <CartItem
                    key={index}
                    product={product}
                    sizeLabel={sizeLabel}
                    additivesLabel={additivesLabel}
                    total={total}
                    discounted={discounted}
                    onRemove={() => handleRemove(index)}
                />
            );
        })
        .filter(Boolean);

    const totalHtml = renderPrice(
        renderedItems.reduce((sum, el) => sum + (el as any).props.total, 0),
        renderedItems.reduce((sum, el) => sum + (el as any).props.discounted, 0)
    );

    return (
        <div className="shopping-cart-container">
            {notify && (
                <Notification
                    text={notify.text}
                    type={notify.type}
                    onClose={() => setNotify(null)}
                />
            )}

            <h2 className="cart-title heading-2">{t("cartPage.title")}</h2>

            <div id="cart-items">{renderedItems}</div>

            <CartSummary user={user} totalHtml={totalHtml} />

            <div className="cart-actions">
                {user ? (
                    <button
                        onClick={handleConfirm}
                        disabled={cartItems?.length == 0}
                        className="button button--secondary"
                    >
                        {t("cartPage.confirm")}
                    </button>
                ) : (
                    <>
                        <a href="/login" className="button button--secondary">
                            {t("cartPage.login")}
                        </a>
                        <a href="/register" className="button button--secondary">
                            {t("cartPage.register")}
                        </a>
                    </>
                )}
            </div>
        </div>
    );
};
