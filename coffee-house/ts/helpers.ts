export function renderPrice(
  price: string | number,
  discountPrice?: string | number,
  options?: { authed?: boolean }
): string {
  const isAuthed = options?.authed ?? Boolean(localStorage.getItem("user"));

  const priceNum = Number(price);
  const hasDiscount =
    discountPrice !== undefined && discountPrice !== null && Number(discountPrice) < priceNum;

  const priceText = `$${priceNum.toFixed(2)}`;
  if (hasDiscount && isAuthed) {
    const discText = `$${Number(discountPrice).toFixed(2)}`;
    return writePriceWithDiscount(priceText, discText)
  }

  return writePriceWithDiscount(priceText)
}


export function writePriceWithDiscount(priceText: string, discText?: string) {
  if (discText) return `
      <div class="price-block" style="display:flex; align-items:center; gap:8px;">
        <h3 class="price heading-3" style="margin:0;">${discText}</h3>
        <h3 class="old-price heading-3" style="margin:0; text-decoration:line-through; opacity:0.5;">${priceText}</h3>
      </div>
    `;
  else return `<h3 class="price heading-3">${priceText}</h3>`;

}

// ---- Price calculation helper ----
export interface CalcPriceArgs {
  product: { price: string | number; discountPrice?: string | number };
  size?: number | string; // add-price from selected size (e.g., 0, 0.5, 1)
  additives?: Array<number | { [key: string]: string }>; // accepts numbers or objects with "add-price"
}

export interface CalcPriceResult {
  total: number; // base price + size + additives
  discounted: number; // discount base + size + additives
}

export function calculatePrice({ product, size = 0, additives = [] }: CalcPriceArgs): CalcPriceResult {
  const base = Number(product.price) || 0;
  const discountBase =
    product.discountPrice !== undefined && product.discountPrice !== null
      ? Number(product.discountPrice)
      : base;

  const toNumber = (v: number | { [key: string]: string }): number =>
    typeof v === "number" ? v : Number((v)["add-price"]) || 0;

  const addSum: number = additives.reduce<number>((acc, item) => acc + toNumber(item), 0);
  const sizeNum = Number(size) || 0;
  const delta = sizeNum + addSum;
  const total = base + delta;
  const discounted = discountBase + delta;

  return { total, discounted };
}

// ---- Header cart count helper ----
export function setShoppingItemCount(): void {
  const raw = localStorage.getItem("selectedItems");
  let parsed: number[] = [];
  try {
    parsed = raw ? JSON.parse(raw) : [];

  } catch {
    parsed = [];
  }
  const count = parsed.length;
  const el = document.getElementById("shopping-item-count");

  const isAuthed = Boolean(localStorage.getItem("user"));

  if (!el) {
    return;
  }
  if (count > 0) {
    el.textContent = String(count);
    (el as HTMLElement).style.display = "";
  } else {
    if (!isAuthed) {
      el?.classList.add("hidden")
    } else {
      el?.classList.remove("hidden")
    }
    el.textContent = "";
    (el as HTMLElement).style.display = "none";
  }
}


export const producAdditives = [
  { name: "Sugar", "add-price": "0.50" },
  { name: "Cinnamon", "add-price": "0.50" },
  { name: "Syrup", "add-price": "0.50" },
];


export const productSizes = {
  s: { size: "200 ml", "add-price": "0.00" },
  m: { size: "300 ml", "add-price": "0.50" },
  l: { size: "400 ml", "add-price": "1.00" },
};


export const productSizesDesert = {
  s: { size: "50 g", "add-price": "0.00" },
  m: { size: "100 g", "add-price": "0.50" },
  l: { size: "200 g", "add-price": "1.00" },
};