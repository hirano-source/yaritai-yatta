// --- Types ---
export type Group = 'family' | 'friends' | 'work' | 'solo' | 'self';
export type Tab = 'stock' | 'home' | 'yaritai' | 'plan' | 'yatta';
export type StockCategory = 'gourmet' | 'travel' | 'outing' | 'event';
export type StockStatus = 'active' | 'done' | 'archived';
export type PlanStatus = 'planning' | 'confirmed' | 'done';
export type AttendanceStatus = 'yes' | 'no' | 'maybe';
export type MemoryFormat = 'text' | 'manga' | 'video';

export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
  lineId?: string;
  createdAt: string;
}

export interface GroupData {
  id: string;
  name: string;
  createdBy: string;
  inviteCode: string;
  createdAt: string;
}

export interface GroupMember {
  groupId: string;
  userId: string;
  role: 'owner' | 'member';
  joinedAt: string;
}

export interface StockItem {
  id: string;
  userId: string;
  groupId?: string;
  title: string;
  url?: string;
  imageUrl: string;
  category: StockCategory;
  location: string;
  note?: string;
  status: StockStatus;
  user: string; // Who stocked it (display name)
  group: Group;
  date: string;
  createdAt: string;
  wantToGoCount: number; // 「行きたい」の数
  wantToGoUsers: string[]; // 「行きたい」を押したユーザー名
  isRead?: boolean; // 既読フラグ（自分が見たか）
}

export type StockSortType = 'newest' | 'popular' | 'category';

export interface StockReaction {
  stockId: string;
  userId: string;
  reaction: 'want_to_go' | 'like';
  createdAt: string;
}

export interface PlanItem {
  id: string;
  groupId: string;
  title: string;
  dateStart: string;
  dateEnd?: string;
  status: PlanStatus;
  itinerary?: ItineraryItem[];
  shioriUrl?: string;
  members: string[];
  createdAt: string;
}

export interface ItineraryItem {
  time: string;
  title: string;
  description?: string;
  location?: string;
  icon?: string;
}

export interface PlanAttendance {
  planId: string;
  userId: string;
  status: AttendanceStatus;
  updatedAt: string;
}

export interface Memory {
  id: string;
  planId: string;
  format: MemoryFormat;
  contentUrl: string;
  createdAt: string;
}

export interface Photo {
  id: string;
  planId: string;
  userId: string;
  url: string;
  takenAt?: string;
  createdAt: string;
}

// AI提案プラン
export interface AIPlanProposal {
  id: string;
  title: string;
  description: string;
  estimatedBudget: string;
  highlight: string;
  basedOnStocks: string[]; // ストックIDの配列
}

// Group Options for UI
export interface GroupOption {
  id: Group;
  label: string;
  icon: string;
}

export const DEFAULT_GROUP_OPTIONS: GroupOption[] = [
  { id: 'self', label: '自分だけ', icon: '📝' },
  { id: 'family', label: '家族', icon: '👨‍👩‍👧' },
  { id: 'friends', label: '友人', icon: '🍺' },
  { id: 'work', label: '会社の同僚', icon: '💼' },
  { id: 'solo', label: 'ひとりで', icon: '☕' },
];
