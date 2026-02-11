import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ChevronRight,
  ChevronLeft,
  Calendar,
  Sparkles,
  Users,
  Plus,
  Minus,
  Check,
  CreditCard,
  Shield,
  CheckCircle2,
  Copy,
  ArrowRight,
} from 'lucide-react';
import { cn } from '../utils/cn';
import { packages } from '../data/packages';
import { formatPrice } from '../components/common/PriceDisplay';
import Button from '../components/common/Button';
import { useUIStore } from '../store/useUIStore';

const personalInfoSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(8, 'Valid phone number is required'),
  nationality: z.string().min(2, 'Nationality is required'),
  passportNumber: z.string().min(5, 'Passport number is required'),
  medicalNotes: z.string().optional(),
  consentTerms: z.literal(true, { errorMap: () => ({ message: 'You must agree to the terms' }) }),
  consentMedical: z.literal(true, { errorMap: () => ({ message: 'You must provide medical consent' }) }),
});

const STEPS = [
  { id: 1, label: 'Date & Travelers' },
  { id: 2, label: 'Options' },
  { id: 3, label: 'Information' },
  { id: 4, label: 'Payment' },
  { id: 5, label: 'Confirmation' },
];

const ADDITIONAL_OPTIONS = [
  { id: 'opt-1', name: 'VIP Airport Transfer (Luxury Sedan)', price: 150000 },
  { id: 'opt-2', name: 'Extra Night Stay (5-star Hotel)', price: 280000 },
  { id: 'opt-3', name: 'Professional Photo Shoot', price: 120000 },
  { id: 'opt-4', name: 'Korean Language Pocket Guide', price: 15000 },
  { id: 'opt-5', name: 'Travel Insurance Premium', price: 45000 },
  { id: 'opt-6', name: 'Post-treatment Follow-up (Online)', price: 80000 },
];

const PAYMENT_METHODS = [
  { id: 'credit-card', label: 'Credit Card', icon: CreditCard, desc: 'Visa, Mastercard, Amex' },
  { id: 'paypal', label: 'PayPal', icon: Shield, desc: 'Pay securely with PayPal' },
  { id: 'alipay', label: 'Alipay', icon: Shield, desc: 'Pay with Alipay' },
];

export default function BookingPage() {
  const { t } = useTranslation();
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToast } = useUIStore();

  const pkg = packages.find((p) => p.slug === slug);

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [travelers, setTravelers] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [bookingNumber, setBookingNumber] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      nationality: '',
      passportNumber: '',
      medicalNotes: '',
      consentTerms: false,
      consentMedical: false,
    },
  });

  const basePrice = pkg ? (pkg.pricing.salePrice || pkg.pricing.originalPrice) : 0;
  const optionsTotal = selectedOptions.reduce((sum, optId) => {
    const opt = ADDITIONAL_OPTIONS.find((o) => o.id === optId);
    return sum + (opt ? opt.price : 0);
  }, 0);
  const subtotal = basePrice * travelers + optionsTotal;

  const toggleOption = (optId) => {
    setSelectedOptions((prev) =>
      prev.includes(optId) ? prev.filter((id) => id !== optId) : [...prev, optId]
    );
  };

  const canGoNext = useMemo(() => {
    switch (currentStep) {
      case 1:
        return selectedDate && travelers >= 1;
      case 2:
        return true; // Options are optional
      case 3:
        return true; // Will validate with react-hook-form
      case 4:
        return paymentMethod;
      default:
        return false;
    }
  }, [currentStep, selectedDate, travelers, paymentMethod]);

  const handleNext = async () => {
    if (currentStep === 3) {
      const valid = await trigger();
      if (!valid) return;
    }
    if (currentStep === 4) {
      // Generate booking number and complete
      const num = 'KMT-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
      setBookingNumber(num);
      setCurrentStep(5);
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  if (!pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('packageNotFound', 'Package not found')}</h2>
          <Button onClick={() => navigate('/packages')}>{t('browsePackages', 'Browse Packages')}</Button>
        </div>
      </div>
    );
  }

  // Min date = today
  const today = new Date().toISOString().split('T')[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm mb-4">
            <Link to={`/package/${pkg.slug}`} className="text-gray-500 hover:text-primary-600">{pkg.title.en}</Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium">{t('booking', 'Booking')}</span>
          </nav>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 font-heading">{t('bookYourPackage', 'Book Your Package')}</h1>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-30">
        <div className="max-w-4xl mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            {STEPS.map((step, idx) => (
              <div key={step.id} className="flex items-center flex-1 last:flex-initial">
                <div className="flex items-center gap-1.5 md:gap-2">
                  <div
                    className={cn(
                      'w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-semibold transition-colors',
                      currentStep > step.id
                        ? 'bg-green-500 text-white'
                        : currentStep === step.id
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    )}
                  >
                    {currentStep > step.id ? <Check className="w-3.5 h-3.5 md:w-4 md:h-4" /> : step.id}
                  </div>
                  <span
                    className={cn(
                      'text-xs md:text-sm font-medium hidden sm:block',
                      currentStep >= step.id ? 'text-gray-900' : 'text-gray-400'
                    )}
                  >
                    {step.label}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div
                    className={cn(
                      'flex-1 h-0.5 mx-1.5 md:mx-3',
                      currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Date & Travelers */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-2xl p-6 shadow-sm"
                >
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary-600" />
                    {t('selectDateTravelers', 'Select Date & Travelers')}
                  </h2>

                  {/* AI Schedule Tip — compact inline chip */}
                  <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 rounded-full">
                    <Sparkles className="w-3 h-3 text-violet-500" />
                    <span className="text-[11px] font-medium text-violet-700">AI Tip: Spring (Mar-May) is ideal for recovery</span>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('preferredDate', 'Preferred Start Date')}
                      </label>
                      <input
                        type="date"
                        min={today}
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('numberOfTravelers', 'Number of Travelers')}
                      </label>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setTravelers((p) => Math.max(1, p - 1))}
                          className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50"
                          disabled={travelers <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-gray-400" />
                          <span className="text-xl font-semibold text-gray-900 w-8 text-center">{travelers}</span>
                        </div>
                        <button
                          onClick={() => setTravelers((p) => Math.min(10, p + 1))}
                          className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Package summary */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-start gap-4">
                        <img src={pkg.images[0]} alt="" className="w-20 h-20 rounded-xl object-cover" />
                        <div>
                          <h3 className="font-medium text-gray-900 text-sm">{pkg.title.en}</h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {pkg.duration.days}D{pkg.duration.nights}N | {pkg.location.district}, {pkg.location.city}
                          </p>
                          <p className="text-sm font-semibold text-primary-600 mt-1">
                            {formatPrice(basePrice)} / {t('person', 'person')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Additional Options */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-2xl p-6 shadow-sm"
                >
                  <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-primary-600" />
                    {t('additionalOptions', 'Additional Options')}
                  </h2>
                  <p className="text-sm text-gray-500 mb-6">{t('optionalEnhancements', 'Enhance your experience with optional add-ons')}</p>

                  <div className="space-y-3">
                    {ADDITIONAL_OPTIONS.map((opt) => {
                      const isSelected = selectedOptions.includes(opt.id);
                      return (
                        <motion.label
                          key={opt.id}
                          whileTap={{ scale: 0.98 }}
                          className={cn(
                            'flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all',
                            isSelected
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300'
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleOption(opt.id)}
                            className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <div className="flex-1">
                            <span className="font-medium text-gray-900 text-sm">{opt.name}</span>
                          </div>
                          <span className="font-semibold text-gray-900 text-sm">+{formatPrice(opt.price)}</span>
                        </motion.label>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Personal Information */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-2xl p-6 shadow-sm"
                >
                  <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary-600" />
                    {t('personalInfo', 'Personal Information')}
                  </h2>

                  <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('firstName', 'First Name')} *</label>
                        <input
                          {...register('firstName')}
                          className={cn(
                            'w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500',
                            errors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-200'
                          )}
                          placeholder="John"
                        />
                        {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('lastName', 'Last Name')} *</label>
                        <input
                          {...register('lastName')}
                          className={cn(
                            'w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500',
                            errors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-200'
                          )}
                          placeholder="Doe"
                        />
                        {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('email', 'Email')} *</label>
                      <input
                        {...register('email')}
                        type="email"
                        className={cn(
                          'w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500',
                          errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'
                        )}
                        placeholder="john@example.com"
                      />
                      {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('phone', 'Phone')} *</label>
                        <input
                          {...register('phone')}
                          type="tel"
                          className={cn(
                            'w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500',
                            errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200'
                          )}
                          placeholder="+1 234 567 8900"
                        />
                        {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('nationality', 'Nationality')} *</label>
                        <input
                          {...register('nationality')}
                          className={cn(
                            'w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500',
                            errors.nationality ? 'border-red-300 bg-red-50' : 'border-gray-200'
                          )}
                          placeholder="United States"
                        />
                        {errors.nationality && <p className="text-xs text-red-500 mt-1">{errors.nationality.message}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('passportNumber', 'Passport Number')} *</label>
                      <input
                        {...register('passportNumber')}
                        className={cn(
                          'w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500',
                          errors.passportNumber ? 'border-red-300 bg-red-50' : 'border-gray-200'
                        )}
                        placeholder="A12345678"
                      />
                      {errors.passportNumber && <p className="text-xs text-red-500 mt-1">{errors.passportNumber.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('medicalNotes', 'Medical Notes')} ({t('optional', 'optional')})</label>
                      <textarea
                        {...register('medicalNotes')}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                        placeholder={t('medicalNotesPlaceholder', 'Any allergies, medical conditions, or special requirements...')}
                      />
                    </div>

                    <div className="space-y-3 pt-4 border-t border-gray-100">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          {...register('consentTerms')}
                          className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 mt-1"
                        />
                        <span className="text-sm text-gray-600">
                          {t('consentTerms', 'I agree to the Terms of Service and Privacy Policy')} *
                        </span>
                      </label>
                      {errors.consentTerms && <p className="text-xs text-red-500 ml-7">{errors.consentTerms.message}</p>}

                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          {...register('consentMedical')}
                          className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 mt-1"
                        />
                        <span className="text-sm text-gray-600">
                          {t('consentMedical', 'I consent to sharing my medical information with the treating hospital')} *
                        </span>
                      </label>
                      {errors.consentMedical && <p className="text-xs text-red-500 ml-7">{errors.consentMedical.message}</p>}
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Step 4: Payment */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-2xl p-6 shadow-sm"
                >
                  <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary-600" />
                    {t('paymentMethod', 'Payment Method')}
                  </h2>

                  {/* Order Summary */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <h3 className="font-medium text-gray-900 text-sm mb-3">{t('orderSummary', 'Order Summary')}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-gray-600">
                        <span>{pkg.title.en}</span>
                        <span>{formatPrice(basePrice)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>{t('travelers', 'Travelers')}: {travelers}</span>
                        <span>x{travelers}</span>
                      </div>
                      {selectedOptions.map((optId) => {
                        const opt = ADDITIONAL_OPTIONS.find((o) => o.id === optId);
                        return opt ? (
                          <div key={optId} className="flex justify-between text-gray-600">
                            <span className="truncate pr-4">{opt.name}</span>
                            <span>{formatPrice(opt.price)}</span>
                          </div>
                        ) : null;
                      })}
                      <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold text-gray-900">
                        <span>{t('total', 'Total')}</span>
                        <span className="text-primary-600">{formatPrice(subtotal)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {PAYMENT_METHODS.map((method) => {
                      const Icon = method.icon;
                      return (
                        <motion.label
                          key={method.id}
                          whileTap={{ scale: 0.98 }}
                          className={cn(
                            'flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all',
                            paymentMethod === method.id
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300'
                          )}
                        >
                          <input
                            type="radio"
                            name="payment"
                            value={method.id}
                            checked={paymentMethod === method.id}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-5 h-5 text-primary-600 focus:ring-primary-500"
                          />
                          <Icon className="w-5 h-5 text-gray-600" />
                          <div>
                            <span className="font-medium text-gray-900 text-sm">{method.label}</span>
                            <p className="text-xs text-gray-500">{method.desc}</p>
                          </div>
                        </motion.label>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-2 mt-6 p-3 bg-green-50 rounded-xl">
                    <Shield className="w-4 h-4 text-green-600 shrink-0" />
                    <span className="text-xs text-green-700">{t('securePayment', 'Your payment information is encrypted and secure')}</span>
                  </div>
                </motion.div>
              )}

              {/* Step 5: Confirmation */}
              {currentStep === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-2xl p-8 shadow-sm text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2, stiffness: 200 }}
                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-2xl font-bold text-gray-900 mb-2"
                  >
                    {t('bookingConfirmed', 'Booking Confirmed!')}
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-gray-500 mb-6"
                  >
                    {t('bookingConfirmedDesc', 'Your booking has been successfully placed. A confirmation email has been sent.')}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-gray-50 rounded-xl p-4 mb-6 inline-block"
                  >
                    <p className="text-xs text-gray-500 mb-1">{t('bookingNumber', 'Booking Number')}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold font-mono text-primary-600">{bookingNumber}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(bookingNumber);
                          addToast({ type: 'success', message: t('copied', 'Copied!') });
                        }}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                      >
                        <Copy className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-gray-50 rounded-xl p-4 mb-8 text-left"
                  >
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">{t('package', 'Package')}</span>
                        <span className="font-medium text-gray-900">{pkg.title.en}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">{t('date', 'Date')}</span>
                        <span className="font-medium text-gray-900">{selectedDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">{t('travelers', 'Travelers')}</span>
                        <span className="font-medium text-gray-900">{travelers}</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-200 pt-2">
                        <span className="text-gray-500 font-medium">{t('totalPaid', 'Total Paid')}</span>
                        <span className="font-bold text-primary-600">{formatPrice(subtotal)}</span>
                      </div>
                    </div>
                  </motion.div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button variant="primary" onClick={() => navigate('/mypage')}>
                      {t('viewMyBookings', 'View My Bookings')}
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/')} icon={ArrowRight} iconRight>
                      {t('backToHome', 'Back to Home')}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar - Order Summary (Steps 1-4) */}
          {currentStep < 5 && (
            <div className="hidden lg:block">
              <div className="sticky top-32 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">{t('orderSummary', 'Order Summary')}</h3>
                <div className="flex items-start gap-3 mb-4 pb-4 border-b border-gray-100">
                  <img src={pkg.images[0]} alt="" className="w-16 h-16 rounded-xl object-cover" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-2">{pkg.title.en}</h4>
                    <p className="text-xs text-gray-500 mt-1">{pkg.duration.days}D{pkg.duration.nights}N</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>{t('basePrice', 'Base Price')}</span>
                    <span>{formatPrice(basePrice)}</span>
                  </div>
                  {travelers > 1 && (
                    <div className="flex justify-between text-gray-600">
                      <span>{travelers} {t('travelers', 'travelers')}</span>
                      <span>{formatPrice(basePrice * travelers)}</span>
                    </div>
                  )}
                  {optionsTotal > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>{t('addOns', 'Add-ons')}</span>
                      <span>{formatPrice(optionsTotal)}</span>
                    </div>
                  )}
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between font-semibold text-gray-900">
                  <span>{t('total', 'Total')}</span>
                  <span className="text-lg text-primary-600">{formatPrice(subtotal)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons (Steps 1-4) */}
        {currentStep < 5 && (
          <div className="max-w-4xl mx-auto mt-6 md:mt-8 mb-20 md:mb-0 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 1}
              icon={ChevronLeft}
            >
              {t('back', 'Back')}
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canGoNext}
              icon={currentStep === 4 ? Check : ChevronRight}
              iconRight
              size="lg"
            >
              {currentStep === 4 ? t('confirmAndPay', 'Confirm & Pay') : t('next', 'Next')}
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
