import { supabase } from './supabase';

export interface Stock {
  id: string;
  user_id: string;
  group_id: string | null;
  title: string;
  url: string | null;
  image_url: string | null;
  category: 'gourmet' | 'travel' | 'outing' | 'event';
  location: string | null;
  note: string | null;
  status: 'active' | 'done' | 'archived';
  created_at: string;
}

export interface CreateStockInput {
  title: string;
  category: 'gourmet' | 'travel' | 'outing' | 'event';
  group_id?: string | null;
  url?: string | null;
  image_url?: string | null;
  location?: string | null;
  note?: string | null;
}

// ストック一覧取得
export async function getStocks(groupId?: string | null): Promise<Stock[]> {
  let query = supabase
    .from('stocks')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (groupId === 'self' || groupId === null) {
    // 自分のストック（グループなし）
    query = query.is('group_id', null);
  } else if (groupId) {
    // グループのストック
    query = query.eq('group_id', groupId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching stocks:', error);
    return [];
  }

  return data || [];
}

// 全ストック取得（個人用）
export async function getMyStocks(): Promise<Stock[]> {
  const { data, error } = await supabase
    .from('stocks')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching stocks:', error);
    return [];
  }

  return data || [];
}

// ストック作成
export async function createStock(input: CreateStockInput): Promise<Stock | null> {
  const { data, error } = await supabase
    .from('stocks')
    .insert({
      user_id: 'anonymous',
      title: input.title,
      category: input.category,
      group_id: input.group_id || null,
      url: input.url || null,
      image_url: input.image_url || null,
      location: input.location || null,
      note: input.note || null,
      status: 'active',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating stock:', error);
    return null;
  }

  return data;
}

// ストック更新
export async function updateStock(id: string, input: Partial<CreateStockInput>): Promise<Stock | null> {
  const { data, error } = await supabase
    .from('stocks')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating stock:', error);
    return null;
  }

  return data;
}

// ストック削除（論理削除）
export async function deleteStock(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('stocks')
    .update({ status: 'archived' })
    .eq('id', id);

  if (error) {
    console.error('Error deleting stock:', error);
    return false;
  }

  return true;
}

// グループに共有
export async function shareToGroup(id: string, groupId: string): Promise<Stock | null> {
  const { data, error } = await supabase
    .from('stocks')
    .update({ group_id: groupId })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error sharing stock:', error);
    return null;
  }

  return data;
}
