import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const slides = [
  {
    image: 'https://picsum.photos/seed/hero-medical/1200/400',
    title: 'Your Glow-Up Starts in Korea',
    subtitle: 'World-class treatments + unforgettable experiences',
  },
  {
    image: 'https://picsum.photos/seed/hero-beauty/1200/400',
    title: 'Spring Beauty Festival',
    subtitle: 'Up to 50% off top clinics — limited time',
  },
  {
    image: 'https://picsum.photos/seed/hero-dental/1200/400',
    title: 'Premium Health Checkup',
    subtitle: 'Full-body screening + Seoul city tour',
  },
];

export default function HeroSection() {
  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section className="relative w-full h-[260px] md:h-[320px] overflow-hidden">
      {/* Background Image */}
      <img
        src={slide.image}
        alt={slide.title}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/10" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end h-full px-4 pb-10 md:pb-12 max-w-3xl md:max-w-5xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-white font-heading leading-tight mb-1.5 drop-shadow-sm">
          {slide.title}
        </h1>
        <p className="text-sm md:text-base text-white/80 drop-shadow-sm">
          {slide.subtitle}
        </p>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              idx === current ? 'bg-white w-4' : 'bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Trust line outside hero (rendered below) */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-4 py-2 text-[10px] md:text-xs text-white/70 max-w-5xl mx-auto px-4">
          <span>🏆 #1 Medical Tourism</span>
          <span className="text-white/30">·</span>
          <span>15,000+ Patients</span>
          <span className="text-white/30">·</span>
          <span>200+ Hospitals</span>
          <span className="text-white/30 hidden sm:inline">·</span>
          <span className="hidden sm:inline">24/7 Support</span>
        </div>
      </div>
    </section>
  );
}
