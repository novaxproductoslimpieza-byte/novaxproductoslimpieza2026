"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { catalogApi } from "../../lib/api";
import {
  LogIn,
  User,
  ShoppingBag,
  LogOut,
  ChevronDown,
  Search,
  Home,
} from "lucide-react";
import { AvatarDropdown } from "./AvatarDropdown";

export default function TopBar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Search state
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCat, setSelectedCat] = useState("Todas");
  const [selectedCatId, setSelectedCatId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );

  useEffect(() => {
    catalogApi.getCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      const catId = searchParams.get("category_id");
      if (catId) {
        const cat = categories.find((c) => c.id === Number(catId));
        if (cat) {
          setSelectedCat(cat.nombre);
          setSelectedCatId(cat.id);
        }
      } else {
        setSelectedCat("Todas");
        setSelectedCatId(null);
      }
    }
    setSearchTerm(searchParams.get("search") || "");
  }, [categories, searchParams]);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (selectedCatId) params.set("category_id", String(selectedCatId));
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="bg-navbar py-2 border-bottom border-secondary border-opacity-10 position-relative z-index-top">
      <div className="container d-flex justify-content-between align-items-center gap-3">
        {/* Logo */}
        <Link
          href="/"
          title="Inicio"
          className="d-flex align-items-center gap-2 text-decoration-none hover-scale shrink-0"
        >
          <img
            src="/images/config_web/logonovax.png"
            alt="Novax"
            height="50"
            className="h-12 w-auto object-contain"
          />
          <span className="fw-bold text-white fs-5 font-outfit d-none d-lg-inline">
            Novax
          </span>
        </Link>

        {/* Search Bar MOVED FROM MAIN HEADER */}
        <form
          onSubmit={handleSearch}
          className="d-flex align-items-center bg-white rounded-pill overflow-hidden shadow-sm grow mx-lg-4"
          style={{ maxWidth: "600px", height: "42px" }}
        >
          {/* Selector de Categoría con Hover CSS */}
          <div className="dropdown-hover h-100 position-relative border-end border-light d-none d-md-block">
            <button
              type="button"
              className="btn-category-selector h-100 px-3 d-flex align-items-center gap-2"
              style={{ minWidth: "130px" }}
            >
              <span className="text-truncate fw-bold small text-dark">
                {selectedCat}
              </span>
              <ChevronDown
                size={14}
                className="text-primary-dark chevron-icon"
              />
            </button>
            <div
              className="dropdown-menu-custom position-absolute top-100 inset-s-0 mt-0 p-2 bg-white rounded shadow-lg border border-light z-3"
              style={{ minWidth: "200px" }}
            >
              <button
                type="button"
                className="btn btn-link text-dark text-decoration-none w-100 text-start small py-2 px-3 hover-bg-light rounded fw-bold"
                onClick={() => {
                  setSelectedCat("Todas");
                  setSelectedCatId(null);
                  const params = new URLSearchParams();
                  if (searchTerm) params.set("search", searchTerm);
                  router.push(`/?${params.toString()}`);
                }}
              >
                Todas las categorías
              </button>
              {categories.map((cat: any) => (
                <button
                  title="Grupos"
                  key={cat.id}
                  type="button"
                  className="btn btn-link text-dark text-decoration-none w-100 text-start small py-2 px-3 hover-bg-light rounded fw-bold"
                  onClick={() => {
                    setSelectedCat(cat.nombre);
                    setSelectedCatId(cat.id);
                    const params = new URLSearchParams();
                    if (searchTerm) params.set("search", searchTerm);
                    params.set("category_id", String(cat.id));
                    router.push(`/?${params.toString()}`);
                  }}
                >
                  {cat.nombre}
                </button>
              ))}
            </div>
          </div>

          <input
            type="text"
            className="form-control bg-transparent border-0 text-dark shadow-none px-3 h-100 fw-bold small"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button
            type="submit"
            title="Buscar productos Novax"
            className="btn btn-primary-dark rounded-0 px-3 h-100 d-flex align-items-center justify-content-center border-0 text-white hover-bright"
          >
            <Search size={18} strokeWidth={2.5} />
          </button>
        </form>

        <div className="d-flex align-items-center gap-3 shrink-0">
          {/* Inicio */}
          <Link
            href="/"
            title="Inicio"
            className="text-white text-decoration-none d-flex align-items-center gap-1 small fw-bold font-inter hover-scale home-icon-btn"
          >
            <Home
              size={20}
              className="text-primary-dark bg-white rounded-circle p-1 shadow-sm"
            />
            <span className="d-none d-lg-inline">Inicio</span>
          </Link>


          {/* Cuenta / Avatar Dropdown */}
          <div className="flex items-center">
            <AvatarDropdown user={user} logout={logout} />
          </div>

          {/* Carrito */}
          <Link
            href="/cart"
            title="Carrito de compras"
            className="text-white text-decoration-none d-flex align-items-center gap-2 small position-relative fw-bold font-inter hover-scale"
          >
            <div className="position-relative">
              <img
                src="/images/config_web/carrito.jpg"
                alt="Cart"
                width="26"
                height="26"
                className="rounded-circle object-fit-cover shadow-sm border border-white"
              />
              {itemCount > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger shadow-sm border border-white"
                  style={{
                    fontSize: "0.65rem",
                    padding: "0.35em 0.5em",
                    zIndex: 5,
                  }}
                >
                  {itemCount}
                </span>
              )}
            </div>

            <span className="d-none d-lg-inline">Carrito</span>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .z-index-top {
          z-index: 1100;
        }
        .dropdown-menu-custom {
          display: none;
          min-width: 150px;
          animation: fadeIn 0.15s ease-out;
          pointer-events: auto;
        }
        .dropdown-hover:hover .dropdown-menu-custom {
          display: block;
        }
        .dropdown-hover:hover .chevron-icon {
          transform: rotate(180deg);
        }
        .chevron-icon {
          transition: transform 0.2s;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .hover-bg-light:hover {
          background-color: #f8fafc;
          color: var(--primary-dark) !important;
        }
        .hover-bg-danger-light:hover {
          background-color: #fef2f2;
        }

        .btn-category-selector {
          background: #fdfdfd;
          border: none;
          transition: all 0.2s;
          cursor: pointer;
        }
        .btn-category-selector:hover {
          background: #f8fafc;
        }
        .btn-primary-dark {
          background-color: var(--primary-dark);
          transition: all 0.3s;
        }
        .btn-primary-dark:hover {
          background-color: #1a44c2;
        }
        .hover-bright:hover {
          filter: brightness(1.1);
        }
      `}</style>
    </div>
  );
}
