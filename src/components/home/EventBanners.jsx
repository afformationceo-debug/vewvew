import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const banners = [
  {
    id: 'welcome',
    title: 'First Visit? $100 OFF',
    subtitle: 'Code: WELCOME100',
    gradient: 'from-primary-600 to-violet-500',
    icon: '🎉',
    to: '/packages',
  },
  {
    id: 'spring',
    title: 'Spring Beauty Fest',
    subtitle: 'Up to 50% off',
    gradient: 'from-rose-500 to-orange-400',
    icon: '🌸',
    to: '/events',
  },
  {
    id: 'referral',
    title: 'Refer & Get 15%',
    subtitle: 'Both you & friend save',
    gradient: 'from-emerald-500 to-teal-500',
    icon: '🎁',
    to: '/referral',
  },
  {
    id: 'ai',
    title: 'AI Picks for You',
    subtitle: 'Personalized recs',
    gradient: 'from-indigo-600 to-pink-500',
    icon: '✨',
    to: '/ai-chat',
  },
];

export default function EventBanners() {
  return (
    <div>
      <div className="flex overflow-x-auto gap-3 scrollbar-hide pb-1">
        {banners.map((banner) => (
          <Link
            key={banner.id}
            to={banner.to}
            className="flex-shrink-0 w-[220px] h-[120px] rounded-xl overflow-hidden relative group"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${banner.gradient}`} />
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-white/10 rounded-full" />
            </div>
            <div className="relative h-full flex flex-col justify-between p-4">
              <div>
                <span className="text-lg mb-1 block">{banner.icon}</span>
                <h3 className="text-sm font-bold text-white leading-tight">{banner.title}</h3>
                <p className="text-[10px] text-white/70 mt-0.5">{banner.subtitle}</p>
              </div>
              <div className="inline-flex items-center gap-1 text-white/80 text-[10px] font-medium group-hover:gap-2 transition-all">
                View
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
