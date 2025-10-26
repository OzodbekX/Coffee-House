import type {ProductType, UserData} from "./types";
import {confirmOrder, fetchProducts} from "./api";
import {calculatePrice, productSizes, productSizesDesert, renderPrice, setShoppingItemCount} from "./helpers";
import "./common-includes"
import "./cart-include"
import "../scss/_main.scss"

function getUserData(): UserData | null {
    const data = localStorage.getItem("user");
    return data ? JSON.parse(data) : null;
}

function showTopNotify(text: string, type: "error" | "success") {
    const existing = document.getElementById("cart-top-notify");
    if (existing) existing.remove();
    const el = document.createElement("div");
    el.id = "cart-top-notify";
    el.textContent = text;
    el.style.position = "fixed";
    el.style.top = "0";
    el.style.left = "50%";
    el.style.transform = "translateX(-50%)";
    el.style.zIndex = "2000";
    el.style.padding = "12px 20px";
    el.style.borderRadius = "0 0 12px 12px";
    el.style.boxShadow = "0 4px 10px rgba(0,0,0,0.15)";
    el.style.fontWeight = "600";
    el.style.backgroundColor = type === "error" ? "#b00020" : "#2e7d32";
    el.style.color = "white";
    el.style.opacity = "0";
    el.style.transition = "opacity 0.4s ease, top 0.4s ease";
    document.body.appendChild(el);
    setTimeout(() => {
        el.style.top = "0px";
        el.style.opacity = "1";
    }, 30);
    setTimeout(() => {
        el.style.opacity = "0";
        el.style.top = "-100px";
        setTimeout(() => el.remove(), 400);
    }, 4000);
}

type CartItem = { id: number; size?: number; additives?: Array<{ name: string; "add-price": string }> };

function getSelectedItems(): CartItem[] {
    const raw = localStorage.getItem("selectedItems");
    if (!raw) return [];
    try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed.filter((it: CartItem) => it && typeof it.id === "number");
    } catch (e: unknown) {
        console.log(e);
        localStorage.removeItem("selectedItems");
        return [];
    }
}


function renderCartItems(products: ProductType[]) {
    const container = document.getElementById("cart-items")!;
    const totalEl = document.getElementById("total-price")!;
    const addressEl = document.getElementById("address")!;
    const payByEl = document.getElementById("pay-by")!;
    const actions = document.getElementById("cart-actions")!;
    const user = getUserData();
    const cartItems = getSelectedItems();
    const rows = cartItems
        .map((ci, index) => {
            const product = products.find(p => p.id === ci.id);
            if (!product) return null;
            return {index, ci, product};
        })
        .filter(Boolean) as Array<{ index: number; ci: CartItem; product: ProductType }>;

    let total = 0;
    let totalDiscount = 0;
    if (container) container.innerHTML = "";

    rows.forEach(({index, ci, product: p}) => {
        const item = document.createElement("div");
        item.className = "cart-item";

        let priceHTML = "";
        const {total: itemTotal, discounted} = calculatePrice({
            product: {price: p.price, discountPrice: p.discountPrice},
            size: ci.size || 0,
            additives: ci.additives || []
        });
        priceHTML = renderPrice(itemTotal, discounted);
        total += Number(itemTotal);
        totalDiscount += Number(discounted);

        // Build size label from helpers using selected size add-price
        const sizeValue = Number(ci.size || 0);
        const sizesMap = p.category === "dessert" ? productSizesDesert : productSizes;
        const sizeEntry = Object.entries(sizesMap).find(([, s]) => Number(s["add-price"]) === sizeValue);
        const sizeLabel = sizeEntry ? sizeEntry[1].size : "";

        // Build additives label from selected additives
        const additivesLabel = (ci.additives && ci.additives.length > 0)
            ? ci.additives.map(a => a.name).join(", ")
            : "";

        item.innerHTML = `
      <div class="item-left">
        <div class="remove-item-icon" style="cursor:pointer" data-index="${index}">
         <img loading="lazy" width="24" height="24" src="assets/icons/trash.png"/>
        </div>
        <img loading="lazy" class="item-img" src="assets/images/${p.name}.png" alt="${p.name}" />
        <div class="item-info">
          <h3 class="heading-3">${p.name}</h3>
          <p class="text-medium">${sizeLabel}, ${additivesLabel ?? ""}</p>
        </div>
      </div>
      <div class="item-right">
        ${priceHTML}
      </div>
    `;
        container.appendChild(item);

        const removeBtn = item.querySelector<HTMLDivElement>(".remove-item-icon");
        removeBtn?.addEventListener("click", () => {
            const current = getSelectedItems();
            const idxAttr = removeBtn.getAttribute("data-index");
            const idx = idxAttr ? Number(idxAttr) : -1;
            if (idx >= 0 && idx < current.length) {
                current.splice(idx, 1);
                localStorage.setItem("selectedItems", JSON.stringify(current));
                setShoppingItemCount();
                renderCartItems(products);
            }
        });
    });

    if (totalEl) totalEl.innerHTML = renderPrice(total, totalDiscount);

    if (user) {
        if (addressEl) addressEl.textContent = `${user.city}, ${user.street}, ${user.houseNumber}`;
        if (payByEl) payByEl.textContent = user.paymentMethod;
        if (actions) actions.innerHTML = `<button id="confirm" class="button button--secondary">Confirm Order</button>`;
        const confirmBtn = document.getElementById("confirm") as HTMLButtonElement | null;
        if (confirmBtn) confirmBtn.disabled = getSelectedItems().length === 0;
        confirmBtn?.addEventListener("click", async () => {
            if (!confirmBtn) return;
            const itemsRawPre = getSelectedItems();
            if (!itemsRawPre.length) {
                showTopNotify("Your cart is empty.", "error");
                return;
            }
            const originalText = confirmBtn.textContent || "Confirm Order";
            confirmBtn.disabled = true;
            confirmBtn.textContent = "Placing...";

            try {
                const itemsRaw = itemsRawPre;
                const payloadItems = itemsRaw
                    .map((ci) => {
                        const product = products.find((p) => p.id === ci.id);
                        if (!product) return null;
                        const sizesMap = product.category === "dessert" ? productSizesDesert : productSizes;
                        const sizeEntry = Object.entries(sizesMap).find(([, s]) => Number(s["add-price"]) === Number(ci.size || 0));
                        const sizeKey = (sizeEntry ? sizeEntry[0] : "s") as "s" | "m" | "l";
                        const additives = (ci.additives || []).map((a) => a.name);
                        return {
                            productId: product.id,
                            size: sizeKey,
                            additives,
                            quantity: 1,
                        };
                    })
                    .filter(Boolean) as Array<{
                    productId: number;
                    size: "s" | "m" | "l";
                    additives: string[];
                    quantity: number
                }>;

                const {payloadTotal, confirmDisplayTotal} = rows.reduce(
                    (acc, {ci, product: p}) => {
                        const {total, discounted} = calculatePrice({
                            product: {price: p.price, discountPrice: p.discountPrice},
                            size: ci.size || 0,
                            additives: ci.additives || [],
                        });
                        acc.payloadTotal += Number(total);
                        acc.confirmDisplayTotal += Number(user ? discounted : total);
                        return acc;
                    },
                    {payloadTotal: 0, confirmDisplayTotal: 0}
                );

                const totalPrice = payloadTotal;

                const ok = window.confirm(
                    `Confirm your order of ${payloadItems.length} item(s) totaling $${confirmDisplayTotal.toFixed(2)}?`
                );
                if (!ok) {
                    return;
                }

                await confirmOrder({items: payloadItems, totalPrice});

                localStorage.setItem("selectedItems", JSON.stringify([]));
                setShoppingItemCount();
                showTopNotify("Thank you for your order! Our manager will contact you shortly.", "success");
                renderCartItems(products);
            } catch (e: unknown) {
                console.error(e);
                showTopNotify("Something went wrong. Please, try again", "error");
            } finally {
                if (confirmBtn) {
                    confirmBtn.disabled = false;
                    confirmBtn.textContent = originalText || "Confirm Order";
                }
            }
        });
    } else {
        addressEl.textContent = "-";
        payByEl.textContent = "-";
        actions.innerHTML = `
      <a href="login.html" id="login" class="button button--secondary">Login</a>
      <a href="registration.html" id="register" class="button button--secondary">Register</a>
    `;
        const addressAndPayment = document.getElementById("cart-summary");
        const children = addressAndPayment?.children;
        // Remove second child (index 1)
        if (children && children?.length > 1) {
            addressAndPayment?.removeChild(children?.[1]);
        }

        // Remove last child
        if (children && children?.length > 0) {
            addressAndPayment?.removeChild(children?.[children.length - 1]);
        }
    }

}

(async function initCart() {
    // Run only on pages that contain the shopping cart placeholder
    const shoppingCartPlaceholder = document.getElementById("shopping-cart-placeholder");
    if (!shoppingCartPlaceholder) return;
    const shoppingCartHtml = await fetch("partials/shopping-cart.html");
    if (!shoppingCartHtml.ok) throw new Error("Failed to load shopping-cart.html");
    const shoppingCartHtmlText = await shoppingCartHtml.text();
    if (shoppingCartPlaceholder) shoppingCartPlaceholder.innerHTML = shoppingCartHtmlText;


    const loaderHtml = await fetch("partials/loader.html");
    if (!loaderHtml.ok) throw new Error("Failed to load loader.html");
    const loaderHtmlText = await loaderHtml.text();
    const loaderPlaceholder = shoppingCartPlaceholder?.querySelector("#loader-placeholder");
    if (loaderPlaceholder) loaderPlaceholder.innerHTML = loaderHtmlText || "";

    const loader = document.getElementById("loader");
    const productsContainer = document.getElementById("cart-items");
    try {
        productsContainer?.classList.add("hidden");
        loader?.classList.remove("hidden");
        const products = await fetchProducts();
        renderCartItems(products?.data);
    } catch (err) {
        // renderCartItems([]);
        loader?.classList?.add("hidden");
        productsContainer?.classList.remove("hidden")
        if (productsContainer) {
            productsContainer.innerHTML = "Something went wrong. Please, refresh the page..."
        }
        console.error("Error loading products:", err);
    } finally {
        setTimeout(() => loader?.classList.add("hidden"), 300);
        setTimeout(() => productsContainer?.classList.remove("hidden"), 300);
    }

})();
