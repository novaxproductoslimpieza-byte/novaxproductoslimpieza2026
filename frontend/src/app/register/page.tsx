'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const [form, setForm] = useState({ nombre: '', ci: '', telefono: '', direccion: '', correo: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Error al registrarse.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: '520px' }}>
        <h1 className="auth-title">Crear cuenta</h1>
        <p className="auth-subtitle">Registrate para hacer pedidos</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="alert alert-error">{error}</div>}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Nombre completo</label>
              <input className="form-input" value={form.nombre} onChange={set('nombre')} placeholder="Juan Pérez" required />
            </div>
            <div className="form-group">
              <label className="form-label">CI</label>
              <input className="form-input" value={form.ci} onChange={set('ci')} placeholder="1234567" required />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Teléfono</label>
              <input className="form-input" value={form.telefono} onChange={set('telefono')} placeholder="77712345" />
            </div>
            <div className="form-group">
              <label className="form-label">Correo electrónico</label>
              <input className="form-input" type="email" value={form.correo} onChange={set('correo')} placeholder="tu@correo.com" required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Dirección</label>
            <input className="form-input" value={form.direccion} onChange={set('direccion')} placeholder="Av. Principal 123, La Paz" />
          </div>
          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input className="form-input" type="password" value={form.password} onChange={set('password')} placeholder="Mínimo 6 caracteres" required minLength={6} />
          </div>
          <button className="btn btn-primary btn-lg w-full" type="submit" disabled={loading}>{loading ? 'Registrando...' : 'Crear cuenta'}</button>
        </form>
        <div className="auth-footer">¿Ya tenés cuenta? <Link href="/login">Iniciar sesión</Link></div>
      </div>
    </div>
  );
}
