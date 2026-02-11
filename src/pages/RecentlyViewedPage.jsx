import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Trash2, Star, MapPin } from 'lucide-react';
import { cn } from '../utils/cn';
import { formatPrice } from '../components/common/PriceDisplay';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import { useRecentStore } from '../store/useRecentStore';
import { packages } from '../data/packages';

function CompactCard({ item, index }) {
  const pkg = packages.find((p) => p.id === item.id);
  const slug = pkg?.slug || '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="shrink-0 w-52 md:w-60"
    >
      <Link
        to={`/package/${slug}`}
        className="block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={item.image}
            alt={item.title?.en || ''}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
        <div className="p-3">
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors mb-1">
            {item.title?.en || ''}
          </h3>
          <div className="flex items-center gap-2 mb-1">
            {item.rating && (
              <div className="flex items-center gap-0.5">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs font-semibold text-gray-700">{item.rating}</span>
              </div>
            )}
            {item.location && (
              <span className="text-xs text-gray-500 flex items-center gap-0.5">
                <MapPin className="w-3 h-3" />
                {item.location.city}
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-gray-900 text-sm">{formatPrice(item.price)}</span>
            {item.originalPrice > item.price && (
              <span className="text-xs text-gray-400 line-through">{formatPrice(item.originalPrice)}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function DateGroup({ label, items }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="mb-8">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">{label}</h3>
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
        {items.map((item, idx) => (
          <CompactCard key={item.id} item={item} index={idx} />
        ))}
      </div>
    </div>
  );
}

export default function RecentlyViewedPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items, clearRecent, getGrouped } = useRecentStore();
  const grouped = getGrouped();

  const hasItems = items.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 font-heading flex items-center gap-2">
                <Clock className="w-7 h-7 text-primary-600" />
                {t('recentlyViewed', 'Recently Viewed')}
              </h1>
              <p className="text-gray-500 mt-1">
                {items.length} {items.length === 1 ? t('item', 'item') : t('items', 'items')}
              </p>
            </div>
            {hasItems && (
              <Button variant="ghost" size="sm" icon={Trash2} onClick={clearRecent}>
                {t('clearAll', 'Clear All')}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 pb-20 md:pb-8">
        {!hasItems ? (
          <EmptyState
            icon={Clock}
            title={t('noRecentItems', 'No recently viewed items')}
            description={t('noRecentItemsDesc', 'Packages you view will appear here for easy access.')}
            actionLabel={t('browsePackages', 'Browse Packages')}
            onAction={() => navigate('/packages')}
          />
        ) : (
          <>
            <DateGroup label={t('today', 'Today')} items={grouped.today} />
            <DateGroup label={t('yesterday', 'Yesterday')} items={grouped.yesterday} />
            <DateGroup label={t('thisWeek', 'This Week')} items={grouped.thisWeek} />
            <DateGroup label={t('older', 'Older')} items={grouped.older} />
          </>
        )}
      </div>
    </motion.div>
  );
}
