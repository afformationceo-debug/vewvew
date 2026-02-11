import { cn } from '../../utils/cn';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SectionHeader({ title, subtitle, emoji, viewAllLink, className }) {
  return (
    <div className={cn('flex items-center justify-between mb-3', className)}>
      <h2 className="text-lg md:text-xl font-bold text-gray-900 font-heading">
        {emoji && <span className="mr-1.5">{emoji}</span>}
        {title}
      </h2>
      {viewAllLink && (
        <Link
          to={viewAllLink}
          className="flex items-center gap-0.5 text-xs text-gray-400 hover:text-gray-600 transition-colors shrink-0"
        >
          See All
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      )}
    </div>
  );
}
