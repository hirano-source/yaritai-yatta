'use client';

import { useState } from 'react';
import { Trash2, Share2, Bookmark, List, Map, Loader2, Plus } from 'lucide-react';
import { StockCategory } from '@/types';
import { Stock } from '@/lib/stocks';
import { MOCK_GROUPS } from '@/lib/mock-data';

interface StockScreenProps {
  dbStocks: Stock[];
  isLoading: boolean;
  onDelete: (id: string) => void;
  onShareToGroup: (id: string, groupId: string) => void;
  onAddClick: () => void;
}

const categoryLabels: Record<StockCategory, string> = {
  gourmet: 'グルメ',
  travel: '旅行',
  outing: 'おでかけ',
  event: 'イベント',
};

const categoryColors: Record<StockCategory, string> = {
  gourmet: 'bg-rose-100 text-rose-600',
  travel: 'bg-sky-100 text-sky-600',
  outing: 'bg-emerald-100 text-emerald-600',
  event: 'bg-violet-100 text-violet-600',
};

type ViewMode = 'list' | 'map';

export default function StockScreen({ dbStocks, isLoading, onDelete, onShareToGroup, onAddClick }: StockScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<StockCategory | 'all'>('all');
  const [shareModalStock, setShareModalStock] = useState<Stock | null>(null);
  const [deleteConfirmStock, setDeleteConfirmStock] = useState<Stock | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const filteredStocks = selectedCategory === 'all'
    ? dbStocks
    : dbStocks.filter(stock => stock.category === selectedCategory);

  const categories: (StockCategory | 'all')[] = ['all', 'gourmet', 'travel', 'outing', 'event'];

  const handleDelete = (stock: Stock) => {
    onDelete(stock.id);
    setDeleteConfirmStock(null);
  };

  const handleShare = (stock: Stock, groupId: string) => {
    onShareToGroup(stock.id, groupId);
    setShareModalStock(null);
  };

  // ローディング中
  if (isLoading) {
    return (
      <div className="h-full pb-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-2" />
          <p className="text-sm text-gray-500">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full pb-20 animate-fade-in">
      {/* Filter Tabs */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm px-4 py-3 border-b border-gray-100 z-10">
        {/* カテゴリフィルター */}
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide mb-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat === 'all' ? 'すべて' : categoryLabels[cat]}
            </button>
          ))}
        </div>

        {/* 表示モード切替 */}
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              viewMode === 'list'
                ? 'bg-gray-800 text-white'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            <List size={12} />
            <span>リスト</span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              viewMode === 'map'
                ? 'bg-gray-800 text-white'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            <Map size={12} />
            <span>マップ</span>
          </button>
        </div>
      </div>

      {/* マップ表示（未実装） */}
      {viewMode === 'map' && (
        <div className="p-4">
          <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center">
            <p className="text-gray-500 text-sm">マップ表示は準備中です</p>
          </div>
        </div>
      )}

      {/* リスト表示 */}
      {viewMode === 'list' && (
        <div className="p-4 space-y-3">
          {filteredStocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Bookmark size={48} className="mb-4 text-gray-300" />
              <p className="text-sm">まだストックがありません</p>
              <p className="text-xs mt-1">「+」ボタンから追加してね</p>
            </div>
          ) : (
            filteredStocks.map((stock) => (
              <div
                key={stock.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100"
              >
                {/* Image */}
                {stock.image_url && (
                  <div className="relative h-40">
                    <img
                      src={stock.image_url}
                      alt={stock.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${categoryColors[stock.category]}`}>
                        {categoryLabels[stock.category]}
                      </span>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-sm">{stock.title}</h3>
                      {stock.location && (
                        <p className="text-xs text-gray-500 mt-1">{stock.location}</p>
                      )}
                      <p className="text-[10px] text-gray-400 mt-1">
                        {new Date(stock.created_at).toLocaleDateString('ja-JP')}
                      </p>
                      {stock.note && (
                        <p className="text-xs text-gray-600 mt-2 bg-gray-50 p-2 rounded">{stock.note}</p>
                      )}
                    </div>
                    {!stock.image_url && (
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${categoryColors[stock.category]}`}>
                        {categoryLabels[stock.category]}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => setDeleteConfirmStock(stock)}
                      className="flex items-center space-x-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                      <span className="text-xs">削除</span>
                    </button>
                    {!stock.group_id && (
                      <button
                        onClick={() => setShareModalStock(stock)}
                        className="flex items-center space-x-1 bg-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-bold"
                      >
                        <Share2 size={12} />
                        <span>グループに共有</span>
                      </button>
                    )}
                    {stock.group_id && (
                      <span className="text-xs text-gray-400">
                        共有済み: {MOCK_GROUPS.find(g => g.id === stock.group_id)?.name || stock.group_id}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirmStock && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 animate-slide-up">
            <h3 className="text-lg font-bold text-gray-800 mb-2">削除しますか？</h3>
            <p className="text-sm text-gray-500 mb-4">「{deleteConfirmStock.title}」を削除します。この操作は取り消せません。</p>
            <div className="flex space-x-2">
              <button
                onClick={() => setDeleteConfirmStock(null)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold"
              >
                キャンセル
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmStock)}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold"
              >
                削除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Button (FAB) */}
      <button
        onClick={onAddClick}
        className="fixed bottom-24 right-4 w-14 h-14 bg-orange-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-orange-600 transition-colors z-40"
      >
        <Plus size={24} />
      </button>

      {/* Share Modal */}
      {shareModalStock && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-end justify-center">
          <div className="bg-white rounded-t-2xl w-full max-w-md p-6 animate-slide-up">
            <h3 className="text-lg font-bold text-gray-800 mb-4">どのグループに共有する？</h3>
            <p className="text-sm text-gray-500 mb-4">「{shareModalStock.title}」</p>
            <div className="space-y-2">
              {MOCK_GROUPS.filter(g => g.id !== 'self').map((group) => (
                <button
                  key={group.id}
                  onClick={() => handleShare(shareModalStock, group.id)}
                  className="w-full flex items-center space-x-3 p-3 rounded-xl bg-gray-50 hover:bg-orange-50 transition-colors"
                >
                  <span className="text-2xl">{group.icon}</span>
                  <div className="text-left">
                    <p className="font-bold text-gray-800">{group.name}</p>
                    <p className="text-xs text-gray-500">{group.members.length}人のメンバー</p>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShareModalStock(null)}
              className="w-full mt-4 py-3 text-gray-500 font-bold text-sm"
            >
              キャンセル
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
