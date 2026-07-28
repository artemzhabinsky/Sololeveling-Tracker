-- Sololeveling Tracker schema. Apply manually in the Supabase SQL editor (Task 27).
create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key default '00000000-0000-0000-0000-000000000001',
  user_id uuid not null default '00000000-0000-0000-0000-000000000001',
  level int not null default 1,
  xp int not null default 0,
  coins int not null default 0,
  hp int not null default 3 check (hp >= 0 and hp <= 3),
  attr_str int not null default 0,
  attr_int int not null default 0,
  attr_vit int not null default 0,
  attr_gold int not null default 0,
  attr_disc int not null default 0,
  last_hp_check_date date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into profiles (id) values ('00000000-0000-0000-0000-000000000001')
  on conflict (id) do nothing;

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null check (category in ('physical','mental','spirit','finance','discipline')),
  rank text not null check (rank in ('E','D','C','B','A','S')),
  xp_reward int not null,
  coin_reward int not null,
  status text not null default 'todo' check (status in ('todo','in_progress','done')),
  due_date date,
  completed_at timestamptz,
  -- Soft delete: null means live. Deliberately no default — a task is deleted
  -- only when the client stamps this.
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists daily_quests (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  last_completed_date date,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists shop_rewards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  cost_coins int not null check (cost_coins > 0),
  created_at timestamptz not null default now()
);

create table if not exists user_inventory (
  id uuid primary key default gen_random_uuid(),
  shop_reward_id uuid references shop_rewards(id) on delete set null,
  purchased_at timestamptz not null default now(),
  expires_at timestamptz not null,
  used_at timestamptz,
  status text not null default 'active' check (status in ('active','used','expired'))
);

create table if not exists analytics_logs (
  id uuid primary key default gen_random_uuid(),
  log_date date not null unique,
  xp_gained int not null default 0,
  tasks_completed int not null default 0,
  category_breakdown jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists system_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  occurred_at timestamptz not null default now()
);

-- RLS left permissive for now (no auth yet). Revisit when Supabase Auth is added.
alter table profiles enable row level security;
alter table tasks enable row level security;
alter table daily_quests enable row level security;
alter table shop_rewards enable row level security;
alter table user_inventory enable row level security;
alter table analytics_logs enable row level security;
alter table system_events enable row level security;

create policy "public read/write" on profiles for all using (true) with check (true);
create policy "public read/write" on tasks for all using (true) with check (true);
create policy "public read/write" on daily_quests for all using (true) with check (true);
create policy "public read/write" on shop_rewards for all using (true) with check (true);
create policy "public read/write" on user_inventory for all using (true) with check (true);
create policy "public read/write" on analytics_logs for all using (true) with check (true);
create policy "public read/write" on system_events for all using (true) with check (true);
