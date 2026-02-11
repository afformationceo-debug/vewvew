import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Building2, BedDouble, UtensilsCrossed, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTripStore, TRIP_TYPES } from '../../store/useTripStore';
import { cn } from '../../utils/cn';

const tripCards = [
  {
    id: 'medical-only',
    icon: Building2,
    gradient: 'from-blue-500 to-cyan-400',
    bgLight: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-600',
    items: [
      { icon: '🏥', label: { en: 'Hospital', ko: '병원' } },
    ],
    popular: false,
  },
  {
    id: 'medical-stay',
    icon: BedDouble,
    gradient: 'from-violet-500 to-purple-400',
    bgLight: 'bg-violet-50',
    borderColor: 'border-violet-200',
    textColor: 'text-violet-600',
    items: [
      { icon: '🏥', label: { en: 'Hospital', ko: '병원' } },
      { icon: '🏨', label: { en: 'Stay', ko: '숙소' } },
    ],
    popular: true,
  },
  {
    id: 'full-experience',
    icon: MapPin,
    gradient: 'from-amber-500 to-orange-400',
    bgLight: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-600',
    items: [
      { icon: '🏥', label: { en: 'Hospital', ko: '병원' } },
      { icon: '🏨', label: { en: 'Stay', ko: '숙소' } },
      { icon: '🍽️', label: { en: 'Dining', ko: '맛집' } },
      { icon: '🗺️', label: { en: 'Tour', ko: '관광' } },
    ],
    popular: false,
  },
];

const titles = {
  'medical-only': { en: 'Treatment Only', ko: '시술만' },
  'medical-stay': { en: 'Treatment + Stay', ko: '시술 + 숙소' },
  'full-experience': { en: 'Full Experience', ko: '풀 패키지' },
};

const descriptions = {
  'medical-only': { en: 'Focus on your treatment', ko: '시술에만 집중하고 싶다면' },
  'medical-stay': { en: 'Treatment with comfortable stay', ko: '편안한 숙소에서 치료받기' },
  'full-experience': { en: 'Complete K-Medical Trip', ko: '한국 의료관광 풀코스' },
};

export default function TripBuilderSection() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { setTripType, reset } = useTripStore();
  const lang = i18n.language === 'ko' ? 'ko' : 'en';

  const handleSelect = (typeId) => {
    reset();
    setTripType(typeId);
    navigate('/custom-trip');
  };

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-0.5 bg-violet-50 rounded-full">
            <Sparkles className="w-3 h-3 text-violet-500" />
            <span className="text-[11px] font-semibold text-violet-600">AI</span>
          </div>
          <h2 className="text-lg md:text-xl font-bold text-gray-900">
            {lang === 'ko' ? '나만의 여행 만들기' : 'Build Your Trip'}
          </h2>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-5">
        {lang === 'ko'
          ? '원하는 스타일을 선택하면, AI가 맞춤 플랜을 만들어드려요'
          : 'Choose your style, AI creates your perfect plan'}
      </p>

      {/* Trip Type Cards */}
      <div className="grid grid-cols-3 gap-3">
        {tripCards.map((card, index) => (
          <motion.button
            key={card.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            onClick={() => handleSelect(card.id)}
            className={cn(
              'relative flex flex-col items-center p-4 rounded-2xl border-2 transition-all duration-200',
              'hover:shadow-lg hover:-translate-y-1 active:scale-[0.98]',
              card.borderColor, card.bgLight,
              'group cursor-pointer'
            )}
          >
            {card.popular && (
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-violet-600 text-white text-[10px] font-bold rounded-full whitespace-nowrap">
                BEST
              </span>
            )}

            {/* Icon Row */}
            <div className="flex items-center gap-1 mb-3">
              {card.items.map((item, i) => (
                <span key={i} className="text-xl">{item.icon}</span>
              ))}
            </div>

            {/* Title */}
            <span className={cn('text-sm font-bold mb-1', card.textColor)}>
              {titles[card.id][lang]}
            </span>

            {/* Description */}
            <span className="text-[11px] text-gray-500 text-center leading-tight">
              {descriptions[card.id][lang]}
            </span>

            {/* Item Labels */}
            <div className="flex flex-wrap justify-center gap-1 mt-2.5">
              {card.items.map((item, i) => (
                <span key={i} className="text-[10px] text-gray-400 bg-white/80 px-1.5 py-0.5 rounded-full">
                  {item.label[lang]}
                </span>
              ))}
            </div>

            {/* Arrow */}
            <div className={cn(
              'mt-3 w-7 h-7 rounded-full flex items-center justify-center transition-colors',
              'bg-white/80 group-hover:bg-white',
              card.textColor
            )}>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </motion.button>
        ))}
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="mt-4 flex items-center justify-center gap-2 py-3 px-4 bg-gray-50 rounded-xl"
      >
        <span className="text-sm">🎯</span>
        <span className="text-xs text-gray-500">
          {lang === 'ko'
            ? '제출하면 전담 1:1 의료관광 플래너가 연락드려요'
            : 'Submit and your dedicated 1:1 planner will contact you'}
        </span>
      </motion.div>
    </div>
  );
}
