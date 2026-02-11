import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2 } from 'lucide-react';
import { cn } from '../utils/cn';
import { packages } from '../data/packages';
import PackageCard from '../components/common/PackageCard';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import { useWishlistStore } from '../store/useWishlistStore';

export default function WishlistPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items, clearWishlist, getCount } = useWishlistStore();
  const count = getCount();

  // Match wishlist items to full package data for PackageCard compatibility
  const wishlistedPackages = items
    .map((item) => packages.find((p) => p.id === item.id))
    .filter(Boolean);

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
                <Heart className="w-7 h-7 text-red-500" />
                {t('myWishlist', 'My Wishlist')}
              </h1>
              <p className="text-gray-500 mt-1">
                {count} {count === 1 ? t('item', 'item') : t('items', 'items')}
              </p>
            </div>
            {count > 0 && (
              <Button variant="ghost" size="sm" icon={Trash2} onClick={clearWishlist}>
                {t('removeAll', 'Remove All')}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 pb-20 md:pb-8">
        {wishlistedPackages.length === 0 ? (
          <EmptyState
            icon={Heart}
            title={t('emptyWishlist', 'Your wishlist is empty')}
            description={t('emptyWishlistDesc', 'Browse our packages and save your favorites here.')}
            actionLabel={t('browsePackages', 'Browse Packages')}
            onAction={() => navigate('/packages')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <AnimatePresence mode="popLayout">
              {wishlistedPackages.map((pkg, index) => (
                <motion.div
                  key={pkg.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <PackageCard pkg={pkg} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}
