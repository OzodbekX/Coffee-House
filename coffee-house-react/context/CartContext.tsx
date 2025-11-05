import {createContext, ReactNode, useContext, useState,} from "react";
import {CartItemType} from "../src/assets/types";

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

export const CartProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    // Initialize from localStorage
    const [cartItems, setCartItems] = useState<CartItemType[]>(() => {
        try {
            const saved = localStorage.getItem("selectedItems");
            return saved ? (JSON.parse(saved) as CartItemType[]) : [];
        } catch {
            return [];
        }
    });

    /* ------------------ 🔁 Helper: Update both State + localStorage ------------------ */
    const updateLocalStorage = (items: CartItemType[]) => {
        setCartItems(items);
        localStorage.setItem("selectedItems", JSON.stringify(items));
    };

    /* ------------------ 🛒 Actions ------------------ */

    const addToCart = (entry: CartItemType) => {
        const existing = [...cartItems];

        // Check if identical item (same id, size, additives)
        const duplicate = existing.find(
            (i) =>
                i.id === entry.id &&
                i.size?.key === entry.size?.key &&
                JSON.stringify(i.additives) === JSON.stringify(entry.additives)
        );

        if (!duplicate) {
            const updated = [...existing, entry];
            updateLocalStorage(updated);
        }
    };

    const removeFromCart = (id: number) => {
        const updated = cartItems.filter((i) => i.id !== id);
        updateLocalStorage(updated);
    };

    const deleteFromCart = (id: number) => {
        const updated = cartItems.filter((i) => i.id !== id);
        updateLocalStorage(updated);
    };

    const clearCart = () => {
        updateLocalStorage([]);
    };

    const totalCount = cartItems.length;

    /* ------------------ 📦 Context Value ------------------ */
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
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
