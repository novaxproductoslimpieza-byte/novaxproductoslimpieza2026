'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const [form, setForm] = useState({ ci_or_correo: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.ci_or_correo, form.password);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Credenciales inválidas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center py-5">
      <div className="window-card w-100" style={{ maxWidth: '440px' }}>
        <div className="card-body p-0">
          <h1 className="h3 fw-bold text-dark mb-1 window-title">Bienvenido</h1>
          <p className="text-muted small mb-4">Ingresa con tu CI o correo electrónico</p>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="alert alert-danger d-flex align-items-center border-0 small py-2 mb-4" role="alert">
                <span className="me-2">⚠️</span> {error}
              </div>
            )}

            <div className="mb-3">
              <label className="form-label text-dark small fw-bold">CI o Correo electrónico</label>
              <input
                className="form-control bg-light border-secondary border-opacity-10 text-dark py-2 px-3 shadow-none"
                value={form.ci_or_correo}
                onChange={e => setForm(f => ({ ...f, ci_or_correo: e.target.value }))}
                placeholder="1234567 o tu@correo.com"
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label text-dark small fw-bold">Contraseña</label>
              <input
                className="form-control bg-light border-secondary border-opacity-10 text-dark py-2 px-3 shadow-none"
                type="password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="Tu contraseña"
                required
              />
            </div>

            <button className="btn btn-primary-dark w-100 py-2 fw-bold rounded-pill text-dark" type="submit" disabled={loading}>
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              ) : null}
              {loading ? 'Ingresando...' : 'Iniciar sesión'}
            </button>
          </form>

          <div className="mt-4 text-center small text-muted">
            ¿No tenés cuenta? <Link href="/register" className="text-primary-dark text-decoration-none fw-bold">Registrarse</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
