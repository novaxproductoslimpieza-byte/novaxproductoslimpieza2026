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
    <div className="py-2">
      <div className="row mb-4">
        <div className="col">
          <h1 className="h3 fw-bold text-light mb-0">Categorías</h1>
        </div>
      </div>
      
      <div className="row g-4 mb-5">
        {/* Nueva categoría */}
        <div className="col-md-6">
          <div className="card bg-dark border-secondary border-opacity-25 h-100 shadow-sm" style={{ borderRadius: '1rem' }}>
            <div className="card-body p-4">
              <h5 className="card-title text-light fw-bold mb-4">Nueva categoría</h5>
              <form onSubmit={handleCat} className="d-flex flex-column gap-3">
                <div>
                  <label className="form-label text-light small fw-semibold">Nombre *</label>
                  <input className="form-control bg-secondary bg-opacity-10 border-secondary border-opacity-25 text-light" value={catForm.nombre} onChange={e => setCatForm(f => ({ ...f, nombre: e.target.value }))} required />
                </div>
                <div>
                  <label className="form-label text-light small fw-semibold">Descripción</label>
                  <input className="form-control bg-secondary bg-opacity-10 border-secondary border-opacity-25 text-light" value={catForm.descripcion} onChange={e => setCatForm(f => ({ ...f, descripcion: e.target.value }))} />
                </div>
                <button className="btn btn-primary rounded-pill px-4 fw-bold mt-2" type="submit" disabled={saving}>
                  {saving ? '...' : '+ Crear categoría'}
                </button>
              </form>
            </div>
          </div>
        </div>
        
        {/* Nueva subcategoría */}
        <div className="col-md-6">
          <div className="card bg-dark border-secondary border-opacity-25 h-100 shadow-sm" style={{ borderRadius: '1rem' }}>
            <div className="card-body p-4">
              <h5 className="card-title text-light fw-bold mb-4">Nueva subcategoría</h5>
              <form onSubmit={handleSub} className="d-flex flex-column gap-3">
                <div>
                  <label className="form-label text-light small fw-semibold">Categoría padre *</label>
                  <select className="form-select bg-secondary bg-opacity-10 border-secondary border-opacity-25 text-light" value={subForm.categoria_id} onChange={e => setSubForm(f => ({ ...f, categoria_id: e.target.value }))} required>
                    <option value="" className="bg-dark">Seleccionar...</option>
                    {categories.map(c => <option key={c.id} value={c.id} className="bg-dark">{c.nombre}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label text-light small fw-semibold">Nombre *</label>
                  <input className="form-control bg-secondary bg-opacity-10 border-secondary border-opacity-25 text-light" value={subForm.nombre} onChange={e => setSubForm(f => ({ ...f, nombre: e.target.value }))} required />
                </div>
                <div>
                  <label className="form-label text-light small fw-semibold">Descripción</label>
                  <input className="form-control bg-secondary bg-opacity-10 border-secondary border-opacity-25 text-light" value={subForm.descripcion} onChange={e => setSubForm(f => ({ ...f, descripcion: e.target.value }))} />
                </div>
                <button className="btn btn-primary rounded-pill px-4 fw-bold mt-2" type="submit" disabled={saving}>
                  {saving ? '...' : '+ Crear subcategoría'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Árbol de categorías */}
      <h2 className="h4 fw-bold text-light mb-4">Árbol de categorías</h2>
      <div className="row g-3">
        {loading ? (
          <div className="col-12"><div className="skeleton" style={{ height: '200px', borderRadius: '1rem' }} /></div>
        ) : categories.length === 0 ? (
          <div className="col-12 text-center py-5 text-muted opacity-50">No hay categorías configuradas.</div>
        ) :
          categories.map(cat => (
            <div key={cat.id} className="col-12">
              <div className="card bg-dark border-secondary border-opacity-25 shadow-sm overflow-hidden" style={{ borderRadius: '1rem' }}>
                <div className="card-header bg-secondary bg-opacity-10 border-0 p-3 d-flex justify-content-between align-items-center">
                  <div>
                    <div className="fw-bold text-light mb-0">{cat.nombre}</div>
                    <div className="text-muted extra-small">{cat.descripcion}</div>
                  </div>
                  <button className="btn btn-outline-danger btn-sm rounded-circle p-2 border-0" onClick={() => handleDelCat(cat.id)} title="Eliminar categoría">
                    🗑
                  </button>
                </div>
                <div className="card-body p-3">
                  {cat.subcategorias?.length > 0 ? (
                    <div className="d-flex flex-wrap gap-2">
                      {cat.subcategorias.map((sub: any) => (
                        <div key={sub.id} className="d-flex align-items-center gap-2 bg-secondary bg-opacity-25 border border-secondary border-opacity-25 rounded-pill py-1 ps-3 pe-2 small transition-all hover-bg-light">
                          <span className="text-light small">{sub.nombre}</span>
                          <button className="btn btn-sm btn-link text-danger p-0 border-0 fs-6 text-decoration-none" onClick={() => handleDelSub(sub.id)}>✕</button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted small mb-0 opacity-50 px-2 italic">Sin subcategorías</p>
                  )}
                </div>
              </div>
            </div>
          ))
        }
      </div>
      
      <style jsx>{`
        .extra-small { font-size: 0.75rem; }
        .hover-bg-light:hover { background-color: rgba(255,255,255,0.1) !important; }
      `}</style>
    </div>
  );
}
