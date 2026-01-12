'use client';

import { useState, useMemo } from 'react';
import { MapPin, Calendar, ChevronRight, ChevronLeft, Check, Plus, Sparkles } from 'lucide-react';
import { StockItem, PlanItem, Tab, Group } from '@/types';
import { MOCK_GROUPS, MOCK_AVAILABLE_DATES, MOCK_AI_PROPOSALS } from '@/lib/mock-data';

interface HomeScreenProps {
  stocks: StockItem[];
  plans: PlanItem[];
  currentGroup: Group;
  onNavigate?: (tab: Tab) => void;
  onAddClick?: () => void;
}

// 日本時間でのヘルパー関数
const getJSTDate = (date: Date = new Date()) => {
  return new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
};

const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

const formatDate = (year: number, month: number, day: number) => {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

const formatJSTDate = (date: Date) => {
  const jst = getJSTDate(date);
  return formatDate(jst.getFullYear(), jst.getMonth(), jst.getDate());
};

export default function HomeScreen({ stocks, plans, currentGroup, onNavigate, onAddClick }: HomeScreenProps) {
  const activePlan = plans.find((p) => p.status === 'planning');
  const aiProposals = MOCK_AI_PROPOSALS[currentGroup] || [];

  // 日本時間の今日を基準にする
  const jstToday = getJSTDate();
  const [currentDate, setCurrentDate] = useState(new Date(jstToday.getFullYear(), jstToday.getMonth(), 1));
  const [myAvailableDates, setMyAvailableDates] = useState<Set<string>>(
    new Set(MOCK_AVAILABLE_DATES.filter(d => d.groupId === currentGroup && d.userId === 'me').map(d => d.date))
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const todayStr = formatJSTDate(new Date());
  const weekDays = ['日', '月', '火', '水', '木', '金', '土'];

  // 現在のグループ情報
  const groupInfo = MOCK_GROUPS.find(g => g.id === currentGroup);
  const members = groupInfo?.members || [];

  // グループの空き日データ
  const groupAvailableDates = useMemo(() => {
    return MOCK_AVAILABLE_DATES.filter(d => d.groupId === currentGroup);
  }, [currentGroup]);

  // 日付ごとの空いてる人数を計算
  const getAvailableCount = (dateStr: string) => {
    const myDates = myAvailableDates.has(dateStr) ? 1 : 0;
    const otherDates = groupAvailableDates.filter(d => d.date === dateStr && d.userId !== 'me').length;
    return myDates + otherDates;
  };

  // 全員空いてる日かどうか
  const isAllAvailable = (dateStr: string) => {
    return getAvailableCount(dateStr) === members.length;
  };

  // 全員空いてる日のリスト
  const allAvailableDates = useMemo(() => {
    const dates: string[] = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDate(year, month, day);
      if (dateStr >= todayStr && isAllAvailable(dateStr)) {
        dates.push(dateStr);
      }
    }
    return dates;
  }, [year, month, daysInMonth, todayStr, myAvailableDates, groupAvailableDates, members.length]);

  // 自分の空き日をトグル
  const toggleMyAvailability = (dateStr: string) => {
    setMyAvailableDates(prev => {
      const next = new Set(prev);
      if (next.has(dateStr)) {
        next.delete(dateStr);
      } else {
        next.add(dateStr);
      }
      return next;
    });
  };

  // 月を変更
  const changeMonth = (delta: number) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };

  // 新着順にソート
  const sortedStocks = [...stocks].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // 未読のストック
  const unreadStocks = sortedStocks.filter((s) => !s.isRead);
  // 新着3件（未読優先）
  const displayStocks = unreadStocks.length > 0
    ? unreadStocks.slice(0, 3)
    : sortedStocks.slice(0, 3);

  const unreadCount = unreadStocks.length;

  // 特定の日付に空いてるメンバーを取得
  const getAvailableMembers = (dateStr: string) => {
    const availableIds = new Set<string>();
    if (myAvailableDates.has(dateStr)) {
      availableIds.add('me');
    }
    groupAvailableDates.filter(d => d.date === dateStr).forEach(d => {
      availableIds.add(d.userId);
    });
    return members.filter(m => availableIds.has(m.id));
  };

  // カレンダーの日付セルを生成
  const renderCalendarDays = () => {
    const days = [];

    // 空白セル
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12" />);
    }

    // 日付セル
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDate(year, month, day);
      const isMyAvailable = myAvailableDates.has(dateStr);
      const allAvailable = isAllAvailable(dateStr);
      const isToday = dateStr === todayStr;
      const dayOfWeek = new Date(year, month, day).getDay();
      const isPast = dateStr < todayStr;
      const availableMembers = getAvailableMembers(dateStr);

      days.push(
        <button
          key={day}
          onClick={() => {
            if (!isPast) {
              toggleMyAvailability(dateStr);
            }
          }}
          disabled={isPast}
          className={`h-12 rounded-lg relative flex flex-col items-center justify-center transition-all ${
            isPast
              ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
              : allAvailable
              ? 'bg-orange-500 text-white shadow-sm'
              : isMyAvailable
              ? 'bg-orange-100 text-orange-700 border border-orange-200'
              : 'bg-white border border-gray-100 hover:border-orange-200'
          } ${isToday && !isPast ? 'ring-2 ring-blue-400' : ''}`}
        >
          <span className={`text-xs font-bold ${
            !isPast && dayOfWeek === 0 && !allAvailable && !isMyAvailable ? 'text-red-400' : ''
          } ${
            !isPast && dayOfWeek === 6 && !allAvailable && !isMyAvailable ? 'text-blue-400' : ''
          }`}>
            {day}
          </span>
          {/* 空いてるメンバーのアイコン */}
          {!isPast && availableMembers.length > 0 && (
            <div className="flex -space-x-1 mt-0.5">
              {availableMembers.slice(0, 3).map((m) => (
                <div
                  key={m.id}
                  className={`w-3 h-3 rounded-full flex items-center justify-center text-[6px] font-bold ${
                    allAvailable
                      ? 'bg-white/30 text-white'
                      : 'bg-orange-200 text-orange-700'
                  }`}
                >
                  {m.name.charAt(0)}
                </div>
              ))}
            </div>
          )}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in p-4">
      {/* STEP 1: みんなのやりたい！（SNSで発見 → ストック） */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="flex items-center space-x-2">
            <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">STEP 1</span>
            <h2 className="text-lg font-bold text-gray-800">みんなのやりたい！</h2>
          </div>
          <button
            onClick={() => onNavigate?.('yaritai')}
            className="text-gray-500 text-xs font-bold flex items-center"
          >
            すべて見る
            {unreadCount > 0 && (
              <span className="ml-1 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {unreadCount}
              </span>
            )}
            <ChevronRight size={14} />
          </button>
        </div>
        <div className="flex items-center justify-between mb-3 px-1">
          <p className="text-[10px] text-gray-400">SNSで見つけたら共有からストック</p>
          <button
            onClick={onAddClick}
            className="text-[10px] text-orange-500 font-bold flex items-center space-x-0.5"
          >
            <Plus size={10} />
            <span>手動で追加</span>
          </button>
        </div>
        <div className="space-y-3">
          {displayStocks.map((stock) => (
            <div
              key={stock.id}
              className={`bg-white rounded-xl p-3 shadow-sm flex space-x-3 active:scale-[0.99] transition-transform relative ${
                !stock.isRead ? 'ring-2 ring-orange-400' : ''
              }`}
            >
              {/* 未読バッジ */}
              {!stock.isRead && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full" />
              )}
              <img
                src={stock.imageUrl}
                alt={stock.title}
                className="w-24 h-24 rounded-lg object-cover"
              />
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded mb-1 inline-block">
                      {stock.user}がストック
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-800 text-sm leading-tight mb-1">
                    {stock.title}
                  </h3>
                  <p className="text-xs text-gray-500 flex items-center">
                    <MapPin size={10} className="mr-1" /> {stock.location}
                  </p>
                </div>
                <div className="flex justify-between items-end mt-2">
                  {stock.wantToGoCount > 0 ? (
                    <div className="flex items-center space-x-1">
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
                    </div>
                  ) : (
                    <div />
                  )}
                  <button className="flex items-center space-x-1 bg-gray-100 text-gray-500 text-xs px-3 py-1.5 rounded-full font-bold">
                    <span>👀</span>
                    <span>やろう</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* STEP 2: みんなの空き日（この日遊ぼう！） */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">STEP 2</span>
            <h2 className="text-lg font-bold text-gray-800">空き日を登録</h2>
          </div>
        </div>

        {/* カレンダー */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3">
          {/* カレンダーヘッダー */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => changeMonth(-1)}
              className="p-1.5 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft size={18} />
            </button>
            <h3 className="text-sm font-bold text-gray-800">
              {year}年{month + 1}月
            </h3>
            <button
              onClick={() => changeMonth(1)}
              className="p-1.5 hover:bg-gray-100 rounded-lg"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* メンバー表示 */}
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center space-x-1">
              {members.map((m, i) => (
                <div
                  key={m.id}
                  className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600 border-2 border-white"
                  title={m.name}
                >
                  {m.name.charAt(0)}
                </div>
              ))}
            </div>
            <p className="text-[10px] text-gray-400">タップで空き登録</p>
          </div>

          {/* 曜日ヘッダー */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {weekDays.map((day, i) => (
              <div
                key={day}
                className={`h-6 flex items-center justify-center text-[10px] font-bold ${
                  i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-400'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* 日付グリッド */}
          <div className="grid grid-cols-7 gap-1">
            {renderCalendarDays()}
          </div>

          {/* 全員揃った日がある場合のみ表示 */}
          {allAvailableDates.length > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-100">
              <p className="text-xs font-bold text-orange-600 mb-2">
                全員空いてる日があるよ！
              </p>
              <div className="flex flex-wrap gap-2">
                {allAvailableDates.slice(0, 3).map(dateStr => (
                  <button
                    key={dateStr}
                    className="bg-orange-500 text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center space-x-1 shadow-sm hover:bg-orange-600 transition-colors"
                  >
                    <Calendar size={12} />
                    <span>{new Date(dateStr).getMonth() + 1}/{new Date(dateStr).getDate()} 遊ぼう！</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI提案セクション（折りたたみ） */}
      {aiProposals.length > 0 && (
        <button
          onClick={() => onNavigate?.('plan')}
          className="w-full bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100 flex items-center justify-between hover:shadow-md transition-all"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Sparkles size={20} className="text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-gray-800 text-sm">AIからの提案</h3>
              <p className="text-xs text-gray-500">{aiProposals.length}件のプラン案</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-purple-600 font-bold">見る</span>
            <ChevronRight size={16} className="text-purple-400" />
          </div>
        </button>
      )}

      {/* STEP 3: 進行中の計画（AI提案 → 調整 → 確定） */}
      {activePlan && (
        <div>
          <div className="flex items-center space-x-2 mb-3 px-1">
            <span className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">STEP 3</span>
            <h2 className="text-lg font-bold text-gray-800">進行中の計画</h2>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
            <div className="flex justify-between items-center mb-2">
              <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded font-bold">
                日程調整中
              </span>
              <span className="text-xs text-gray-500">LINEで調整中...</span>
            </div>
            <h3 className="font-bold text-gray-800">{activePlan.title}</h3>
            <p className="text-xs text-gray-500 mt-1 flex items-center">
              <Calendar size={10} className="mr-1" />
              候補：{activePlan.dateStart}
              {activePlan.dateEnd && ` - ${activePlan.dateEnd}`}
            </p>
            <div className="mt-3 flex space-x-2">
              <button className="flex-1 bg-white text-blue-600 text-xs py-2 rounded-lg font-bold shadow-sm">
                LINEで返信
              </button>
              <button
                onClick={() => onNavigate?.('plan')}
                className="flex-1 bg-blue-600 text-white text-xs py-2 rounded-lg font-bold shadow-sm"
              >
                詳細・しおり
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
