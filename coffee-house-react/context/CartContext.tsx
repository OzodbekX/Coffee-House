import { createContext, ReactNode, useContext, useState } from "react";
import { CartItemType } from "../src/assets/types";

/* ------------------ 🧾 Types ------------------ */
interface CartContextType {
  cartItems: CartItemType[];
  addToCart: (item: CartItemType) => void;
  removeFromCart: (id: number) => void;
  deleteFromCart: (id: number) => void;
  clearCart: () => void;
  totalCount: number;
}

/* ------------------ 🧠 Create Context ------------------ */
const CartContext = createContext<CartContextType | undefined>(undefined);

/* ------------------ ⚙️ Provider ------------------ */
export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartItemType[]>(() => {
    try {
      const saved = localStorage.getItem("selectedItems");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const updateLocalStorage = (items: CartItemType[]) => {
    setCartItems(items);
    localStorage.setItem("selectedItems", JSON.stringify(items));
  };

  const addToCart = (item: CartItemType) => {
    const existing = [...cartItems];
    const duplicate = existing.find(
      (i) =>
        i.id === item.id &&
        i.size?.key === item.size?.key &&
        JSON.stringify(i.additives) === JSON.stringify(item.additives),
    );
    if (!duplicate) updateLocalStorage([...existing, item]);
  };

  const removeFromCart = (id: number) => {
    updateLocalStorage(cartItems.filter((i) => i.id !== id));
  };

  const deleteFromCart = (id: number) => {
    updateLocalStorage(cartItems.filter((i) => i.id !== id));
  };

  const clearCart = () => updateLocalStorage([]);

  const totalCount = cartItems.length;

  const value: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    deleteFromCart,
    clearCart,
    totalCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

/* ------------------ 🪄 Hook ------------------ */
export const useCart = (): CartContextType => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
};
