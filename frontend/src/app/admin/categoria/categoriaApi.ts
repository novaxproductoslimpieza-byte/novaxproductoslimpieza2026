import { request } from '@/lib/api';


export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;   // ✅ ahora es obligatorio
  createdAt: string;
}

export const categoriaApi = {
  getCategorias: () => request<Categoria[]>('/admin/categoria'),

  createCategoria: (data: { nombre: string; descripcion: string }) =>
    request<Categoria>('/admin/categoria', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateCategoria: (id: number, data: { nombre: string; descripcion: string }) =>
    request<Categoria>(`/admin/categoria/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteCategoria: (id: number) =>
    request<void>(`/admin/categoria/${id}`, {
      method: 'DELETE',
    }),
};