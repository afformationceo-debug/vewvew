import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Share2,
  MapPin,
  Clock,
  Star,
  Check,
  X,
  ChevronRight,
  ChevronDown,
  ShoppingCart,
  Plane,
  Coffee,
  Utensils,
  Hotel,
  Stethoscope,
  Syringe,
  Bed,
  Camera,
  ClipboardList,
  ShoppingBag,
  Hospital,
  User,
  Shield,
  Award,
  MessageCircle,
  Sparkles,
} from 'lucide-react';
import { cn } from '../utils/cn';
import { packages } from '../data/packages';
import { reviews } from '../data/reviews';
import Badge from '../components/common/Badge';
import Rating from '../components/common/Rating';
import PriceDisplay, { formatPrice } from '../components/common/PriceDisplay';
import Button from '../components/common/Button';
import PackageCard from '../components/common/PackageCard';
import SectionHeader from '../components/common/SectionHeader';
import { useWishlistStore } from '../store/useWishlistStore';
import { useCartStore } from '../store/useCartStore';
import { useRecentStore } from '../store/useRecentStore';
import { useUIStore } from '../store/useUIStore';

const ICON_MAP = {
  plane: Plane,
  coffee: Coffee,
  utensils: Utensils,
  hotel: Hotel,
  stethoscope: Stethoscope,
  syringe: Syringe,
  bed: Bed,
  camera: Camera,
  clipboard: ClipboardList,
  'shopping-bag': ShoppingBag,
  'map-pin': MapPin,
};

const TYPE_COLORS = {
  pickup: 'bg-blue-100 text-blue-600',
  dropoff: 'bg-blue-100 text-blue-600',
  meal: 'bg-orange-100 text-orange-600',
  hotel: 'bg-purple-100 text-purple-600',
  consultation: 'bg-teal-100 text-teal-600',
  treatment: 'bg-red-100 text-red-600',
  checkup: 'bg-teal-100 text-teal-600',
  tour: 'bg-green-100 text-green-600',
  rest: 'bg-indigo-100 text-indigo-600',
  shopping: 'bg-pink-100 text-pink-600',
};

export default function ProductDetailPage() {
  const { t } = useTranslation();
  const { slug } = useParams();
  const navigate = useNavigate();

  const { toggleWishlist, isWishlisted } = useWishlistStore();
  const { addItem } = useCartStore();
  const { addRecent } = useRecentStore();
  const { addToast } = useUIStore();

  const [selectedImage, setSelectedImage] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const pkg = packages.find((p) => p.slug === slug);

  // Track recently viewed
  useEffect(() => {
    if (pkg) {
      addRecent(pkg);
    }
  }, [pkg?.id]);

  // Get package reviews
  const packageReviews = useMemo(() => {
    if (!pkg) return [];
    return reviews.filter((r) => r.packageId === pkg.id || r.category === pkg.category).slice(0, 5);
  }, [pkg]);

  // Rating distribution
  const ratingDist = useMemo(() => {
    const dist = [0, 0, 0, 0, 0];
    packageReviews.forEach((r) => {
      const idx = Math.min(Math.floor(r.rating) - 1, 4);
      if (idx >= 0) dist[idx]++;
    });
    return dist.reverse(); // 5 to 1
  }, [packageReviews]);

  // Similar packages
  const similarPackages = useMemo(() => {
    if (!pkg) return [];
    return packages
      .filter((p) => p.id !== pkg.id && (p.category === pkg.category || p.location.city === pkg.location.city))
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
  }, [pkg]);

  if (!pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('packageNotFound', 'Package not found')}</h2>
          <p className="text-gray-500 mb-6">{t('packageNotFoundDesc', 'The package you are looking for does not exist.')}</p>
          <Button onClick={() => navigate('/packages')}>{t('browsePackages', 'Browse Packages')}</Button>
        </div>
      </div>
    );
  }

  const wishlisted = isWishlisted(pkg.id);

  const handleAddToCart = () => {
    addItem(pkg);
    addToast({ type: 'success', message: t('addedToCart', 'Added to cart!') });
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      addToast({ type: 'success', message: t('linkCopied', 'Link copied to clipboard!') });
    } catch {
      addToast({ type: 'info', message: window.location.href });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-white"
    >
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-2.5 md:py-3">
          <nav className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm overflow-x-auto scrollbar-hide">
            <Link to="/" className="text-gray-500 hover:text-primary-600 shrink-0">{t('home', 'Home')}</Link>
            <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400 shrink-0" />
            <Link to="/packages" className="text-gray-500 hover:text-primary-600 shrink-0">{t('packages', 'Packages')}</Link>
            <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400 shrink-0" />
            <Link to={`/packages/${pkg.category}`} className="text-gray-500 hover:text-primary-600 capitalize shrink-0">{pkg.category}</Link>
            <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400 shrink-0" />
            <span className="text-gray-900 font-medium truncate max-w-[150px] md:max-w-[200px]">{pkg.title.en}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div>
            <motion.div
              className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4"
              key={selectedImage}
            >
              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                src={pkg.images[selectedImage]}
                alt={pkg.title.en}
                className="w-full h-full object-cover"
              />
              {/* Badges overlay */}
              <div className="absolute top-4 left-4 flex gap-2">
                {pkg.badges?.map((badge) => (
                  <Badge key={badge} variant={badge.toLowerCase()} size="sm">{badge}</Badge>
                ))}
              </div>
            </motion.div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {pkg.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={cn(
                    'shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all',
                    selectedImage === idx
                      ? 'border-primary-600 ring-2 ring-primary-200'
                      : 'border-transparent hover:border-gray-300'
                  )}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Package Info */}
          <div>
            {/* Title area */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                {pkg.rating >= 4.7 && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-violet-50 text-violet-600">
                    <Sparkles className="w-2.5 h-2.5" /> AI Pick
                  </span>
                )}
                {pkg.badges?.map((badge) => (
                  <Badge key={badge} variant={badge.toLowerCase()} size="xs">{badge}</Badge>
                ))}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 font-heading mb-3">
                {pkg.title.en}
              </h1>
              <div className="flex items-center gap-4 flex-wrap">
                <Rating stars={pkg.rating} count={pkg.reviewCount} size="sm" />
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <MapPin className="w-4 h-4" />
                  <span>{pkg.location.district}, {pkg.location.city}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>{pkg.duration.days}D{pkg.duration.nights}N</span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-6">
              <PriceDisplay
                original={pkg.pricing.originalPrice}
                sale={pkg.pricing.salePrice}
                discountPercent={pkg.pricing.discountPercent}
                size="lg"
              />
              <p className="text-sm text-gray-500 mt-2">{t('perPerson', 'per person')}</p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-8">
              <Button onClick={handleAddToCart} icon={ShoppingCart} className="flex-1 min-w-[140px]" size="lg">
                {t('addToCart', 'Add to Cart')}
              </Button>
              <Button
                variant="outline"
                icon={MessageCircle}
                className="flex-1 min-w-[140px]"
                size="lg"
                onClick={() => useUIStore.getState().openConsultModal(pkg.title.en)}
              >
                {t('consultFirst', 'Consult First')}
              </Button>
              <div className="flex items-center gap-2">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleWishlist(pkg)}
                  className={cn(
                    'w-11 h-11 md:w-12 md:h-12 rounded-xl border-2 flex items-center justify-center transition-colors',
                    wishlisted
                      ? 'border-red-200 bg-red-50 text-red-500'
                      : 'border-gray-200 text-gray-400 hover:border-gray-300'
                  )}
                >
                  <Heart className={cn('w-5 h-5', wishlisted && 'fill-red-500')} />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleShare}
                  className="w-11 h-11 md:w-12 md:h-12 rounded-xl border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:border-gray-300 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Hospital Info Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                  <Hospital className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{pkg.treatment.hospital}</h3>
                  <p className="text-sm text-gray-500">{pkg.treatment.name}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="w-4 h-4 text-gray-400" />
                  <span>{pkg.treatment.doctor}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>{pkg.treatment.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Shield className="w-4 h-4 text-gray-400" />
                  <span>{pkg.treatment.anesthesia}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Award className="w-4 h-4 text-gray-400" />
                  <span>{t('recovery', 'Recovery')}: {pkg.treatment.recovery}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Itinerary Section */}
        {pkg.itinerary && pkg.itinerary.length > 0 && (
          <section className="mt-8 md:mt-10">
            <SectionHeader title={t('itinerary', 'Itinerary')} subtitle={t('itinerarySubtitle', 'Your day-by-day journey')} />
            <div className="space-y-8">
              {pkg.itinerary.map((day) => (
                <div key={day.day} className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary-600 text-white font-bold text-sm">
                      D{day.day}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {t('day', 'Day')} {day.day}
                    </h3>
                  </div>
                  <div className="ml-5 border-l-2 border-gray-200 pl-8 space-y-4">
                    {day.items.map((item, idx) => {
                      const IconComp = ICON_MAP[item.icon] || MapPin;
                      const colorClass = TYPE_COLORS[item.type] || 'bg-gray-100 text-gray-600';
                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.1 }}
                          className="relative flex items-start gap-4"
                        >
                          <div className="absolute -left-[2.55rem] top-1 w-3 h-3 rounded-full bg-white border-2 border-primary-400" />
                          <div className={cn('shrink-0 w-10 h-10 rounded-xl flex items-center justify-center', colorClass)}>
                            <IconComp className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-xs font-medium text-gray-400 uppercase">{item.time}</span>
                            <p className="text-sm font-medium text-gray-800">{item.title}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Includes / Excludes */}
        <section className="mt-8 md:mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50/50 rounded-2xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              {t('whatsIncluded', "What's Included")}
            </h3>
            <ul className="space-y-3">
              {pkg.includes.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-red-50/50 rounded-2xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <X className="w-5 h-5 text-red-500" />
              {t('whatsExcluded', "What's Excluded")}
            </h3>
            <ul className="space-y-3">
              {pkg.excludes.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                  <X className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Reviews Section */}
        {packageReviews.length > 0 && (
          <section className="mt-8 md:mt-10">
            <SectionHeader title={t('reviews', 'Reviews')} subtitle={`${pkg.rating} ${t('outOf5', 'out of 5')} - ${pkg.reviewCount.toLocaleString()} ${t('reviewsCount', 'reviews')}`} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Rating bars chart */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold text-gray-900">{pkg.rating}</span>
                  <div className="flex justify-center mt-2">
                    <Rating stars={pkg.rating} showCount={false} size="md" />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{pkg.reviewCount.toLocaleString()} {t('totalReviews', 'total reviews')}</p>
                </div>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((star, idx) => {
                    const count = ratingDist[idx] || 0;
                    const pct = packageReviews.length > 0 ? (count / packageReviews.length) * 100 : 0;
                    return (
                      <div key={star} className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 w-3">{star}</span>
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${pct}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: idx * 0.1 }}
                            className="h-full bg-amber-400 rounded-full"
                          />
                        </div>
                        <span className="text-xs text-gray-400 w-6 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Review cards */}
              <div className="lg:col-span-2 space-y-4">
                {packageReviews.map((review) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white border border-gray-100 rounded-2xl p-5"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={review.avatarUrl}
                        alt={review.userName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{review.userName}</span>
                          <span className="text-sm">{review.countryFlag}</span>
                        </div>
                        <Rating stars={review.rating} showCount={false} size="xs" />
                      </div>
                      <span className="text-xs text-gray-400">{review.date}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{review.text}</p>
                    {review.hasBeforeAfter && (
                      <span className="inline-block mt-2 text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
                        {t('beforeAfterPhotos', 'Before & After Photos')}
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQ Accordion */}
        {pkg.faq && pkg.faq.length > 0 && (
          <section className="mt-8 md:mt-10">
            <SectionHeader title={t('faq', 'Frequently Asked Questions')} />
            <button
              onClick={() => useUIStore.getState().openConsultModal(pkg.title.en)}
              className="mb-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-violet-50 text-violet-600 hover:bg-violet-100 transition-colors"
            >
              <Sparkles className="w-3 h-3" />
              Ask AI
            </button>
            <div className="max-w-3xl space-y-3">
              {pkg.faq.map((item, idx) => (
                <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-900 pr-4">{item.q}</span>
                    <ChevronDown
                      className={cn(
                        'w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200',
                        openFaqIndex === idx && 'rotate-180'
                      )}
                    />
                  </button>
                  <AnimatePresence>
                    {openFaqIndex === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Similar Packages */}
        {similarPackages.length > 0 && (
          <section className="mt-8 md:mt-10">
            <SectionHeader title={t('similarPackages', 'Similar Packages')} viewAllLink={`/packages/${pkg.category}`} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {similarPackages.map((sp) => (
                <PackageCard key={sp.id} pkg={sp} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Sticky Bottom Booking Bar */}
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-40 pb-safe">
        <div className="max-w-7xl mx-auto px-3 md:px-4 py-2.5 md:py-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <PriceDisplay
              original={pkg.pricing.originalPrice}
              sale={pkg.pricing.salePrice}
              discountPercent={pkg.pricing.discountPercent}
              size="sm"
            />
            <p className="text-[10px] md:text-xs text-gray-400">{pkg.duration.days}D{pkg.duration.nights}N / {t('perPerson', 'per person')}</p>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              icon={MessageCircle}
              onClick={() => useUIStore.getState().openConsultModal(pkg.title.en)}
              className="hidden sm:inline-flex"
            >
              {t('consult', 'Consult')}
            </Button>
            <Link to={`/booking/${pkg.slug}`}>
              <Button size="sm" className="md:!text-base md:!px-6 md:!py-2.5">
                {t('bookNow', 'Book Now')}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom spacer for sticky bar + mobile tab bar */}
      <div className="h-32 md:h-20" />
    </motion.div>
  );
}
