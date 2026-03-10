'use client';
import { useEffect, useState } from 'react';
import { catalogApi, adminProductsApi } from '../../../lib/api';

const EMPTY = { nombre: '', descripcion: '', precio_minorista: '', precio_mayorista: '', presentacion: '', olor: '', color: '', imagen: '', stock: '', subcategoria_id: '' };

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [subcats, setSubcats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => Promise.all([catalogApi.getProducts(), catalogApi.getCategories()])
    .then(([prods, cats]) => { setProducts(prods); setSubcats(cats.flatMap((c: any) => c.subcategorias.map((s: any) => ({ ...s, catNombre: c.nombre })))) })
    .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const handleEdit = (p: any) => {
    setForm({ nombre: p.nombre, descripcion: p.descripcion || '', precio_minorista: p.precio_minorista, precio_mayorista: p.precio_mayorista, presentacion: p.presentacion || '', olor: p.olor || '', color: p.color || '', imagen: p.imagen || '', stock: p.stock, subcategoria_id: p.subcategoria_id });
    setEditing(p.id); setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError('');
    const data = { ...form, precio_minorista: Number(form.precio_minorista), precio_mayorista: Number(form.precio_mayorista), stock: Number(form.stock), subcategoria_id: Number(form.subcategoria_id) };
    try {
      if (editing) await adminProductsApi.update(editing, data); else await adminProductsApi.create(data);
      setShowForm(false); setEditing(null); setForm(EMPTY); await load();
    } catch (err: any) { setError(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este producto?')) return;
    await adminProductsApi.delete(id); await load();
  };

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="py-2">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <h1 className="h3 fw-bold text-light mb-0">Productos</h1>
        <button className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm" onClick={() => { setShowForm(true); setEditing(null); setForm(EMPTY); }}>
          <span className="me-2">+</span> Nuevo producto
        </button>
      </div>

      {showForm && (
        <div className="card bg-dark border-secondary border-opacity-25 shadow-lg mb-4" style={{ borderRadius: '1rem' }}>
          <div className="card-body p-4">
            <h5 className="card-title text-light fw-bold mb-4">{editing ? 'Editar producto' : 'Nuevo producto'}</h5>
            {error && <div className="alert alert-danger border-0 small py-2 mb-4">⚠️ {error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-light small fw-semibold">Nombre *</label>
                  <input className="form-control bg-secondary bg-opacity-10 border-secondary border-opacity-25 text-light" value={form.nombre} onChange={set('nombre')} required />
                </div>
                
                <div className="col-md-6">
                  <label className="form-label text-light small fw-semibold">Subcategoría *</label>
                  <select className="form-select bg-secondary bg-opacity-10 border-secondary border-opacity-25 text-light" value={form.subcategoria_id} onChange={set('subcategoria_id')} required>
                    <option value="" className="bg-dark">Seleccionar...</option>
                    {subcats.map(s => <option key={s.id} value={s.id} className="bg-dark">{s.catNombre} — {s.nombre}</option>)}
                  </select>
                </div>
                
                <div className="col-md-3 col-6">
                  <label className="form-label text-light small fw-semibold">Precio Minorista (Bs.)*</label>
                  <input className="form-control bg-secondary bg-opacity-10 border-secondary border-opacity-25 text-light" type="number" step="0.01" value={form.precio_minorista} onChange={set('precio_minorista')} required />
                </div>
                
                <div className="col-md-3 col-6">
                  <label className="form-label text-light small fw-semibold">Precio Mayorista (Bs.)*</label>
                  <input className="form-control bg-secondary bg-opacity-10 border-secondary border-opacity-25 text-light" type="number" step="0.01" value={form.precio_mayorista} onChange={set('precio_mayorista')} required />
                </div>
                
                <div className="col-md-3 col-6">
                  <label className="form-label text-light small fw-semibold">Stock inicial</label>
                  <input className="form-control bg-secondary bg-opacity-10 border-secondary border-opacity-25 text-light" type="number" value={form.stock} onChange={set('stock')} />
                </div>
                
                <div className="col-md-3 col-6">
                  <label className="form-label text-light small fw-semibold">Presentación</label>
                  <input className="form-control bg-secondary bg-opacity-10 border-secondary border-opacity-25 text-light" value={form.presentacion} onChange={set('presentacion')} placeholder="Ej: Botella 1L" />
                </div>
                
                <div className="col-md-4">
                  <label className="form-label text-light small fw-semibold">Olor / Aroma</label>
                  <input className="form-control bg-secondary bg-opacity-10 border-secondary border-opacity-25 text-light" value={form.olor} onChange={set('olor')} />
                </div>
                
                <div className="col-md-4">
                  <label className="form-label text-light small fw-semibold">Color</label>
                  <input className="form-control bg-secondary bg-opacity-10 border-secondary border-opacity-25 text-light" value={form.color} onChange={set('color')} />
                </div>
                
                <div className="col-md-4">
                  <label className="form-label text-light small fw-semibold">Imagen (URL)</label>
                  <input className="form-control bg-secondary bg-opacity-10 border-secondary border-opacity-25 text-light" value={form.imagen} onChange={set('imagen')} />
                </div>
                
                <div className="col-12">
                  <label className="form-label text-light small fw-semibold">Descripción</label>
                  <textarea className="form-control bg-secondary bg-opacity-10 border-secondary border-opacity-25 text-light" value={form.descripcion} onChange={set('descripcion')} rows={2} style={{ resize: 'vertical' }} />
                </div>
              </div>
              
              <div className="mt-4 d-flex gap-2">
                <button className="btn btn-primary px-4 fw-bold rounded-pill" type="submit" disabled={saving}>
                  {saving ? (
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  ) : null}
                  {saving ? 'Guardando...' : editing ? 'Actualizar' : 'Crear producto'}
                </button>
                <button type="button" className="btn btn-outline-secondary px-4 rounded-pill border-secondary border-opacity-25" onClick={() => setShowForm(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card bg-dark border-secondary border-opacity-25 overflow-hidden shadow-sm" style={{ borderRadius: '1rem' }}>
        <div className="table-responsive">
          <table className="table table-dark table-hover align-middle mb-0">
            <thead className="bg-secondary bg-opacity-10 text-muted small text-uppercase">
              <tr>
                <th className="px-4 py-3 border-0">Producto</th>
                <th className="py-3 border-0">Subcategoría</th>
                <th className="py-3 border-0">P. Minorista</th>
                <th className="py-3 border-0">P. Mayorista</th>
                <th className="py-3 border-0">Stock</th>
                <th className="pe-4 py-3 border-0 text-end">Acciones</th>
              </tr>
            </thead>
            <tbody className="border-0">
              {loading ? Array(5).fill(0).map((_, i) => (
                <tr key={i}>
                  <td colSpan={6} className="p-3"><div className="skeleton" style={{ height: '36px' }} /></td>
                </tr>
              )) :
                products.map(p => (
                  <tr key={p.id}>
                    <td className="px-4">
                      <div className="fw-bold text-light">{p.nombre}</div>
                      <div className="text-muted extra-small">{p.presentacion}</div>
                    </td>
                    <td className="text-muted small">{p.subcategoria?.nombre}</td>
                    <td className="text-accent fw-bold small">Bs. {Number(p.precio_minorista).toFixed(2)}</td>
                    <td className="text-muted small">Bs. {Number(p.precio_mayorista).toFixed(2)}</td>
                    <td>
                      <span className={`fw-bold small px-2 py-1 rounded-pill bg-opacity-10 bg-${p.stock === 0 ? 'danger text-danger' : p.stock < 10 ? 'warning text-warning' : 'success text-success'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="pe-4 text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <button className="btn btn-outline-primary btn-sm border-secondary border-opacity-25 rounded-circle p-2" onClick={() => handleEdit(p)} title="Editar">
                           ✏️
                        </button>
                        <button className="btn btn-outline-danger btn-sm border-secondary border-opacity-25 rounded-circle p-2" onClick={() => handleDelete(p.id)} title="Eliminar">
                           🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
      
      <style jsx>{`
        .extra-small { font-size: 0.7rem; }
      `}</style>
    </div>
  );
}
