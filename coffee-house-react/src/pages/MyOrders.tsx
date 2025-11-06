import React, {useEffect, useState} from "react";
import {CartItem} from "../components/Cart/CartItem";
import {renderPrice} from "../assets/helpers";
import {useTranslation} from "react-i18next";
import {ProductAdditiveInfo} from "../assets/types";
import "../styles/components/_shopping-cart.scss";
import "../styles/pages/orders.scss"
interface Order {
  id: number;
  items: any[];
  totalPrice: number;
  status: string;
  createdAt: string;
}

export const OrdersPage: React.FC = () => {
  const { t } = useTranslation();
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
              const additivesLabel = ci.additives?.map((a:ProductAdditiveInfo) => a.name).join(", ") || "";
              // const { total, discounted } = renderPrice(ci.total, ci.discounted);
              return (
                <CartItem
                  key={idx}
                  product={ci.product}
                  sizeLabel={sizeLabel}
                  additivesLabel={additivesLabel}
                  total={ci.total}
                  discounted={ci.discounted}
                  onRemove={() => {}}
                />
              );
            })}
          </div>
            <div className="order-header">
                <p>
                    <strong>Order ID:</strong> #{order.id}
                </p>
                <p>
                    <strong>Status:</strong> {order.status}
                </p>
                <p>
                    <strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}
                </p>
            </div>
            <div
            className="order-total"
            dangerouslySetInnerHTML={{ __html: renderPrice(order.totalPrice) }}
          />
        </div>
      ))}
    </div>
  );
};
