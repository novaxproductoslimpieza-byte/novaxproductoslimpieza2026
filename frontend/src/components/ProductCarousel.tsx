'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import ProductCard from './ProductCard';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface ProductCarouselProps {
  products: any[];
  onAddToCart: (product: any) => void;
  userLoggedIn: boolean;
}

export default function ProductCarousel({ products, onAddToCart, userLoggedIn }: ProductCarouselProps) {
  return (
    <div className="product-carousel-container bg-card rounded-4 p-4 shadow-sm border border-light">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
        className="pb-5"
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <div className="h-100 py-2">
              <ProductCard 
                product={product} 
                onAddToCart={onAddToCart} 
                userLoggedIn={userLoggedIn} 
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .product-carousel-container {
          background-color: var(--bg-card) !important;
        }
        .product-carousel-container .swiper-button-next,
        .product-carousel-container .swiper-button-prev {
          color: var(--primary-dark);
          background: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .product-carousel-container .swiper-button-next:after,
        .product-carousel-container .swiper-button-prev:after {
          font-size: 1.2rem;
          font-weight: bold;
        }
        .product-carousel-container .swiper-pagination-bullet {
          background: var(--primary-dark);
          opacity: 0.3;
        }
        .product-carousel-container .swiper-pagination-bullet-active {
          opacity: 1;
          width: 24px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
