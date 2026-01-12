'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Sparkles, Bookmark, Send } from 'lucide-react';
import { AIPlanProposal } from '@/types';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  suggestion?: {
    field: string;
    before: string;
    after: string;
  };
}

interface AIChatAdjustModalProps {
  proposal: AIPlanProposal;
  onClose: () => void;
  onKeep: (proposal: AIPlanProposal) => void;
  onConvert: (proposal: AIPlanProposal) => void;
}

export default function AIChatAdjustModal({
  proposal,
  onClose,
  onKeep,
  onConvert,
}: AIChatAdjustModalProps) {
  const [adjustedProposal, setAdjustedProposal] = useState<AIPlanProposal>({ ...proposal });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `「${proposal.title}」のプランを調整しますね！\n\n現在のプラン：\n・予算：${proposal.estimatedBudget}\n・${proposal.highlight}\n\nどんな調整をしたいですか？`,
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const generateAiResponse = (userMessage: string): { content: string; suggestion?: ChatMessage['suggestion'] } => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('安く') || lowerMessage.includes('予算') || lowerMessage.includes('コスト')) {
      return {
        content: '予算を抑えたプランに変更しますね！\n\n宿のグレードを下げて、ランチを地元の人気店に変更すると...',
        suggestion: {
          field: '予算',
          before: adjustedProposal.estimatedBudget,
          after: '約3万円/人',
        }
      };
    }

    if (lowerMessage.includes('午後') || lowerMessage.includes('遅く') || lowerMessage.includes('昼から')) {
      return {
        content: '午後出発のプランに変更しますね！\n\nゆっくり出発して、夜までたっぷり楽しめるスケジュールです。',
        suggestion: {
          field: '出発時間',
          before: '10:00出発',
          after: '14:00出発',
        }
      };
    }

    if (lowerMessage.includes('子供') || lowerMessage.includes('子ども') || lowerMessage.includes('キッズ')) {
      return {
        content: 'お子様向けのアクティビティを追加しますね！\n\nキッズスペースのあるレストランと、体験型施設をプランに入れました。',
        suggestion: {
          field: 'ハイライト',
          before: adjustedProposal.highlight,
          after: 'キッズ向けアクティビティ充実',
        }
      };
    }

    if (lowerMessage.includes('1日') || lowerMessage.includes('日帰り')) {
      return {
        content: '日帰りプランに変更しますね！\n\nコンパクトに楽しめるスケジュールに調整しました。',
        suggestion: {
          field: '日程',
          before: '1泊2日',
          after: '日帰り',
        }
      };
    }

    return {
      content: '承知しました！そのご要望を反映させますね。\n\n他に調整したいポイントはありますか？',
    };
  };

  const sendMessage = () => {
    if (!chatInput.trim() || isAiTyping) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: chatInput,
    };

    setChatMessages(prev => [...prev, userMessage]);
    const inputValue = chatInput;
    setChatInput('');
    setIsAiTyping(true);

    setTimeout(() => {
      const response = generateAiResponse(inputValue);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        suggestion: response.suggestion,
      };
      setChatMessages(prev => [...prev, aiMessage]);
      setIsAiTyping(false);
    }, 1000);
  };

  const applySuggestion = (suggestion: ChatMessage['suggestion']) => {
    if (!suggestion) return;

    const updated = { ...adjustedProposal };
    if (suggestion.field === '予算') {
      updated.estimatedBudget = suggestion.after;
    } else if (suggestion.field === 'ハイライト') {
      updated.highlight = suggestion.after;
    }
    setAdjustedProposal(updated);

    const confirmMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `${suggestion.field}を「${suggestion.after}」に変更しました！\n\n他にも調整したいことがあれば教えてくださいね。`,
    };
    setChatMessages(prev => [...prev, confirmMessage]);
  };

  const handleKeep = () => {
    const newProposal = {
      ...adjustedProposal,
      id: `adjusted-${Date.now()}`,
      title: adjustedProposal.title + '（調整済み）',
    };
    onKeep(newProposal);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col max-w-md mx-auto">
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-purple-500 to-pink-500">
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-white" />
        </button>
        <h3 className="text-white font-bold">{proposal.title}</h3>
        <div className="w-10" />
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 border-b border-purple-100">
        <p className="text-xs text-purple-600 font-bold mb-2">現在のプラン</p>
        <div className="flex flex-wrap gap-2">
          <span className="bg-white text-purple-700 text-xs px-2 py-1 rounded-full shadow-sm">
            {adjustedProposal.estimatedBudget}
          </span>
          <span className="bg-white text-purple-700 text-xs px-2 py-1 rounded-full shadow-sm">
            {adjustedProposal.highlight}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {chatMessages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-purple-500 text-white rounded-br-md'
                  : 'bg-white text-gray-800 shadow-sm rounded-bl-md'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="flex items-center space-x-1 mb-1">
                  <Sparkles size={12} className="text-purple-500" />
                  <span className="text-[10px] text-purple-500 font-bold">Claude</span>
                </div>
              )}
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>

              {message.suggestion && (
                <div className="mt-3 bg-purple-50 rounded-lg p-3 border border-purple-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-purple-600 font-bold">{message.suggestion.field}の変更</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="text-gray-400 line-through">{message.suggestion.before}</span>
                    <span className="text-purple-600">→</span>
                    <span className="text-purple-700 font-bold">{message.suggestion.after}</span>
                  </div>
                  <button
                    onClick={() => applySuggestion(message.suggestion)}
                    className="mt-2 w-full bg-purple-500 text-white text-xs py-2 rounded-lg font-bold hover:bg-purple-600 transition-colors"
                  >
                    この変更を適用する
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isAiTyping && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
              <div className="flex items-center space-x-1 mb-1">
                <Sparkles size={12} className="text-purple-500" />
                <span className="text-[10px] text-purple-500 font-bold">Claude</span>
              </div>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <div className="px-4 py-2 bg-white border-t border-gray-100">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {['もっと安く', '午後から', '子供向けに', '日帰りで'].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setChatInput(suggestion)}
              className="flex-shrink-0 bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="例：もう少し予算を抑えたい"
            className="flex-1 bg-gray-100 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
          <button
            onClick={sendMessage}
            disabled={!chatInput.trim() || isAiTyping}
            className="bg-purple-500 text-white p-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-600 transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      <div className="p-4 bg-white border-t border-gray-100 flex space-x-3">
        <button
          onClick={handleKeep}
          className="flex-1 py-3 rounded-xl border-2 border-purple-500 text-purple-500 font-bold text-sm flex items-center justify-center space-x-1"
        >
          <Bookmark size={16} />
          <span>キープ</span>
        </button>
        <button
          onClick={() => {
            onConvert(adjustedProposal);
            onClose();
          }}
          className="flex-1 py-3 rounded-xl bg-orange-500 text-white font-bold text-sm"
        >
          これで決定！
        </button>
      </div>
    </div>
  );
}
