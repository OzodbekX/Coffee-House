import type { MenuProduct, UserData } from "./types.ts";
import { fetchProducts } from "./api";


function getUserData(): UserData | null {
  const data = localStorage.getItem("user");
  return data ? JSON.parse(data) : null;
}

function getSelectedIds(): number[] {
  const ids = localStorage.getItem("selectedItems");
  return ids ? JSON.parse(ids) : [];
}

function renderCartItems(products: MenuProduct[]) {
  const container = document.getElementById("cart-items")!;
  const totalEl = document.getElementById("total-price")!;
  const addressEl = document.getElementById("address")!;
  const payByEl = document.getElementById("pay-by")!;
  const actions = document.getElementById("cart-actions")!;

  const user = getUserData();
  const selectedIds = getSelectedIds();
  const filtered = products.filter(p => selectedIds.includes(p.id));

  let total = 0;
  container.innerHTML = "";

  filtered.forEach(p => {
    const item = document.createElement("div");
    item.className = "cart-item";

    let priceHTML = "";
    let priceToAdd = 0;
    console.log({ user });

    if (user) {
      priceHTML = `
        <div class="old-price">$${Number(p.price).toFixed(2)}</div>
        <div class="new-price">$${Number(p.discountPrice).toFixed(2)}</div>
      `;
      priceToAdd = Number(p.discountPrice);
    } else {
      priceHTML = `<div class="new-price">$${Number(p.price).toFixed(2)}</div>`;
      priceToAdd = Number(p.price);
    }

    total += priceToAdd;

    item.innerHTML = `
      <div class="item-left">
        <img class="item-img" src="./images/${p.id}.jpg" alt="${p.name}" />
        <div class="item-info">
          <span class="item-name">${p.name}</span>
          <span class="item-desc">${p.description}</span>
        </div>
      </div>
      <div class="item-right">
        ${priceHTML}
      </div>
    `;
    container.appendChild(item);
  });

  totalEl.textContent = `$${total.toFixed(2)}`;

  if (user) {
    addressEl.textContent = `${user.city}, ${user.street}, ${user.house}`;
    payByEl.textContent = user.payBy;
    actions.innerHTML = `<button id="confirm">Confirm</button>`;
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
  }finally{
    setTimeout(() => loader?.classList.add("hidden"), 300);
    setTimeout(() => productsContainer?.classList.remove("hidden"), 300);
  }

})();
