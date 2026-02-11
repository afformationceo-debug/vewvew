import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Check, Sparkles, Building2, BedDouble,
  UtensilsCrossed, MapPin, Star, ChevronRight, Phone, Mail, User,
  Globe, Calendar, MessageSquare, PartyPopper, RotateCcw, Heart,
  MapPinned, Clock, Shield
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTripStore, TRIP_TYPES } from '../store/useTripStore';
import { hospitals } from '../data/hospitals';
import { categories } from '../data/categories';
import { accommodations } from '../data/accommodations';
import { restaurants } from '../data/restaurants';
import { attractions } from '../data/attractions';
import { cn } from '../utils/cn';

const stepIcons = {
  treatment: Building2,
  accommodation: BedDouble,
  dining: UtensilsCrossed,
  attractions: MapPin,
  contact: Phone,
};

const stepLabels = {
  treatment: { en: 'Treatment', ko: '시술 선택' },
  accommodation: { en: 'Stay', ko: '숙소 선택' },
  dining: { en: 'Dining', ko: '맛집 선택' },
  attractions: { en: 'Explore', ko: '관광지 선택' },
  contact: { en: 'Contact', ko: '상담 신청' },
};

// Animation variants
const pageVariants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

export default function CustomTripPage() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const lang = i18n.language === 'ko' ? 'ko' : 'en';

  const {
    tripType, currentStep, selectedCategory, selectedHospital,
    selectedAccommodation, selectedRestaurants, selectedAttractions,
    contactInfo, isSubmitted,
    setTripType, setCurrentStep, nextStep, prevStep,
    setSelectedCategory, setSelectedHospital, setSelectedAccommodation,
    toggleRestaurant, toggleAttraction, setContactInfo, submit, reset,
    getSteps, getTotalSteps,
  } = useTripStore();

  const steps = getSteps();
  const totalSteps = getTotalSteps();

  // Redirect if no trip type selected
  useEffect(() => {
    if (!tripType) navigate('/');
  }, [tripType, navigate]);

  if (!tripType) return null;

  if (isSubmitted) {
    return <SuccessScreen lang={lang} onReset={() => { reset(); navigate('/'); }} />;
  }

  const currentStepName = steps[currentStep];
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const canProceed = () => {
    switch (currentStepName) {
      case 'treatment': return selectedCategory && selectedHospital;
      case 'accommodation': return selectedAccommodation;
      case 'dining': return true; // optional
      case 'attractions': return true; // optional
      case 'contact': return contactInfo.name && contactInfo.email && contactInfo.phone;
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStepName === 'contact') {
      submit();
    } else {
      nextStep();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 pb-32"
    >
      {/* Top Bar */}
      <div className="sticky top-12 md:top-14 z-30 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4">
          {/* Back + Title */}
          <div className="flex items-center gap-3 py-3">
            <button onClick={() => currentStep === 0 ? navigate('/') : prevStep()} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-900">
                  {lang === 'ko' ? '나만의 여행 만들기' : 'Build Your Trip'}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 bg-violet-50 text-violet-600 rounded-full font-medium">
                  {currentStep + 1}/{totalSteps}
                </span>
              </div>
            </div>
            <button onClick={() => { reset(); navigate('/'); }} className="text-xs text-gray-400 hover:text-gray-600">
              {lang === 'ko' ? '취소' : 'Cancel'}
            </button>
          </div>

          {/* Progress Bar */}
          <div className="h-1 bg-gray-100 rounded-full mb-1 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>

          {/* Step Indicators */}
          <div className="flex items-center gap-1 py-2 overflow-x-auto scrollbar-hide">
            {steps.map((step, i) => {
              const Icon = stepIcons[step];
              const isActive = i === currentStep;
              const isDone = i < currentStep;
              return (
                <button
                  key={step}
                  onClick={() => i < currentStep && setCurrentStep(i)}
                  className={cn(
                    'flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-all',
                    isActive && 'bg-violet-100 text-violet-700',
                    isDone && 'bg-gray-100 text-gray-500 cursor-pointer',
                    !isActive && !isDone && 'text-gray-300'
                  )}
                >
                  {isDone ? (
                    <Check className="w-3 h-3 text-green-500" />
                  ) : (
                    <Icon className="w-3 h-3" />
                  )}
                  <span>{stepLabels[step][lang]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-3xl mx-auto px-4 pt-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStepName}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            {currentStepName === 'treatment' && (
              <TreatmentStep lang={lang} />
            )}
            {currentStepName === 'accommodation' && (
              <AccommodationStep lang={lang} />
            )}
            {currentStepName === 'dining' && (
              <DiningStep lang={lang} />
            )}
            {currentStepName === 'attractions' && (
              <AttractionsStep lang={lang} />
            )}
            {currentStepName === 'contact' && (
              <ContactStep lang={lang} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          {currentStep > 0 && (
            <button
              onClick={prevStep}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              {lang === 'ko' ? '이전' : 'Back'}
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all',
              canProceed()
                ? 'bg-violet-600 text-white hover:bg-violet-700 active:scale-[0.98]'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            )}
          >
            {currentStepName === 'contact' ? (
              <>
                <Sparkles className="w-4 h-4" />
                {lang === 'ko' ? '플래너 매칭 신청' : 'Request Planner Match'}
              </>
            ) : (
              <>
                {lang === 'ko' ? '다음' : 'Next'}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ================================================
   STEP 1: Treatment Selection
   ================================================ */
const categoryToSpecialties = {
  beauty: ['Dermatology', 'Filler', 'Botox', 'Skin Rejuvenation', 'Thread Lift', 'Laser', 'Hair Transplant'],
  eye: ['LASIK', 'LASEK', 'SMILE', 'Cataract', 'ICL'],
  dental: ['Dental', 'Implant', 'Veneers', 'Whitening', 'Orthodontics'],
  plastic: ['Plastic Surgery', 'Rhinoplasty', 'Facial Contouring', 'Eyelid', 'Body Contouring', 'Facelift', 'Breast', 'Liposuction'],
  checkup: ['Health Checkup', 'Cancer Screening', 'Cardiology'],
  stemcell: ['Stem Cell', 'Anti-Aging', 'Regenerative', 'Immune Therapy'],
  wellness: ['Wellness', 'Acupuncture', 'Herbal'],
  vip: ['VIP', 'Premium', 'Concierge'],
};

function TreatmentStep({ lang }) {
  const { selectedCategory, selectedHospital, setSelectedCategory, setSelectedHospital } = useTripStore();

  const filteredHospitals = selectedCategory
    ? (() => {
        const keywords = categoryToSpecialties[selectedCategory] || [selectedCategory];
        const matched = hospitals.filter(h =>
          h.specialties.some(s => keywords.some(k => s.toLowerCase().includes(k.toLowerCase())))
        );
        return matched.length > 0 ? matched : hospitals;
      })()
    : hospitals;

  return (
    <div className="space-y-5">
      {/* AI Tip */}
      <div className="flex items-center gap-2 px-3 py-2 bg-violet-50 rounded-xl">
        <Sparkles className="w-4 h-4 text-violet-500 shrink-0" />
        <p className="text-xs text-violet-700">
          {lang === 'ko'
            ? '관심있는 시술 분야를 선택하면, 최적의 병원을 추천해드려요!'
            : 'Select your treatment area and we\'ll recommend the best hospitals!'}
        </p>
      </div>

      {/* Category Selection */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3">
          {lang === 'ko' ? '어떤 시술을 원하세요?' : 'What treatment are you looking for?'}
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {categories.slice(0, 8).map(cat => (
            <button
              key={cat.id}
              onClick={() => { setSelectedCategory(cat.id); setSelectedHospital(null); }}
              className={cn(
                'flex items-center gap-2 p-3 rounded-xl border-2 text-left transition-all',
                selectedCategory === cat.id
                  ? 'border-violet-400 bg-violet-50'
                  : 'border-gray-100 bg-white hover:border-gray-200'
              )}
            >
              <span className="text-lg">{getCategoryEmoji(cat.id)}</span>
              <div>
                <span className="text-xs font-semibold text-gray-900 block">{cat.name[lang] || cat.name.en}</span>
                <span className="text-[10px] text-gray-400">{cat.packageCount} {lang === 'ko' ? '패키지' : 'pkgs'}</span>
              </div>
              {selectedCategory === cat.id && (
                <Check className="w-4 h-4 text-violet-500 ml-auto" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Hospital Selection */}
      {selectedCategory && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-sm font-bold text-gray-900 mb-3">
            {lang === 'ko' ? '병원을 선택해주세요' : 'Choose your hospital'}
          </h3>
          <div className="space-y-2">
            {filteredHospitals.map(hospital => (
              <button
                key={hospital.id}
                onClick={() => setSelectedHospital(hospital.id)}
                className={cn(
                  'w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all',
                  selectedHospital === hospital.id
                    ? 'border-violet-400 bg-violet-50'
                    : 'border-gray-100 bg-white hover:border-gray-200'
                )}
              >
                <img
                  src={hospital.images[0]}
                  alt={hospital.name}
                  className="w-14 h-14 rounded-lg object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-gray-900 truncate">{hospital.name}</span>
                    {hospital.certifications.includes('JCI') && (
                      <Shield className="w-3 h-3 text-blue-500 shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-[11px] text-gray-600">{hospital.rating}</span>
                    <span className="text-[11px] text-gray-400">({hospital.reviewCount.toLocaleString()})</span>
                  </div>
                  <span className="text-[10px] text-gray-400">
                    {hospital.location.city}, {hospital.location.district}
                  </span>
                </div>
                {selectedHospital === hospital.id && (
                  <Check className="w-5 h-5 text-violet-500 shrink-0" />
                )}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* ================================================
   STEP 2: Accommodation Selection
   ================================================ */
function AccommodationStep({ lang }) {
  const { selectedAccommodation, setSelectedAccommodation } = useTripStore();

  const typeLabels = {
    luxury: { en: 'Luxury Hotel', ko: '럭셔리 호텔', emoji: '🌟' },
    serviced: { en: 'Serviced Residence', ko: '서비스드 레지던스', emoji: '🏠' },
    boutique: { en: 'Boutique Hotel', ko: '부티크 호텔', emoji: '🏨' },
    guesthouse: { en: 'Recovery Stay', ko: '회복 전문 숙소', emoji: '🩹' },
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-xl">
        <BedDouble className="w-4 h-4 text-blue-500 shrink-0" />
        <p className="text-xs text-blue-700">
          {lang === 'ko'
            ? '회복에 최적화된 숙소를 골라보세요. 병원과의 거리도 확인할 수 있어요!'
            : 'Pick recovery-optimized stays. Check distance to hospital!'}
        </p>
      </div>

      <div className="space-y-2">
        {accommodations.map(acc => (
          <button
            key={acc.id}
            onClick={() => setSelectedAccommodation(acc.id)}
            className={cn(
              'w-full flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-all',
              selectedAccommodation === acc.id
                ? 'border-violet-400 bg-violet-50'
                : 'border-gray-100 bg-white hover:border-gray-200'
            )}
          >
            <img
              src={acc.image}
              alt={acc.name[lang] || acc.name.en}
              className="w-20 h-16 rounded-lg object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 rounded-full">
                  {typeLabels[acc.type]?.emoji} {typeLabels[acc.type]?.[lang] || acc.type}
                </span>
              </div>
              <span className="text-sm font-bold text-gray-900 block truncate">
                {acc.name[lang] || acc.name.en}
              </span>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-0.5">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-[11px] text-gray-600">{acc.rating}</span>
                </div>
                <span className="text-[11px] text-gray-400">|</span>
                <div className="flex items-center gap-0.5">
                  <MapPinned className="w-3 h-3 text-gray-400" />
                  <span className="text-[11px] text-gray-400">
                    {lang === 'ko' ? `병원 ${acc.distanceToHospital}` : `${acc.distanceToHospital} to hospital`}
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-violet-600 mt-1 block">
                ₩{acc.pricePerNight.KRW.toLocaleString()}/{lang === 'ko' ? '박' : 'night'}
              </span>
            </div>
            {selectedAccommodation === acc.id && (
              <Check className="w-5 h-5 text-violet-500 shrink-0 mt-2" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ================================================
   STEP 3: Dining Selection
   ================================================ */
function DiningStep({ lang }) {
  const { selectedRestaurants, toggleRestaurant } = useTripStore();

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 rounded-xl">
        <UtensilsCrossed className="w-4 h-4 text-orange-500 shrink-0" />
        <p className="text-xs text-orange-700">
          {lang === 'ko'
            ? '가고 싶은 맛집을 자유롭게 선택해주세요 (선택사항)'
            : 'Pick restaurants you want to visit (optional)'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {restaurants.map(rest => {
          const selected = selectedRestaurants.includes(rest.id);
          return (
            <button
              key={rest.id}
              onClick={() => toggleRestaurant(rest.id)}
              className={cn(
                'flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-all',
                selected
                  ? 'border-orange-300 bg-orange-50'
                  : 'border-gray-100 bg-white hover:border-gray-200'
              )}
            >
              <img
                src={rest.image}
                alt={rest.name[lang] || rest.name.en}
                className="w-16 h-16 rounded-lg object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-bold text-gray-900 block truncate">
                  {rest.name[lang] || rest.name.en}
                </span>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[10px] px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded-full font-medium">
                    {rest.highlight}
                  </span>
                  <span className="text-[10px] text-gray-400">{rest.priceRange}</span>
                </div>
                <p className="text-[11px] text-gray-500 mt-1 line-clamp-1">
                  {rest.description[lang] || rest.description.en}
                </p>
                <div className="flex gap-1 mt-1.5">
                  {rest.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-[9px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
              <div className={cn(
                'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-2 transition-colors',
                selected ? 'bg-orange-500 border-orange-500' : 'border-gray-300'
              )}>
                {selected && <Check className="w-3 h-3 text-white" />}
              </div>
            </button>
          );
        })}
      </div>

      {selectedRestaurants.length > 0 && (
        <div className="text-center">
          <span className="text-xs text-gray-500">
            {selectedRestaurants.length}{lang === 'ko' ? '곳 선택됨' : ' selected'}
          </span>
        </div>
      )}
    </div>
  );
}

/* ================================================
   STEP 4: Attractions Selection
   ================================================ */
function AttractionsStep({ lang }) {
  const { selectedAttractions, toggleAttraction } = useTripStore();

  const typeColors = {
    Cultural: 'bg-amber-50 text-amber-700',
    Shopping: 'bg-pink-50 text-pink-700',
    Landmark: 'bg-blue-50 text-blue-700',
    Entertainment: 'bg-purple-50 text-purple-700',
    Nature: 'bg-green-50 text-green-700',
    Wellness: 'bg-teal-50 text-teal-700',
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-xl">
        <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
        <p className="text-xs text-emerald-700">
          {lang === 'ko'
            ? '치료 전후로 즐길 관광지를 골라보세요 (선택사항)'
            : 'Pick attractions to enjoy before/after treatment (optional)'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {attractions.map(attr => {
          const selected = selectedAttractions.includes(attr.id);
          return (
            <button
              key={attr.id}
              onClick={() => toggleAttraction(attr.id)}
              className={cn(
                'flex flex-col p-0 rounded-xl border-2 text-left transition-all overflow-hidden',
                selected
                  ? 'border-emerald-300 bg-emerald-50/50'
                  : 'border-gray-100 bg-white hover:border-gray-200'
              )}
            >
              <div className="relative">
                <img
                  src={attr.image}
                  alt={attr.name[lang] || attr.name.en}
                  className="w-full h-24 object-cover"
                />
                <span className={cn(
                  'absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full',
                  typeColors[attr.type] || 'bg-gray-100 text-gray-600'
                )}>
                  {attr.type}
                </span>
                {selected && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <div className="p-2.5">
                <span className="text-xs font-bold text-gray-900 block truncate">
                  {attr.name[lang] || attr.name.en}
                </span>
                <div className="flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span className="text-[10px] text-gray-400">{attr.duration}</span>
                </div>
                <span className="text-[10px] text-gray-500 block mt-0.5 truncate">{attr.highlight}</span>
              </div>
            </button>
          );
        })}
      </div>

      {selectedAttractions.length > 0 && (
        <div className="text-center">
          <span className="text-xs text-gray-500">
            {selectedAttractions.length}{lang === 'ko' ? '곳 선택됨' : ' selected'}
          </span>
        </div>
      )}
    </div>
  );
}

/* ================================================
   STEP 5: Contact / Submit
   ================================================ */
function ContactStep({ lang }) {
  const { contactInfo, setContactInfo, tripType, selectedCategory, selectedHospital,
    selectedAccommodation, selectedRestaurants, selectedAttractions } = useTripStore();

  const hospital = hospitals.find(h => h.id === selectedHospital);
  const acc = accommodations.find(a => a.id === selectedAccommodation);

  return (
    <div className="space-y-5">
      {/* Summary Card */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-violet-500" />
          <span className="text-sm font-bold text-gray-900">
            {lang === 'ko' ? '나의 맞춤 여행' : 'My Custom Trip'}
          </span>
        </div>
        <div className="space-y-2">
          {hospital && (
            <SummaryRow emoji="🏥" label={lang === 'ko' ? '병원' : 'Hospital'} value={hospital.name} />
          )}
          {selectedCategory && (
            <SummaryRow emoji={getCategoryEmoji(selectedCategory)} label={lang === 'ko' ? '시술' : 'Treatment'} value={selectedCategory} />
          )}
          {acc && (
            <SummaryRow emoji="🏨" label={lang === 'ko' ? '숙소' : 'Stay'} value={acc.name[lang] || acc.name.en} />
          )}
          {selectedRestaurants.length > 0 && (
            <SummaryRow emoji="🍽️" label={lang === 'ko' ? '맛집' : 'Dining'} value={`${selectedRestaurants.length}${lang === 'ko' ? '곳' : ' places'}`} />
          )}
          {selectedAttractions.length > 0 && (
            <SummaryRow emoji="🗺️" label={lang === 'ko' ? '관광' : 'Tour'} value={`${selectedAttractions.length}${lang === 'ko' ? '곳' : ' places'}`} />
          )}
        </div>
      </div>

      {/* Contact Form */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3">
          {lang === 'ko' ? '상담 신청 정보' : 'Contact Information'}
        </h3>
        <div className="space-y-3">
          <FormField
            icon={User}
            label={lang === 'ko' ? '이름' : 'Name'}
            value={contactInfo.name}
            onChange={v => setContactInfo({ name: v })}
            placeholder={lang === 'ko' ? '이름을 입력해주세요' : 'Enter your name'}
            required
          />
          <FormField
            icon={Mail}
            label={lang === 'ko' ? '이메일' : 'Email'}
            type="email"
            value={contactInfo.email}
            onChange={v => setContactInfo({ email: v })}
            placeholder={lang === 'ko' ? '이메일을 입력해주세요' : 'Enter your email'}
            required
          />
          <FormField
            icon={Phone}
            label={lang === 'ko' ? '전화번호' : 'Phone'}
            type="tel"
            value={contactInfo.phone}
            onChange={v => setContactInfo({ phone: v })}
            placeholder={lang === 'ko' ? '전화번호를 입력해주세요' : 'Enter your phone'}
            required
          />
          <FormField
            icon={Globe}
            label={lang === 'ko' ? '국가' : 'Country'}
            value={contactInfo.country}
            onChange={v => setContactInfo({ country: v })}
            placeholder={lang === 'ko' ? '국가를 입력해주세요' : 'Enter your country'}
          />
          <FormField
            icon={Calendar}
            label={lang === 'ko' ? '희망 방문일' : 'Preferred Date'}
            type="date"
            value={contactInfo.preferredDate}
            onChange={v => setContactInfo({ preferredDate: v })}
          />
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700 mb-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              {lang === 'ko' ? '추가 메시지 (선택)' : 'Additional Message (optional)'}
            </label>
            <textarea
              value={contactInfo.message}
              onChange={e => setContactInfo({ message: e.target.value })}
              placeholder={lang === 'ko' ? '궁금한 점이나 요청사항을 적어주세요' : 'Any questions or special requests?'}
              rows={3}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent resize-none"
            />
          </div>
        </div>
      </div>

      {/* Trust Banner */}
      <div className="flex items-center gap-3 p-3 bg-violet-50 rounded-xl">
        <Shield className="w-5 h-5 text-violet-500 shrink-0" />
        <div>
          <span className="text-xs font-bold text-violet-700 block">
            {lang === 'ko' ? '전담 1:1 의료관광 플래너' : 'Dedicated 1:1 Medical Tour Planner'}
          </span>
          <span className="text-[11px] text-violet-600">
            {lang === 'ko'
              ? '제출 후 24시간 이내에 전담 플래너가 연락드립니다'
              : 'Your dedicated planner will contact you within 24 hours'}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ================================================
   SUCCESS SCREEN
   ================================================ */
function SuccessScreen({ lang, onReset }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen bg-gray-50 flex items-center justify-center px-4"
    >
      <div className="max-w-sm w-full text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2, stiffness: 200 }}
          className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl flex items-center justify-center"
        >
          <PartyPopper className="w-10 h-10 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {lang === 'ko' ? '신청 완료!' : 'Request Submitted!'}
        </h2>
        <p className="text-sm text-gray-500 mb-2">
          {lang === 'ko'
            ? '전담 1:1 의료관광 플래너가 24시간 이내에 연락드릴게요.'
            : 'Your dedicated 1:1 planner will contact you within 24 hours.'}
        </p>
        <p className="text-xs text-gray-400 mb-8">
          {lang === 'ko'
            ? '맞춤 일정, 비용, 상세 안내를 받으실 수 있습니다.'
            : 'You will receive a customized itinerary, pricing, and detailed guide.'}
        </p>

        <div className="space-y-2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 text-left"
          >
            <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
              <Phone className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <span className="text-xs font-bold text-gray-900">
                {lang === 'ko' ? '전화 상담' : 'Phone Consultation'}
              </span>
              <span className="text-[11px] text-gray-400 block">
                {lang === 'ko' ? '24시간 이내 연락' : 'Within 24 hours'}
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 text-left"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <span className="text-xs font-bold text-gray-900">
                {lang === 'ko' ? '맞춤 플랜 이메일' : 'Custom Plan Email'}
              </span>
              <span className="text-[11px] text-gray-400 block">
                {lang === 'ko' ? '상세 일정 & 견적서' : 'Detailed itinerary & quote'}
              </span>
            </div>
          </motion.div>
        </div>

        <button
          onClick={onReset}
          className="mt-8 flex items-center justify-center gap-2 w-full py-3 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          {lang === 'ko' ? '홈으로 돌아가기' : 'Back to Home'}
        </button>
      </div>
    </motion.div>
  );
}

/* ================================================
   SHARED COMPONENTS
   ================================================ */
function SummaryRow({ emoji, label, value }) {
  return (
    <div className="flex items-center gap-2 py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-sm">{emoji}</span>
      <span className="text-[11px] text-gray-400 w-12 shrink-0">{label}</span>
      <span className="text-xs font-medium text-gray-700 truncate">{value}</span>
    </div>
  );
}

function FormField({ icon: Icon, label, type = 'text', value, onChange, placeholder, required }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700 mb-1.5">
        <Icon className="w-3.5 h-3.5" />
        {label}
        {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
      />
    </div>
  );
}

function getCategoryEmoji(id) {
  const map = {
    beauty: '💄',
    eye: '👁️',
    dental: '🦷',
    plastic: '✨',
    checkup: '🩺',
    stemcell: '🧬',
    wellness: '🌿',
    vip: '👑',
  };
  return map[id] || '🏥';
}
