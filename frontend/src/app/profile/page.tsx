'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userApi, geoApi } from '../../lib/api';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const MapPicker = dynamic(() => import('../../components/MapPicker'), { 
  ssr: false,
  loading: () => <div className="bg-secondary bg-opacity-10 rounded-4 d-flex align-items-center justify-content-center" style={{ height: '250px' }}>
    <div className="spinner-border text-primary" role="status"></div>
  </div>
});

export default function ProfilePage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ 
    nombre: '', telefono: '', direccion: '', correo: '', password: '',
    latitud: null as number | null,
    longitud: null as number | null,
    zona_id: null as number | null
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  const [currentZona, setCurrentZona] = useState('');

  useEffect(() => {
    if (!isLoading && !user) { router.push('/login'); return; }
    if (user) { 
      userApi.getProfile().then(p => {
        setForm(f => ({ 
          ...f, 
          nombre: p.nombre, 
          telefono: p.telefono || '', 
          direccion: p.direccion || '', 
          correo: p.correo,
          latitud: p.latitud,
          longitud: p.longitud,
          zona_id: p.zona_id
        }));
        if (p.zona) setCurrentZona(p.zona.nombre);
      }); 
    }
  }, [user, isLoading]);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleLocationSelect = async (lat: number, lng: number) => {
    setForm(f => ({ ...f, latitud: lat, longitud: lng }));
    
    // Reverse Geocoding con Nominatim
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
      const data = await res.json();
      if (data && data.display_name) {
        const addr = data.address;
        const shortAddress = [
          addr.road || addr.pedestrian,
          addr.house_number,
          addr.suburb || addr.neighbourhood,
          addr.city || addr.town
        ].filter(Boolean).join(', ');
        
        setForm(f => ({ ...f, direccion: shortAddress || data.display_name }));
      }
    } catch (err) {
      console.warn('No se pudo autocompletar la dirección:', err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    const data: any = { 
      nombre: form.nombre, 
      telefono: form.telefono, 
      direccion: form.direccion, 
      correo: form.correo,
      latitud: form.latitud,
      longitud: form.longitud,
      zona_id: form.zona_id
    };
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

  if (isLoading) return <div className="page container"><div className="skeleton" style={{ height: '400px', borderRadius: '12px' }} /></div>;

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-9 col-xl-8">
          <div className="window-card overflow-hidden p-0">
            <div className="card-header bg-light border-bottom border-light p-4">
              <div className="d-flex align-items-center gap-4">
                <div className="profile-avatar shadow-sm" style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-dark), var(--primary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem', fontWeight: 800, color: '#fff' }}>
                  {user?.nombre?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="h4 fw-bold text-dark mb-1">Mi Perfil</h1>
                  <p className="text-muted small mb-0">{user?.correo}</p>
                  <span className={`badge rounded-pill mt-2 bg-opacity-20 bg-${user?.rol === 'ADMINISTRADOR' ? 'primary' : 'success'} text-${user?.rol === 'ADMINISTRADOR' ? 'primary-dark' : 'success'}`}>
                    {user?.rol === 'ADMINISTRADOR' ? '⚡ Administrador' : '👤 Cliente'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="card-body p-4">
              <form onSubmit={handleSave} className="row g-4">
                {success && (
                  <div className="col-12">
                    <div className="alert alert-success border-0 small py-2 mb-0 rounded-3 shadow-sm" role="alert">
                      ✅ {success}
                    </div>
                  </div>
                )}
                {error && (
                  <div className="col-12">
                    <div className="alert alert-danger border-0 small py-2 mb-0 rounded-3 shadow-sm" role="alert">
                      ⚠️ {error}
                    </div>
                  </div>
                )}
                
                <div className="col-md-6">
                  <label className="form-label text-dark small fw-bold">Nombre completo</label>
                  <input 
                    className="form-control bg-light border-secondary border-opacity-10 text-dark py-2 px-3 rounded-pill shadow-none" 
                    value={form.nombre} 
                    onChange={set('nombre')} 
                  />
                </div>
                
                <div className="col-md-6">
                  <label className="form-label text-dark small fw-bold">Correo electrónico</label>
                  <input 
                    className="form-control bg-light border-secondary border-opacity-10 text-dark py-2 px-3 rounded-pill shadow-none" 
                    type="email" 
                    value={form.correo} 
                    onChange={set('correo')} 
                  />
                </div>
                
                <div className="col-md-6">
                  <label className="form-label text-dark small fw-bold">Teléfono</label>
                  <input 
                    className="form-control bg-light border-secondary border-opacity-10 text-dark py-2 px-3 rounded-pill shadow-none" 
                    value={form.telefono} 
                    onChange={set('telefono')} 
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label text-dark small fw-bold">Zona actual</label>
                  <input 
                    className="form-control bg-light border-secondary border-opacity-10 text-muted py-2 px-3 rounded-pill" 
                    value={currentZona || 'No asignada'} 
                    disabled
                  />
                </div>
                
                <div className="col-12">
                  <label className="form-label text-dark small fw-bold">Dirección de entrega</label>
                  <input 
                    className="form-control bg-light border-secondary border-opacity-10 text-dark py-2 px-3 rounded-pill shadow-none" 
                    value={form.direccion} 
                    onChange={set('direccion')} 
                  />
                </div>

                {/* Mapa de perfil */}
                <div className="col-12">
                  <div className="p-3 bg-light rounded-4 border border-light shadow-sm">
                    <p className="text-primary-dark small fw-bold mb-2">Ubicación registrada</p>
                    <div className="overflow-hidden rounded-3 mb-3 shadow-inner" style={{ height: '250px', border: '1px solid var(--border)' }}>
                      <MapPicker 
                        onLocationSelect={handleLocationSelect} 
                        initialCenter={form.latitud ? [form.latitud, form.longitud!] : undefined} 
                      />
                    </div>
                    {form.latitud && (
                      <p className="text-muted extra-small mb-0 text-center">
                        📍 Coordenadas: {form.latitud.toFixed(4)}, {form.longitud?.toFixed(4)}
                        <br/>
                        <span className="opacity-75">Haz clic en el mapa para actualizar tu ubicación.</span>
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="col-12">
                  <label className="form-label text-dark small fw-bold">Nueva contraseña <span className="small opacity-50 fw-normal">(dejar vacío para no cambiar)</span></label>
                  <input 
                    className="form-control bg-light border-secondary border-opacity-10 text-dark py-2 px-3 rounded-pill shadow-none" 
                    type="password" 
                    value={form.password} 
                    onChange={set('password')} 
                    placeholder="Nueva contraseña" 
                  />
                </div>
                
                <div className="col-12 d-flex flex-column flex-sm-row gap-3 mt-4 text-center">
                  <button className="btn btn-primary-dark px-4 py-2 fw-bold text-white rounded-pill shadow-sm transition-scale flex-grow-1" type="submit" disabled={loading}>
                    {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
                    {loading ? 'Guardando...' : 'Guardar cambios'}
                  </button>
                  <button type="button" className="btn btn-outline-danger px-4 py-2 fw-bold rounded-pill border-secondary border-opacity-25 flex-grow-1" onClick={logout}>
                    Cerrar sesión
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .extra-small { font-size: 0.7rem; }
        .shadow-inner { box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06); }
      `}</style>
    </div>
  );
}
