import { useState, useMemo } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  SlidersHorizontal,
  Grid3X3,
  List,
  Star,
  X,
  ChevronDown,
  Search,
  Sparkles,
} from 'lucide-react';
import { cn } from '../utils/cn';
import { packages } from '../data/packages';
import { categories } from '../data/categories';
import PackageCard from '../components/common/PackageCard';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';

const ITEMS_PER_PAGE = 12;

const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'ai-recommended', label: 'AI Recommended' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest' },
];

const PRICE_RANGES = [
  { label: 'Under ₩500,000', min: 0, max: 500000 },
  { label: '₩500,000 - ₩1,000,000', min: 500000, max: 1000000 },
  { label: '₩1,000,000 - ₩2,000,000', min: 1000000, max: 2000000 },
  { label: '₩2,000,000 - ₩5,000,000', min: 2000000, max: 5000000 },
  { label: 'Over ₩5,000,000', min: 5000000, max: Infinity },
];

const RATING_OPTIONS = [4, 3, 2, 1];

const LOCATIONS = ['Seoul', 'Busan', 'Jeju'];

export default function ProductListPage() {
  const { t } = useTranslation();
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // Filter state
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [selectedRating, setSelectedRating] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const sortBy = searchParams.get('sort') || 'popular';

  const currentCategory = categories.find((c) => c.id === category);

  // Get unique subcategories for the current category
  const subcategories = useMemo(() => {
    const filtered = category
      ? packages.filter((p) => p.category === category)
      : packages;
    const subs = [...new Set(filtered.map((p) => p.subcategory))];
    return subs.map((s) => ({
      value: s,
      label: s
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase()),
    }));
  }, [category]);

  // Filtered and sorted packages
  const filteredPackages = useMemo(() => {
    let result = [...packages];

    // Category filter
    if (category) {
      result = result.filter((p) => p.category === category);
    }

    // Subcategory filter
    if (selectedSubcategories.length > 0) {
      result = result.filter((p) =>
        selectedSubcategories.includes(p.subcategory)
      );
    }

    // Price range filter
    if (selectedPriceRange !== null) {
      const range = PRICE_RANGES[selectedPriceRange];
      result = result.filter((p) => {
        const price = p.pricing.salePrice || p.pricing.originalPrice;
        return price >= range.min && price < range.max;
      });
    }

    // Rating filter
    if (selectedRating !== null) {
      result = result.filter((p) => p.rating >= selectedRating);
    }

    // Location filter
    if (selectedLocation) {
      result = result.filter((p) => p.location.city === selectedLocation);
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort(
          (a, b) =>
            (a.pricing.salePrice || a.pricing.originalPrice) -
            (b.pricing.salePrice || b.pricing.originalPrice)
        );
        break;
      case 'price-high':
        result.sort(
          (a, b) =>
            (b.pricing.salePrice || b.pricing.originalPrice) -
            (a.pricing.salePrice || a.pricing.originalPrice)
        );
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      case 'popular':
      default:
        result.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
        break;
    }

    return result;
  }, [category, selectedSubcategories, selectedPriceRange, selectedRating, selectedLocation, sortBy]);

  const visiblePackages = filteredPackages.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPackages.length;

  const handleSort = (value) => {
    setSearchParams({ sort: value });
  };

  const clearAllFilters = () => {
    setSelectedSubcategories([]);
    setSelectedPriceRange(null);
    setSelectedRating(null);
    setSelectedLocation(null);
  };

  const activeFilterCount =
    selectedSubcategories.length +
    (selectedPriceRange !== null ? 1 : 0) +
    (selectedRating !== null ? 1 : 0) +
    (selectedLocation ? 1 : 0);

  const toggleSubcategory = (sub) => {
    setSelectedSubcategories((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
    );
  };

  // Sidebar filter panel content (shared by desktop sidebar and mobile modal)
  const FilterPanel = ({ onClose }) => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 text-lg">{t('filters', 'Filters')}</h3>
        {activeFilterCount > 0 && (
          <button onClick={clearAllFilters} className="text-sm text-primary-600 hover:text-primary-700">
            {t('clearAll', 'Clear All')}
          </button>
        )}
        {onClose && (
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg lg:hidden">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Treatment Type */}
      {subcategories.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-800 mb-3">{t('treatmentType', 'Treatment Type')}</h4>
          <div className="space-y-2">
            {subcategories.map((sub) => (
              <label key={sub.value} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedSubcategories.includes(sub.value)}
                  onChange={() => toggleSubcategory(sub.value)}
                  className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-900">{sub.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div>
        <h4 className="font-medium text-gray-800 mb-3">{t('priceRange', 'Price Range')}</h4>
        <div className="space-y-2">
          {PRICE_RANGES.map((range, idx) => (
            <label key={idx} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="price"
                checked={selectedPriceRange === idx}
                onChange={() => setSelectedPriceRange(selectedPriceRange === idx ? null : idx)}
                className="w-4 h-4 border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-900">{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="font-medium text-gray-800 mb-3">{t('rating', 'Rating')}</h4>
        <div className="space-y-2">
          {RATING_OPTIONS.map((r) => (
            <label key={r} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="rating"
                checked={selectedRating === r}
                onChange={() => setSelectedRating(selectedRating === r ? null : r)}
                className="w-4 h-4 border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'w-4 h-4',
                      i < r ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'
                    )}
                  />
                ))}
                <span className="text-sm text-gray-600 ml-1">& up</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Location */}
      <div>
        <h4 className="font-medium text-gray-800 mb-3">{t('location', 'Location')}</h4>
        <div className="space-y-2">
          {LOCATIONS.map((loc) => (
            <label key={loc} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="location"
                checked={selectedLocation === loc}
                onChange={() => setSelectedLocation(selectedLocation === loc ? null : loc)}
                className="w-4 h-4 border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-900">{loc}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Apply button for mobile */}
      {onClose && (
        <Button onClick={onClose} className="w-full mt-4">
          {t('applyFilters', 'Apply Filters')} ({filteredPackages.length})
        </Button>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-primary-600 transition-colors">
              {t('home', 'Home')}
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link to="/packages" className="text-gray-500 hover:text-primary-600 transition-colors">
              {t('packages', 'Packages')}
            </Link>
            {currentCategory && (
              <>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900 font-medium">{currentCategory.name.en}</span>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 font-heading">
            {currentCategory ? currentCategory.name.en : t('allPackages', 'All Packages')}
          </h1>
          <p className="text-gray-500 mt-1">
            {filteredPackages.length} {t('packagesFound', 'packages found')}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 pb-20 md:pb-6">
        {/* AI Recommendation Chip */}
        <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 rounded-full cursor-pointer hover:bg-violet-100 transition-colors" onClick={() => handleSort('ai-recommended')}>
          <Sparkles className="w-3 h-3 text-violet-500" />
          <span className="text-[11px] font-medium text-violet-700">AI Picks for You</span>
          <ChevronRight className="w-3 h-3 text-violet-400" />
        </div>

        {/* Mobile Category Pills */}
        <div className="flex md:hidden items-center gap-2 overflow-x-auto scrollbar-hide mb-4 -mx-4 px-4 pb-1">
          <Link
            to="/packages"
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors shrink-0',
              !category
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            )}
          >
            {t('all', 'All')}
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/packages/${cat.id}`}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors shrink-0',
                category === cat.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              )}
            >
              {cat.name.en}
            </Link>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            {/* Mobile filter button */}
            <button
              onClick={() => setShowFilters(true)}
              className="lg:hidden flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {t('filters', 'Filters')}
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 bg-primary-600 text-white rounded-full text-xs flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Desktop Category pills */}
            <div className="hidden md:flex items-center gap-2 overflow-x-auto">
              <Link
                to="/packages"
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                  !category
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                )}
              >
                {t('all', 'All')}
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/packages/${cat.id}`}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                    category === cat.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  )}
                >
                  {cat.name.en}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => handleSort(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-10 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* View toggle */}
            <div className="hidden md:flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2 transition-colors',
                  viewMode === 'grid' ? 'bg-primary-50 text-primary-600' : 'text-gray-400 hover:text-gray-600'
                )}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-2 transition-colors',
                  viewMode === 'list' ? 'bg-primary-50 text-primary-600' : 'text-gray-400 hover:text-gray-600'
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <FilterPanel />
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {filteredPackages.length === 0 ? (
              <EmptyState
                icon={Search}
                title={t('noPackagesFound', 'No packages found')}
                description={t('noPackagesDescription', 'Try adjusting your filters or browse all packages.')}
                actionLabel={t('clearFilters', 'Clear Filters')}
                onAction={clearAllFilters}
              />
            ) : (
              <>
                <div
                  className={cn(
                    'grid gap-4 md:gap-6',
                    viewMode === 'grid'
                      ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                      : 'grid-cols-1'
                  )}
                >
                  <AnimatePresence mode="popLayout">
                    {visiblePackages.map((pkg, index) => (
                      <motion.div
                        key={pkg.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <PackageCard pkg={pkg} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Load More */}
                {hasMore && (
                  <div className="text-center mt-10">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
                    >
                      {t('loadMore', 'Load More')} ({filteredPackages.length - visibleCount} {t('remaining', 'remaining')})
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      <AnimatePresence>
        {showFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50"
              onClick={() => setShowFilters(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 max-w-full bg-white shadow-2xl overflow-y-auto p-6"
            >
              <FilterPanel onClose={() => setShowFilters(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
