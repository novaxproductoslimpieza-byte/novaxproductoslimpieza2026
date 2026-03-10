import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import Navbar from '../components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Novax — Productos de Limpieza',
  description: 'Catálogo online de productos de limpieza Novax. Compra fácil, rápido y seguro.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" async></script>
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <div className="app-wrapper">
              <Navbar />
              <main className="main-content">
                {children}
              </main>
              <footer className="footer">
                <div className="footer-inner">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <img src="/logonovax.png" alt="Logo" height="30" className="rounded-1" />
                    <span className="footer-logo">Novax</span>
                  </div>
                  <p>© 2026 Novax Productos de Limpieza. Todos los derechos reservados.</p>
                </div>
              </footer>
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
