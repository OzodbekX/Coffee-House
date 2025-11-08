import React, { useEffect, useState } from "react";
import { CartItem } from "@components/Cart/CartItem";
import { useTranslation } from "react-i18next";
import { ProductAdditiveInfo } from "@assets/types";
import "@styles/components/_shopping-cart.scss";
import "@styles/pages/orders.scss";

interface Order {
  id: number;
  items: any[];
  totalPrice: number;
  status: string;
  createdAt: string;
}

export const OrdersPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(stored);
  }, []);

  if (!orders.length) {
    return <p className="text-medium">{t("ordersPage.noOrders")}</p>;
  }

  return (
    <div className="shopping-cart-container">
      <h2 className="cart-title heading-2">{t("ordersPage.title")}</h2>

      {orders.map((order) => (
        <div key={order.id} className="order-block">
          <div className="order-items">
            {order.items.map((ci, idx) => {
              const sizeLabel = ci?.size?.key || "s";
              const additivesLabel =
                ci.additives
                  ?.map((a: ProductAdditiveInfo) => a.name)
                  .join(", ") || "";

              return (
                <CartItem
                  key={idx}
                  product={ci.product}
                  sizeLabel={sizeLabel}
                  additivesLabel={additivesLabel}
                  total={order.totalPrice}
                  discounted={ci.discounted}
                  onRemove={() => {}}
                />
              );
            })}
          </div>

          <div className="order-header">
            <p>
              <strong>{t("ordersPage.id")}:</strong> #{order.id}
            </p>
            <p>
              <strong>{t("ordersPage.status")}:</strong> {order.status}
            </p>
            <p>
              <strong>{t("ordersPage.date")}:</strong>{" "}
              {new Date(order.createdAt).toLocaleString(i18n.language)}
            </p>
            <p>
              <strong>{t("ordersPage.arrivalDate")}:</strong>{" "}
              {new Date(
                new Date(order.createdAt).getTime() + 20 * 60 * 1000,
              ).toLocaleString(i18n.language)}
            </p>
            <p>
              <strong>{t("ordersPage.total")}:</strong> $
              {order.totalPrice.toFixed(2)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
