'use client';

import { useEffect, useRef, useState } from 'react';

interface JapanMapProps {
  stockCountByArea: Record<string, number>;
  onAreaClick: (areaId: string) => void;
}

// 都道府県コードから地方への対応
const prefectureToRegion: Record<string, string> = {
  '01': 'hokkaido',
  '02': 'tohoku', '03': 'tohoku', '04': 'tohoku', '05': 'tohoku', '06': 'tohoku', '07': 'tohoku',
  '08': 'kanto', '09': 'kanto', '10': 'kanto', '11': 'kanto', '12': 'kanto', '13': 'kanto', '14': 'kanto',
  '15': 'chubu', '16': 'chubu', '17': 'chubu', '18': 'chubu', '19': 'chubu', '20': 'chubu', '21': 'chubu', '22': 'chubu', '23': 'chubu',
  '24': 'kinki', '25': 'kinki', '26': 'kinki', '27': 'kinki', '28': 'kinki', '29': 'kinki', '30': 'kinki',
  '31': 'chugoku', '32': 'chugoku', '33': 'chugoku', '34': 'chugoku', '35': 'chugoku',
  '36': 'shikoku', '37': 'shikoku', '38': 'shikoku', '39': 'shikoku',
  '40': 'kyushu', '41': 'kyushu', '42': 'kyushu', '43': 'kyushu', '44': 'kyushu', '45': 'kyushu', '46': 'kyushu', '47': 'kyushu',
};

// 地方ごとの色
const regionColors: Record<string, string> = {
  hokkaido: '#60A5FA', // blue-400
  tohoku: '#34D399',   // emerald-400
  kanto: '#F472B6',    // pink-400
  chubu: '#FBBF24',    // amber-400
  kinki: '#A78BFA',    // violet-400
  chugoku: '#FB923C',  // orange-400
  shikoku: '#2DD4BF',  // teal-400
  kyushu: '#F87171',   // red-400
};

const regionNames: Record<string, string> = {
  hokkaido: '北海道',
  tohoku: '東北',
  kanto: '関東',
  chubu: '中部',
  kinki: '関西',
  chugoku: '中国',
  shikoku: '四国',
  kyushu: '九州・沖縄',
};

export default function JapanMap({ stockCountByArea, onAreaClick }: JapanMapProps) {
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

      const prefectures = svgDoc.querySelectorAll('.prefecture');

      prefectures.forEach((pref) => {
        const code = pref.getAttribute('data-code');
        if (!code) return;

        const region = prefectureToRegion[code];
        if (!region) return;

        const hasStock = stockCountByArea[region] > 0;
        const color = hasStock ? regionColors[region] : '#E5E7EB';

        // 初期色を設定
        pref.querySelectorAll('polygon, path').forEach((el) => {
          (el as SVGElement).style.fill = color;
          (el as SVGElement).style.transition = 'fill 0.2s, transform 0.2s';
          (el as SVGElement).style.cursor = hasStock ? 'pointer' : 'default';
        });

        if (hasStock) {
          pref.addEventListener('mouseenter', () => {
            setHoveredRegion(region);
            pref.querySelectorAll('polygon, path').forEach((el) => {
              (el as SVGElement).style.fill = '#FB923C'; // orange-400
            });
          });

          pref.addEventListener('mouseleave', () => {
            setHoveredRegion(null);
            pref.querySelectorAll('polygon, path').forEach((el) => {
              (el as SVGElement).style.fill = color;
            });
          });

          pref.addEventListener('click', () => {
            onAreaClick(region);
          });
        }
      });

      // 境界線を非表示
      const boundaryLines = svgDoc.querySelectorAll('.boundary-line');
      boundaryLines.forEach((line) => {
        (line as SVGElement).style.display = 'none';
      });
    };

    object.addEventListener('load', handleLoad);

    // 既に読み込み済みの場合
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
        data="/japan-map.svg"
        type="image/svg+xml"
        className="w-full h-auto"
        style={{ minHeight: '280px' }}
      />

      {/* ホバー時のツールチップ */}
      {hoveredRegion && isLoaded && (
        <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-gray-200">
          <p className="text-sm font-bold text-gray-800">{regionNames[hoveredRegion]}</p>
          <p className="text-xs text-orange-500 font-bold">{stockCountByArea[hoveredRegion]}件のストック</p>
        </div>
      )}

      {/* 凡例 */}
      {isLoaded && (
        <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 text-[10px]">
          <div className="flex items-center space-x-1 text-gray-500">
            <div className="w-3 h-3 rounded-sm bg-gray-200"></div>
            <span>ストックなし</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-600 mt-1">
            <div className="w-3 h-3 rounded-sm" style={{ background: 'linear-gradient(135deg, #60A5FA, #F472B6)' }}></div>
            <span>ストックあり</span>
          </div>
        </div>
      )}
    </div>
  );
}
