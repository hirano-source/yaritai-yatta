'use client';

import { useEffect, useRef, useState } from 'react';

interface WorldMapProps {
  stockCountByArea: Record<string, number>;
  onAreaClick: (areaId: string) => void;
}

// 国コードから地域への対応
const countryToRegion: Record<string, string> = {
  // アジア
  'CN': 'asia', 'KR': 'asia', 'TW': 'asia', 'HK': 'asia', 'MO': 'asia',
  'TH': 'asia', 'VN': 'asia', 'SG': 'asia', 'MY': 'asia', 'ID': 'asia',
  'PH': 'asia', 'MM': 'asia', 'KH': 'asia', 'LA': 'asia', 'BN': 'asia',
  'IN': 'asia', 'BD': 'asia', 'LK': 'asia', 'NP': 'asia', 'PK': 'asia',
  // ヨーロッパ
  'FR': 'europe', 'GB': 'europe', 'DE': 'europe', 'IT': 'europe', 'ES': 'europe',
  'PT': 'europe', 'NL': 'europe', 'BE': 'europe', 'CH': 'europe', 'AT': 'europe',
  'GR': 'europe', 'CZ': 'europe', 'PL': 'europe', 'HU': 'europe', 'SE': 'europe',
  'NO': 'europe', 'DK': 'europe', 'FI': 'europe', 'IE': 'europe', 'RU': 'europe',
  // アメリカ
  'US': 'america', 'CA': 'america', 'MX': 'america', 'BR': 'america',
  'AR': 'america', 'CL': 'america', 'PE': 'america', 'CO': 'america',
  // オセアニア
  'AU': 'oceania', 'NZ': 'oceania', 'FJ': 'oceania', 'GU': 'oceania',
};

// 地域ごとの色
const regionColors: Record<string, string> = {
  asia: '#F472B6',     // pink-400
  europe: '#60A5FA',   // blue-400
  america: '#34D399',  // emerald-400
  oceania: '#FBBF24',  // amber-400
};

const regionNames: Record<string, string> = {
  asia: 'アジア',
  europe: 'ヨーロッパ',
  america: 'アメリカ',
  oceania: 'オセアニア',
};

export default function WorldMap({ stockCountByArea, onAreaClick }: WorldMapProps) {
  const objectRef = useRef<HTMLObjectElement>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const object = objectRef.current;
    if (!object) return;

    const handleLoad = () => {
      const svgDoc = object.contentDocument;
      if (!svgDoc) return;

      setIsLoaded(true);

      // すべてのpath要素を取得
      const paths = svgDoc.querySelectorAll('path');

      paths.forEach((path) => {
        const id = path.getAttribute('id');
        if (!id) return;

        // 国コードから地域を特定
        const countryCode = id.toUpperCase().substring(0, 2);
        const region = countryToRegion[countryCode];

        if (region) {
          const hasStock = stockCountByArea[region] > 0;
          const color = hasStock ? regionColors[region] : '#E5E7EB';

          path.style.fill = color;
          path.style.transition = 'fill 0.2s';
          path.style.cursor = hasStock ? 'pointer' : 'default';

          if (hasStock) {
            path.addEventListener('mouseenter', () => {
              setHoveredRegion(region);
              path.style.fill = '#FB923C'; // orange-400
            });

            path.addEventListener('mouseleave', () => {
              setHoveredRegion(null);
              path.style.fill = color;
            });

            path.addEventListener('click', () => {
              onAreaClick(region);
            });
          }
        } else {
          // マッピングがない国はグレー
          path.style.fill = '#E5E7EB';
        }
      });
    };

    object.addEventListener('load', handleLoad);

    if (object.contentDocument) {
      handleLoad();
    }

    return () => {
      object.removeEventListener('load', handleLoad);
    };
  }, [stockCountByArea, onAreaClick]);

  return (
    <div className="relative">
      <object
        ref={objectRef}
        data="/world-map.svg"
        type="image/svg+xml"
        className="w-full h-auto"
        style={{ minHeight: '150px' }}
      />

      {/* ホバー時のツールチップ */}
      {hoveredRegion && isLoaded && (
        <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-gray-200">
          <p className="text-sm font-bold text-gray-800">{regionNames[hoveredRegion]}</p>
          <p className="text-xs text-orange-500 font-bold">{stockCountByArea[hoveredRegion]}件のストック</p>
        </div>
      )}
    </div>
  );
}
