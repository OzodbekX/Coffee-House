// favorites.ts
import { apiRequest } from "./request";
import type { SliderProduct } from "./types";

export async function fetchFavoriteProducts(): Promise<SliderProduct[]> {
  return await apiRequest<SliderProduct[]>("/products/favorites", {
    method: "GET",
    auth: true
  });
}
