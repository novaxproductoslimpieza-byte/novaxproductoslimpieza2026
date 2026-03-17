'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState({ ci_or_correo: '', password: '' });
  const [errors, setErrors] = useState<{ ci_or_correo?: string; password?: string }>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  // ── Validación en tiempo real ─────────────────────────────
  useEffect(() => {
    const errs: any = {};
    if (form.ci_or_correo && !/^[0-9]{6,10}$|^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.ci_or_correo)) {
      errs.ci_or_correo = 'Ingrese un CI válido o correo electrónico correcto';
    }
    if (form.password && form.password.length < 6) {
      errs.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    setErrors(errs);
  }, [form]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setServerError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(errors).length) return; // No enviar si hay errores de validación
    setLoading(true);
    try {
      await login(form.ci_or_correo, form.password);
      router.push('/');
    } catch (err: any) {
      const message = err?.response?.data?.msg || err?.message || 'Credenciales inválidas.';
      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center py-5">
      <div className="window-card w-100" style={{ maxWidth: 440 }}>
        <div className="card-body p-0">
          <h1 className="h3 fw-bold text-dark mb-1 window-title">Bienvenido</h1>
          <p className="text-muted small mb-4">Ingresa con tu CI o correo electrónico</p>

          {serverError && <Alert message={serverError} />}

          <form onSubmit={handleSubmit} noValidate>
            <InputField
              id="ci_or_correo"
              label="CI o Correo electrónico"
              name="ci_or_correo"
              placeholder="1234567 o tu@correo.com"
              value={form.ci_or_correo}
              onChange={handleChange}
              error={errors.ci_or_correo}
              required
            />

            <InputField
              id="password"
              label="Contraseña"
              name="password"
              type="password"
              placeholder="Tu contraseña"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              required
            />

            <Button text="Iniciar sesión" loading={loading} disabled={Object.keys(errors).length > 0} />
          </form>

          <div className="mt-4 text-center small text-muted">
            ¿No tenés cuenta?{' '}
            <Link href="/register" className="text-primary-dark text-decoration-none fw-bold">
              Registrarse
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Componentes reutilizables ─────────────────────────────

function InputField({ id, label, error, ...props }: any) {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label text-dark small fw-bold">{label}</label>
      <input
        id={id}
        className={`form-control bg-light border py-2 px-3 shadow-none ${error ? 'border-danger' : 'border-secondary border-opacity-10'}`}
        {...props}
      />
      {error && <div className="text-danger small mt-1">{error}</div>}
    </div>
  );
}

function Button({ text, loading, disabled }: { text: string; loading?: boolean; disabled?: boolean }) {
  return (
    <button
      className="btn btn-primary-dark w-100 py-2 fw-bold rounded-pill text-dark d-flex justify-content-center align-items-center"
      type="submit"
      disabled={loading || disabled}
    >
      {loading && <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>}
      {loading ? 'Ingresando...' : text}
    </button>
  );
}

function Alert({ message }: { message: string }) {
  return (
    <div className="alert alert-danger d-flex align-items-center border-0 small py-2 mb-4" role="alert">
      <span className="me-2">⚠️</span> {message}
    </div>
  );
}