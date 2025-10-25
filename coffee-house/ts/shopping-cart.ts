import type { ProductType, UserData } from "./types.ts";
import { fetchProducts } from "./api";
import { renderPrice, setShoppingItemCount, calculatePrice, productSizes, productSizesDesert } from "./helpers.ts";


function getUserData(): UserData | null {
  const data = localStorage.getItem("user");
  return data ? JSON.parse(data) : null;
}

type CartItem = { id: number; size?: number; additives?: Array<{ name: string; "add-price": string }> };

function getSelectedItems(): CartItem[] {
  const raw = localStorage.getItem("selectedItems");
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((it: any) => it && typeof it.id === "number");
  } catch {
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
      return { index, ci, product };
    })
    .filter(Boolean) as Array<{ index: number; ci: CartItem; product: ProductType }>;

  let total = 0;
  let totalDiscount = 0;
  container.innerHTML = "";

  rows.forEach(({ index, ci, product: p }) => {
    const item = document.createElement("div");
    item.className = "cart-item";

    let priceHTML = "";
    const { total: itemTotal, discounted } = calculatePrice({
      product: { price: p.price, discountPrice: p.discountPrice },
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
         <img width="24" height="24" src="./assets/icons/trash.png"/>
        </div>
        <img class="item-img" src="assets/images/${p.name}.png" alt="${p.name}" />
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

  totalEl.innerHTML = renderPrice(total, totalDiscount);

  if (user) {
    addressEl.textContent = `${user.city}, ${user.street}, ${user.houseNumber}`;
    payByEl.textContent = user.paymentMethod;
    actions.innerHTML = `<button id="confirm" class="button button--secondary">Confirm</button>`;
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
  const loader = document.getElementById("loader");
  const productsContainer = document.getElementById("cart-items");
  try {
    productsContainer?.classList.add("hidden");
    loader?.classList.remove("hidden");
    const products = await fetchProducts();
    renderCartItems(products?.data);
  } catch (err) {
    renderCartItems([]);
    loader?.classList.add("hidden");
    productsContainer?.classList.add("error");

    console.error("Error loading products:", err);
  } finally {
    setTimeout(() => loader?.classList.add("hidden"), 300);
    setTimeout(() => productsContainer?.classList.remove("hidden"), 300);
  }

})();
