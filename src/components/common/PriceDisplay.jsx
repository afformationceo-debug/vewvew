import { cn } from '../../utils/cn';

export function formatPrice(price, currency = 'KRW') {
  const formatters = {
    KRW: (p) => `₩${p.toLocaleString()}`,
    USD: (p) => `$${(p / 1350).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
    JPY: (p) => `¥${Math.round(p * 0.11).toLocaleString()}`,
    CNY: (p) => `¥${(p / 190).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
    EUR: (p) => `€${(p / 1450).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
  };
  return (formatters[currency] || formatters.KRW)(price);
}

export default function PriceDisplay({ original, sale, discountPercent, currency = 'KRW', size = 'md', className }) {
  const hasDiscount = sale && sale < original;
  const discount = discountPercent || (hasDiscount ? Math.round((1 - sale / original) * 100) : 0);

  const textSizes = {
    sm: { price: 'text-base', original: 'text-xs', badge: 'text-xs' },
    md: { price: 'text-xl', original: 'text-sm', badge: 'text-sm' },
    lg: { price: 'text-2xl', original: 'text-base', badge: 'text-base' },
  };
  const s = textSizes[size] || textSizes.md;

  return (
    <div className={cn('flex flex-wrap items-baseline gap-2', className)}>
      {hasDiscount && (
        <span className={cn('font-bold text-red-500', s.badge)}>{discount}%</span>
      )}
      <span className={cn('font-bold text-gray-900', s.price)}>
        {formatPrice(hasDiscount ? sale : original, currency)}
      </span>
      {hasDiscount && (
        <span className={cn('text-gray-400 line-through', s.original)}>
          {formatPrice(original, currency)}
        </span>
      )}
    </div>
  );
}
