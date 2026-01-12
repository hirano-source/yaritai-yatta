'use client';

import { Home, Bookmark, MapPin, Calendar, BookOpen } from 'lucide-react';
import { Tab } from '@/types';

interface BottomNavProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  unreadStockCount?: number;
}

const navItems: { id: Tab; icon: React.ElementType; label: string }[] = [
  { id: 'stock', icon: Bookmark, label: '自分の' },
  { id: 'home', icon: Home, label: 'ホーム' },
  { id: 'yaritai', icon: MapPin, label: 'みんなの' },
  { id: 'plan', icon: Calendar, label: '予定' },
  { id: 'yatta', icon: BookOpen, label: 'やった' },
];

export default function BottomNav({ activeTab, setActiveTab, unreadStockCount = 0 }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 pb-safe pt-2 px-4 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const showBadge = item.id === 'yaritai' && unreadStockCount > 0;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center h-14 space-y-1 relative ${
                isActive ? 'text-orange-500' : 'text-gray-400'
              }`}
            >
              <div className="relative">
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                {showBadge && (
                  <span className="absolute -top-1 -right-2 bg-orange-500 text-white text-[9px] font-bold px-1 py-0.5 rounded-full min-w-[16px] text-center">
                    {unreadStockCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
