import React, { Suspense } from 'react';
import type { Metadata } from 'next';

import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import Header from '../components/header/Header';
import Footer from '../components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Novax — Productos de Limpieza',
  description: 'Catálogo online de productos de limpieza Novax. Compra fácil, rápido y seguro.',
};

import { ThemeProvider } from '../components/theme-provider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" async></script>
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <div className="app-wrapper">
                <Suspense fallback={<div className="h-16" />}>
                  <Header />
                </Suspense>

                <main className="main-content">
                  {children}
                </main>
                <Footer />
              </div>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
