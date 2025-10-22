// favorites.ts
import { apiRequest } from "./request";
import type { MenuProduct, SliderProduct } from "./types";

export async function fetchFavoriteProducts(): Promise<{ data: SliderProduct[] }> {
  return await apiRequest<{ data: SliderProduct[] }>("/products/favorites", {
    method: "GET",
    auth: true
  });
}

export async function fetchProducts(): Promise<{ data: MenuProduct[] }> {
  return await apiRequest<{ data: MenuProduct[] }>("/products", {
    method: "GET",
    auth: true
  });
}

export async function fetchProductById(id:number): Promise<{ data: MenuProduct }> {
  return await apiRequest<{ data: MenuProduct }>("/products/"+id, {
    method: "GET",
    auth: true
  });
}
