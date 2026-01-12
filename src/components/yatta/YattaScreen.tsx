'use client';

import { useState } from 'react';
import { FileText, Smile, PlayCircle, Share2 } from 'lucide-react';
import { MemoryFormat } from '@/types';

export default function YattaScreen() {
  const [format, setFormat] = useState<MemoryFormat>('manga');

  return (
    <div className="h-full pb-20 animate-fade-in">
      <div className="px-4 py-4 sticky top-16 bg-white z-10 border-b border-gray-50">
        <h2 className="text-xl font-bold text-gray-800">やったリスト</h2>
        <div className="flex space-x-2 mt-4 overflow-x-auto pb-1">
          {[
            { id: 'text' as MemoryFormat, label: 'ブログ風', icon: FileText },
            { id: 'manga' as MemoryFormat, label: 'マンガ風', icon: Smile },
            { id: 'video' as MemoryFormat, label: 'ダイジェスト', icon: PlayCircle },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFormat(item.id)}
              className={`flex items-center space-x-1 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                format === item.id
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              <item.icon size={14} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header of Memory */}
          <div className="p-4 border-b border-gray-50">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg text-gray-800">
                  夏の京都旅行
                </h3>
                <p className="text-xs text-gray-500">2023.08.15 - 家族で</p>
              </div>
              <div className="bg-orange-100 text-orange-600 px-2 py-1 rounded text-[10px] font-bold">
                AI生成済み
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="min-h-[300px] bg-gray-50 relative">
            {format === 'manga' && (
              <div className="p-4 grid grid-cols-2 gap-2">
                {/* Mock Manga Panels */}
                <div className="col-span-2 aspect-[2/1] bg-white rounded-lg border-2 border-gray-800 p-2 relative overflow-hidden">
                  <p className="text-[10px] font-bold absolute top-2 left-2 bg-white px-1 z-10">
                    1. 出発
                  </p>
                  <img
                    src="https://images.unsplash.com/photo-1542640244-7e67286feb8f?auto=format&fit=crop&q=80&w=400"
                    className="w-full h-full object-cover opacity-80 grayscale contrast-125"
                    alt="shinkansen"
                  />
                  <div className="absolute bottom-2 right-2 bg-white border border-gray-800 px-2 py-1 rounded-full text-xs font-bold shadow-md transform rotate-[-2deg]">
                    いざ京都へ！
                  </div>
                </div>
                <div className="aspect-square bg-white rounded-lg border-2 border-gray-800 p-2 relative overflow-hidden">
                  <p className="text-[10px] font-bold absolute top-2 left-2 bg-white px-1 z-10">
                    2. 暑すぎ
                  </p>
                  <img
                    src="https://images.unsplash.com/photo-1595839062005-47a329ce7bd5?auto=format&fit=crop&q=80&w=300"
                    className="w-full h-full object-cover opacity-80 grayscale contrast-125"
                    alt="kyoto street"
                  />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-800 px-1 py-4 rounded-full text-[10px] font-bold shadow-md writing-vertical-rl">
                    38度...
                  </div>
                </div>
                <div className="aspect-square bg-white rounded-lg border-2 border-gray-800 p-2 relative overflow-hidden">
                  <p className="text-[10px] font-bold absolute top-2 left-2 bg-white px-1 z-10">
                    3. かき氷
                  </p>
                  <img
                    src="https://images.unsplash.com/photo-1588665576020-f4728d757270?auto=format&fit=crop&q=80&w=300"
                    className="w-full h-full object-cover opacity-80 grayscale contrast-125"
                    alt="shaved ice"
                  />
                  <div className="absolute bottom-2 left-2 bg-white border border-gray-800 px-2 py-1 rounded-xl text-xs font-bold shadow-md">
                    生き返った〜
                  </div>
                </div>
              </div>
            )}

            {format === 'video' && (
              <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
                <PlayCircle size={48} className="text-orange-500 mb-2" />
                <span className="text-sm font-bold text-gray-600">
                  ハイライト動画を再生
                </span>
                <p className="text-xs mt-2">BGM: Summer Breeze</p>
              </div>
            )}

            {format === 'text' && (
              <div className="p-6 bg-white h-full">
                <h4 className="font-bold text-gray-800 mb-2">
                  最高に暑くて最高に楽しい京都
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  今年の夏は思い切って京都へ。予想通りの猛暑だったけど、
                  鴨川沿いの散歩は風が気持ちよかった。
                  <br />
                  <br />
                  特に印象的だったのは、パパが見つけてくれた路地裏のかき氷屋さん。
                  2時間待ちだったけど、待った甲斐があった！
                  <br />
                  子供たちも「またやりたい」って言ってくれて、
                  いい思い出になりました。
                </p>
              </div>
            )}
          </div>

          <div className="p-3 bg-gray-50 flex justify-end">
            <button className="flex items-center space-x-1 text-gray-600 text-xs font-bold bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
              <Share2 size={12} />
              <span>シェアする</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
