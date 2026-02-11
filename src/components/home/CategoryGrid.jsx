import { Link } from 'react-router-dom';
import { categories } from '../../data/categories';
import { cn } from '../../utils/cn';

const emojiMap = {
  beauty: '🌸',
  eye: '👁️',
  dental: '🦷',
  plastic: '✨',
  checkup: '🩺',
  stemcell: '🧬',
  wellness: '🍃',
  vip: '👑',
};

const bgColorMap = {
  beauty: 'bg-rose-50',
  eye: 'bg-sky-50',
  dental: 'bg-emerald-50',
  plastic: 'bg-violet-50',
  checkup: 'bg-blue-50',
  stemcell: 'bg-amber-50',
  wellness: 'bg-teal-50',
  vip: 'bg-yellow-50',
};

export default function CategoryGrid() {
  // Prepend AI Recommend as a virtual category
  const aiItem = { id: 'ai-recommend', name: { en: 'AI Pick' }, badge: null };
  const allItems = [aiItem, ...categories];

  return (
    <div className="grid grid-cols-5 gap-y-4 gap-x-2 md:gap-x-4">
      {allItems.slice(0, 10).map((cat) => {
        const isAI = cat.id === 'ai-recommend';
        const emoji = isAI ? '✨' : (emojiMap[cat.id] || '📦');
        const bgColor = isAI ? 'bg-violet-50' : (bgColorMap[cat.id] || 'bg-gray-50');

        return (
          <Link
            key={cat.id}
            to={isAI ? '/packages?sort=ai-recommended' : `/packages?category=${cat.id}`}
            className="group flex flex-col items-center gap-1 relative"
          >
            {/* Badge */}
            {cat.badge && (
              <span className="absolute -top-1 right-0 md:right-1 text-[8px] font-bold bg-red-500 text-white px-1 rounded-full leading-tight">
                {cat.badge}
              </span>
            )}

            {/* Icon circle */}
            <div className={cn(
              'w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110',
              bgColor
            )}>
              {emoji}
            </div>

            {/* Label */}
            <span className="text-[11px] text-gray-600 text-center leading-tight line-clamp-1 group-hover:text-primary-600 transition-colors">
              {cat.name.en}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
