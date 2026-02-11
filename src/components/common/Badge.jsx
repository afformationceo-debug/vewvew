import { cn } from '../../utils/cn';

const variants = {
  hot: 'bg-red-500 text-white',
  new: 'bg-emerald-500 text-white',
  sale: 'bg-orange-500 text-white',
  best: 'bg-primary-600 text-white',
  limited: 'bg-amber-500 text-white',
  vip: 'bg-gradient-to-r from-amber-400 to-amber-600 text-white',
  default: 'bg-gray-100 text-gray-700',
};

export default function Badge({ variant = 'default', children, className, size = 'sm' }) {
  return (
    <span className={cn(
      'inline-flex items-center font-bold uppercase tracking-wide rounded-full',
      size === 'xs' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs',
      variants[variant] || variants.default,
      className
    )}>
      {children}
    </span>
  );
}
