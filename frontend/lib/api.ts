// lib/api.ts
// Cliente centralizado para comunicarse con el backend Express
// En Docker, el browser llama a NEXT_PUBLIC_API_URL (expuesto al exterior)
// En SSR/Server Components, usa INTERNAL_API_URL (red interna Docker)

const API_URL =
  typeof window === "undefined"
    ? process.env.INTERNAL_API_URL || "http://10.0.2.143:8080/api"
    : process.env.NEXT_PUBLIC_API_URL || "http://52.23.118.7/api";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  slug: string;
  product_count?: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  stock: number;
  material: string;
  image_url: string;
  avg_rating?: string;
  review_count?: string;
  category: Category;
}

export interface ProductsResponse {
  products: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ProductFilters {
  category?: string;
  material?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  user: { id: string; name: string };
}

export interface ReviewsResponse {
  reviews: Review[];
  stats: {
    avg_rating: string;
    total_reviews: number;
    distribution: Record<number, number>;
  };
  pagination: { total: number; page: number; limit: number; totalPages: number };
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "customer" | "admin";
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
  message: string;
}

// ─── Helper ───────────────────────────────────────────────────────────────────

async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Error desconocido" }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }

  return res.json();
}

// ─── Products API ─────────────────────────────────────────────────────────────

export async function getProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, val]) => {
    if (val !== undefined && val !== "") params.append(key, String(val));
  });
  const query = params.toString() ? `?${params}` : "";
  return apiFetch<ProductsResponse>(`/products${query}`);
}

export async function getProductById(id: string): Promise<{ product: Product }> {
  return apiFetch<{ product: Product }>(`/products/${id}`);
}

export async function getCategories(): Promise<{ categories: Category[] }> {
  return apiFetch<{ categories: Category[] }>("/categories");
}

export async function getProductReviews(productId: string): Promise<ReviewsResponse> {
  return apiFetch<ReviewsResponse>(`/reviews/products/${productId}/reviews`);
}

// ─── Auth API ─────────────────────────────────────────────────────────────────

export async function login(email: string, password: string): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function register(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export async function getMe(token: string): Promise<{ user: AuthUser }> {
  return apiFetch<{ user: AuthUser }>("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
}
