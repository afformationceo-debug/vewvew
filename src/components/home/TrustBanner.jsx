import { useState, useEffect, useRef, useCallback } from 'react';
import { Users, Award, Building2, Globe } from 'lucide-react';
import { cn } from '../../utils/cn';

const stats = [
  { icon: Users, value: 15000, suffix: '+', label: 'Happy Patients', color: 'bg-primary-50 text-primary-600' },
  { icon: Award, value: 98.7, suffix: '%', label: 'Satisfaction Rate', color: 'bg-rose-50 text-rose-500', decimals: 1 },
  { icon: Building2, value: 200, suffix: '+', label: 'Partner Hospitals', color: 'bg-amber-50 text-amber-600' },
  { icon: Globe, value: 50, suffix: '+', label: 'Countries Served', color: 'bg-emerald-50 text-emerald-500' },
];

function useCountUp(target, duration = 2000, start = false, decimals = 0) {
  const [count, setCount] = useState(0);
  const frameRef = useRef(null);

  useEffect(() => {
    if (!start) return;

    const startTime = performance.now();
    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;

      setCount(decimals > 0 ? parseFloat(current.toFixed(decimals)) : Math.floor(current));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(step);
      }
    };

    frameRef.current = requestAnimationFrame(step);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [start, target, duration, decimals]);

  return count;
}

function StatItem({ icon: Icon, value, suffix, label, color, decimals = 0, isVisible }) {
  const animatedValue = useCountUp(value, 2000, isVisible, decimals);

  const displayValue = decimals > 0
    ? animatedValue.toFixed(decimals)
    : animatedValue.toLocaleString();

  return (
    <div className="flex flex-col items-center gap-3 px-4 py-2">
      <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center', color)}>
        <Icon className="w-7 h-7" />
      </div>
      <div className="text-center">
        <div className="text-3xl md:text-4xl font-bold text-gray-900 tabular-nums">
          {displayValue}
          <span className="text-primary-500">{suffix}</span>
        </div>
        <p className="text-sm text-gray-500 mt-1 font-medium">{label}</p>
      </div>
    </div>
  );
}

export default function TrustBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const handleIntersect = useCallback((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersect, {
      threshold: 0.3,
    });

    const current = sectionRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [handleIntersect]);

  return (
    <section
      ref={sectionRef}
      className="bg-white border-b border-gray-100 py-12 md:py-16"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {stats.map((stat) => (
            <StatItem
              key={stat.label}
              {...stat}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
