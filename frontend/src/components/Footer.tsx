'use client';
import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="footer py-5 mt-auto text-light" style={{ background: 'var(--bg-navbar)' }}>
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <img src="/images/config_web/logonovax.png" alt="Logo" height="35" className="rounded-1" />
              <span className="footer-logo fs-4 text-primary">Novax</span>
            </div>
            <p className="text-white-50 small">
              Especialistas en soluciones de limpieza profesional para el hogar e industrias.
              Calidad y compromiso en cada producto.
            </p>
            <div className="d-flex gap-3 mt-4">
              <a href="#" className="text-white-50 transition-all"><i className="bi bi-facebook fs-5"></i></a>
              <a href="#" className="text-white-50 transition-all"><i className="bi bi-instagram fs-5"></i></a>
              <a href="#" className="text-white-50 transition-all"><i className="bi bi-whatsapp fs-5"></i></a>
            </div>
          </div>

          <div className="col-6 col-lg-2 offset-lg-1">
            <h6 className="fw-bold mb-3 text-white">Navegación</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2">
              <li><Link href="/" className="text-white-50 text-decoration-none hover-white">Inicio</Link></li>
              <li><Link href="/products" className="text-white-50 text-decoration-none hover-white">Productos</Link></li>
              <li><Link href="/ofertas" className="text-white-50 text-decoration-none hover-white">Ofertas</Link></li>
              <li><Link href="/nosotros" className="text-white-50 text-decoration-none hover-white">Nosotros</Link></li>
            </ul>
          </div>

          <div className="col-6 col-lg-2">
            <h6 className="fw-bold mb-3 text-white">Legal</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2">
              <li><Link href="/terminos" className="text-white-50 text-decoration-none hover-white">Términos</Link></li>
              <li><Link href="/privacidad" className="text-white-50 text-decoration-none hover-white">Privacidad</Link></li>
              <li><Link href="/devoluciones" className="text-white-50 text-decoration-none hover-white">Devoluciones</Link></li>
            </ul>
          </div>

          <div className="col-lg-3">
            <h6 className="fw-bold mb-3 text-white">Contacto</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2">
              <li className="text-white-50 d-flex gap-2">
                <span>📍</span> Cercado, Cochabamba, Bolivia
              </li>
              <li className="text-white-50 d-flex gap-2">
                <span>📞</span> +591 76919688
              </li>
              <li className="text-white-50 d-flex gap-2">
                <span>✉️</span> novaxproductoslimpieza@gmail.com
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-4 border-white border-opacity-10" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
          <p className="text-white-50 small mb-0">© 2026 Novax Productos de Limpieza. Todos los derechos reservados.</p>
          <div className="text-white-50 small">
            Desarrollado con Ing. Espinoza
          </div>
        </div>
      </div>
      <style jsx>{`
        .hover-white:hover { color: white !important; }
      `}</style>
    </footer>
  );
};

export default Footer;
