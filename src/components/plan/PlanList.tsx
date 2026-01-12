'use client';

import { Calendar, ChevronRight } from 'lucide-react';
import { PlanItem } from '@/types';

interface PlanListProps {
  plans: PlanItem[];
  onSelectPlan: (planId: string) => void;
}

export default function PlanList({ plans, onSelectPlan }: PlanListProps) {
  const planningPlans = plans.filter(p => p.status === 'planning');
  const confirmedPlans = plans.filter(p => p.status === 'confirmed');

  if (plans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-gray-400">
        <Calendar size={36} className="mb-3 text-gray-300" />
        <p className="text-sm">まだ予定がありません</p>
        <p className="text-xs mt-1">上のAI提案から追加してみましょう</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {planningPlans.length > 0 && (
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-0.5 rounded">
              調整中
            </span>
            <span className="text-xs text-gray-500">{planningPlans.length}件</span>
          </div>
          <div className="space-y-2">
            {planningPlans.map((p) => (
              <button
                key={p.id}
                onClick={() => onSelectPlan(p.id)}
                className="w-full bg-white rounded-xl p-4 shadow-sm border border-yellow-200 text-left hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-800">{p.title}</h3>
                    <p className="text-xs text-gray-500 flex items-center mt-1">
                      <Calendar size={12} className="mr-1" />
                      {p.dateStart}
                    </p>
                  </div>
                  <ChevronRight size={20} className="text-gray-400" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {confirmedPlans.length > 0 && (
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded">
              確定済み
            </span>
            <span className="text-xs text-gray-500">{confirmedPlans.length}件</span>
          </div>
          <div className="space-y-2">
            {confirmedPlans.map((p) => (
              <button
                key={p.id}
                onClick={() => onSelectPlan(p.id)}
                className="w-full bg-white rounded-xl p-4 shadow-sm border border-green-200 text-left hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-800">{p.title}</h3>
                    <p className="text-xs text-gray-500 flex items-center mt-1">
                      <Calendar size={12} className="mr-1" />
                      {p.dateStart}
                    </p>
                  </div>
                  <ChevronRight size={20} className="text-gray-400" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
