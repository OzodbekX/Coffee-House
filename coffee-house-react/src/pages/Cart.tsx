import React, {useEffect, useState} from "react";
import {CartItemType, ProductType, UserData} from "../assets/types";
import {confirmOrder, fetchProducts} from "../assets/api";
import {
    calculatePrice,
    getSelectedItems,
    productSizes,
    productSizesDesert,
    renderPrice,
    setShoppingItemCount
} from "../assets/helpers";
import Loader from "../components/Loader";
import {CartItem} from "../components/Cart/CartItem";
import {Notification} from "../components/Cart/Notification";
import {CartSummary} from "../components/Cart/CartSummary";
import "../styles/components/_shopping-cart.scss";


const getUserData = (): UserData | null => {
    const data = localStorage.getItem("user");
    return data ? JSON.parse(data) : null;
};


export const CartPage: React.FC = () => {
    const [products, setProducts] = useState<ProductType[]>([]);
    const [cartItems, setCartItems] = useState<CartItemType[]>(getSelectedItems());
    const [loading, setLoading] = useState(true);
    const [notify, setNotify] = useState<{ text: string; type: "success" | "error" } | null>(null);
    const [user] = useState<UserData | null>(getUserData());

    useEffect(() => {
        (async () => {
            try {
                const res = await fetchProducts();
                setProducts(res.data);
            } catch (err) {
                console.error(err);
                setNotify({text: "Failed to load products.", type: "error"});
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleRemove = (index: number) => {
        const updated = [...cartItems];
        updated.splice(index, 1);
        localStorage.setItem("selectedItems", JSON.stringify(updated));
        setCartItems(updated);
        setShoppingItemCount();
    };

    const handleConfirm = async () => {
        if (!cartItems.length) {
            setNotify({text: "Your cart is empty.", type: "error"});
            return;
        }

        const rows = cartItems
            .map((ci) => {
                const product = products.find((p) => p.id === ci.id);
                if (!product) return null;
                return {ci, product};
            })
            .filter(Boolean) as { ci: CartItemType; product: ProductType }[];

        const payloadItems = rows.map(({ci, product}) => {
            const sizesMap = product.category === "dessert" ? productSizesDesert : productSizes;
            const sizeEntry = Object.entries(sizesMap).find(([, s]) => Number(s["add-price"]) === (ci.size || 0));
            const sizeKey = (sizeEntry ? sizeEntry[0] : "s") as "s" | "m" | "l";
            const additives = (ci.additives || []).map((a) => a.name);
            return {productId: product.id, size: sizeKey, additives, quantity: 1};
        });

        const totalPrice = rows.reduce((acc, {ci}) => {
            const {total} = calculatePrice({
                size: ci.size,
                additives: ci.additives || [],
            });
            return acc + Number(total);
        }, 0);

        const ok = window.confirm(`Confirm your order of ${rows.length} item(s)?`);
        if (!ok) return;

        try {
            await confirmOrder({items: payloadItems, totalPrice});
            localStorage.setItem("selectedItems", JSON.stringify([]));
            setCartItems([]);
            setShoppingItemCount();
            setNotify({text: "Thank you! Your order is placed.", type: "success"});
        } catch {
            setNotify({text: "Something went wrong. Please try again.", type: "error"});
        }
    };

    if (loading) return <Loader/>;

    const renderedItems = cartItems
        .map((ci, index) => {
            const product = products.find((p) => p.id === ci.id);
            if (!product) return null;
            const {total, discounted} = calculatePrice({
                size: ci.size,
                additives: ci.additives || [],
            });

            const sizesMap = product.category === "dessert" ? productSizesDesert : productSizes;
            const sizeEntry = Object.entries(sizesMap).find(([, s]) => Number(s["add-price"]) === (ci.size || 0));
            const sizeLabel = sizeEntry ? sizeEntry[1].size : "";
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
            {notify && <Notification text={notify.text} type={notify.type} onClose={() => setNotify(null)}/>}

            <h2 className="cart-title heading-2">Cart</h2>

            <div id="cart-items">{renderedItems}</div>

            <CartSummary user={user} totalHtml={totalHtml}/>

            <div className="cart-actions">
                {user ? <button onClick={handleConfirm} disabled={cartItems?.length == 0}
                                className={"button button--secondary"}>Confirm</button> : (
                    <>
                        <a href="/login" className="button button--secondary">Login</a>
                        <a href="/register" className="button button--secondary">Register</a>
                    </>
                )}
            </div>
        </div>
    );
};
