import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  PartyPopper,
  Copy,
  Share2,
  ChevronDown,
} from 'lucide-react';
import { cn } from '../utils/cn';
import { events } from '../data/events';
import { packages } from '../data/packages';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import CountdownTimer from '../components/common/CountdownTimer';
import PackageCard from '../components/common/PackageCard';
import { useUIStore } from '../store/useUIStore';

export default function EventPage() {
  const { t } = useTranslation();
  const { addToast } = useUIStore();

  const now = new Date();

  const isActive = (event) => {
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    return now >= start && now <= end;
  };

  const isUpcoming = (event) => {
    return new Date(event.startDate) > now;
  };

  const getStatus = (event) => {
    if (isActive(event)) return 'active';
    if (isUpcoming(event)) return 'upcoming';
    return 'expired';
  };

  const handleCopyCoupon = (code) => {
    navigator.clipboard.writeText(code);
    addToast({ type: 'success', message: `Coupon code "${code}" copied!` });
  };

  const handleShare = (event) => {
    navigator.clipboard.writeText(`${window.location.origin}/events#${event.id}`);
    addToast({ type: 'success', message: 'Event link copied!' });
  };

  // Sort: active first, then upcoming, then expired
  const sortedEvents = [...events].sort((a, b) => {
    const order = { active: 0, upcoming: 1, expired: 2 };
    return order[getStatus(a)] - order[getStatus(b)];
  });

  const featuredEvent = sortedEvents.find((e) => getStatus(e) === 'active');
  const otherEvents = sortedEvents.filter((e) => e.id !== featuredEvent?.id);

  // Get featured packages for active events
  const featuredPackages = packages.slice(0, 6);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Featured Hero Banner */}
      {featuredEvent && (
        <div className="relative w-full h-[300px] sm:h-[380px] md:h-[480px] overflow-hidden">
          <img
            src={featuredEvent.image}
            alt={featuredEvent.title.en}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 md:p-12">
            <div className="max-w-5xl mx-auto w-full">
              <div className="flex items-center gap-2 mb-2 md:mb-3">
                <Badge variant="hot">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> LIVE NOW
                  </span>
                </Badge>
                <span className="text-[10px] md:text-xs font-semibold text-white/60 uppercase bg-white/10 px-2 py-1 rounded-full">
                  {featuredEvent.type}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white font-heading mb-2 md:mb-3 line-clamp-2">
                {featuredEvent.title.en}
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-white/70 max-w-2xl mb-3 md:mb-5 leading-relaxed line-clamp-2 md:line-clamp-none">
                {featuredEvent.description.en}
              </p>
              <div className="flex flex-wrap items-center gap-2 md:gap-4">
                <CountdownTimer targetDate={featuredEvent.endDate} />
                {featuredEvent.couponCode && (
                  <button
                    onClick={() => handleCopyCoupon(featuredEvent.couponCode)}
                    className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2 md:py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white text-sm hover:bg-white/20 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    <span className="font-mono font-bold text-xs md:text-sm">{featuredEvent.couponCode}</span>
                  </button>
                )}
                {featuredEvent.discount && (
                  <span className="bg-red-500 text-white text-sm md:text-lg font-bold px-3 md:px-4 py-1.5 md:py-2 rounded-xl shadow-lg">
                    {featuredEvent.discount.type === 'percent'
                      ? `${featuredEvent.discount.value}% OFF`
                      : `${(featuredEvent.discount.value / 10000).toFixed(0)}만원 OFF`}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Page Header (if no featured event) */}
      {!featuredEvent && (
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
          <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/10 mb-4">
                <PartyPopper className="w-7 h-7" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold font-heading mb-2">
                {t('eventsAndPromotions', 'Events & Promotions')}
              </h1>
              <p className="text-white/70 max-w-lg mx-auto">
                {t('eventsSubtitle', 'Discover exclusive deals and limited-time offers on medical tour packages')}
              </p>
            </motion.div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-6 md:py-12 pb-20 md:pb-12">
        {/* Featured Packages Horizontal Scroll */}
        {featuredEvent && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 font-heading mb-4">Featured Packages</h2>
            <div className="flex gap-4 overflow-x-auto scroll-snap-x scrollbar-hide pb-4 -mx-4 px-4">
              {featuredPackages.map((pkg) => (
                <div key={pkg.id} className="scroll-snap-start shrink-0 w-[280px]">
                  <PackageCard pkg={pkg} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Event Cards */}
        <div className="space-y-6">
          {otherEvents.map((event, index) => {
            const status = getStatus(event);
            const expired = status === 'expired';

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={cn(
                  'bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100',
                  expired && 'opacity-60'
                )}
              >
                {/* Wide banner image */}
                <div className="relative w-full h-48 md:h-56">
                  <img
                    src={event.image}
                    alt={event.title.en}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    {status === 'active' && (
                      <Badge variant="hot">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> LIVE
                        </span>
                      </Badge>
                    )}
                    {status === 'upcoming' && <Badge variant="new">UPCOMING</Badge>}
                    {status === 'expired' && (
                      <Badge variant="default">
                        <span className="flex items-center gap-1">
                          <XCircle className="w-3 h-3" /> EXPIRED
                        </span>
                      </Badge>
                    )}
                  </div>
                  {event.discount && (
                    <div className="absolute bottom-3 right-3">
                      <span className="bg-red-500 text-white text-lg font-bold px-3 py-1.5 rounded-xl shadow-lg">
                        {event.discount.type === 'percent'
                          ? `${event.discount.value}% OFF`
                          : `${(event.discount.value / 10000).toFixed(0)}만원`}
                      </span>
                    </div>
                  )}
                  {status === 'active' && (
                    <div className="absolute bottom-3 left-3">
                      <CountdownTimer targetDate={event.endDate} />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 md:p-6">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h2 className="text-xl font-bold text-gray-900">{event.title.en}</h2>
                    <button
                      onClick={() => handleShare(event)}
                      className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">{event.description.en}</p>

                  {/* Coupon Code Display */}
                  {event.couponCode && !expired && (
                    <div className="flex items-center gap-3 mb-4 p-3 bg-primary-50 rounded-xl border border-primary-100">
                      <div className="flex-1">
                        <p className="text-xs text-primary-500 font-medium mb-0.5">Coupon Code</p>
                        <span className="font-mono text-lg font-bold text-primary-700">{event.couponCode}</span>
                      </div>
                      <button
                        onClick={() => handleCopyCoupon(event.couponCode)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        Copy
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {event.startDate}
                      </span>
                      <span className="text-gray-300">-</span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {event.endDate}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-gray-500 uppercase bg-gray-100 px-2 py-1 rounded-full">
                      {event.type}
                    </span>
                  </div>

                  {/* Terms (expandable) */}
                  <details className="mt-4">
                    <summary className="flex items-center gap-1 text-xs text-gray-400 cursor-pointer hover:text-gray-600 transition-colors">
                      <ChevronDown className="w-3 h-3" />
                      Terms & Conditions
                    </summary>
                    <div className="mt-2 text-xs text-gray-400 leading-relaxed pl-4 border-l-2 border-gray-100">
                      <p>Cannot be combined with other promotions.</p>
                      {event.discount?.maxDiscount && (
                        <p>Max discount: ₩{event.discount.maxDiscount.toLocaleString()}</p>
                      )}
                      <p>Valid: {event.startDate} ~ {event.endDate}</p>
                    </div>
                  </details>
                </div>
              </motion.div>
            );
          })}
        </div>

        {sortedEvents.length === 0 && (
          <div className="text-center py-16">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('noEvents', 'No events at this time')}</h3>
            <p className="text-sm text-gray-500">{t('noEventsDesc', 'Check back soon for upcoming promotions and events.')}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
