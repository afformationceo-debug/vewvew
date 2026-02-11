import { cn } from '../../utils/cn';

export default function Skeleton({ className, variant = 'rect' }) {
  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200 rounded-lg',
        variant === 'circle' && 'rounded-full',
        variant === 'text' && 'h-4 rounded',
        className
      )}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
      <Skeleton className="w-full h-48" />
      <div className="p-4 space-y-3">
        <Skeleton variant="text" className="w-3/4 h-4" />
        <Skeleton variant="text" className="w-1/2 h-3" />
        <Skeleton variant="text" className="w-1/3 h-3" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton variant="text" className="w-1/4 h-5" />
          <Skeleton className="w-20 h-8 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
