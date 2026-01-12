'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Tab, Group } from '@/types';
import { MOCK_STOCKS, MOCK_PLANS } from '@/lib/mock-data';
import { getMyStocks, createStock, deleteStock, shareToGroup, Stock, CreateStockInput } from '@/lib/stocks';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import AddYaritaiModal from '@/components/yaritai/AddYaritaiModal';
import HomeScreen from '@/components/ui/HomeScreen';
import StockScreen from '@/components/stock/StockScreen';
import YaritaiScreen from '@/components/yaritai/YaritaiScreen';
import PlanScreen from '@/components/plan/PlanScreen';
import YattaScreen from '@/components/yatta/YattaScreen';
import ProfileScreen from '@/components/ui/ProfileScreen';

const getHeaderTitle = (tab: Tab): string => {
  switch (tab) {
    case 'home':
      return 'ホーム';
    case 'stock':
      return '自分のストック';
    case 'yaritai':
      return 'みんなのやりたい';
    case 'plan':
      return '予定';
    case 'yatta':
      return 'やったリスト';
    default:
      return 'ホーム';
  }
};

export default function Home() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [currentGroup, setCurrentGroup] = useState<Group>('family');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // 共有から受け取ったデータ
  const [sharedUrl, setSharedUrl] = useState<string | null>(null);
  const [sharedTitle, setSharedTitle] = useState<string | null>(null);

  // DBから取得したストック
  const [dbStocks, setDbStocks] = useState<Stock[]>([]);
  const [isLoadingStocks, setIsLoadingStocks] = useState(true);

  // ストック取得
  const loadStocks = useCallback(async () => {
    setIsLoadingStocks(true);
    const stocks = await getMyStocks();
    setDbStocks(stocks);
    setIsLoadingStocks(false);
  }, []);

  useEffect(() => {
    loadStocks();
  }, [loadStocks]);

  // 共有からのパラメータを処理
  useEffect(() => {
    const shared = searchParams.get('shared');
    const url = searchParams.get('url');
    const title = searchParams.get('title');

    if (shared === 'true') {
      setSharedUrl(url);
      setSharedTitle(title);
      setIsModalOpen(true);
      setActiveTab('stock');

      // URLパラメータをクリア（履歴を汚さない）
      window.history.replaceState({}, '', '/');
    }
  }, [searchParams]);

  // モーダルを閉じたら共有データをクリア
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSharedUrl(null);
    setSharedTitle(null);
  };

  // ストック追加
  const handleAddStock = async (input: CreateStockInput) => {
    const newStock = await createStock(input);
    if (newStock) {
      setDbStocks(prev => [newStock, ...prev]);
    }
  };

  // ストック削除
  const handleDeleteStock = async (id: string) => {
    const success = await deleteStock(id);
    if (success) {
      setDbStocks(prev => prev.filter(s => s.id !== id));
    }
  };

  // グループに共有
  const handleShareToGroup = async (id: string, groupId: string) => {
    const updated = await shareToGroup(id, groupId);
    if (updated) {
      setDbStocks(prev => prev.map(s => s.id === id ? updated : s));
    }
  };

  // グループでフィルタリングされたストック（モックデータ + DBデータ）
  const filteredStocks = useMemo(() => {
    return MOCK_STOCKS.filter(stock => stock.group === currentGroup);
  }, [currentGroup]);

  // グループでフィルタリングされた計画
  const filteredPlans = useMemo(() => {
    return MOCK_PLANS.filter(plan => plan.groupId === currentGroup);
  }, [currentGroup]);

  // 未読ストック数
  const unreadStockCount = useMemo(() => {
    return filteredStocks.filter(stock => !stock.isRead).length;
  }, [filteredStocks]);

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-900 pb-safe">
      {/* Mobile Frame Simulation on Desktop */}
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl relative overflow-hidden">
        {/* Dynamic Header */}
        <Header
          title={getHeaderTitle(activeTab)}
          showGroupSelector={activeTab === 'home' || activeTab === 'yaritai' || activeTab === 'plan'}
          currentGroup={currentGroup}
          onGroupChange={setCurrentGroup}
          onSettingsClick={() => setShowSettings(true)}
        />

        {/* Scrollable Content Area */}
        <main className="h-full overflow-y-auto custom-scrollbar">
          {activeTab === 'home' && (
            <HomeScreen
              stocks={filteredStocks}
              plans={filteredPlans}
              currentGroup={currentGroup}
              onNavigate={setActiveTab}
              onAddClick={() => setIsModalOpen(true)}
            />
          )}
          {activeTab === 'stock' && (
            <StockScreen
              dbStocks={dbStocks}
              isLoading={isLoadingStocks}
              onDelete={handleDeleteStock}
              onShareToGroup={handleShareToGroup}
              onAddClick={() => setIsModalOpen(true)}
            />
          )}
          {activeTab === 'yaritai' && <YaritaiScreen stocks={filteredStocks} />}
          {activeTab === 'plan' && <PlanScreen plans={filteredPlans} currentGroup={currentGroup} />}
          {activeTab === 'yatta' && <YattaScreen />}
        </main>

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
            <div className="bg-white rounded-t-2xl w-full max-w-md animate-slide-up">
              <ProfileScreen />
              <button
                onClick={() => setShowSettings(false)}
                className="w-full py-4 text-gray-500 font-bold text-sm border-t border-gray-100"
              >
                閉じる
              </button>
            </div>
          </div>
        )}

        {/* Add Modal */}
        <AddYaritaiModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onAdd={handleAddStock}
          initialUrl={sharedUrl}
          initialTitle={sharedTitle}
        />

        {/* Bottom Navigation */}
        <BottomNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          unreadStockCount={unreadStockCount}
        />
      </div>
    </div>
  );
}
