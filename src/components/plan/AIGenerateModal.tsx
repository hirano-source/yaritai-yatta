'use client';

import { Sparkles, X, RefreshCw, Bookmark, MessageCircle } from 'lucide-react';
import { AIPlanProposal } from '@/types';

type DayType = '1DAY' | '2DAY' | '週末';

interface AIGenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDayType: DayType;
  onDayTypeChange: (type: DayType) => void;
  proposals: AIPlanProposal[];
  onRegenerate: () => void;
  onKeep: (proposal: AIPlanProposal) => void;
  onAdjust: (proposal: AIPlanProposal) => void;
}

export default function AIGenerateModal({
  isOpen,
  onClose,
  selectedDayType,
  onDayTypeChange,
  proposals,
  onRegenerate,
  onKeep,
  onAdjust,
}: AIGenerateModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
      <div className="bg-white rounded-t-2xl w-full max-w-md animate-slide-up max-h-[85vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Sparkles size={20} className="text-purple-500" />
              <h3 className="text-lg font-bold text-gray-800">AIプラン提案</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>

          <div className="flex space-x-2">
            {(['1DAY', '2DAY', '週末'] as DayType[]).map((type) => (
              <button
                key={type}
                onClick={() => onDayTypeChange(type)}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${
                  selectedDayType === type
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {proposals.length > 0 ? (
            <>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">{proposals.length}件のプラン</p>
                <button
                  onClick={onRegenerate}
                  className="flex items-center space-x-1 text-purple-500 text-xs font-bold"
                >
                  <RefreshCw size={12} />
                  <span>再生成</span>
                </button>
              </div>

              {proposals.map((proposal, index) => (
                <div
                  key={proposal.id}
                  className={`bg-white rounded-xl p-4 shadow-sm border transition-all ${
                    index === 0 ? 'border-purple-200 ring-1 ring-purple-100' : 'border-gray-100'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        {index === 0 && (
                          <span className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                            おすすめ
                          </span>
                        )}
                        <span className="text-[10px] text-gray-400">
                          {proposal.estimatedBudget}
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-800 text-sm mb-1">
                        {proposal.title}
                      </h4>
                      <p className="text-xs text-gray-500 mb-2">
                        {proposal.description}
                      </p>
                      <span className="text-[10px] bg-yellow-50 text-yellow-700 px-1.5 py-0.5 rounded font-medium">
                        {proposal.highlight}
                      </span>
                    </div>
                    <div className="ml-3 flex flex-col space-y-2">
                      <button
                        onClick={() => onKeep(proposal)}
                        className="bg-white border-2 border-purple-500 text-purple-500 text-xs px-3 py-2 rounded-lg font-bold hover:bg-purple-50 transition-colors flex items-center space-x-1"
                      >
                        <Bookmark size={12} />
                        <span>キープ</span>
                      </button>
                      <button
                        onClick={() => onAdjust(proposal)}
                        className="bg-purple-100 text-purple-600 text-xs px-3 py-2 rounded-lg font-bold hover:bg-purple-200 transition-colors flex items-center justify-center space-x-1"
                      >
                        <MessageCircle size={12} />
                        <span>調整</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="text-center py-8">
              <Sparkles size={32} className="text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">ストックを元にAIがプランを提案します</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-gray-100 text-gray-600 font-bold text-sm"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
