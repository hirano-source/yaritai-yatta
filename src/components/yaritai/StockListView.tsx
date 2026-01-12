'use client';

import { StockItem } from '@/types';
import StockCard from './StockCard';

interface StockListViewProps {
  stocks: StockItem[];
  myWants: Record<string, boolean>;
  onWantClick: (stockId: string) => void;
}

export default function StockListView({ stocks, myWants, onWantClick }: StockListViewProps) {
  return (
    <div className="p-4 space-y-3">
      {stocks.map((stock) => (
        <StockCard
          key={stock.id}
          stock={stock}
          isWanted={myWants[stock.id] || false}
          onWantClick={() => onWantClick(stock.id)}
        />
      ))}
    </div>
  );
}
