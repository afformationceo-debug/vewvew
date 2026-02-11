import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Check, Sparkles, Building2, BedDouble,
  UtensilsCrossed, MapPin, Star, Phone, Mail, User,
  Globe, Calendar, MessageSquare, PartyPopper, RotateCcw,
  MapPinned, Clock, Shield, X, ChevronRight, Users, Award,
  Wifi, Dumbbell, Coffee, Car, Heart, Eye, ImageIcon
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
      case 'dining': return true;
      case 'attractions': return true;
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

          <div className="h-1 bg-gray-100 rounded-full mb-1 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>

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
                  {isDone ? <Check className="w-3 h-3 text-green-500" /> : <Icon className="w-3 h-3" />}
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
            {currentStepName === 'treatment' && <TreatmentStep lang={lang} />}
            {currentStepName === 'accommodation' && <AccommodationStep lang={lang} />}
            {currentStepName === 'dining' && <DiningStep lang={lang} />}
            {currentStepName === 'attractions' && <AttractionsStep lang={lang} />}
            {currentStepName === 'contact' && <ContactStep lang={lang} />}
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
   DETAIL BOTTOM SHEET
   ================================================ */
function DetailSheet({ isOpen, onClose, children }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[60]"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[61] bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white z-10 pt-3 pb-2 px-5 border-b border-gray-50">
              <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-3" />
              <button
                onClick={onClose}
                className="absolute right-4 top-4 p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="px-5 pb-8 pt-3">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ================================================
   IMAGE GALLERY
   ================================================ */
function ImageGallery({ images, alt }) {
  const [current, setCurrent] = useState(0);
  return (
    <div className="relative rounded-2xl overflow-hidden mb-4">
      <img src={images[current]} alt={alt} className="w-full h-48 sm:h-56 object-cover" />
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                'w-2 h-2 rounded-full transition-all',
                i === current ? 'bg-white w-5' : 'bg-white/50'
              )}
            />
          ))}
        </div>
      )}
      <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/40 text-white text-[10px] px-2 py-0.5 rounded-full">
        <ImageIcon className="w-3 h-3" />
        {current + 1}/{images.length}
      </div>
    </div>
  );
}

/* ================================================
   STAR RATING
   ================================================ */
function StarRating({ rating, reviewCount, size = 'sm' }) {
  const isSm = size === 'sm';
  return (
    <div className="flex items-center gap-1">
      <Star className={cn('text-amber-400 fill-amber-400', isSm ? 'w-3.5 h-3.5' : 'w-4 h-4')} />
      <span className={cn('font-bold text-gray-900', isSm ? 'text-xs' : 'text-sm')}>{rating}</span>
      {reviewCount !== undefined && (
        <span className={cn('text-gray-400', isSm ? 'text-[11px]' : 'text-xs')}>
          ({reviewCount.toLocaleString()})
        </span>
      )}
    </div>
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
  const [detailHospital, setDetailHospital] = useState(null);

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
      <div className="flex items-center gap-2 px-3 py-2.5 bg-violet-50 rounded-xl">
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
              {selectedCategory === cat.id && <Check className="w-4 h-4 text-violet-500 ml-auto" />}
            </button>
          ))}
        </div>
      </div>

      {/* Hospital Selection */}
      {selectedCategory && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h3 className="text-sm font-bold text-gray-900 mb-3">
            {lang === 'ko' ? '병원을 선택해주세요' : 'Choose your hospital'}
            <span className="text-[11px] text-gray-400 font-normal ml-2">
              {filteredHospitals.length}{lang === 'ko' ? '곳' : ' available'}
            </span>
          </h3>
          <div className="space-y-3">
            {filteredHospitals.map(hospital => {
              const isSelected = selectedHospital === hospital.id;
              return (
                <div
                  key={hospital.id}
                  className={cn(
                    'rounded-2xl border-2 bg-white overflow-hidden transition-all',
                    isSelected ? 'border-violet-400 shadow-sm shadow-violet-100' : 'border-gray-100 hover:border-gray-200'
                  )}
                >
                  {/* Hospital Card */}
                  <div className="p-3">
                    <div className="flex gap-3">
                      <img
                        src={hospital.images[0]}
                        alt={hospital.name}
                        className="w-20 h-20 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="text-sm font-bold text-gray-900 truncate">{hospital.name}</span>
                            </div>
                            <StarRating rating={hospital.rating} reviewCount={hospital.reviewCount} />
                          </div>
                          {isSelected && (
                            <div className="w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center shrink-0">
                              <Check className="w-3.5 h-3.5 text-white" />
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                          <span className="text-[11px] text-gray-500">{hospital.location.city}, {hospital.location.district}</span>
                        </div>

                        {/* Certifications */}
                        <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                          {hospital.certifications.slice(0, 3).map(cert => (
                            <span key={cert} className={cn(
                              'text-[9px] font-bold px-1.5 py-0.5 rounded-full',
                              cert === 'JCI' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-500'
                            )}>
                              {cert === 'JCI' && '🛡️ '}{cert}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Specialties */}
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {hospital.specialties.slice(0, 4).map(sp => (
                        <span key={sp} className="text-[10px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full">{sp}</span>
                      ))}
                      {hospital.specialties.length > 4 && (
                        <span className="text-[10px] text-gray-400 px-1.5 py-0.5">+{hospital.specialties.length - 4}</span>
                      )}
                    </div>

                    {/* Description Preview */}
                    <p className="text-[11px] text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                      {hospital.description[lang] || hospital.description.en}
                    </p>

                    {/* Quick Stats */}
                    <div className="flex items-center gap-3 mt-2.5 pt-2.5 border-t border-gray-50">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-gray-400" />
                        <span className="text-[10px] text-gray-500">
                          {lang === 'ko' ? `의료진 ${hospital.doctorCount}명` : `${hospital.doctorCount} doctors`}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="w-3 h-3 text-gray-400" />
                        <span className="text-[10px] text-gray-500">
                          {lang === 'ko' ? `${hospital.yearEstablished}년 설립` : `Est. ${hospital.yearEstablished}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex border-t border-gray-100">
                    <button
                      onClick={() => setDetailHospital(hospital)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors border-r border-gray-100"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      {lang === 'ko' ? '자세히 보기' : 'View Details'}
                    </button>
                    <button
                      onClick={() => setSelectedHospital(hospital.id)}
                      className={cn(
                        'flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold transition-colors',
                        isSelected
                          ? 'bg-violet-500 text-white'
                          : 'text-violet-600 hover:bg-violet-50'
                      )}
                    >
                      <Check className="w-3.5 h-3.5" />
                      {isSelected
                        ? (lang === 'ko' ? '선택됨' : 'Selected')
                        : (lang === 'ko' ? '선택하기' : 'Select')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Hospital Detail Sheet */}
      <DetailSheet isOpen={!!detailHospital} onClose={() => setDetailHospital(null)}>
        {detailHospital && (
          <HospitalDetail
            hospital={detailHospital}
            lang={lang}
            isSelected={selectedHospital === detailHospital.id}
            onSelect={() => { setSelectedHospital(detailHospital.id); setDetailHospital(null); }}
          />
        )}
      </DetailSheet>
    </div>
  );
}

function HospitalDetail({ hospital, lang, isSelected, onSelect }) {
  return (
    <div>
      <ImageGallery images={hospital.images} alt={hospital.name} />

      <div className="flex items-start justify-between mb-1">
        <h3 className="text-lg font-bold text-gray-900">{hospital.name}</h3>
        <StarRating rating={hospital.rating} reviewCount={hospital.reviewCount} size="md" />
      </div>

      <div className="flex items-center gap-1 mb-3">
        <MapPin className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-xs text-gray-500">{hospital.location.address}</span>
      </div>

      {/* Certifications */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {hospital.certifications.map(cert => (
          <span key={cert} className={cn(
            'text-[11px] font-bold px-2 py-1 rounded-lg',
            cert === 'JCI' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-600'
          )}>
            {cert === 'JCI' ? '🛡️ ' : '✓ '}{cert}
          </span>
        ))}
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 leading-relaxed mb-4">
        {hospital.description[lang] || hospital.description.en}
      </p>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <Users className="w-5 h-5 text-violet-500 mx-auto mb-1" />
          <span className="text-sm font-bold text-gray-900 block">{hospital.doctorCount}</span>
          <span className="text-[10px] text-gray-400">{lang === 'ko' ? '의료진' : 'Doctors'}</span>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <Award className="w-5 h-5 text-amber-500 mx-auto mb-1" />
          <span className="text-sm font-bold text-gray-900 block">{hospital.yearEstablished}</span>
          <span className="text-[10px] text-gray-400">{lang === 'ko' ? '설립연도' : 'Established'}</span>
        </div>
      </div>

      {/* Specialties */}
      <div className="mb-5">
        <h4 className="text-xs font-bold text-gray-700 mb-2">{lang === 'ko' ? '전문 분야' : 'Specialties'}</h4>
        <div className="flex flex-wrap gap-1.5">
          {hospital.specialties.map(sp => (
            <span key={sp} className="text-[11px] text-violet-600 bg-violet-50 px-2.5 py-1 rounded-full font-medium">{sp}</span>
          ))}
        </div>
      </div>

      {/* Select Button */}
      <button
        onClick={onSelect}
        className={cn(
          'w-full py-3 rounded-xl text-sm font-bold transition-all',
          isSelected
            ? 'bg-gray-100 text-gray-500'
            : 'bg-violet-600 text-white hover:bg-violet-700 active:scale-[0.98]'
        )}
      >
        {isSelected
          ? (lang === 'ko' ? '✓ 이미 선택됨' : '✓ Already Selected')
          : (lang === 'ko' ? '이 병원 선택하기' : 'Select This Hospital')}
      </button>
    </div>
  );
}

/* ================================================
   STEP 2: Accommodation Selection
   ================================================ */
function AccommodationStep({ lang }) {
  const { selectedAccommodation, setSelectedAccommodation } = useTripStore();
  const [detailAcc, setDetailAcc] = useState(null);

  const typeLabels = {
    luxury: { en: 'Luxury Hotel', ko: '럭셔리 호텔', emoji: '🌟' },
    serviced: { en: 'Serviced Residence', ko: '서비스드 레지던스', emoji: '🏠' },
    boutique: { en: 'Boutique Hotel', ko: '부티크 호텔', emoji: '🏨' },
    guesthouse: { en: 'Recovery Stay', ko: '회복 전문 숙소', emoji: '🩹' },
  };

  const amenityIcons = {
    Pool: '🏊', Spa: '💆', Fitness: '💪', Concierge: '🛎️',
    'Airport Shuttle': '✈️', Kitchen: '🍳', Laundry: '👔',
    'Wi-Fi': '📶', 'Duty Free': '🛍️', Breakfast: '🥐',
    'City View': '🌇', 'Medical Support': '⚕️', 'Nurse Call': '🔔',
    'Ocean View': '🌊', 'Beach Access': '🏖️',
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 px-3 py-2.5 bg-blue-50 rounded-xl">
        <BedDouble className="w-4 h-4 text-blue-500 shrink-0" />
        <p className="text-xs text-blue-700">
          {lang === 'ko'
            ? '회복에 최적화된 숙소를 골라보세요. 병원과의 거리도 확인할 수 있어요!'
            : 'Pick recovery-optimized stays. Check distance to hospital!'}
        </p>
      </div>

      <div className="space-y-3">
        {accommodations.map(acc => {
          const isSelected = selectedAccommodation === acc.id;
          const typeInfo = typeLabels[acc.type];
          return (
            <div
              key={acc.id}
              className={cn(
                'rounded-2xl border-2 bg-white overflow-hidden transition-all',
                isSelected ? 'border-violet-400 shadow-sm shadow-violet-100' : 'border-gray-100 hover:border-gray-200'
              )}
            >
              <div className="p-3">
                <div className="flex gap-3">
                  <div className="relative shrink-0">
                    <img
                      src={acc.image}
                      alt={acc.name[lang] || acc.name.en}
                      className="w-24 h-20 rounded-xl object-cover"
                    />
                    <span className="absolute top-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 bg-white/90 rounded-full">
                      {typeInfo?.emoji} {typeInfo?.[lang] || acc.type}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-sm font-bold text-gray-900 truncate block">
                        {acc.name[lang] || acc.name.en}
                      </span>
                      {isSelected && (
                        <div className="w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                    </div>
                    <StarRating rating={acc.rating} reviewCount={acc.reviewCount} />

                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex items-center gap-0.5">
                        <MapPinned className="w-3 h-3 text-blue-400" />
                        <span className="text-[11px] text-blue-500 font-medium">
                          {lang === 'ko' ? `병원 ${acc.distanceToHospital}` : `${acc.distanceToHospital} to hospital`}
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-300">|</span>
                      <span className="text-[11px] text-gray-400">
                        {acc.location.city}, {acc.location.district}
                      </span>
                    </div>

                    <span className="text-sm font-bold text-violet-600 mt-1.5 block">
                      ₩{acc.pricePerNight.KRW.toLocaleString()}<span className="text-[10px] text-gray-400 font-normal">/{lang === 'ko' ? '박' : 'night'}</span>
                    </span>
                  </div>
                </div>

                {/* Amenities */}
                <div className="flex flex-wrap gap-1.5 mt-2.5 pt-2.5 border-t border-gray-50">
                  {acc.amenities.map(am => (
                    <span key={am} className="text-[10px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full">
                      {amenityIcons[am] || '•'} {am}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <p className="text-[11px] text-gray-400 mt-2 line-clamp-1">
                  {acc.description[lang] || acc.description.en}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex border-t border-gray-100">
                <button
                  onClick={() => setDetailAcc(acc)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors border-r border-gray-100"
                >
                  <Eye className="w-3.5 h-3.5" />
                  {lang === 'ko' ? '자세히 보기' : 'View Details'}
                </button>
                <button
                  onClick={() => setSelectedAccommodation(acc.id)}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold transition-colors',
                    isSelected
                      ? 'bg-violet-500 text-white'
                      : 'text-violet-600 hover:bg-violet-50'
                  )}
                >
                  <Check className="w-3.5 h-3.5" />
                  {isSelected
                    ? (lang === 'ko' ? '선택됨' : 'Selected')
                    : (lang === 'ko' ? '선택하기' : 'Select')}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Accommodation Detail Sheet */}
      <DetailSheet isOpen={!!detailAcc} onClose={() => setDetailAcc(null)}>
        {detailAcc && (
          <AccommodationDetail
            acc={detailAcc}
            lang={lang}
            typeLabels={typeLabels}
            amenityIcons={amenityIcons}
            isSelected={selectedAccommodation === detailAcc.id}
            onSelect={() => { setSelectedAccommodation(detailAcc.id); setDetailAcc(null); }}
          />
        )}
      </DetailSheet>
    </div>
  );
}

function AccommodationDetail({ acc, lang, typeLabels, amenityIcons, isSelected, onSelect }) {
  const typeInfo = typeLabels[acc.type];
  return (
    <div>
      <div className="relative rounded-2xl overflow-hidden mb-4">
        <img src={acc.image} alt={acc.name[lang] || acc.name.en} className="w-full h-48 sm:h-56 object-cover" />
        <span className="absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 bg-white/90 rounded-full">
          {typeInfo?.emoji} {typeInfo?.[lang] || acc.type}
        </span>
      </div>

      <div className="flex items-start justify-between mb-1">
        <h3 className="text-lg font-bold text-gray-900">{acc.name[lang] || acc.name.en}</h3>
        <span className="text-lg font-bold text-violet-600 shrink-0">
          ₩{acc.pricePerNight.KRW.toLocaleString()}
          <span className="text-xs text-gray-400 font-normal">/{lang === 'ko' ? '박' : 'night'}</span>
        </span>
      </div>

      <div className="flex items-center gap-3 mb-3">
        <StarRating rating={acc.rating} reviewCount={acc.reviewCount} size="md" />
        <span className="text-xs text-gray-300">|</span>
        <div className="flex items-center gap-1">
          <MapPinned className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-xs text-blue-500 font-medium">
            {lang === 'ko' ? `병원까지 ${acc.distanceToHospital}` : `${acc.distanceToHospital} to hospital`}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 mb-4">
        <MapPin className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-xs text-gray-500">{acc.location.city}, {acc.location.district}</span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 leading-relaxed mb-4">
        {acc.description[lang] || acc.description.en}
      </p>

      {/* Amenities */}
      <div className="mb-5">
        <h4 className="text-xs font-bold text-gray-700 mb-2">{lang === 'ko' ? '편의시설' : 'Amenities'}</h4>
        <div className="grid grid-cols-2 gap-2">
          {acc.amenities.map(am => (
            <div key={am} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
              <span className="text-sm">{amenityIcons[am] || '•'}</span>
              <span className="text-xs text-gray-600">{am}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onSelect}
        className={cn(
          'w-full py-3 rounded-xl text-sm font-bold transition-all',
          isSelected
            ? 'bg-gray-100 text-gray-500'
            : 'bg-violet-600 text-white hover:bg-violet-700 active:scale-[0.98]'
        )}
      >
        {isSelected
          ? (lang === 'ko' ? '✓ 이미 선택됨' : '✓ Already Selected')
          : (lang === 'ko' ? '이 숙소 선택하기' : 'Select This Stay')}
      </button>
    </div>
  );
}

/* ================================================
   STEP 3: Dining Selection
   ================================================ */
function DiningStep({ lang }) {
  const { selectedRestaurants, toggleRestaurant } = useTripStore();
  const [detailRest, setDetailRest] = useState(null);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 px-3 py-2.5 bg-orange-50 rounded-xl">
        <UtensilsCrossed className="w-4 h-4 text-orange-500 shrink-0" />
        <p className="text-xs text-orange-700">
          {lang === 'ko'
            ? '가고 싶은 맛집을 자유롭게 선택해주세요 (선택사항, 복수 선택 가능)'
            : 'Pick restaurants you want to visit (optional, multi-select)'}
        </p>
      </div>

      {selectedRestaurants.length > 0 && (
        <div className="flex items-center gap-2 px-3 py-2 bg-orange-500 text-white rounded-xl">
          <Check className="w-4 h-4" />
          <span className="text-xs font-bold">{selectedRestaurants.length}{lang === 'ko' ? '곳 선택됨' : ' selected'}</span>
        </div>
      )}

      <div className="space-y-3">
        {restaurants.map(rest => {
          const isSelected = selectedRestaurants.includes(rest.id);
          return (
            <div
              key={rest.id}
              className={cn(
                'rounded-2xl border-2 bg-white overflow-hidden transition-all',
                isSelected ? 'border-orange-300 shadow-sm shadow-orange-50' : 'border-gray-100 hover:border-gray-200'
              )}
            >
              <div className="p-3">
                <div className="flex gap-3">
                  <div className="relative shrink-0">
                    <img
                      src={rest.image}
                      alt={rest.name[lang] || rest.name.en}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-bold text-gray-900 truncate">{rest.name[lang] || rest.name.en}</span>
                    </div>

                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded-full">
                        {rest.highlight}
                      </span>
                      <span className="text-[11px] text-gray-400">{rest.priceRange}</span>
                    </div>

                    <div className="flex items-center gap-1.5 mb-1">
                      <StarRating rating={rest.rating} />
                      <span className="text-[11px] text-gray-300">|</span>
                      <span className="text-[11px] text-gray-400">{rest.cuisine}</span>
                    </div>

                    <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
                      {rest.description[lang] || rest.description.en}
                    </p>

                    <div className="flex gap-1 mt-1.5">
                      {rest.tags.map(tag => (
                        <span key={tag} className="text-[9px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded-full">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex border-t border-gray-100">
                <button
                  onClick={() => setDetailRest(rest)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors border-r border-gray-100"
                >
                  <Eye className="w-3.5 h-3.5" />
                  {lang === 'ko' ? '자세히 보기' : 'View Details'}
                </button>
                <button
                  onClick={() => toggleRestaurant(rest.id)}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold transition-colors',
                    isSelected
                      ? 'bg-orange-500 text-white'
                      : 'text-orange-600 hover:bg-orange-50'
                  )}
                >
                  {isSelected ? (
                    <><Check className="w-3.5 h-3.5" />{lang === 'ko' ? '선택 해제' : 'Deselect'}</>
                  ) : (
                    <><Heart className="w-3.5 h-3.5" />{lang === 'ko' ? '선택하기' : 'Select'}</>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Restaurant Detail Sheet */}
      <DetailSheet isOpen={!!detailRest} onClose={() => setDetailRest(null)}>
        {detailRest && (
          <RestaurantDetail
            rest={detailRest}
            lang={lang}
            isSelected={selectedRestaurants.includes(detailRest.id)}
            onToggle={() => { toggleRestaurant(detailRest.id); }}
          />
        )}
      </DetailSheet>
    </div>
  );
}

function RestaurantDetail({ rest, lang, isSelected, onToggle }) {
  return (
    <div>
      <div className="relative rounded-2xl overflow-hidden mb-4">
        <img src={rest.image} alt={rest.name[lang] || rest.name.en} className="w-full h-48 sm:h-56 object-cover" />
        <span className="absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full">
          {rest.highlight}
        </span>
      </div>

      <div className="flex items-start justify-between mb-1">
        <h3 className="text-lg font-bold text-gray-900">{rest.name[lang] || rest.name.en}</h3>
        <span className="text-sm font-bold text-gray-500">{rest.priceRange}</span>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <StarRating rating={rest.rating} size="md" />
        <span className="text-xs text-gray-300">|</span>
        <span className="text-xs text-gray-500">{rest.cuisine}</span>
        <span className="text-xs text-gray-300">|</span>
        <span className="text-xs text-gray-500">{rest.location.city}, {rest.location.district}</span>
      </div>

      <p className="text-sm text-gray-600 leading-relaxed mb-4">
        {rest.description[lang] || rest.description.en}
      </p>

      {/* Tags */}
      <div className="mb-5">
        <h4 className="text-xs font-bold text-gray-700 mb-2">{lang === 'ko' ? '특징' : 'Features'}</h4>
        <div className="flex flex-wrap gap-1.5">
          {rest.tags.map(tag => (
            <span key={tag} className="text-[11px] text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full font-medium">{tag}</span>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="grid grid-cols-2 gap-2 mb-5">
        <div className="bg-gray-50 rounded-xl p-3">
          <span className="text-[10px] text-gray-400 block mb-0.5">{lang === 'ko' ? '요리 종류' : 'Cuisine'}</span>
          <span className="text-xs font-bold text-gray-700">{rest.cuisine}</span>
        </div>
        <div className="bg-gray-50 rounded-xl p-3">
          <span className="text-[10px] text-gray-400 block mb-0.5">{lang === 'ko' ? '가격대' : 'Price Range'}</span>
          <span className="text-xs font-bold text-gray-700">{rest.priceRange}</span>
        </div>
      </div>

      <button
        onClick={onToggle}
        className={cn(
          'w-full py-3 rounded-xl text-sm font-bold transition-all',
          isSelected
            ? 'bg-orange-100 text-orange-600'
            : 'bg-orange-500 text-white hover:bg-orange-600 active:scale-[0.98]'
        )}
      >
        {isSelected
          ? (lang === 'ko' ? '선택 해제하기' : 'Deselect')
          : (lang === 'ko' ? '이 맛집 선택하기' : 'Select This Restaurant')}
      </button>
    </div>
  );
}

/* ================================================
   STEP 4: Attractions Selection
   ================================================ */
function AttractionsStep({ lang }) {
  const { selectedAttractions, toggleAttraction } = useTripStore();
  const [detailAttr, setDetailAttr] = useState(null);

  const typeColors = {
    Cultural: { bg: 'bg-amber-50', text: 'text-amber-700', icon: '🏛️' },
    Shopping: { bg: 'bg-pink-50', text: 'text-pink-700', icon: '🛍️' },
    Landmark: { bg: 'bg-blue-50', text: 'text-blue-700', icon: '🗼' },
    Entertainment: { bg: 'bg-purple-50', text: 'text-purple-700', icon: '🎭' },
    Nature: { bg: 'bg-green-50', text: 'text-green-700', icon: '🌿' },
    Wellness: { bg: 'bg-teal-50', text: 'text-teal-700', icon: '♨️' },
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 px-3 py-2.5 bg-emerald-50 rounded-xl">
        <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
        <p className="text-xs text-emerald-700">
          {lang === 'ko'
            ? '치료 전후로 즐길 관광지를 골라보세요 (선택사항, 복수 선택 가능)'
            : 'Pick attractions to enjoy before/after treatment (optional, multi-select)'}
        </p>
      </div>

      {selectedAttractions.length > 0 && (
        <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500 text-white rounded-xl">
          <Check className="w-4 h-4" />
          <span className="text-xs font-bold">{selectedAttractions.length}{lang === 'ko' ? '곳 선택됨' : ' selected'}</span>
        </div>
      )}

      <div className="space-y-3">
        {attractions.map(attr => {
          const isSelected = selectedAttractions.includes(attr.id);
          const tc = typeColors[attr.type] || { bg: 'bg-gray-50', text: 'text-gray-600', icon: '📍' };
          return (
            <div
              key={attr.id}
              className={cn(
                'rounded-2xl border-2 bg-white overflow-hidden transition-all',
                isSelected ? 'border-emerald-300 shadow-sm shadow-emerald-50' : 'border-gray-100 hover:border-gray-200'
              )}
            >
              <div className="relative">
                <img
                  src={attr.image}
                  alt={attr.name[lang] || attr.name.en}
                  className="w-full h-36 sm:h-44 object-cover"
                />
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full', tc.bg, tc.text)}>
                    {tc.icon} {attr.type}
                  </span>
                </div>
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-sm">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between">
                  <div>
                    <span className="text-white text-sm font-bold block drop-shadow-sm">
                      {attr.name[lang] || attr.name.en}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-[11px] text-white/90 font-medium">{attr.rating}</span>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <Clock className="w-3 h-3 text-white/70" />
                        <span className="text-[11px] text-white/80">{attr.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {attr.highlight}
                  </span>
                  <span className="text-[11px] text-gray-400">
                    {attr.location.city}, {attr.location.district}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                  {attr.description[lang] || attr.description.en}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {attr.tags.map(tag => (
                    <span key={tag} className="text-[9px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex border-t border-gray-100">
                <button
                  onClick={() => setDetailAttr(attr)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors border-r border-gray-100"
                >
                  <Eye className="w-3.5 h-3.5" />
                  {lang === 'ko' ? '자세히 보기' : 'View Details'}
                </button>
                <button
                  onClick={() => toggleAttraction(attr.id)}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold transition-colors',
                    isSelected
                      ? 'bg-emerald-500 text-white'
                      : 'text-emerald-600 hover:bg-emerald-50'
                  )}
                >
                  {isSelected ? (
                    <><Check className="w-3.5 h-3.5" />{lang === 'ko' ? '선택 해제' : 'Deselect'}</>
                  ) : (
                    <><MapPin className="w-3.5 h-3.5" />{lang === 'ko' ? '선택하기' : 'Select'}</>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Attraction Detail Sheet */}
      <DetailSheet isOpen={!!detailAttr} onClose={() => setDetailAttr(null)}>
        {detailAttr && (
          <AttractionDetail
            attr={detailAttr}
            lang={lang}
            typeColors={typeColors}
            isSelected={selectedAttractions.includes(detailAttr.id)}
            onToggle={() => { toggleAttraction(detailAttr.id); }}
          />
        )}
      </DetailSheet>
    </div>
  );
}

function AttractionDetail({ attr, lang, typeColors, isSelected, onToggle }) {
  const tc = typeColors[attr.type] || { bg: 'bg-gray-50', text: 'text-gray-600', icon: '📍' };
  return (
    <div>
      <div className="relative rounded-2xl overflow-hidden mb-4">
        <img src={attr.image} alt={attr.name[lang] || attr.name.en} className="w-full h-48 sm:h-56 object-cover" />
        <span className={cn('absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full', tc.bg, tc.text)}>
          {tc.icon} {attr.type}
        </span>
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-1">{attr.name[lang] || attr.name.en}</h3>

      <div className="flex items-center gap-2 mb-3">
        <StarRating rating={attr.rating} size="md" />
        <span className="text-xs text-gray-300">|</span>
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-xs text-gray-500">{attr.duration}</span>
        </div>
        <span className="text-xs text-gray-300">|</span>
        <span className="text-xs text-gray-500">{attr.location.city}, {attr.location.district}</span>
      </div>

      <div className="inline-flex items-center px-2.5 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full mb-3">
        {attr.highlight}
      </div>

      <p className="text-sm text-gray-600 leading-relaxed mb-4">
        {attr.description[lang] || attr.description.en}
      </p>

      {/* Tags */}
      <div className="mb-5">
        <h4 className="text-xs font-bold text-gray-700 mb-2">{lang === 'ko' ? '태그' : 'Tags'}</h4>
        <div className="flex flex-wrap gap-1.5">
          {attr.tags.map(tag => (
            <span key={tag} className="text-[11px] text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full font-medium">{tag}</span>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="grid grid-cols-2 gap-2 mb-5">
        <div className="bg-gray-50 rounded-xl p-3">
          <span className="text-[10px] text-gray-400 block mb-0.5">{lang === 'ko' ? '소요 시간' : 'Duration'}</span>
          <span className="text-xs font-bold text-gray-700">{attr.duration}</span>
        </div>
        <div className="bg-gray-50 rounded-xl p-3">
          <span className="text-[10px] text-gray-400 block mb-0.5">{lang === 'ko' ? '유형' : 'Type'}</span>
          <span className="text-xs font-bold text-gray-700">{tc.icon} {attr.type}</span>
        </div>
      </div>

      <button
        onClick={onToggle}
        className={cn(
          'w-full py-3 rounded-xl text-sm font-bold transition-all',
          isSelected
            ? 'bg-emerald-100 text-emerald-600'
            : 'bg-emerald-500 text-white hover:bg-emerald-600 active:scale-[0.98]'
        )}
      >
        {isSelected
          ? (lang === 'ko' ? '선택 해제하기' : 'Deselect')
          : (lang === 'ko' ? '이 관광지 선택하기' : 'Select This Attraction')}
      </button>
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
          {hospital && <SummaryRow emoji="🏥" label={lang === 'ko' ? '병원' : 'Hospital'} value={hospital.name} />}
          {selectedCategory && <SummaryRow emoji={getCategoryEmoji(selectedCategory)} label={lang === 'ko' ? '시술' : 'Treatment'} value={selectedCategory} />}
          {acc && <SummaryRow emoji="🏨" label={lang === 'ko' ? '숙소' : 'Stay'} value={acc.name[lang] || acc.name.en} />}
          {selectedRestaurants.length > 0 && <SummaryRow emoji="🍽️" label={lang === 'ko' ? '맛집' : 'Dining'} value={`${selectedRestaurants.length}${lang === 'ko' ? '곳' : ' places'}`} />}
          {selectedAttractions.length > 0 && <SummaryRow emoji="🗺️" label={lang === 'ko' ? '관광' : 'Tour'} value={`${selectedAttractions.length}${lang === 'ko' ? '곳' : ' places'}`} />}
        </div>
      </div>

      {/* Contact Form */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3">
          {lang === 'ko' ? '상담 신청 정보' : 'Contact Information'}
        </h3>
        <div className="space-y-3">
          <FormField icon={User} label={lang === 'ko' ? '이름' : 'Name'} value={contactInfo.name} onChange={v => setContactInfo({ name: v })} placeholder={lang === 'ko' ? '이름을 입력해주세요' : 'Enter your name'} required />
          <FormField icon={Mail} label={lang === 'ko' ? '이메일' : 'Email'} type="email" value={contactInfo.email} onChange={v => setContactInfo({ email: v })} placeholder={lang === 'ko' ? '이메일을 입력해주세요' : 'Enter your email'} required />
          <FormField icon={Phone} label={lang === 'ko' ? '전화번호' : 'Phone'} type="tel" value={contactInfo.phone} onChange={v => setContactInfo({ phone: v })} placeholder={lang === 'ko' ? '전화번호를 입력해주세요' : 'Enter your phone'} required />
          <FormField icon={Globe} label={lang === 'ko' ? '국가' : 'Country'} value={contactInfo.country} onChange={v => setContactInfo({ country: v })} placeholder={lang === 'ko' ? '국가를 입력해주세요' : 'Enter your country'} />
          <FormField icon={Calendar} label={lang === 'ko' ? '희망 방문일' : 'Preferred Date'} type="date" value={contactInfo.preferredDate} onChange={v => setContactInfo({ preferredDate: v })} />
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
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 text-left">
            <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
              <Phone className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <span className="text-xs font-bold text-gray-900">{lang === 'ko' ? '전화 상담' : 'Phone Consultation'}</span>
              <span className="text-[11px] text-gray-400 block">{lang === 'ko' ? '24시간 이내 연락' : 'Within 24 hours'}</span>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 text-left">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <span className="text-xs font-bold text-gray-900">{lang === 'ko' ? '맞춤 플랜 이메일' : 'Custom Plan Email'}</span>
              <span className="text-[11px] text-gray-400 block">{lang === 'ko' ? '상세 일정 & 견적서' : 'Detailed itinerary & quote'}</span>
            </div>
          </motion.div>
        </div>

        <button onClick={onReset} className="mt-8 flex items-center justify-center gap-2 w-full py-3 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors">
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
    beauty: '💄', eye: '👁️', dental: '🦷', plastic: '✨',
    checkup: '🩺', stemcell: '🧬', wellness: '🌿', vip: '👑',
  };
  return map[id] || '🏥';
}
