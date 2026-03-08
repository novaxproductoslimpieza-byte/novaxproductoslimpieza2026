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
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className="page-title">Productos</h1>
        <button className="btn btn-primary" onClick={() => { setShowForm(true); setEditing(null); setForm(EMPTY); }}>+ Nuevo producto</button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.2rem', fontWeight: 700 }}>{editing ? 'Editar producto' : 'Nuevo producto'}</h3>
          {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{error}</div>}
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group"><label className="form-label">Nombre *</label><input className="form-input" value={form.nombre} onChange={set('nombre')} required /></div>
            <div className="form-group"><label className="form-label">Subcategoría *</label>
              <select className="form-input form-select" value={form.subcategoria_id} onChange={set('subcategoria_id')} required>
                <option value="">Seleccionar...</option>
                {subcats.map(s => <option key={s.id} value={s.id}>{s.catNombre} — {s.nombre}</option>)}
              </select>
            </div>
            <div className="form-group"><label className="form-label">Precio Minorista (Bs.)*</label><input className="form-input" type="number" step="0.01" value={form.precio_minorista} onChange={set('precio_minorista')} required /></div>
            <div className="form-group"><label className="form-label">Precio Mayorista (Bs.)*</label><input className="form-input" type="number" step="0.01" value={form.precio_mayorista} onChange={set('precio_mayorista')} required /></div>
            <div className="form-group"><label className="form-label">Stock inicial</label><input className="form-input" type="number" value={form.stock} onChange={set('stock')} /></div>
            <div className="form-group"><label className="form-label">Presentación</label><input className="form-input" value={form.presentacion} onChange={set('presentacion')} placeholder="Ej: Botella 1L" /></div>
            <div className="form-group"><label className="form-label">Olor / Aroma</label><input className="form-input" value={form.olor} onChange={set('olor')} /></div>
            <div className="form-group"><label className="form-label">Color</label><input className="form-input" value={form.color} onChange={set('color')} /></div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}><label className="form-label">Imagen (URL)</label><input className="form-input" value={form.imagen} onChange={set('imagen')} /></div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}><label className="form-label">Descripción</label><textarea className="form-input" value={form.descripcion} onChange={set('descripcion')} rows={3} style={{ resize: 'vertical' }} /></div>
            <div style={{ gridColumn: '1/-1', display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Guardando...' : editing ? 'Actualizar' : 'Crear producto'}</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <div className="table-wrap">
        <table>
          <thead><tr><th>Producto</th><th>Subcategoría</th><th>P. Minorista</th><th>P. Mayorista</th><th>Stock</th><th>Acciones</th></tr></thead>
          <tbody>
            {loading ? Array(5).fill(0).map((_, i) => <tr key={i}><td colSpan={6}><div className="skeleton" style={{ height: '36px' }} /></td></tr>) :
              products.map(p => (
                <tr key={p.id}>
                  <td><div style={{ fontWeight: 600 }}>{p.nombre}</div><div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{p.presentacion}</div></td>
                  <td>{p.subcategoria?.nombre}</td>
                  <td style={{ color: 'var(--accent)', fontWeight: 700 }}>Bs. {Number(p.precio_minorista).toFixed(2)}</td>
                  <td>Bs. {Number(p.precio_mayorista).toFixed(2)}</td>
                  <td><span style={{ color: p.stock === 0 ? 'var(--danger)' : p.stock < 10 ? 'var(--warning)' : 'var(--accent)', fontWeight: 600 }}>{p.stock}</span></td>
                  <td style={{ display: 'flex', gap: '0.4rem' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(p)}>✏️ Editar</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>🗑</button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}
