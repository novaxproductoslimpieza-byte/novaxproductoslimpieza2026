'use client';
import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import Link from 'next/link';
import Button from './ui/Button';
import { catalogApi } from '../lib/api';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Imágenes de muestra que se rotan por índice (se actualizarán con imágenes reales de cada categoría)
const sampleImages = [
  '/images/catogo-novax-plus/1.png',
  '/images/catogo-novax-plus/3.png',
  '/images/catogo-novax-plus/5.png',
  '/images/catogo-novax-plus/1.png',
  '/images/catogo-novax-plus/3.png',
];

const sampleBtnTexts = ['Ver Productos', 'Explorar Línea', 'Comprar Ahora', 'Ver Catálogo', 'Ver Más'];

const HeroCarousel: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    catalogApi.getCategories()
      .then(setCategories)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Mostrar esqueleto mientras carga
  if (loading) {
    return (
      <div className="mb-5 rounded-4 overflow-hidden border border-primary border-opacity-10 shadow-lg" style={{ background: 'var(--bg-card)', height: '400px' }}>
        <div className="h-100 d-flex align-items-center justify-content-center">
          <div className="spinner-border text-primary" role="status" />
        </div>
      </div>
    );
  }

  return (
    <div className="mb-5 rounded-4 overflow-hidden border border-primary border-opacity-10 shadow-lg" style={{ background: 'var(--bg-card)' }}>
      <Swiper
        spaceBetween={0}
        centeredSlides={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
        style={{ height: '400px' }}
      >
        {categories.map((cat: any, idx: number) => {
          const image = sampleImages[idx % sampleImages.length];
          const btnText = sampleBtnTexts[idx % sampleBtnTexts.length];
          return (
            <SwiperSlide key={cat.id}>
              <div className="h-100 p-5 position-relative d-flex align-items-center" style={{
                background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-card2) 100%)'
              }}>
                {/* Abstract Background Element */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-10%',
                    right: '-10%',
                    width: '500px',
                    height: '500px',
                    background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)',
                    pointerEvents: 'none',
                    zIndex: 0
                  }}
                />

                <div className="container position-relative" style={{ zIndex: 1 }}>
                  <div className="row align-items-center">
                    <div className="col-lg-6">
                      <h1 className="display-4 fw-bold mb-3">{cat.nombre}</h1>
                      <p className="lead text-muted mb-4" style={{ maxWidth: '600px' }}>
                        {cat.descripcion || `Descubrí nuestra línea completa de ${cat.nombre}. Calidad y efectividad garantizada.`}
                      </p>
                      <div className="d-flex gap-3">
                        <Link href={`/?category_id=${cat.id}`}>
                          <Button size="lg" className="px-5">{btnText}</Button>
                        </Link>
                        <Button variant="outline" size="lg" className="px-4">Más Info</Button>
                      </div>
                    </div>
                    <div className="col-lg-6 d-none d-lg-flex justify-content-center">
                      <img
                        src={image}
                        alt={cat.nombre}
                        style={{
                          maxHeight: '320px',
                          filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.3))',
                          transform: 'perspective(1000px) rotateY(-10deg)'
                        }}
                        className="img-fluid floating-img"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>


      <style jsx global>{`
        @keyframes float {
          0% { transform: perspective(1000px) rotateY(-10deg) translateY(0px); }
          50% { transform: perspective(1000px) rotateY(-10deg) translateY(-15px); }
          100% { transform: perspective(1000px) rotateY(-10deg) translateY(0px); }
        }
        .floating-img {
          animation: float 6s ease-in-out infinite;
        }
        .swiper-button-next, .swiper-button-prev {
          color: var(--primary);
          background: rgba(15, 23, 42, 0.5);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          backdrop-filter: blur(4px);
        }
        .swiper-button-next:after, .swiper-button-prev:after {
          font-size: 1.2rem;
          font-weight: bold;
        }
        .swiper-pagination-bullet {
          background: var(--text-muted);
          opacity: 0.5;
        }
        .swiper-pagination-bullet-active {
          background: var(--primary);
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default HeroCarousel;
