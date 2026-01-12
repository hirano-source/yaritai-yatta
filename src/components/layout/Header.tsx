'use client';

import { useState } from 'react';
import { Bell, ChevronDown, Settings } from 'lucide-react';
import { Group } from '@/types';
import { MOCK_GROUPS } from '@/lib/mock-data';

interface HeaderProps {
  title: string;
  showGroupSelector?: boolean;
  currentGroup: Group;
  onGroupChange?: (group: Group) => void;
  onSettingsClick?: () => void;
}

export default function Header({
  title,
  showGroupSelector = true,
  currentGroup,
  onGroupChange,
  onSettingsClick
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const currentGroupInfo = MOCK_GROUPS.find(g => g.id === currentGroup);

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-orange-100 px-4 py-3 flex justify-between items-center h-16">
      <h1 className="text-xl font-bold text-gray-800">{title}</h1>
      <div className="flex items-center space-x-3">
        {showGroupSelector && (
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full text-xs font-bold border border-orange-200 flex items-center space-x-1"
            >
              <span>{currentGroupInfo?.icon}</span>
              <span>{currentGroupInfo?.name}</span>
              <ChevronDown size={14} />
            </button>
            {isOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20 min-w-[140px]">
                  {MOCK_GROUPS.map((group) => (
                    <button
                      key={group.id}
                      onClick={() => {
                        onGroupChange?.(group.id);
                        setIsOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm flex items-center space-x-2 ${
                        currentGroup === group.id
                          ? 'bg-orange-50 text-orange-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>{group.icon}</span>
                      <span>{group.name}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
        <Bell size={20} className="text-gray-400" />
        <button onClick={onSettingsClick} className="p-1">
          <Settings size={20} className="text-gray-400" />
        </button>
      </div>
    </header>
  );
}
