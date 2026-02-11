import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Tag,
  ChevronRight,
  ArrowRight,
  X,
  Percent,
} from 'lucide-react';
import { cn } from '../utils/cn';
import { packages } from '../data/packages';
import { formatPrice } from '../components/common/PriceDisplay';
import PackageCard from '../components/common/PackageCard';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import SectionHeader from '../components/common/SectionHeader';
import { useCartStore } from '../store/useCartStore';
import { useUIStore } from '../store/useUIStore';

const COUPON_CODES = {
  WELCOME10: { type: 'percent', value: 10, label: '10% off' },
  SAVE50K: { type: 'fixed', value: 50000, label: '₩50,000 off' },
};

export default function CartPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, clearCart, getTotal, getItemCount } = useCartStore();
  const { addToast } = useUIStore();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  const subtotal = getTotal();
  const itemCount = getItemCount();

  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'percent') {
      return Math.round(subtotal * (appliedCoupon.value / 100));
    }
    return appliedCoupon.value;
  }, [appliedCoupon, subtotal]);

  const total = subtotal - discount;

  const handleApplyCoupon = () => {
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    const coupon = COUPON_CODES[code];
    if (coupon) {
      setAppliedCoupon({ ...coupon, code });
      setCouponCode('');
      addToast({ type: 'success', message: t('couponApplied', 'Coupon applied!') + ` (${coupon.label})` });
    } else {
      setCouponError(t('invalidCoupon', 'Invalid coupon code'));
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast({ type: 'info', message: t('couponRemoved', 'Coupon removed') });
  };

  // Recommended packages (3 random)
  const recommendedPackages = useMemo(() => {
    const cartIds = items.map((item) => item.packageId);
    return packages
      .filter((p) => !cartIds.includes(p.id))
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
  }, [items]);

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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 font-heading flex items-center gap-2">
            <ShoppingCart className="w-7 h-7 text-primary-600" />
            {t('cart', 'Cart')}
            {itemCount > 0 && (
              <span className="text-base font-normal text-gray-500">({itemCount} {t('items', 'items')})</span>
            )}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 pb-32 lg:pb-8">
        {items.length === 0 ? (
          <EmptyState
            icon={ShoppingCart}
            title={t('emptyCart', 'Your cart is empty')}
            description={t('emptyCartDesc', 'Add some medical tour packages to get started.')}
            actionLabel={t('browsePackages', 'Browse Packages')}
            onAction={() => navigate('/packages')}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-gray-900">{t('cartItems', 'Cart Items')}</h2>
                <button
                  onClick={clearCart}
                  className="text-sm text-red-500 hover:text-red-600 transition-colors"
                >
                  {t('clearCart', 'Clear Cart')}
                </button>
              </div>

              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
                    className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100"
                  >
                    <div className="flex gap-4">
                      <Link to={`/package/${packages.find(p => p.id === item.packageId)?.slug || ''}`}>
                        <img
                          src={item.image}
                          alt={item.title?.en || ''}
                          className="w-24 h-24 md:w-28 md:h-28 rounded-xl object-cover shrink-0"
                        />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            to={`/package/${packages.find(p => p.id === item.packageId)?.slug || ''}`}
                            className="font-semibold text-gray-900 hover:text-primary-600 transition-colors line-clamp-2 text-sm md:text-base"
                          >
                            {item.title?.en || item.title}
                          </Link>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-sm font-semibold text-gray-900 w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                            {item.originalPrice > item.price && (
                              <p className="text-xs text-gray-400 line-through">{formatPrice(item.originalPrice * item.quantity)}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Cart Summary */}
            <div>
              <div className="sticky top-24 space-y-4">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-4">{t('orderSummary', 'Order Summary')}</h3>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>{t('subtotal', 'Subtotal')} ({itemCount} {t('items', 'items')})</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>

                    {appliedCoupon && (
                      <div className="flex justify-between text-green-600">
                        <span className="flex items-center gap-1">
                          <Percent className="w-3.5 h-3.5" />
                          {t('discount', 'Discount')} ({appliedCoupon.code})
                          <button onClick={removeCoupon} className="ml-1 hover:text-red-500">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                        <span>-{formatPrice(discount)}</span>
                      </div>
                    )}

                    <div className="border-t border-gray-100 pt-3 flex justify-between font-semibold text-gray-900">
                      <span>{t('total', 'Total')}</span>
                      <span className="text-xl text-primary-600">{formatPrice(total)}</span>
                    </div>
                  </div>

                  {/* Coupon Input */}
                  {!appliedCoupon && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                        <Tag className="w-4 h-4" />
                        {t('couponCode', 'Coupon Code')}
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => { setCouponCode(e.target.value); setCouponError(''); }}
                          placeholder="WELCOME10"
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                          onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                        />
                        <Button variant="outline" size="sm" onClick={handleApplyCoupon}>
                          {t('apply', 'Apply')}
                        </Button>
                      </div>
                      {couponError && <p className="text-xs text-red-500 mt-1">{couponError}</p>}
                    </div>
                  )}

                  <Button
                    className="w-full mt-6"
                    size="lg"
                    icon={ArrowRight}
                    iconRight
                    onClick={() => {
                      const firstItem = items[0];
                      const pkg = packages.find(p => p.id === firstItem?.packageId);
                      if (pkg) {
                        navigate(`/booking/${pkg.slug}`);
                      }
                    }}
                  >
                    {t('proceedToCheckout', 'Proceed to Checkout')}
                  </Button>

                  <p className="text-xs text-gray-400 text-center mt-3">
                    {t('secureCheckout', 'Secure checkout with 256-bit SSL encryption')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recommended Packages */}
        {recommendedPackages.length > 0 && (
          <section className="mt-12 md:mt-16 pb-24 md:pb-0">
            <SectionHeader
              title={t('youMayAlsoLike', 'You May Also Like')}
              viewAllLink="/packages"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {recommendedPackages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Mobile Sticky Checkout Bar */}
      {items.length > 0 && (
        <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-40 lg:hidden">
          <div className="px-4 py-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs text-gray-500">{itemCount} {t('items', 'items')}</p>
              <p className="text-lg font-bold text-primary-600">{formatPrice(total)}</p>
            </div>
            <Button
              size="sm"
              icon={ArrowRight}
              iconRight
              onClick={() => {
                const firstItem = items[0];
                const foundPkg = packages.find(p => p.id === firstItem?.packageId);
                if (foundPkg) {
                  navigate(`/booking/${foundPkg.slug}`);
                }
              }}
            >
              {t('checkout', 'Checkout')}
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
