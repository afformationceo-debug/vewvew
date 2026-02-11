import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Calendar,
  Star,
  Gift,
  Settings,
  LogOut,
  Award,
  Sparkles,
  ChevronRight,
  Globe,
  Bell,
  Moon,
  Shield,
  MapPin,
  Clock,
  Ticket,
} from 'lucide-react';
import { cn } from '../utils/cn';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Rating from '../components/common/Rating';
import EmptyState from '../components/common/EmptyState';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';
import { formatPrice } from '../components/common/PriceDisplay';

const TABS = [
  { id: 'bookings', label: 'Bookings', icon: Calendar },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'points', label: 'Points & Coupons', icon: Gift },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const SAMPLE_BOOKINGS = [
  {
    id: 'bk-001',
    title: 'Juvederm Filler + Gangnam Food Tour',
    date: '2026-03-15',
    status: 'active',
    price: 890000,
    image: 'https://picsum.photos/seed/bk1/200/200',
    travelers: 1,
    duration: '3D2N',
  },
  {
    id: 'bk-002',
    title: 'Premium Botox + Sinsa Shopping Experience',
    date: '2026-01-20',
    status: 'completed',
    price: 690000,
    image: 'https://picsum.photos/seed/bk2/200/200',
    travelers: 2,
    duration: '2D1N',
  },
  {
    id: 'bk-003',
    title: 'Premium Full-Body Checkup + DMZ Tour',
    date: '2025-11-05',
    status: 'cancelled',
    price: 2890000,
    image: 'https://picsum.photos/seed/bk3/200/200',
    travelers: 1,
    duration: '3D2N',
  },
];

const SAMPLE_USER_REVIEWS = [
  {
    id: 'ur-001',
    packageTitle: 'Juvederm Filler + Gangnam Food Tour',
    rating: 5,
    text: 'Amazing experience! The treatment was professional and the tour was fantastic.',
    date: '2026-01-28',
  },
  {
    id: 'ur-002',
    packageTitle: 'Premium Botox + Sinsa Shopping Experience',
    rating: 4.5,
    text: 'Great service, loved the shopping tour. Would recommend.',
    date: '2026-01-22',
  },
];

const SAMPLE_COUPONS = [
  { id: 'cp-001', code: 'WELCOME10', discount: '10%', minPurchase: 500000, expiry: '2026-06-30', isUsed: false },
  { id: 'cp-002', code: 'SPRING2026', discount: '₩50,000', minPurchase: 1000000, expiry: '2026-03-31', isUsed: false },
  { id: 'cp-003', code: 'BEAUTY20', discount: '20%', minPurchase: 800000, expiry: '2025-12-31', isUsed: true },
];

const STATUS_STYLES = {
  active: 'bg-green-100 text-green-700',
  completed: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-700',
};

const TIER_COLORS = {
  Bronze: 'from-orange-400 to-orange-600',
  Silver: 'from-gray-400 to-gray-600',
  Gold: 'from-amber-400 to-amber-600',
  Platinum: 'from-purple-400 to-purple-600',
};

export default function MyPage() {
  const { t } = useTranslation();
  const { user, isAuthenticated, loginDemo, logout } = useAuthStore();
  const { setLanguage, language, addToast } = useUIStore();
  const [activeTab, setActiveTab] = useState('bookings');
  const [notifications, setNotifications] = useState({ booking: true, promotion: false, newsletter: true });

  const loginWithProvider = useAuthStore((s) => s.loginWithProvider);

  const handleSocialLogin = (provider) => {
    loginWithProvider(provider);
    addToast({ type: 'success', message: `Logged in with ${provider}!` });
  };

  // If not authenticated, show login prompt with social login
  if (!isAuthenticated || !user) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-gray-50 flex items-center justify-center px-4"
      >
        <div className="bg-white rounded-2xl p-8 shadow-sm max-w-md w-full text-center">
          <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-10 h-10 text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('loginRequired', 'Login Required')}</h2>
          <p className="text-gray-500 mb-6">{t('loginRequiredDesc', 'Please log in to access your account and manage your bookings.')}</p>

          {/* Social Login Buttons */}
          <div className="space-y-2.5 mb-5">
            <button onClick={() => handleSocialLogin('google')} className="btn-social btn-google">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
            <button onClick={() => handleSocialLogin('line')} className="btn-social btn-line">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.271.173-.508.43-.595.064-.023.131-.033.2-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/></svg>
              Continue with LINE
            </button>
            <button onClick={() => handleSocialLogin('kakao')} className="btn-social btn-kakao">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#191919"><path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 01-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.664 6.201 3 12 3z"/></svg>
              Continue with Kakao
            </button>
            <button onClick={() => handleSocialLogin('apple')} className="btn-social btn-apple">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
              Continue with Apple
            </button>
          </div>

          {/* Or divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
            <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-gray-400">or</span></div>
          </div>

          <Button onClick={loginDemo} variant="secondary" className="w-full" size="lg">
            {t('demoLogin', 'Demo Login')}
          </Button>
          <p className="text-xs text-gray-400 mt-3">{t('demoLoginHint', 'Click to log in with a demo account')}</p>
        </div>
      </motion.div>
    );
  }

  const tierGradient = TIER_COLORS[user.tier] || TIER_COLORS.Bronze;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Profile Header */}
      <div className={cn('bg-gradient-to-r', tierGradient, 'text-white')}>
        <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
          <div className="flex items-center gap-5">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white/30 object-cover"
            />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{user.name}</h1>
              <p className="text-white/80 text-sm">{user.email}</p>
              <div className="flex items-center gap-3 mt-2">
                <Badge variant="vip" size="xs">{user.tier} {t('member', 'Member')}</Badge>
                <span className="text-white/80 text-sm flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  {user.points?.toLocaleString()} {t('points', 'pts')}
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl py-3 px-4">
              <span className="text-2xl font-bold">{user.bookings || 0}</span>
              <p className="text-xs text-white/70 mt-1">{t('bookings', 'Bookings')}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl py-3 px-4">
              <span className="text-2xl font-bold">{user.reviews || 0}</span>
              <p className="text-xs text-white/70 mt-1">{t('reviews', 'Reviews')}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl py-3 px-4">
              <span className="text-2xl font-bold">{user.points?.toLocaleString()}</span>
              <p className="text-xs text-white/70 mt-1">{t('points', 'Points')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Beauty Report — compact banner */}
      <div className="max-w-5xl mx-auto px-4 -mt-4 mb-4 relative z-10">
        <div className="bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100 flex items-center gap-3">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-violet-50 rounded-full shrink-0">
            <Sparkles className="w-3 h-3 text-violet-500" />
            <span className="text-[10px] font-medium text-violet-600">AI Report</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-600 overflow-x-auto scrollbar-hide">
            <span>Skin <strong className="text-gray-900">92</strong></span>
            <span>Match <strong className="text-gray-900">95%</strong></span>
            <span>Savings <strong className="text-gray-900">40%</strong></span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex overflow-x-auto gap-0 -mb-px">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-2 px-5 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors',
                    activeTab === tab.id
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {t(tab.id, tab.label)}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-5xl mx-auto px-4 py-6 md:py-8 pb-20 md:pb-8">
        <AnimatePresence mode="wait">
          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <motion.div
              key="bookings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {SAMPLE_BOOKINGS.map((booking) => (
                <motion.div
                  key={booking.id}
                  whileHover={{ y: -2 }}
                  className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start gap-3 md:gap-4"
                >
                  <img
                    src={booking.image}
                    alt={booking.title}
                    className="w-full sm:w-28 h-36 sm:h-24 rounded-xl object-cover"
                  />
                  <div className="flex-1 w-full min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-gray-900 text-sm md:text-base line-clamp-2">{booking.title}</h3>
                      <span className={cn('text-[10px] md:text-xs font-semibold px-2 md:px-2.5 py-0.5 md:py-1 rounded-full capitalize shrink-0', STATUS_STYLES[booking.status])}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-2 text-xs md:text-sm text-gray-500">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{booking.date}</span>
                      <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{booking.travelers} {t('travelers', 'traveler(s)')}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{booking.duration}</span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-semibold text-gray-900 text-sm md:text-base">{formatPrice(booking.price)}</span>
                      <Button variant="ghost" size="sm" icon={ChevronRight} iconRight>
                        {t('details', 'Details')}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {SAMPLE_USER_REVIEWS.length === 0 ? (
                <EmptyState
                  icon={Star}
                  title={t('noReviews', 'No reviews yet')}
                  description={t('noReviewsDesc', 'Complete a booking to write a review.')}
                />
              ) : (
                SAMPLE_USER_REVIEWS.map((review) => (
                  <div key={review.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 text-sm">{review.packageTitle}</h3>
                      <span className="text-xs text-gray-400">{review.date}</span>
                    </div>
                    <Rating stars={review.rating} showCount={false} size="sm" className="mb-2" />
                    <p className="text-sm text-gray-600">{review.text}</p>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {/* Points & Coupons Tab */}
          {activeTab === 'points' && (
            <motion.div
              key="points"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {/* Points Balance */}
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-2xl p-6 mb-6">
                <p className="text-sm text-white/70">{t('pointsBalance', 'Points Balance')}</p>
                <p className="text-4xl font-bold mt-1">{user.points?.toLocaleString()} <span className="text-base font-normal text-white/70">pts</span></p>
                <p className="text-sm text-white/70 mt-2">{t('pointsEquivalent', 'Equivalent to')} {formatPrice((user.points || 0) * 10)}</p>
              </div>

              {/* Coupons */}
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Ticket className="w-5 h-5 text-primary-600" />
                {t('myCoupons', 'My Coupons')}
              </h3>
              <div className="space-y-3">
                {SAMPLE_COUPONS.map((coupon) => (
                  <div
                    key={coupon.id}
                    className={cn(
                      'bg-white rounded-2xl p-4 border border-gray-100 flex items-center gap-4',
                      coupon.isUsed && 'opacity-50'
                    )}
                  >
                    <div className="w-16 h-16 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                      <span className="text-lg font-bold text-primary-600">{coupon.discount}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-gray-900">{coupon.code}</span>
                        {coupon.isUsed && <Badge variant="default" size="xs">{t('used', 'Used')}</Badge>}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {t('minPurchase', 'Min. purchase')}: {formatPrice(coupon.minPurchase)} | {t('expires', 'Expires')}: {coupon.expiry}
                      </p>
                    </div>
                    {!coupon.isUsed && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(coupon.code);
                          addToast({ type: 'success', message: t('couponCopied', 'Coupon code copied!') });
                        }}
                      >
                        {t('copy', 'Copy')}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Language */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="w-5 h-5 text-primary-600" />
                  <h3 className="font-semibold text-gray-900">{t('language', 'Language')}</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { code: 'en', label: 'English', flag: '🇺🇸' },
                    { code: 'ko', label: '한국어', flag: '🇰🇷' },
                    { code: 'ja', label: '日本語', flag: '🇯🇵' },
                    { code: 'zh', label: '中文', flag: '🇨🇳' },
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={cn(
                        'flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all',
                        language === lang.code
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      )}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Notifications */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <Bell className="w-5 h-5 text-primary-600" />
                  <h3 className="font-semibold text-gray-900">{t('notifications', 'Notifications')}</h3>
                </div>
                <div className="space-y-4">
                  {[
                    { key: 'booking', label: 'Booking Updates', desc: 'Status changes and reminders' },
                    { key: 'promotion', label: 'Promotions', desc: 'Deals, events, and offers' },
                    { key: 'newsletter', label: 'Newsletter', desc: 'Weekly newsletter and tips' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-gray-900">{t(item.key, item.label)}</span>
                        <p className="text-xs text-gray-500">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => setNotifications((prev) => ({ ...prev, [item.key]: !prev[item.key] }))}
                        className={cn(
                          'relative w-11 h-6 rounded-full transition-colors',
                          notifications[item.key] ? 'bg-primary-600' : 'bg-gray-300'
                        )}
                      >
                        <div
                          className={cn(
                            'absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform',
                            notifications[item.key] ? 'translate-x-5.5 left-0' : 'translate-x-0.5 left-0'
                          )}
                          style={{ transform: `translateX(${notifications[item.key] ? '22px' : '2px'})` }}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Logout */}
              <Button
                variant="danger"
                icon={LogOut}
                onClick={() => {
                  logout();
                  addToast({ type: 'info', message: t('loggedOut', 'You have been logged out') });
                }}
                className="w-full"
              >
                {t('logout', 'Log Out')}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
