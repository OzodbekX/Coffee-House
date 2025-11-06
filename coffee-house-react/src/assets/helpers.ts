import { ProductAdditiveInfo, ProductSizeInfo, UserData } from "./types";

export function renderPrice(
  price: string | number,
  discountPrice?: string | number,
  options?: { authed?: boolean },
): string {
  const isAuthed = options?.authed ?? Boolean(localStorage.getItem("user"));

  const priceNum = Number(price);
  const hasDiscount =
    discountPrice !== undefined &&
    discountPrice !== null &&
    Number(discountPrice) < priceNum;

  const priceText = `$${priceNum.toFixed(2)}`;
  if (hasDiscount && isAuthed) {
    const discText = Number(discountPrice || 0).toFixed(2);
    return writePriceWithDiscount(
      priceText,
      Number(discText) > 0 ? discText : undefined,
    );
  }

  return writePriceWithDiscount(priceText);
}

export function writePriceWithDiscount(priceText: string, discText?: string) {
  if (discText)
    return `
      <div class="price-block" style="display:flex; align-items:center; gap:8px;">
        <h3 class="price heading-3" style="margin:0;">${discText}</h3>
        <h3 class="old-price heading-3" style="margin:0; text-decoration:line-through; opacity:0.5;">${priceText}</h3>
      </div>
    `;
  else return `<h3 class="price heading-3">${priceText}</h3>`;
}

// ---- Price calculation helper ----
export interface CalcPriceArgs {
  size?: { key: string; info: ProductSizeInfo }; // add-price from selected size (e.g., 0, 0.5, 1)
  additives?: ProductAdditiveInfo[]; // accepts numbers or objects with "add-price"
}

export interface CalcPriceResult {
  total: number; // base price + size + additives
  discounted: number; // discount base + size + additives
}

export function calculatePrice({
  size,
  additives = [],
}: CalcPriceArgs): CalcPriceResult {
  const toNumber = (v: number | { [key: string]: string }): number =>
    typeof v === "number" ? v : Number(v["price"]) || 0;
  const addSum: number = additives.reduce<number>(
    (acc, item) => acc + toNumber(Number(item?.price)),
    0,
  );
  const addSumDisc: number = additives.reduce<number>(
    (acc, item) =>
      acc + toNumber(Number(item?.discountPrice || item?.price || 0)),
    0,
  );
  const sizeNum = Number(size?.info?.price || 0);
  const sizeNumDisc = Number(
    size?.info?.discountPrice || size?.info?.price || 0,
  );
  const total = sizeNum + addSum;
  const discounted = addSumDisc + sizeNumDisc;
  return { total, discounted };
}

export const getUserData = (): UserData | null => {
  const data = localStorage.getItem("user");
  return data ? JSON.parse(data) : null;
};
