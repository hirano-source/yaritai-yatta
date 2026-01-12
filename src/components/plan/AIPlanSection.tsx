'use client';

import { Sparkles, ChevronDown, Bookmark, MessageCircle } from 'lucide-react';
import { AIPlanProposal } from '@/types';

interface AIPlanSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  keptProposals: AIPlanProposal[];
  onGenerateClick: () => void;
  onConvertToPlan: (proposal: AIPlanProposal) => void;
  onAdjust: (proposal: AIPlanProposal) => void;
  onRemoveKept: (proposalId: string) => void;
}

export default function AIPlanSection({
  isOpen,
  onToggle,
  keptProposals,
  onGenerateClick,
  onConvertToPlan,
  onAdjust,
  onRemoveKept,
}: AIPlanSectionProps) {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Sparkles size={20} className="text-white" />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-gray-800 text-sm">AIからの提案</h3>
            <p className="text-xs text-gray-500">キープ中: {keptProposals.length}件</p>
          </div>
        </div>
        <ChevronDown size={20} className={`text-purple-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="px-4 pb-4 space-y-3">
          <button
            onClick={onGenerateClick}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 shadow-lg hover:opacity-90 transition-opacity"
          >
            <Sparkles size={16} />
            <span>AIにプランを提案してもらう</span>
          </button>

          {keptProposals.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-gray-500 font-bold">キープ中のプラン</p>
              {keptProposals.map((proposal) => (
                <div
                  key={proposal.id}
                  className="bg-white rounded-xl p-3 shadow-sm border border-purple-100"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Bookmark size={12} className="text-purple-500 fill-purple-500" />
                        <span className="text-[10px] text-gray-400">{proposal.estimatedBudget}</span>
                      </div>
                      <h4 className="font-bold text-gray-800 text-sm">{proposal.title}</h4>
                      <p className="text-[10px] text-gray-500 mt-0.5">{proposal.description}</p>
                    </div>
                    <div className="flex flex-col space-y-1 ml-2">
                      <button
                        onClick={() => onConvertToPlan(proposal)}
                        className="bg-orange-500 text-white text-[10px] px-2 py-1 rounded font-bold"
                      >
                        これで！
                      </button>
                      <button
                        onClick={() => onAdjust(proposal)}
                        className="bg-purple-100 text-purple-600 text-[10px] px-2 py-1 rounded font-bold flex items-center justify-center space-x-0.5"
                      >
                        <MessageCircle size={10} />
                        <span>調整</span>
                      </button>
                      <button
                        onClick={() => onRemoveKept(proposal.id)}
                        className="text-gray-400 text-[10px] px-2 py-1"
                      >
                        解除
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {keptProposals.length === 0 && (
            <p className="text-xs text-gray-400 text-center py-2">
              まだキープしたプランはありません
            </p>
          )}
        </div>
      )}
    </div>
  );
}
