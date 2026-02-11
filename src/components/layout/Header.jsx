import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Globe, Heart, ShoppingBag, User, Clock, Menu, X, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useUIStore } from '../../store/useUIStore';
import { cn } from '../../utils/cn';

const languages = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
];

const navCategories = [
  { key: 'beauty', path: '/packages/beauty' },
  { key: 'checkup', path: '/packages/checkup' },
  { key: 'dental', path: '/packages/dental' },
  { key: 'eye', path: '/packages/eye' },
  { key: 'plastic', path: '/packages/plastic' },
  { key: 'events', path: '/events' },
  { key: 'reviews', path: '/reviews' },
];

export default function Header() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const cartCount = useCartStore(s => s.getItemCount());
  const wishCount = useWishlistStore(s => s.getCount());
  const { isMobileMenuOpen, toggleMobileMenu, setLanguage } = useUIStore();
  const [scrolled, setScrolled] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLang = (code) => {
    i18n.changeLanguage(code);
    setLanguage(code);
    setShowLangMenu(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  return (
    <>
      <header className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-gray-100',
        scrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-sm h-12 md:h-14'
          : 'bg-white h-12 md:h-16'
      )}>
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center gap-4">
          {/* Logo */}
          <Link to="/" className="shrink-0 flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <span className="font-heading font-bold text-lg text-gray-900 hidden sm:block">
              K-MEDI <span className="text-primary-600">TOUR</span>
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('hero.search_placeholder')}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>
          </form>

          {/* Right Icons */}
          <div className="flex items-center gap-1 md:gap-2 ml-auto">
            {/* Language */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors text-sm"
              >
                <Globe className="w-4 h-4 text-gray-600" />
                <span className="hidden sm:inline text-gray-700 font-medium">{currentLang.flag}</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>
              <AnimatePresence>
                {showLangMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-gray-100 py-1 min-w-[140px] z-50"
                  >
                    {languages.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => handleLang(lang.code)}
                        className={cn(
                          'w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 transition-colors',
                          i18n.language === lang.code && 'bg-primary-50 text-primary-600 font-medium'
                        )}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Desktop Icons */}
            <div className="hidden md:flex items-center gap-1">
              <Link to="/wishlist" className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Heart className="w-5 h-5 text-gray-600" />
                {wishCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishCount}
                  </span>
                )}
              </Link>
              <Link to="/cart" className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <ShoppingBag className="w-5 h-5 text-gray-600" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link to="/recent" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Clock className="w-5 h-5 text-gray-600" />
              </Link>
              <Link to="/mypage" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <User className="w-5 h-5 text-gray-600" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Desktop Category Nav */}
        <div className={cn(
          'hidden md:block border-t border-gray-100 bg-white transition-all duration-300',
          scrolled ? 'h-0 overflow-hidden opacity-0' : 'h-9 opacity-100'
        )}>
          <div className="max-w-7xl mx-auto px-4 h-full flex items-center gap-6">
            {navCategories.map(cat => (
              <Link
                key={cat.key}
                to={cat.path}
                className="text-sm text-gray-600 hover:text-primary-600 font-medium transition-colors whitespace-nowrap"
              >
                {t(`nav.${cat.key}`)}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div className="absolute inset-0 bg-black/50" onClick={toggleMobileMenu} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-2xl"
            >
              <div className="p-6 pt-20">
                <form onSubmit={handleSearch} className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t('hero.search_placeholder')}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </form>
                <nav className="space-y-1">
                  {navCategories.map(cat => (
                    <Link
                      key={cat.key}
                      to={cat.path}
                      onClick={toggleMobileMenu}
                      className="block px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                    >
                      {t(`nav.${cat.key}`)}
                    </Link>
                  ))}
                </nav>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className={cn(scrolled ? 'h-14' : 'h-[6.5rem]', 'transition-all duration-300 md:block hidden')} />
      <div className="h-12 md:hidden" />
    </>
  );
}
