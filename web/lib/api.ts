const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
const TOKEN_KEY = 'owasp-lab-token';

export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'paid' | 'shipped';
  createdAt: string;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

// The token lives in localStorage so it survives a page reload.
export const auth = {
  getToken(): string | null {
    return typeof window === 'undefined' ? null : window.localStorage.getItem(TOKEN_KEY);
  },
  setToken(token: string) {
    window.localStorage.setItem(TOKEN_KEY, token);
  },
  clear() {
    window.localStorage.removeItem(TOKEN_KEY);
  },
};

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = auth.getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message = Array.isArray(body?.message) ? body.message.join(', ') : body?.message;
    throw new ApiError(res.status, message ?? res.statusText);
  }
  return res.json() as Promise<T>;
}

export const api = {
  login: async (email: string, password: string) => {
    const data = await request<{ accessToken: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    auth.setToken(data.accessToken);
    return data.user;
  },
  logout: () => auth.clear(),
  listProducts: (params: { search?: string; category?: string } = {}) => {
    const qs = new URLSearchParams();
    if (params.search) qs.set('search', params.search);
    if (params.category) qs.set('category', params.category);
    const suffix = qs.toString() ? `?${qs}` : '';
    return request<Product[]>(`/products${suffix}`);
  },
  getProduct: (id: string) => request<Product>(`/products/${encodeURIComponent(id)}`),
  listOrders: () => request<Order[]>('/orders'),
  getOrder: (id: string) => request<Order>(`/orders/${encodeURIComponent(id)}`),
};
