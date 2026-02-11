import { Star } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function Rating({ stars = 0, count, size = 'sm', showCount = true, className }) {
  const fullStars = Math.floor(stars);
  const hasHalf = stars - fullStars >= 0.5;
  const starSize = size === 'xs' ? 'w-3 h-3' : size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const textSize = size === 'xs' ? 'text-xs' : size === 'sm' ? 'text-sm' : 'text-base';

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              starSize,
              i < fullStars
                ? 'fill-amber-400 text-amber-400'
                : i === fullStars && hasHalf
                ? 'fill-amber-400/50 text-amber-400'
                : 'fill-gray-200 text-gray-200'
            )}
          />
        ))}
      </div>
      <span className={cn('font-semibold text-gray-800', textSize)}>{stars}</span>
      {showCount && count !== undefined && (
        <span className={cn('text-gray-400', textSize)}>({count.toLocaleString()})</span>
      )}
    </div>
  );
}
