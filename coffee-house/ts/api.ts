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

// Registration
export interface RegisterPayload {
  login: string;
  password: string;
  confirmPassword: string;
  city: string;
  street: string;
  houseNumber: number;
  paymentMethod: "cash" | "card";
}

export async function registerUser(payload: RegisterPayload): Promise<any> {
  return await apiRequest<any>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

// Login
export interface LoginPayload {
  login: string;
  password: string;
}

export async function loginUser(payload: LoginPayload): Promise<any> {
  return await apiRequest<any>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
