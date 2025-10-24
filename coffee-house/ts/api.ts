// favorites.ts
import { apiRequest } from "./request";
import type { ProductType } from "./types";

export async function fetchFavoriteProducts(): Promise<{ data: ProductType[] }> {
  return await apiRequest<{ data: ProductType[] }>("/products/favorites", {
    method: "GET",
    auth: true
  });
}

export async function fetchProducts(): Promise<{ data: ProductType[] }> {
  return await apiRequest<{ data: ProductType[] }>("/products", {
    method: "GET",
    auth: true
  });
}

export async function fetchProductById(id:number): Promise<{ data: ProductType }> {
  return await apiRequest<{ data: ProductType }>("/products/"+id, {
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
