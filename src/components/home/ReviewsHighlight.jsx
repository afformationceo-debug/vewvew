import { useMemo, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { Star, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { reviews } from '../../data/reviews';
import SectionHeader from '../common/SectionHeader';
import { cn } from '../../utils/cn';

import 'swiper/css';
import 'swiper/css/navigation';

const countryFlags = {
  US: '🇺🇸', JP: '🇯🇵', CN: '🇨🇳', GB: '🇬🇧', AU: '🇦🇺',
  CA: '🇨🇦', SG: '🇸🇬', TW: '🇹🇼', DE: '🇩🇪', FR: '🇫🇷',
  TH: '🇹🇭', AE: '🇦🇪',
};

function CompactReviewCard({ review }) {
  const flag = countryFlags[review.countryCode] || '';

  return (
    <div className="h-full bg-white rounded-xl border border-gray-100 p-4 flex flex-col hover:shadow-sm transition-shadow">
      {/* Stars */}
      <div className="flex items-center gap-0.5 mb-2">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              'w-3 h-3',
              i < Math.floor(review.rating)
                ? 'fill-amber-400 text-amber-400'
                : 'fill-gray-200 text-gray-200'
            )}
          />
        ))}
      </div>

      {/* Review text */}
      <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 flex-1 mb-3">
        {review.content}
      </p>

      {/* Footer */}
      <div className="flex items-center gap-2">
        <img
          src={review.avatar}
          alt={review.userName}
          className="w-7 h-7 rounded-full object-cover border border-gray-100"
          loading="lazy"
        />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium text-gray-800 truncate">
            {review.userName} {flag}
          </p>
          <p className="text-[10px] text-gray-400">{review.treatmentName}</p>
        </div>
      </div>
    </div>
  );
}

export default function ReviewsHighlight() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const topReviews = useMemo(() => {
    return [...reviews]
      .sort((a, b) => b.rating - a.rating || b.helpful - a.helpful)
      .slice(0, 6);
  }, []);

  return (
    <div>
      <SectionHeader
        title="Real Results"
        viewAllLink="/reviews"
      />

      {/* AI summary chip */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 rounded-full mb-4">
        <Sparkles className="w-3 h-3 text-violet-500" />
        <span className="text-[11px] font-medium text-violet-700">97% positive reviews</span>
        <span className="text-[11px] text-violet-400">·</span>
        <span className="text-[11px] font-medium text-violet-700">avg 4.8</span>
      </div>

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
          modules={[Navigation, Autoplay]}
          spaceBetween={10}
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
          autoplay={{ delay: 4000, disableOnInteraction: true, pauseOnMouseEnter: true }}
          breakpoints={{
            0: { slidesPerView: 1.3, spaceBetween: 8 },
            480: { slidesPerView: 1.8, spaceBetween: 10 },
            640: { slidesPerView: 2.5, spaceBetween: 10 },
            1024: { slidesPerView: 3.2, spaceBetween: 12 },
          }}
          className="!overflow-visible"
        >
          {topReviews.map((review) => (
            <SwiperSlide key={review.id} className="!h-auto">
              <CompactReviewCard review={review} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
