import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { packages } from '../../data/packages';
import PackageCard from '../common/PackageCard';
import SectionHeader from '../common/SectionHeader';
import { cn } from '../../utils/cn';

const tabs = [
  { id: 'all', label: 'All' },
  { id: 'beauty', label: 'Beauty' },
  { id: 'eye', label: 'Eye' },
  { id: 'dental', label: 'Dental' },
  { id: 'plastic', label: 'Plastic' },
  { id: 'checkup', label: 'Checkup' },
];

export default function ExploreByTreatment() {
  const [activeTab, setActiveTab] = useState('all');

  const filteredPackages = useMemo(() => {
    const filtered = activeTab === 'all'
      ? packages
      : packages.filter((pkg) => pkg.category === activeTab);
    return filtered.slice(0, 8);
  }, [activeTab]);

  return (
    <div>
      <SectionHeader
        title="Explore by Treatment"
        viewAllLink="/packages"
      />

      {/* Compact pill tabs */}
      <div className="flex items-center gap-1.5 mb-4 overflow-x-auto scrollbar-hide pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors',
              activeTab === tab.id
                ? 'bg-primary-600 text-white'
                : 'text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid: mobile 2 cols, desktop 4 cols */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3"
        >
          {filteredPackages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              variant="compact"
              className="h-full max-w-none"
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {filteredPackages.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400 text-sm">No packages found.</p>
        </div>
      )}
    </div>
  );
}
