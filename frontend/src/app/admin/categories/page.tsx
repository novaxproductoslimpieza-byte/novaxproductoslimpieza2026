'use client';
import { useEffect, useState } from 'react';
import { catalogApi, adminCategoriesApi } from '../../../lib/api';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [catForm, setCatForm] = useState({ nombre: '', descripcion: '' });
  const [subForm, setSubForm] = useState({ nombre: '', descripcion: '', categoria_id: '' });
  const [saving, setSaving] = useState(false);

  const load = () => catalogApi.getCategories().then(setCategories).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleCat = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try { await adminCategoriesApi.createCategory(catForm); setCatForm({ nombre: '', descripcion: '' }); await load(); }
    finally { setSaving(false); }
  };
  const handleSub = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try { await adminCategoriesApi.createSubcategory({ ...subForm, categoria_id: Number(subForm.categoria_id) }); setSubForm({ nombre: '', descripcion: '', categoria_id: '' }); await load(); }
    finally { setSaving(false); }
  };
  const handleDelCat = async (id: number) => { if (!confirm('¿Eliminar categoría?')) return; await adminCategoriesApi.deleteCategory(id); await load(); };
  const handleDelSub = async (id: number) => { if (!confirm('¿Eliminar subcategoría?')) return; await adminCategoriesApi.deleteSubcategory(id); await load(); };

  return (
    <div>
      <div className="page-header"><h1 className="page-title">Categorías</h1></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Nueva categoría */}
        <div className="card">
          <h3 style={{ marginBottom: '1rem', fontWeight: 700 }}>Nueva categoría</h3>
          <form onSubmit={handleCat} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div className="form-group"><label className="form-label">Nombre *</label><input className="form-input" value={catForm.nombre} onChange={e => setCatForm(f => ({ ...f, nombre: e.target.value }))} required /></div>
            <div className="form-group"><label className="form-label">Descripción</label><input className="form-input" value={catForm.descripcion} onChange={e => setCatForm(f => ({ ...f, descripcion: e.target.value }))} /></div>
            <button className="btn btn-primary btn-sm" type="submit" disabled={saving}>+ Crear categoría</button>
          </form>
        </div>
        {/* Nueva subcategoría */}
        <div className="card">
          <h3 style={{ marginBottom: '1rem', fontWeight: 700 }}>Nueva subcategoría</h3>
          <form onSubmit={handleSub} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div className="form-group"><label className="form-label">Categoría padre *</label>
              <select className="form-input form-select" value={subForm.categoria_id} onChange={e => setSubForm(f => ({ ...f, categoria_id: e.target.value }))} required>
                <option value="">Seleccionar...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>
            <div className="form-group"><label className="form-label">Nombre *</label><input className="form-input" value={subForm.nombre} onChange={e => setSubForm(f => ({ ...f, nombre: e.target.value }))} required /></div>
            <div className="form-group"><label className="form-label">Descripción</label><input className="form-input" value={subForm.descripcion} onChange={e => setSubForm(f => ({ ...f, descripcion: e.target.value }))} /></div>
            <button className="btn btn-primary btn-sm" type="submit" disabled={saving}>+ Crear subcategoría</button>
          </form>
        </div>
      </div>

      {/* Árbol de categorías */}
      <div style={{ marginTop: '2rem' }}>
        {loading ? <div className="skeleton" style={{ height: '200px', borderRadius: '12px' }} /> :
          categories.map(cat => (
            <div key={cat.id} className="card" style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div><div style={{ fontWeight: 700 }}>{cat.nombre}</div><div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{cat.descripcion}</div></div>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelCat(cat.id)}>🗑</button>
              </div>
              {cat.subcategorias?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {cat.subcategorias.map((sub: any) => (
                    <div key={sub.id} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: '999px', padding: '0.2rem 0.7rem 0.2rem 0.9rem', fontSize: '0.82rem' }}>
                      {sub.nombre}
                      <button style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '0.8rem' }} onClick={() => handleDelSub(sub.id)}>✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        }
      </div>
    </div>
  );
}
