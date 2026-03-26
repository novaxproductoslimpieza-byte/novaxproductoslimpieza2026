import { useState, useEffect } from 'react';

export function useCrud(api: any) {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const load = async () => {
        setLoading(true);
        const res = await api.getCategorias();
        setData(res);
        setLoading(false);
    };

    const create = async (item: any) => {
        setSaving(true);
        await api.createCategoria(item);
        await load();
        setSaving(false);
    };

    const update = async (id: number, item: any) => {
        setSaving(true);
        await api.updateCategoria(id, item);
        await load();
        setSaving(false);
    };

    const remove = async (id: number) => {
        if (!confirm('¿Eliminar categoría?')) return;
        await api.deleteCategoria(id);
        await load();
    };

    useEffect(() => { load(); }, []);

    return { data, loading, saving, create, update, remove };
}