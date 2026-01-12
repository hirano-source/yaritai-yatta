'use client';

import { useState, useEffect } from 'react';
import { X, MapPin, Plus, Loader2, Link as LinkIcon } from 'lucide-react';
import { DEFAULT_GROUP_OPTIONS, StockCategory } from '@/types';
import { CreateStockInput } from '@/lib/stocks';

interface AddStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (input: CreateStockInput) => void;
  initialUrl?: string | null;
  initialTitle?: string | null;
}

interface OgpData {
  title: string | null;
  description: string | null;
  image: string | null;
  siteName: string | null;
  url: string;
}

const categoryOptions: { id: StockCategory; label: string; icon: string }[] = [
  { id: 'gourmet', label: 'グルメ', icon: '🍽️' },
  { id: 'travel', label: '旅行', icon: '✈️' },
  { id: 'outing', label: 'おでかけ', icon: '🚶' },
  { id: 'event', label: 'イベント', icon: '🎉' },
];

export default function AddStockModal({ isOpen, onClose, onAdd, initialUrl, initialTitle }: AddStockModalProps) {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<StockCategory>('gourmet');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingOgp, setIsLoadingOgp] = useState(false);
  const [ogpError, setOgpError] = useState<string | null>(null);

  // モーダルを開いたとき & 共有からのデータを受け取ったとき
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setTitle(initialTitle || '');
      setUrl(initialUrl || '');
      setImageUrl(null);
      setLocation('');
      setCategory('gourmet');
      setSelectedGroup(null);
      setNote('');
      setIsSaving(false);
      setOgpError(null);

      // 共有からURLがあればOGP取得
      if (initialUrl) {
        fetchOgp(initialUrl);
      }
    }
  }, [isOpen, initialUrl, initialTitle]);

  // OGP情報を取得
  const fetchOgp = async (targetUrl: string) => {
    if (!targetUrl.startsWith('http')) return;

    setIsLoadingOgp(true);
    setOgpError(null);

    try {
      const response = await fetch(`/api/ogp?url=${encodeURIComponent(targetUrl)}`);
      if (!response.ok) throw new Error('OGP取得に失敗');

      const data: OgpData = await response.json();

      // 取得した情報をフォームにセット
      if (data.title && !title) {
        setTitle(data.title);
      }
      if (data.image) {
        setImageUrl(data.image);
      }
      if (data.description && !note) {
        setNote(data.description);
      }
    } catch {
      setOgpError('URL情報の取得に失敗しました');
    } finally {
      setIsLoadingOgp(false);
    }
  };

  // URL入力時に自動取得
  const handleUrlChange = (value: string) => {
    setUrl(value);
  };

  const handleUrlBlur = () => {
    if (url && url.startsWith('http')) {
      fetchOgp(url);
    }
  };

  const handleNext = () => {
    if (!title.trim()) return;
    setStep(2);
  };

  const handleStock = async () => {
    if (!title.trim() || !selectedGroup) return;

    setIsSaving(true);

    const input: CreateStockInput = {
      title: title.trim(),
      category,
      group_id: selectedGroup === 'self' ? null : selectedGroup,
      url: url.trim() || null,
      image_url: imageUrl,
      location: location.trim() || null,
      note: note.trim() || null,
    };

    onAdd?.(input);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-slide-up max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h3 className="font-bold text-gray-800">
            {step === 1 ? 'やりたいを追加' : '誰とやりたい？'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              {/* URL入力 */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  <LinkIcon size={14} className="inline mr-1" />
                  URLから追加
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    onBlur={handleUrlBlur}
                    placeholder="URLを貼り付け（Instagram, 食べログ等）"
                    className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {isLoadingOgp && (
                    <div className="flex items-center px-3">
                      <Loader2 size={20} className="animate-spin text-orange-500" />
                    </div>
                  )}
                </div>
                {ogpError && (
                  <p className="text-xs text-red-500 mt-1">{ogpError}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  URLを入力すると自動で情報を取得します
                </p>
              </div>

              {/* OGP画像プレビュー */}
              {imageUrl && (
                <div className="relative">
                  <img
                    src={imageUrl}
                    alt=""
                    className="w-full h-32 object-cover rounded-lg"
                    onError={() => setImageUrl(null)}
                  />
                </div>
              )}

              {/* タイトル入力 */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  タイトル <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="例：話題のカフェ「森の図書館」"
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* 場所入力（任意） */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  場所（任意）
                </label>
                <div className="flex items-center space-x-2">
                  <MapPin size={16} className="text-gray-400" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="例：東京都渋谷区"
                    className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* カテゴリ選択 */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  カテゴリ
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {categoryOptions.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`flex flex-col items-center p-2 rounded-lg border transition-colors ${
                        category === cat.id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <span className="text-xl">{cat.icon}</span>
                      <span className="text-[10px] mt-1 text-gray-600">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* メモ（任意） */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  メモ（任意）
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="気になるポイントなど..."
                  rows={2}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
              </div>

              <button
                onClick={handleNext}
                disabled={!title.trim() || isLoadingOgp}
                className="w-full bg-gray-800 text-white py-3 rounded-xl font-bold transition-colors disabled:opacity-50"
              >
                次へ
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              {/* 入力内容プレビュー */}
              <div className="bg-orange-50 p-3 rounded-xl">
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt=""
                    className="w-full h-24 object-cover rounded-lg mb-2"
                  />
                )}
                <h4 className="font-bold text-gray-800 text-sm">{title}</h4>
                {location && (
                  <p className="text-xs text-gray-500 flex items-center mt-1">
                    <MapPin size={10} className="mr-1" /> {location}
                  </p>
                )}
                <div className="flex mt-2 space-x-1">
                  <span className="text-[10px] bg-white border border-orange-200 text-orange-600 px-1.5 py-0.5 rounded">
                    {categoryOptions.find(c => c.id === category)?.label}
                  </span>
                </div>
              </div>

              {/* "Who with?" Selector */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  誰とやりたい？
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {DEFAULT_GROUP_OPTIONS.map((group) => (
                    <button
                      key={group.id}
                      onClick={() => setSelectedGroup(group.id)}
                      className={`flex items-center space-x-2 p-3 rounded-lg border transition-colors text-left ${
                        selectedGroup === group.id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-500 hover:bg-orange-50'
                      }`}
                    >
                      <span className="text-xl">{group.icon}</span>
                      <span className="text-sm font-medium text-gray-700">
                        {group.label}
                      </span>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  ※選択したグループのメンバーにのみ表示されます
                </p>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold"
                >
                  戻る
                </button>
                <button
                  onClick={handleStock}
                  disabled={!selectedGroup || isSaving}
                  className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-bold shadow-md hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {isSaving ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Plus size={18} />
                      <span>追加</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
