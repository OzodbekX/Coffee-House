// favorites.ts
import { apiRequest } from "./request";
import type { SliderProduct } from "./types";

export async function fetchFavoriteProducts(): Promise<{ data: SliderProduct[] }> {
  return await apiRequest<{ data: SliderProduct[] }>("/products/favorites", {
    method: "GET",
    auth: true
  });
}

export async function fetchProducts(): Promise<{ data: SliderProduct[] }> {
  return await apiRequest<{ data: SliderProduct[] }>("/products", {
    method: "GET",
    auth: true
  });
}
