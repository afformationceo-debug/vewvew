import { Heart, MapPin, Star, Camera, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Badge from './Badge';
import PriceDisplay from './PriceDisplay';
import { useWishlistStore } from '../../store/useWishlistStore';
import { cn } from '../../utils/cn';

export default function PackageCard({ pkg, rank, variant = 'default', className }) {
  const { t } = useTranslation();
  const { toggleWishlist, isWishlisted } = useWishlistStore();
  const wishlisted = isWishlisted(pkg.id);

  return (
    <div
      className={cn(
        'group bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-200',
        variant === 'compact' ? 'max-w-[280px]' : '',
        className
      )}
    >
      <Link to={`/package/${pkg.slug}`} className="block">
        <div className="relative overflow-hidden aspect-[4/3]">
          <img
            src={pkg.images[0]}
            alt={pkg.title.en}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

          {rank && (
            <div className="absolute top-2.5 left-2.5 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <span className="text-sm font-extrabold text-primary-600">{rank}</span>
            </div>
          )}

          <div className="absolute top-2.5 right-2.5 flex flex-col gap-1">
            {pkg.rating >= 4.7 && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-violet-50 text-violet-600">
                <Sparkles className="w-2.5 h-2.5" /> AI Pick
              </span>
            )}
            {pkg.badges?.map(badge => (
              <Badge key={badge} variant={badge.toLowerCase()}>{badge}</Badge>
            ))}
          </div>

          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(pkg); }}
            className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
          >
            <Heart className={cn('w-4 h-4 transition-colors', wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600')} />
          </button>

          {pkg.images.length > 1 && (
            <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-1.5 py-0.5">
              <Camera className="w-2.5 h-2.5 text-white" />
              <span className="text-[10px] text-white font-medium">{pkg.images.length}</span>
            </div>
          )}
        </div>

        <div className="p-3">
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1 group-hover:text-primary-600 transition-colors">
            {pkg.title.en}
          </h3>

          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="flex items-center gap-0.5">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-semibold text-gray-800">{pkg.rating}</span>
            </div>
            <span className="text-[10px] text-gray-400">({pkg.reviewCount.toLocaleString()})</span>
          </div>

          <div className="flex items-center gap-1 text-[10px] text-gray-500 mb-2">
            <MapPin className="w-3 h-3" />
            <span>{pkg.location.district}, {pkg.location.city}</span>
            <span className="text-gray-300 mx-0.5">·</span>
            <span>{pkg.duration.days}D{pkg.duration.nights}N</span>
          </div>

          <div className="border-t border-gray-50 pt-2">
            <PriceDisplay
              original={pkg.pricing.originalPrice}
              sale={pkg.pricing.salePrice}
              discountPercent={pkg.pricing.discountPercent}
              size="sm"
            />
          </div>
        </div>
      </Link>
    </div>
  );
}
