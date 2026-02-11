import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { packages } from '../../data/packages';
import PackageCard from '../common/PackageCard';
import SectionHeader from '../common/SectionHeader';
import { cn } from '../../utils/cn';

import 'swiper/css';
import 'swiper/css/navigation';

export default function PopularPackages() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const topPackages = [...packages]
    .sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0))
    .slice(0, 5);

  return (
    <div>
      <SectionHeader
        title="Most Popular"
        viewAllLink="/packages?sort=popular"
      />

      <div className="relative group/nav">
        <button
          ref={prevRef}
          className={cn(
            'absolute -left-3 top-1/2 -translate-y-1/2 z-10',
            'w-8 h-8 rounded-full bg-white shadow-md border border-gray-100',
            'flex items-center justify-center',
            'text-gray-500 hover:text-primary-600',
            'opacity-0 group-hover/nav:opacity-100 transition-opacity',
          )}
          aria-label="Previous"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          ref={nextRef}
          className={cn(
            'absolute -right-3 top-1/2 -translate-y-1/2 z-10',
            'w-8 h-8 rounded-full bg-white shadow-md border border-gray-100',
            'flex items-center justify-center',
            'text-gray-500 hover:text-primary-600',
            'opacity-0 group-hover/nav:opacity-100 transition-opacity',
          )}
          aria-label="Next"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <Swiper
          modules={[Navigation]}
          spaceBetween={12}
          slidesPerView="auto"
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onBeforeInit={(swiper) => {
            if (swiper.params.navigation && typeof swiper.params.navigation !== 'boolean') {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }
          }}
          breakpoints={{
            0: { slidesPerView: 1.6, spaceBetween: 10 },
            480: { slidesPerView: 2, spaceBetween: 12 },
            640: { slidesPerView: 2.5, spaceBetween: 12 },
            768: { slidesPerView: 3, spaceBetween: 12 },
            1024: { slidesPerView: 3.2, spaceBetween: 14 },
          }}
          className="!overflow-visible"
        >
          {topPackages.map((pkg, index) => (
            <SwiperSlide key={pkg.id} className="!h-auto">
              <PackageCard pkg={pkg} rank={index + 1} className="h-full" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
