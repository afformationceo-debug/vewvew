import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp, Sparkles } from 'lucide-react';
import { cn } from '../utils/cn';
import { packages } from '../data/packages';
import { categories } from '../data/categories';
import PackageCard from '../components/common/PackageCard';
import EmptyState from '../components/common/EmptyState';

const POPULAR_SEARCHES = ['Beauty', 'Dental', 'LASIK', 'Health Checkup', 'Rhinoplasty', 'Botox', 'Filler'];

export default function SearchPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [input, setInput] = useState(query);

  const results = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return packages.filter(
      (p) =>
        p.title.en.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subcategory?.toLowerCase().includes(q) ||
        p.treatment?.name?.toLowerCase().includes(q) ||
        p.location?.city?.toLowerCase().includes(q) ||
        p.location?.district?.toLowerCase().includes(q)
    );
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setSearchParams({ q: input.trim() });
    }
  };

  const handleQuickSearch = (term) => {
    setInput(term);
    setSearchParams({ q: term });
  };

  const clearSearch = () => {
    setInput('');
    setSearchParams({});
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Search Header */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-20">
        <div className="max-w-3xl mx-auto px-4 py-3 md:py-6">
          <form onSubmit={handleSearch} className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              <Sparkles className="w-5 h-5 text-violet-500" />
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="AI finds your perfect treatment..."
              autoFocus
              className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all"
            />
            {input && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 pb-20 md:pb-8">
        {/* No query yet - show popular searches */}
        {!query && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary-600" />
              <h3 className="font-semibold text-gray-900">{t('popularSearches', 'Popular Searches')}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SEARCHES.map((term) => (
                <button
                  key={term}
                  onClick={() => handleQuickSearch(term)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:bg-primary-50 hover:border-primary-200 hover:text-primary-600 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>

            <div className="mt-8">
              <h3 className="font-semibold text-gray-900 mb-4">{t('browseCategories', 'Browse by Category')}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => navigate(`/packages/${cat.id}`)}
                    className="bg-white border border-gray-200 rounded-xl p-4 text-left hover:border-primary-200 hover:bg-primary-50 transition-colors group"
                  >
                    <span className="text-sm font-medium text-gray-900 group-hover:text-primary-600">{cat.name.en}</span>
                    <p className="text-xs text-gray-400 mt-1">{cat.packageCount} {t('packages', 'packages')}</p>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Search Results */}
        {query && (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                <span className="font-semibold">{results.length}</span> {t('resultsFor', 'results for')} &ldquo;<span className="font-semibold">{query}</span>&rdquo;
              </p>
            </div>

            {results.length === 0 ? (
              <div className="space-y-6">
                <EmptyState
                  icon={Search}
                  title={t('noResults', 'No results found')}
                  description={t('noResultsDesc', 'Try different keywords or browse our categories.')}
                  actionLabel={t('browsePackages', 'Browse Packages')}
                  onAction={() => navigate('/packages')}
                />
                <div className="max-w-md mx-auto text-center mt-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 rounded-full mb-3">
                    <Sparkles className="w-3 h-3 text-violet-500" />
                    <span className="text-[11px] font-medium text-violet-700">Try AI suggestions</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {['Budget-friendly', 'Premium care', 'Quick recovery', 'Korean Wave'].map(chip => (
                      <button
                        key={chip}
                        onClick={() => handleQuickSearch(chip)}
                        className="px-3 py-1.5 text-xs bg-white rounded-full text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                <AnimatePresence mode="popLayout">
                  {results.map((pkg, index) => (
                    <motion.div
                      key={pkg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <PackageCard pkg={pkg} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
