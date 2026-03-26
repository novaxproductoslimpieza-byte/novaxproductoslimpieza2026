const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';



function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('novax_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });

  if (!res.ok) {
    const text = await res.text(); // lee la respuesta completa
    console.error('API error:', res.status, text); // log en consola del navegador
    throw new Error(`Error ${res.status}: ${text}`);
  }



  return res.json() as Promise<T>;
}

export { request }; // ✅ exporta una sola vez

// ── Auth ──
export const authApi = {
  register: (data: {
    nombre: string;
    ci: string;
    telefono: string;
    direccion: string;
    correo: string;
    password: string;
    latitud?: number;
    longitud?: number;
    zona_id?: number;
  }) =>
    request<{ token: string; user: any }>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  login: (data: { ci_or_correo: string; password: string }) =>
    request<{ token: string; user: any }>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
};

// ── Geoubicación ──
export const geoApi = {
  getDepartamentos: () => request<any[]>('/geoubicacion/departamentos'),
  getProvincias: (departamentoId: number) => request<any[]>(`/geoubicacion/provincias/${departamentoId}`),
  getZonas: (provinciaId: number) => request<any[]>(`/geoubicacion/zonas/${provinciaId}`),
  getAdminMap: () => request<any[]>('/geoubicacion/admin'),
};

// ── Catálogo ──
export const catalogApi = {
  getCategories: () => request<any[]>('/categories'),
  getProducts: (params?: { category_id?: number; subcategory_id?: number; search?: string }) => {
    const q = new URLSearchParams();
    if (params?.category_id) q.set('category_id', String(params.category_id));
    if (params?.subcategory_id) q.set('subcategory_id', String(params.subcategory_id));
    if (params?.search) q.set('search', params.search);
    return request<any[]>(`/products${q.toString() ? '?' + q : ''}`);
  },
  getProductById: (id: number) => request<any>(`/products/${id}`),
};

// ── Pedidos ──
export const ordersApi = {
  createOrder: (productos: { producto_id: number; cantidad: number; precio: number }[]) =>
    request<{ message: string; pedido_id: number }>('/orders', { method: 'POST', body: JSON.stringify({ productos }) }),
  getOrders: () => request<any[]>('/orders'),
  getOrderById: (id: number) => request<any>(`/admin/orders/${id}`),
  updateStatus: (id: number, estado: string) =>
    request<any>(`/admin/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ estado }) }),
  deleteOrder: (id: number) => request<any>(`/orders/${id}`, { method: 'DELETE' }),
};

// ── Productos Admin ──
export const adminProductsApi = {
  create: (data: any) => request<any>('/admin/products', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => request<any>(`/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request<any>(`/admin/products/${id}`, { method: 'DELETE' }),
  updateStock: (id: number, cantidad: number, operacion: 'increment' | 'decrement' | 'set') =>
    request<any>(`/admin/products/${id}/stock`, { method: 'PATCH', body: JSON.stringify({ cantidad, operacion }) }),
};

// ── Categorías Admin ──
export const adminCategoriesApi = {
  createCategory: (data: { nombre: string; descripcion?: string }) =>
    request<any>('/admin/categories', { method: 'POST', body: JSON.stringify(data) }),
  updateCategory: (id: number, data: any) =>
    request<any>(`/admin/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCategory: (id: number) => request<any>(`/admin/categories/${id}`, { method: 'DELETE' }),
  createSubcategory: (data: { nombre: string; descripcion?: string; categoria_id: number }) =>
    request<any>('/admin/subcategories', { method: 'POST', body: JSON.stringify(data) }),
  deleteSubcategory: (id: number) => request<any>(`/admin/subcategories/${id}`, { method: 'DELETE' }),
};

// ── Usuario ──
export const userApi = {
  getProfile: () => request<any>('/users/profile'),
  updateProfile: (data: any) => request<any>('/users/profile', { method: 'PUT', body: JSON.stringify(data) }),
  getClients: () => request<any[]>('/admin/clients'),
  deleteClient: (id: number) => request<any>(`/admin/clients/${id}`, { method: 'DELETE' }),
};

// ── Categoria ──
export const categoriaApi = {
  getCategorias: () => request<any[]>('/admin/categoria'),
  createCategoria: (data: { nombre: string; descripcion?: string }) =>
    request<any>('/admin/categoria', { method: 'POST', body: JSON.stringify(data) }),
  updateCategoria: (id: number, data: { nombre: string; descripcion?: string }) =>
    request<any>(`/admin/categoria/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCategoria: (id: number) =>
    request<any>(`/admin/categoria/${id}`, { method: 'DELETE' }),
};
