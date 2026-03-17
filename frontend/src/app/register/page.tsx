'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useAuth } from '../../context/AuthContext';
import { geoApi } from '../../lib/api';

// Cargar Mapa de forma dinámica para evitar errores de SSR con Leaflet
const MapPicker = dynamic(() => import('../../components/MapPicker'), {
  ssr: false,
  loading: () => <div className="bg-secondary bg-opacity-10 rounded-4 d-flex align-items-center justify-content-center" style={{ height: '300px' }}>
    <div className="spinner-border text-primary" role="status"></div>
  </div>
});

export default function RegisterPage() {
  const [form, setForm] = useState({
    nombre: '', ci: '', telefono: '', direccion: '', correo: '', password: '',
    latitud: null as number | null,
    longitud: null as number | null,
    zona_id: null as number | null
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Geolocation states
  const [departamentos, setDepartamentos] = useState<any[]>([]);
  const [provincias, setProvincias] = useState<any[]>([]);
  const [zonas, setZonas] = useState<any[]>([]);

  const [selDep, setSelDep] = useState('');
  const [selProv, setSelProv] = useState('');

  const { register } = useAuth();
  const router = useRouter();

  useEffect(() => {
    geoApi.getDepartamentos().then(setDepartamentos).catch(console.error);
  }, []);

  const handleDepChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelDep(id);
    setSelProv('');
    setZonas([]);
    setForm(f => ({ ...f, zona_id: null }));
    if (id) {
      geoApi.getProvincias(Number(id)).then(setProvincias).catch(console.error);
    } else {
      setProvincias([]);
    }
  };

  const handleProvChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelProv(id);
    setForm(f => ({ ...f, zona_id: null }));
    if (id) {
      geoApi.getZonas(Number(id)).then(setZonas).catch(console.error);
    } else {
      setZonas([]);
    }
  };

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  const handleLocationSelect = async (lat: number, lng: number) => {
    setForm(f => ({ ...f, latitud: lat, longitud: lng }));

    // Reverse Geocoding con Nominatim
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
      const data = await res.json();
      if (data && data.display_name) {
        // Intentar obtener una dirección más corta o específica
        const address = data.address;
        const shortAddress = [
          address.road || address.pedestrian,
          address.house_number,
          address.suburb || address.neighbourhood,
          address.city || address.town
        ].filter(Boolean).join(', ');

        setForm(f => ({ ...f, direccion: shortAddress || data.display_name }));
      }
    } catch (err) {
      console.warn('No se pudo autocompletar la dirección:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.latitud || !form.longitud) {
      setError('Por favor, selecciona tu ubicación en el mapa.');
      return;
    }
    if (!form.zona_id) {
      setError('Por favor, selecciona tu zona.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await register(form as any);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Error al registrarse.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container min-vh-100 py-5">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-lg-10 col-xl-8">
          <div className="window-card overflow-hidden p-0">
            <div className="row g-0">
              {/* Lado del Formulario */}
              <div className="col-md-6 p-4 p-lg-5">
                <h1 className="h3 fw-bold text-dark mb-1 window-title">Crear cuenta</h1>
                <p className="text-muted small mb-4">Registrate para realizar tus pedidos</p>

                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className="alert alert-danger d-flex align-items-center border-0 small py-2 mb-4" role="alert">
                      <span className="me-2">⚠️</span> {error}
                    </div>
                  )}

                  <div className="row g-3">
                    <div className="col-12">
                      <input
                        className="form-control bg-light border-secondary border-opacity-10 text-dark py-2 px-3 rounded-pill shadow-none"
                        value={form.nombre}
                        onChange={set('nombre')}
                        placeholder="Nombre completo"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        className="form-control bg-light border-secondary border-opacity-10 text-dark py-2 px-3 rounded-pill shadow-none"
                        value={form.ci}
                        onChange={set('ci')}
                        placeholder="CI"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        className="form-control bg-light border-secondary border-opacity-10 text-dark py-2 px-3 rounded-pill shadow-none"
                        value={form.telefono}
                        onChange={set('telefono')}
                        placeholder="Teléfono"
                      />
                    </div>

                    <div className="col-12">
                      <input
                        className="form-control bg-light border-secondary border-opacity-10 text-dark py-2 px-3 rounded-pill shadow-none"
                        type="email"
                        value={form.correo}
                        onChange={set('correo')}
                        placeholder="tu@correo.com"
                        required
                      />
                    </div>

                    <div className="col-12">
                      <input
                        className="form-control bg-light border-secondary border-opacity-10 text-dark py-2 px-3 rounded-pill shadow-none"
                        type="password"
                        value={form.password}
                        onChange={set('password')}
                        placeholder="Contraseña (mín. 6)"
                        required
                        minLength={6}
                      />
                    </div>

                    <hr className="my-2 border-secondary border-opacity-10" />
                    <p className="text-primary-dark small fw-bold mb-0">Ubicación</p>

                    <div className="col-12">
                      <select className="form-select bg-light border-secondary border-opacity-10 text-dark rounded-pill px-3 shadow-none" value={selDep} onChange={handleDepChange} required>
                        <option value="">Selecciona Departamento</option>
                        {departamentos.map(d => <option key={d.id} value={d.id}>{d.nombre}</option>)}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <select className="form-select bg-light border-secondary border-opacity-10 text-dark rounded-pill px-3 shadow-none" value={selProv} onChange={handleProvChange} required disabled={!selDep}>
                        <option value="">Selecciona Provincia</option>
                        {provincias.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <select className="form-select bg-light border-secondary border-opacity-10 text-dark rounded-pill px-3 shadow-none" value={form.zona_id || ''} onChange={set('zona_id')} required disabled={!selProv}>
                        <option value="">Selecciona Zona</option>
                        {zonas.map(z => <option key={z.id} value={z.id}>{z.nombre}</option>)}
                      </select>
                    </div>

                    <div className="col-12">
                      <input
                        className="form-control bg-light border-secondary border-opacity-10 text-dark py-2 px-3 rounded-pill shadow-none"
                        value={form.direccion}
                        onChange={set('direccion')}
                        placeholder="Dirección exacta"
                        required
                      />
                    </div>
                  </div>

                  <button className="btn btn-primary-dark w-100 py-2 fw-bold text-dark rounded-pill mt-4 shadow-sm transition-scale" type="submit" disabled={loading}>
                    {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
                    {loading ? 'Registrando...' : 'Finalizar Registro'}
                  </button>
                </form>

                <div className="mt-4 text-center small text-muted">
                  ¿Ya tenés cuenta? <Link href="/login" className="text-primary-dark text-decoration-none fw-bold">Iniciar sesión</Link>
                </div>
              </div>

              {/* Lado del Mapa */}
              <div className="col-md-6 d-none d-md-flex flex-column bg-light bg-opacity-50 p-4 border-start border-secondary border-opacity-10">
                <div className="mb-3">
                  <h5 className="text-dark fw-bold mb-1">Marca tu posición</h5>
                  <p className="extra-small text-muted mb-0">Haz clic en el mapa para fijar tu ubicación de entrega.</p>
                </div>
                <div className="flex-grow-1 overflow-hidden" style={{ borderRadius: '1.5rem', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)' }}>
                  <MapPicker onLocationSelect={handleLocationSelect} />
                </div>
                {form.latitud !== null && form.longitud !== null && (
                  <div className="mt-3 p-2 bg-primary bg-opacity-10 border border-primary border-opacity-25 rounded-3 text-center">
                    <span className="extra-small text-primary-dark fw-bold">📍 Ubicación fijada: {form.latitud.toFixed(4)}, {form.longitud.toFixed(4)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .extra-small { font-size: 0.7rem; }
        .form-select { background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%236c757d' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e"); }
      `}</style>
    </div>
  );
}
