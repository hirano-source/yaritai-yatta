'use client';

import { useState, useMemo } from 'react';
import { Clock, TrendingUp, Filter, List, Map } from 'lucide-react';
import { StockItem, StockSortType, StockCategory } from '@/types';
import StockListView from './StockListView';
import StockMapView from '@/components/map/StockMapView';

interface YaritaiScreenProps {
  stocks: StockItem[];
}

type ViewMode = 'list' | 'map';

export default function YaritaiScreen({ stocks: initialStocks }: YaritaiScreenProps) {
  const [sortType, setSortType] = useState<StockSortType>('newest');
  const [categoryFilter, setCategoryFilter] = useState<StockCategory | 'all'>('all');
  const [stocks] = useState(initialStocks);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [myWants, setMyWants] = useState<Record<string, boolean>>({});

  const sortedStocks = useMemo(() => {
    let filtered = categoryFilter === 'all'
      ? stocks
      : stocks.filter(s => s.category === categoryFilter);

    return [...filtered].sort((a, b) => {
      switch (sortType) {
        case 'popular':
          return b.wantToGoCount - a.wantToGoCount;
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [stocks, sortType, categoryFilter]);

  const handleWant = (stockId: string) => {
    setMyWants(prev => ({ ...prev, [stockId]: !prev[stockId] }));
  };

  return (
    <div className="pb-24 animate-fade-in">
      {/* ヘッダー＆ソート */}
      <div className="sticky top-16 bg-white z-10 px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-800">やりたいストック</h2>
          <span className="text-xs text-gray-400">{sortedStocks.length}件</span>
        </div>

        {/* 表示モード＆フィルタ */}
        <div className="flex space-x-2 mb-2">
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

          <div className="relative ml-auto">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as StockCategory | 'all')}
              className="appearance-none bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1.5 pr-6 rounded-full focus:outline-none"
            >
              <option value="all">すべて</option>
              <option value="gourmet">グルメ</option>
              <option value="travel">旅行</option>
              <option value="outing">お出かけ</option>
              <option value="event">イベント</option>
            </select>
            <Filter size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* リスト表示時のソート */}
        {viewMode === 'list' && (
          <div className="flex space-x-2">
            <button
              onClick={() => setSortType('newest')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                sortType === 'newest'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              <Clock size={12} />
              <span>新着順</span>
            </button>
            <button
              onClick={() => setSortType('popular')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                sortType === 'popular'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              <TrendingUp size={12} />
              <span>人気順</span>
            </button>
          </div>
        )}
      </div>

      {/* マップ表示 */}
      {viewMode === 'map' && (
        <div className="p-4">
          <StockMapView stocks={sortedStocks} />
        </div>
      )}

      {/* リスト表示 */}
      {viewMode === 'list' && (
        <StockListView
          stocks={sortedStocks}
          myWants={myWants}
          onWantClick={handleWant}
        />
      )}
    </div>
  );
}
