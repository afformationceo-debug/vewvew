import { NavLink } from 'react-router-dom';
import { Home, Search, Heart, User, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useAIStore } from '../../store/useAIStore';
import { cn } from '../../utils/cn';

const tabs = [
  { key: 'home', path: '/', icon: Home },
  { key: 'search', path: '/search', icon: Search },
  { key: 'wishlist', path: '/wishlist', icon: Heart },
  { key: 'mypage', path: '/mypage', icon: User },
  { key: 'ai', path: null, icon: Sparkles },
];

export default function MobileTabBar() {
  const { t } = useTranslation();
  const wishCount = useWishlistStore(s => s.getCount());
  const toggleAI = useAIStore(s => s.toggleAI);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map(tab => {
          if (tab.key === 'ai') {
            return (
              <button
                key={tab.key}
                onClick={toggleAI}
                className="flex flex-col items-center justify-center gap-0.5 w-16 py-1 text-violet-500 transition-colors relative"
              >
                <div className="relative">
                  <tab.icon className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
                </div>
                <span className="text-[10px] font-medium">{t(`nav.${tab.key}`, 'AI')}</span>
              </button>
            );
          }
          return (
            <NavLink
              key={tab.key}
              to={tab.path}
              end={tab.path === '/'}
              className={({ isActive }) => cn(
                'flex flex-col items-center justify-center gap-0.5 w-16 py-1 transition-colors relative',
                isActive ? 'text-primary-600' : 'text-gray-400 hover:text-gray-600'
              )}
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <tab.icon className={cn('w-5 h-5', isActive && 'stroke-[2.5]')} />
                    {tab.key === 'wishlist' && wishCount > 0 && (
                      <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                        {wishCount}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-medium">{t(`nav.${tab.key}`)}</span>
                  {isActive && (
                    <div className="absolute -top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary-600 rounded-full" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
