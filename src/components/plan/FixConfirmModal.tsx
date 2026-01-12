'use client';

import { CalendarDays } from 'lucide-react';

interface FixConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  syncToGoogle: boolean;
  onSyncToggle: () => void;
}

export default function FixConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  syncToGoogle,
  onSyncToggle,
}: FixConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 animate-scale-in">
        <h3 className="text-lg font-bold text-gray-800 mb-2">予定を確定する</h3>
        <p className="text-sm text-gray-500 mb-4">
          確定するとメンバーに通知されます
        </p>

        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <button
            onClick={onSyncToggle}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <CalendarDays size={20} className="text-blue-500" />
              <div className="text-left">
                <p className="text-sm font-bold text-gray-800">Googleカレンダーに追加</p>
                <p className="text-[10px] text-gray-500">予定を自動で同期します</p>
              </div>
            </div>
            <div className={`w-10 h-6 rounded-full transition-colors ${syncToGoogle ? 'bg-orange-500' : 'bg-gray-300'}`}>
              <div className={`w-5 h-5 bg-white rounded-full shadow-sm mt-0.5 transition-transform ${syncToGoogle ? 'translate-x-4.5 ml-4' : 'ml-0.5'}`} />
            </div>
          </button>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm"
          >
            キャンセル
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-orange-500 text-white font-bold text-sm"
          >
            確定する
          </button>
        </div>
      </div>
    </div>
  );
}
