'use client';

import { StockItem, StockCategory } from '@/types';

const CATEGORY_LABELS: Record<StockCategory, string> = {
  gourmet: 'グルメ',
  travel: '旅行',
  outing: 'お出かけ',
  event: 'イベント',
};

interface StockCardProps {
  stock: StockItem;
  isWanted: boolean;
  onWantClick: () => void;
}

export default function StockCard({ stock, isWanted, onWantClick }: StockCardProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex">
      <img
        src={stock.imageUrl}
        className="w-28 h-28 object-cover flex-shrink-0"
        alt={stock.title}
      />
      <div className="flex-1 p-3 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] text-orange-500 font-bold bg-orange-50 px-1.5 py-0.5 rounded">
                {stock.user}
              </span>
              <span className="text-[10px] text-gray-400 ml-1">
                {CATEGORY_LABELS[stock.category]}
              </span>
            </div>
          </div>
          <h3 className="font-bold text-sm text-gray-800 mt-1 line-clamp-1">
            {stock.title}
          </h3>
          <p className="text-[10px] text-gray-500 mt-0.5">{stock.location}</p>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center space-x-1">
            {stock.wantToGoCount > 0 && (
              <>
                <div className="flex -space-x-1">
                  {stock.wantToGoUsers.slice(0, 3).map((user, i) => (
                    <div
                      key={i}
                      className="w-5 h-5 rounded-full bg-orange-100 border border-white flex items-center justify-center text-[8px] text-orange-600 font-bold"
                    >
                      {user.charAt(0)}
                    </div>
                  ))}
                </div>
                <span className="text-[10px] text-gray-500">
                  {stock.wantToGoCount}人
                </span>
              </>
            )}
          </div>

          <button
            onClick={onWantClick}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 ${
              isWanted
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            <span>{isWanted ? '🔥' : '👀'}</span>
            <span>{isWanted ? 'やろう！' : 'やろう'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
