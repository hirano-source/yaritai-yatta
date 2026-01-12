'use client';

import { ChevronRight } from 'lucide-react';

export default function ProfileScreen() {
  return (
    <div className="p-6 text-center animate-fade-in">
      <div className="w-20 h-20 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
        <span className="text-2xl font-bold text-orange-500">U</span>
      </div>
      <h2 className="font-bold text-lg">ユーザー</h2>
      <p className="text-sm text-gray-500 mb-8">未ログイン</p>

      <div className="space-y-2">
        <button className="w-full bg-gray-100 p-3 rounded-xl text-left text-sm font-bold flex justify-between items-center">
          <span>アカウント設定</span>
          <ChevronRight size={16} />
        </button>
        <button className="w-full bg-gray-100 p-3 rounded-xl text-left text-sm font-bold flex justify-between items-center">
          <span>グループ管理</span>
          <ChevronRight size={16} />
        </button>
        <button className="w-full bg-gray-100 p-3 rounded-xl text-left text-sm font-bold flex justify-between items-center">
          <span>通知設定</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
