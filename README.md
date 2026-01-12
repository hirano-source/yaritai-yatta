# やりたい・やった！

**「やりたいを、やったに。」**

SNSで「いいな」と思った瞬間を逃さずストックし、仲間と共有し、実際に「やった」に変えるアプリ。

---

## コンセプト

### 解決する問題

**「本音を言えない」問題**
- 「ここ行きたい」と言い出しにくい
- 空気を壊したくない
- 結果、誰かが全部決めて、誰かが我慢する

**このアプリの解決策**
- アプリにストック → 自動で共有される
- アプリが代わりに「○○さんがここ行きたいって」と伝える
- 本人は直接言わなくていい。でも本音は伝わる。

### コアバリュー

1. **全員が選ぶ（子供も）** - 親だけが決めるんじゃない
2. **本音が伝わる（言わなくても）** - アプリが代弁
3. **自分が主役（幹事構造）** - 自分中心でグループを管理
4. **知り合い限定** - 完全招待制、新しい出会いは求めない

---

## ユーザーフロー

```
1. ストック   SNS/WEBで見つける → 共有ボタン → アプリで保存
      ↓
2. 共有      「誰と行きたい？」→ グループに共有 → 「行きたい」リアクション
      ↓
3. 空き日    カレンダーで「この日空いてる」→ 全員揃ったらチャンス
      ↓
4. 予定      AIがストックから仮プランを提案 → 調整 → 確定 → しおり生成
      ↓
5. 実行      お出かけ → 写真/動画をLINEに投げる
      ↓
6. アンケート 帰りにLINE Botでアンケート（どうだった？ベストは？）
      ↓
7. 思い出    写真・動画・アンケートを元に自動生成 → やったリスト
```

---

## ユーザー構造（幹事構造）

```
自分（幹事）
├── グループA：家族（妻、子供）
├── グループB：友人（田中、鈴木）
├── グループC：会社（同僚A、同僚B）
└── グループD：一人用（自分のみ）
```

- 誰でもストックを追加できる（子供も）
- 子ユーザーも別グループでは幹事になれる
- 完全招待制（招待リンクを自分で送る）

---

## 技術スタック

| 領域 | 技術 |
|------|------|
| フレームワーク | Next.js 16 (App Router) |
| 言語 | TypeScript |
| スタイリング | Tailwind CSS |
| 地図 | Leaflet + OpenStreetMap |
| DB/Auth | Supabase |
| ホスティング | Vercel |
| AI（テキスト） | Claude API |
| AI（画像/動画） | Gemini API |
| 通知/Bot | LINE Messaging API |
| カレンダー | Google Calendar API |

---

## セットアップ

```bash
cd yaritai-yatta
npm install
npm run dev
```

http://localhost:3000 で起動

---

## ディレクトリ構成

```
src/
├── app/
│   ├── layout.tsx
│   └── page.tsx          # メインページ（指揮者）
├── components/
│   ├── layout/           # Header, BottomNav
│   ├── ui/               # HomeScreen, ProfileScreen
│   ├── stock/            # 自分のストック
│   ├── yaritai/          # みんなのやりたい
│   ├── plan/             # 予定・AI提案
│   ├── yatta/            # やった！（思い出）
│   └── map/              # 地図
├── lib/
│   ├── mock-data.ts
│   └── supabase.ts
└── types/
    └── index.ts
```

---

## 実装状況

### UI（完了）
- ホーム（グループ切り替え、空き日カレンダー）
- 自分のストック（リスト/マップ）
- みんなのやりたい（リスト/マップ、行きたいリアクション）
- 予定（AI提案、キープ、詳細、しおり）
- やった！（思い出：ブログ風/マンガ風/動画）
- プロフィール

### ロジック（未実装）
- [ ] Supabase連携・認証（メール認証で実装予定）
- [ ] Google認証（Google Cloud課金必要のため後回し）
- [ ] LINE認証（Supabase未サポートのため後回し）
- [ ] グループ機能
- [ ] ストックCRUD
- [ ] AI提案（Claude API）
- [ ] LINE Bot連携
- [ ] Googleカレンダー連携

---

## DB設計

```sql
-- ユーザー
create table users (
  id uuid references auth.users primary key,
  name text,
  avatar_url text,
  line_id text,
  created_at timestamptz default now()
);

-- グループ
create table groups (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  icon text default '👥',
  invite_code text unique default substr(md5(random()::text), 1, 8),
  created_at timestamptz default now()
);

-- グループメンバー
create table group_members (
  group_id uuid references groups(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  joined_at timestamptz default now(),
  primary key (group_id, user_id)
);

-- ストック
create table stocks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id) on delete cascade not null,
  group_id uuid references groups(id) on delete cascade,
  title text not null,
  url text,
  image_url text,
  category text,
  location text,
  note text,
  status text default 'active',
  created_at timestamptz default now()
);

-- ストック既読
create table stock_reads (
  stock_id uuid references stocks(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  read_at timestamptz default now(),
  primary key (stock_id, user_id)
);

-- 行きたいリアクション
create table stock_reactions (
  stock_id uuid references stocks(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (stock_id, user_id)
);

-- 空き日
create table available_dates (
  group_id uuid references groups(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  date date not null,
  primary key (group_id, user_id, date)
);

-- 予定
create table plans (
  id uuid default gen_random_uuid() primary key,
  group_id uuid references groups(id) on delete cascade not null,
  title text not null,
  date_start date,
  date_end date,
  status text default 'planning',
  itinerary jsonb default '[]',
  created_at timestamptz default now()
);

-- 予定の出欠
create table plan_attendances (
  plan_id uuid references plans(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  status text default 'maybe',
  primary key (plan_id, user_id)
);

-- 思い出
create table memories (
  id uuid default gen_random_uuid() primary key,
  plan_id uuid references plans(id) on delete cascade,
  format text default 'text',
  content text,
  created_at timestamptz default now()
);

-- 写真
create table photos (
  id uuid default gen_random_uuid() primary key,
  plan_id uuid references plans(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  url text not null,
  taken_at timestamptz,
  created_at timestamptz default now()
);

-- ユーザー自動作成トリガー
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into users (id, name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name', 'ユーザー'),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
```

---

## LINE Bot連携

**このアプリの本質：LINEで普段通り使う + アプリで全部まとまって見える**

| 機能 | LINEでの操作 | アプリでの表示 |
|------|--------------|----------------|
| ストック通知 | 「○○がここ行きたいって」 | ストック一覧 |
| 出欠 | ◯/×/△をタップ | 出欠状況 |
| 日程調整 | 候補日に反応 | 最有力日 |
| しおり | しおりが届く | フル版 |
| 当日サポート | 「次はここ」 | ルート全体 |
| 写真収集 | LINEに投げる | 時系列で整理 |
| アンケート | 選択肢タップ | 結果グラフ |
| 思い出 | 思い出が届く | フル版 |

---

## AI設計

| 役割 | AI | 理由 |
|------|-----|------|
| URL解析・テキスト処理 | Claude | テキスト理解が得意 |
| 場所提案・工程表生成 | Claude | 論理的な構造化 |
| しおり/思い出（文字版） | Claude | テキスト生成 |
| しおり/思い出（漫画風） | Gemini | 画像生成 |
| しおり/思い出（動画） | Gemini | 動画生成 |

**AIがやること：** 情報抽出、候補提案、ログ生成
**AIがやらないこと：** 感情の代弁、事実の推測

---

## 外部連携

| 連携先 | 用途 |
|--------|------|
| LINE / Google | ログイン認証 |
| Googleカレンダー | 空き日確認、予定登録 |
| Google Maps | 位置情報、ナビ |
| SNS各種 | 共有ボタンからURL受け取り |

---

## 次のステップ

1. DBテーブル作成（Supabase SQL Editor）
2. Google/LINE認証設定
3. 認証UI実装
4. ストック機能実装
