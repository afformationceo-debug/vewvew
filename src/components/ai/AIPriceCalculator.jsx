import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Plus, Minus, Calculator, TrendingUp } from 'lucide-react';
import { useAIStore } from '../../store/useAIStore';
import { cn } from '../../utils/cn';
import { formatPrice } from '../common/PriceDisplay';

const TREATMENTS = [
  { key: 'botox', label: 'Botox', icon: '💉' },
  { key: 'filler', label: 'Filler', icon: '✨' },
  { key: 'rhinoplasty', label: 'Rhinoplasty', icon: '👃' },
  { key: 'dental_implant', label: 'Dental Implant', icon: '🦷' },
  { key: 'checkup', label: 'Health Checkup', icon: '🩺' },
  { key: 'whitening', label: 'Whitening', icon: '😁' },
  { key: 'liposuction', label: 'Liposuction', icon: '💪' },
  { key: 'eyelid', label: 'Eyelid Surgery', icon: '👁' },
];

function TreatmentCheckbox({ treatment, isSelected, onToggle }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onToggle(treatment.key)}
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all duration-200',
        isSelected
          ? 'border-violet-400 bg-violet-50 text-violet-700 shadow-sm'
          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
      )}
    >
      <span className="text-base">{treatment.icon}</span>
      <span>{treatment.label}</span>
      {isSelected && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="ml-auto w-5 h-5 rounded-full bg-violet-500 text-white flex items-center justify-center text-xs"
        >
          ✓
        </motion.span>
      )}
    </motion.button>
  );
}

function NightsSlider({ nights, onChange }) {
  const percentage = ((nights - 1) / 13) * 100;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Accommodation</span>
        <span className="text-sm font-bold text-violet-600">
          {nights} {nights === 1 ? 'night' : 'nights'}
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={1}
          max={14}
          value={nights}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-violet-500
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-violet-500
            [&::-webkit-slider-thumb]:shadow-md
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-white"
          style={{
            background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`,
          }}
        />
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-gray-400">1</span>
          <span className="text-[10px] text-gray-400">7</span>
          <span className="text-[10px] text-gray-400">14</span>
        </div>
      </div>
    </div>
  );
}

function CompanionsCounter({ companions, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-700">Companions</span>
      <div className="flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => onChange(companions - 1)}
          disabled={companions <= 0}
          className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center border transition-colors',
            companions <= 0
              ? 'border-gray-200 text-gray-300 cursor-not-allowed'
              : 'border-violet-300 text-violet-600 hover:bg-violet-50'
          )}
        >
          <Minus className="w-4 h-4" />
        </motion.button>
        <span className="w-8 text-center text-lg font-bold text-gray-800">
          {companions}
        </span>
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => onChange(companions + 1)}
          disabled={companions >= 5}
          className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center border transition-colors',
            companions >= 5
              ? 'border-gray-200 text-gray-300 cursor-not-allowed'
              : 'border-violet-300 text-violet-600 hover:bg-violet-50'
          )}
        >
          <Plus className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
}

function AnimatedPrice({ price }) {
  return (
    <div className="relative h-10 flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={price}
          initial={{ y: 24, opacity: 0, filter: 'blur(4px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: -24, opacity: 0, filter: 'blur(4px)' }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="text-2xl font-extrabold text-gray-900"
        >
          {formatPrice(price)}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

function AIInsightCard({ selectedCount }) {
  const insights = [
    { min: 0, text: 'Select treatments above to get an AI-powered estimate.' },
    { min: 1, text: 'Great start! Single treatments in Korea save you up to 60% vs the US.' },
    { min: 2, text: 'This combo has a 93% satisfaction rate among our patients!' },
    { min: 3, text: 'Bundling 3+ treatments unlocks VIP pricing. Smart choice!' },
    { min: 5, text: 'Full makeover package! Our concierge will plan your entire trip.' },
  ];

  const insight = [...insights].reverse().find((i) => selectedCount >= i.min) || insights[0];

  return (
    <motion.div
      layout
      className="relative rounded-xl p-[1px] ai-gradient"
    >
      <div className="bg-white rounded-[11px] px-4 py-3">
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-100 to-cyan-100 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-4 h-4 text-violet-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-violet-700 mb-0.5">AI Insight</p>
            <AnimatePresence mode="wait">
              <motion.p
                key={insight.text}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="text-xs text-gray-600 leading-relaxed"
              >
                {insight.text}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function AIPriceCalculator({ className }) {
  const {
    selectedTreatments,
    nights,
    companions,
    estimatedPrice,
    toggleTreatment,
    setNights,
    setCompanions,
    calculatePrice,
  } = useAIStore();

  // Recalculate price whenever inputs change
  useEffect(() => {
    calculatePrice();
  }, [selectedTreatments, nights, companions, calculatePrice]);

  return (
    <div
      className={cn(
        'bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden',
        className
      )}
    >
      {/* AI Gradient Header */}
      <div className="h-1.5 ai-gradient" />

      {/* Title Section */}
      <div className="px-5 pt-4 pb-3">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-100 to-cyan-100 flex items-center justify-center">
            <Calculator className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">AI Price Calculator</h3>
            <p className="text-xs text-gray-500">Get your personalized estimate</p>
          </div>
        </div>
      </div>

      {/* Treatments Section */}
      <div className="px-5 pb-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">
          Select Treatments
        </p>
        <div className="grid grid-cols-2 gap-2">
          {TREATMENTS.map((t) => (
            <TreatmentCheckbox
              key={t.key}
              treatment={t}
              isSelected={selectedTreatments.includes(t.key)}
              onToggle={toggleTreatment}
            />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 border-t border-gray-100" />

      {/* Nights and Companions */}
      <div className="px-5 py-4 space-y-4">
        <NightsSlider nights={nights} onChange={setNights} />
        <CompanionsCounter companions={companions} onChange={setCompanions} />
      </div>

      {/* Divider */}
      <div className="mx-5 border-t border-gray-100" />

      {/* Price Display */}
      <div className="px-5 py-4">
        <div className="bg-gray-50 rounded-xl px-4 py-4 text-center mb-4">
          <p className="text-xs text-gray-500 font-medium mb-1">Estimated Total</p>
          <AnimatedPrice price={estimatedPrice} />
          <p className="text-[10px] text-gray-400 mt-1">
            Includes treatments, hotel ({nights} nights), {1 + companions} {1 + companions === 1 ? 'person' : 'people'}
          </p>
        </div>

        {/* USD equivalent */}
        {estimatedPrice > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-xs text-gray-400 mb-4"
          >
            Approx. {formatPrice(estimatedPrice, 'USD')} USD
          </motion.p>
        )}

        {/* AI Insight */}
        <AIInsightCard selectedCount={selectedTreatments.length} />
      </div>

      {/* Footer */}
      <div className="px-5 pb-5 pt-1">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="w-full ai-gradient text-white font-semibold text-sm py-3 rounded-xl shadow-md flex items-center justify-center gap-2 hover:shadow-lg transition-shadow"
        >
          <Sparkles className="w-4 h-4" />
          Get Detailed Quote
        </motion.button>
      </div>
    </div>
  );
}
