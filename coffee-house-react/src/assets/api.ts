// favorites.ts
import { apiRequest } from "./request";
import {ProductType, SelectedProductType, UserData} from "./types";

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

export async function fetchProductById(id: number): Promise<{ data: SelectedProductType }> {
  return await apiRequest<{ data: SelectedProductType }>("/products/" + id, {
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

export async function registerUser(payload: RegisterPayload): Promise<{ data: { access_token: string, user: UserData } }> {
  return await apiRequest<{ data: { access_token: string, user: UserData } }>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

// Login
export interface LoginPayload {
  login: string;
  password: string;
}

export async function loginUser(payload: LoginPayload): Promise<{ data: { access_token: string, user: UserData } }> {
  return await apiRequest<{ data: { access_token: string, user: UserData } }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

// Orders
export interface ConfirmOrderItem {
  productId: number;
  size: "s" | "m" | "l";
  additives: string[];
  quantity: number;
}

export interface ConfirmOrderPayload {
  items: ConfirmOrderItem[];
  totalPrice: number;
}

export async function confirmOrder(payload: ConfirmOrderPayload): Promise<{
  data: ConfirmOrderPayload,
  message: string,
  error: string
}> {
  return await apiRequest<{
    data: ConfirmOrderPayload,
    message: string,
    error: string
  }>("/orders/confirm", {
    method: "POST",
    auth: true,
    body: JSON.stringify(payload)
  });
}
