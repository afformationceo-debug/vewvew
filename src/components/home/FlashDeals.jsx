import { useMemo } from 'react';
import { ArrowRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { packages } from '../../data/packages';
import CountdownTimer from '../common/CountdownTimer';
import PriceDisplay from '../common/PriceDisplay';

export default function FlashDeals() {
  const endTime = useMemo(() => {
    const end = new Date();
    end.setHours(end.getHours() + 24);
    return end.toISOString();
  }, []);

  const dealPackages = useMemo(() => {
    return packages
      .filter((pkg) => pkg.pricing.discountPercent >= 30)
      .sort((a, b) => b.pricing.discountPercent - a.pricing.discountPercent)
      .slice(0, 4);
  }, []);

  const bookingPercentages = [87, 72, 64, 91];

  return (
    <section className="py-5 md:py-6 bg-orange-50/30">
      <div className="max-w-3xl md:max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 font-heading">
            Hot Deals 🔥
          </h2>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock className="w-3.5 h-3.5" />
            <CountdownTimer endTime={endTime} size="sm" />
          </div>
        </div>

        {/* Horizontal scroll cards */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {dealPackages.map((pkg, index) => (
            <Link
              key={pkg.id}
              to={`/package/${pkg.slug}`}
              className="flex-shrink-0 w-[180px] group"
            >
              <div className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={pkg.images[0]}
                    alt={pkg.title.en}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {pkg.pricing.discountPercent}% OFF
                  </div>
                </div>
                <div className="p-2.5">
                  <h3 className="text-xs font-semibold text-gray-900 line-clamp-2 mb-1.5 group-hover:text-primary-600 transition-colors">
                    {pkg.title.en}
                  </h3>
                  <PriceDisplay
                    original={pkg.pricing.originalPrice}
                    sale={pkg.pricing.salePrice}
                    discountPercent={pkg.pricing.discountPercent}
                    size="sm"
                  />
                  <div className="mt-1.5">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[10px] text-gray-400">
                        <span className="text-orange-500 font-semibold">{bookingPercentages[index]}%</span> booked
                      </span>
                    </div>
                    <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-orange-400 to-red-400"
                        style={{ width: `${bookingPercentages[index]}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-center mt-3">
          <Link
            to="/packages?sort=discount"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-primary-600 transition-colors"
          >
            View All Deals
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
