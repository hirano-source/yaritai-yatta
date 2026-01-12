'use client';

import { Calendar, Share2, Check, ArrowLeft } from 'lucide-react';
import { PlanItem } from '@/types';
import { getIconForItem } from './icons';

interface PlanDetailModalProps {
  plan: PlanItem;
  onClose: () => void;
  onMenuClick: () => void;
  onFixClick: () => void;
}

export default function PlanDetailModal({
  plan,
  onClose,
  onMenuClick,
  onFixClick,
}: PlanDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col max-w-md mx-auto">
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-orange-500">
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-white" />
        </button>
        <h3 className="text-white font-bold">予定詳細</h3>
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-white/20 rounded-lg"
        >
          <span className="text-white text-lg">...</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2 mb-2">
            {plan.status === 'planning' && (
              <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-0.5 rounded">
                調整中
              </span>
            )}
            {plan.status === 'confirmed' && (
              <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded">
                確定済み
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-gray-800">{plan.title}</h2>
          <p className="text-sm text-gray-500 flex items-center mt-1">
            <Calendar size={14} className="mr-1" />
            {plan.dateStart}
            {plan.dateEnd && ` - ${plan.dateEnd}`}
          </p>

          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-[10px] text-gray-400 mb-2">参加メンバー</p>
            <div className="flex items-center space-x-2">
              {plan.members.map((m, i) => (
                <div key={i} className="flex items-center space-x-1">
                  <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-[10px] text-orange-600 font-bold">
                    {m.charAt(0)}
                  </div>
                  <Check size={12} className="text-green-500" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {plan.status === 'planning' && (
          <button
            onClick={onFixClick}
            className="w-full bg-orange-500 text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 shadow-lg hover:bg-orange-600 transition-colors"
          >
            <Check size={18} />
            <span>この予定を確定する</span>
          </button>
        )}

        {plan.itinerary && plan.itinerary.length > 0 && (
          <div>
            <div className="flex items-center mb-4">
              <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                Day 1
              </span>
              <span className="ml-2 text-sm font-bold text-gray-600">
                {plan.dateStart}
              </span>
            </div>

            <div className="border-l-2 border-orange-200 ml-2 space-y-6 pb-4">
              {plan.itinerary.map((item, i) => (
                <div key={i} className="relative pl-6 group">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-orange-400 z-10"></div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-orange-500 mb-0.5">
                      {item.time}
                    </span>
                    <h4 className="font-bold text-gray-800 text-sm">
                      {item.title}
                    </h4>
                    {item.description && (
                      <p className="text-xs text-gray-500 mt-1">
                        {item.description}
                      </p>
                    )}
                    <div className="mt-2 text-orange-300">
                      {getIconForItem(i)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(!plan.itinerary || plan.itinerary.length === 0) && (
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <p className="text-sm text-gray-500 mb-3">まだしおりがありません</p>
            <button className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-bold">
              AIにしおりを作ってもらう
            </button>
          </div>
        )}

        <button className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 shadow-lg">
          <Share2 size={16} />
          <span>LINEでしおりを共有</span>
        </button>
      </div>
    </div>
  );
}
