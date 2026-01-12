'use client';

import { CalendarDays, X, Trash2, ChevronRight } from 'lucide-react';

interface PlanMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PlanMenuModal({ isOpen, onClose }: PlanMenuModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
      <div className="bg-white rounded-t-2xl w-full max-w-md animate-slide-up">
        <div className="p-4 space-y-1">
          <button className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
            <CalendarDays size={20} className="text-gray-600" />
            <span className="text-sm font-bold text-gray-800">日程を変更する</span>
            <ChevronRight size={16} className="text-gray-400 ml-auto" />
          </button>
          <button className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
            <X size={20} className="text-gray-600" />
            <span className="text-sm font-bold text-gray-800">参加できなくなった...</span>
            <ChevronRight size={16} className="text-gray-400 ml-auto" />
          </button>
          <button className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-red-50 transition-colors">
            <Trash2 size={20} className="text-red-500" />
            <span className="text-sm font-bold text-red-500">この予定を削除する</span>
          </button>
        </div>
        <button
          onClick={onClose}
          className="w-full py-4 text-gray-500 font-bold text-sm border-t border-gray-100"
        >
          閉じる
        </button>
      </div>
    </div>
  );
}
