'use client';

import { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, X, Heart, Share2, Navigation } from 'lucide-react';
import { StockItem, StockCategory } from '@/types';

interface StockMapViewProps {
  stocks: StockItem[];
  onStockClick?: (stock: StockItem) => void;
  onShareClick?: (stock: StockItem) => void;
}

// カテゴリごとのピンの色
const CATEGORY_COLORS: Record<StockCategory, string> = {
  gourmet: '#f43f5e',    // rose-500
  travel: '#0ea5e9',     // sky-500
  outing: '#10b981',     // emerald-500
  event: '#8b5cf6',      // violet-500
};

const CATEGORY_LABELS: Record<StockCategory, string> = {
  gourmet: 'グルメ',
  travel: '旅行',
  outing: 'おでかけ',
  event: 'イベント',
};

// 仮の座標データ
const LOCATION_COORDS: Record<string, [number, number]> = {
  '東京': [35.6895, 139.6917],
  '渋谷': [35.6580, 139.7016],
  '新宿': [35.6897, 139.7003],
  '池袋': [35.7295, 139.7103],
  '横浜': [35.4437, 139.6380],
  '京都': [35.0116, 135.7681],
  '大阪': [34.6937, 135.5023],
  '神戸': [34.6901, 135.1955],
  '札幌': [43.0618, 141.3545],
  '福岡': [33.5902, 130.4017],
  '名古屋': [35.1815, 136.9066],
  '金沢': [36.5944, 136.6256],
  '軽井沢': [36.3483, 138.6369],
  '沖縄': [26.2124, 127.6809],
  '那覇': [26.2124, 127.6809],
  'ソウル': [37.5665, 126.9780],
  '台北': [25.0330, 121.5654],
  'バンコク': [13.7563, 100.5018],
  'シンガポール': [1.3521, 103.8198],
  'パリ': [48.8566, 2.3522],
  'ロンドン': [51.5074, -0.1278],
  'ニューヨーク': [40.7128, -74.0060],
  'ハワイ': [19.8968, -155.5828],
  'シドニー': [-33.8688, 151.2093],
};

// locationから座標を取得 [lat, lng]
const getCoordinates = (location: string): [number, number] | null => {
  for (const [key, coords] of Object.entries(LOCATION_COORDS)) {
    if (location.includes(key)) {
      return [
        coords[0] + (Math.random() - 0.5) * 0.02,
        coords[1] + (Math.random() - 0.5) * 0.02,
      ];
    }
  }
  return null;
};

// Leafletはクライアントサイドのみで動作するため、dynamic importを使用
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

export default function StockMapView({ stocks, onShareClick }: StockMapViewProps) {
  const [isClient, setIsClient] = useState(false);
  const [selectedStock, setSelectedStock] = useState<StockItem | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // 座標付きのストック
  const stocksWithCoords = useMemo(() => {
    return stocks
      .map(stock => ({
        ...stock,
        coordinates: getCoordinates(stock.location),
      }))
      .filter(stock => stock.coordinates !== null);
  }, [stocks]);

  // サーバーサイドではローディング表示
  if (!isClient) {
    return (
      <div className="h-[400px] bg-gray-100 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-gray-500">地図を読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-lg">
      {/* CSSをインポート */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />

      <MapContainer
        center={[35.6895, 139.6917]}
        zoom={5}
        style={{ width: '100%', height: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* ストックのマーカー */}
        {stocksWithCoords.map((stock) => (
          <Marker
            key={stock.id}
            position={stock.coordinates as [number, number]}
            eventHandlers={{
              click: () => setSelectedStock(stock),
            }}
          >
            <Popup>
              <div className="min-w-[180px]">
                <div className="relative h-20 -mx-3 -mt-3 mb-2 overflow-hidden">
                  <img
                    src={stock.imageUrl}
                    alt={stock.title}
                    className="w-full h-full object-cover"
                  />
                  <span
                    className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[10px] font-bold text-white"
                    style={{ backgroundColor: CATEGORY_COLORS[stock.category] }}
                  >
                    {CATEGORY_LABELS[stock.category]}
                  </span>
                </div>
                <h4 className="font-bold text-gray-800 text-sm line-clamp-1">{stock.title}</h4>
                <p className="text-[10px] text-gray-500 mt-0.5">{stock.location}</p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                  <span className="flex items-center space-x-1 text-gray-400 text-xs">
                    <Heart size={12} />
                    <span>気になる</span>
                  </span>
                  <button
                    onClick={() => onShareClick?.(stock)}
                    className="flex items-center space-x-1 bg-orange-500 text-white px-2 py-1 rounded-full text-[10px] font-bold"
                  >
                    <Share2 size={10} />
                    <span>共有</span>
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* ストック数表示 */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl shadow-md z-[1000]">
        <p className="text-xs font-bold text-gray-800">
          <span className="text-orange-500">{stocksWithCoords.length}</span>
          <span className="text-gray-500"> / {stocks.length}件を表示</span>
        </p>
      </div>

      {/* カテゴリ凡例 */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl shadow-md z-[1000]">
        <div className="flex flex-wrap gap-2">
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <div key={key} className="flex items-center space-x-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: CATEGORY_COLORS[key as StockCategory] }}
              />
              <span className="text-[10px] text-gray-600">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
