'use client';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import Link from 'next/link';
import Button from './ui/Button';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const HeroCarousel: React.FC = () => {
  const slides = [
    {
      id: 1,
      title: 'Limpieza <span class="text-primary">Automotriz</span>',
      description: 'Línea especializada para el cuidado y brillo de tu vehículo. Máxima protección y acabado profesional.',
      image: '/images/CATALOGO NOVAX PLUS/1.png',
      btnText: 'Ver Productos',
      btnLink: '#productos'
    },
    {
      id: 2,
      title: 'Higiene <span class="text-accent">Personal</span>',
      description: 'Jabones y desinfectantes diseñados para tu bienestar. Suavidad y limpieza profunda garantizada.',
      image: '/images/CATALOGO NOVAX PLUS/3.png',
      btnText: 'Explorar Línea',
      btnLink: '#productos'
    },
    {
      id: 3,
      title: 'Limpieza del <span class="text-primary">Hogar</span>',
      description: 'Todo lo que necesitas para un hogar impecable. Eficiencia contra la grasa y suciedad más difícil.',
      image: '/images/CATALOGO NOVAX PLUS/5.png',
      btnText: 'Comprar Ahora',
      btnLink: '#productos'
    }
  ];

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
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
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
                    <h1 className="display-4 fw-bold mb-3" dangerouslySetInnerHTML={{ __html: slide.title }} />
                    <p className="lead text-muted mb-4" style={{ maxWidth: '600px' }}>
                      {slide.description}
                    </p>
                    <div className="d-flex gap-3">
                      <Link href={slide.btnLink}>
                        <Button size="lg" className="px-5">{slide.btnText}</Button>
                      </Link>
                      <Button variant="outline" size="lg" className="px-4">Más Info</Button>
                    </div>
                  </div>
                  <div className="col-lg-6 d-none d-lg-flex justify-content-center">
                    <img 
                      src={slide.image} 
                      alt={slide.title} 
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
        ))}
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
