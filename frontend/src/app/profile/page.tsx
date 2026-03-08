'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userApi } from '../../lib/api';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ nombre: '', telefono: '', direccion: '', correo: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoading && !user) { router.push('/login'); return; }
    if (user) { userApi.getProfile().then(p => setForm(f => ({ ...f, nombre: p.nombre, telefono: p.telefono || '', direccion: p.direccion || '', correo: p.correo }))); }
  }, [user, isLoading]);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    const data: any = { nombre: form.nombre, telefono: form.telefono, direccion: form.direccion, correo: form.correo };
    if (form.password) data.password = form.password;
    try {
      await userApi.updateProfile(data);
      setSuccess('Perfil actualizado correctamente.');
    } catch (err: any) {
      setError(err.message || 'Error al actualizar.');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <div className="page container"><div className="skeleton" style={{ height: '300px', borderRadius: '12px' }} /></div>;

  return (
    <div className="page container" style={{ maxWidth: '560px', margin: '0 auto' }}>
      <div className="page-header">
        <h1 className="page-title">Mi perfil</h1>
        <p className="page-subtitle">{user?.correo}</p>
      </div>
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>
            {user?.nombre?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 700 }}>{user?.nombre}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user?.rol === 'ADMINISTRADOR' ? '⚡ Administrador' : '👤 Cliente'}</div>
          </div>
        </div>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {success && <div className="alert alert-success">{success}</div>}
          {error && <div className="alert alert-error">{error}</div>}
          <div className="form-group"><label className="form-label">Nombre completo</label><input className="form-input" value={form.nombre} onChange={set('nombre')} /></div>
          <div className="form-group"><label className="form-label">Correo electrónico</label><input className="form-input" type="email" value={form.correo} onChange={set('correo')} /></div>
          <div className="form-group"><label className="form-label">Teléfono</label><input className="form-input" value={form.telefono} onChange={set('telefono')} /></div>
          <div className="form-group"><label className="form-label">Dirección</label><input className="form-input" value={form.direccion} onChange={set('direccion')} /></div>
          <div className="form-group"><label className="form-label">Nueva contraseña <span className="form-help">(dejar vacío para no cambiar)</span></label><input className="form-input" type="password" value={form.password} onChange={set('password')} placeholder="Nueva contraseña" /></div>
          <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Guardar cambios'}</button>
          <button type="button" className="btn btn-secondary" onClick={logout}>Cerrar sesión</button>
        </form>
      </div>
    </div>
  );
}
