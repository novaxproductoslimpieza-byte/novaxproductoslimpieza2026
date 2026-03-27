import { create } from "zustand";
import { catalogApi } from "@/lib/api";

interface Category {
    id: number;
    nombre: string;
}

interface CategoryStore {
    categories: Category[];
    loading: boolean;

    fetchCategories: () => Promise<void>;
    addCategory: (cat: Category) => void;
    updateCategory: (cat: Category) => void;
    removeCategory: (id: number) => void;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
    categories: [],
    loading: false,

    fetchCategories: async () => {
        set({ loading: true });
        try {
            const data = await catalogApi.getCategories();
            set({ categories: data });
        } catch (error) {
            console.error("Error cargando categorías:", error);
        } finally {
            set({ loading: false });
        }
    },

    addCategory: (cat) =>
        set((state) => ({
            categories: [...state.categories, cat],
        })),

    updateCategory: (cat) =>
        set((state) => ({
            categories: state.categories.map((c) =>
                c.id === cat.id ? cat : c
            ),
        })),

    removeCategory: (id) =>
        set((state) => ({
            categories: state.categories.filter((c) => c.id !== id),
        })),
}));