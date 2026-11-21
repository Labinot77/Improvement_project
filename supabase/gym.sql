-- Gym tracking: sessions keep living in `activities`; lifts go in workout_sets,
-- the user's program in workout_templates. Additive only.

alter table public.activities
  add column if not exists workout_name text,
  add column if not exists cardio_type  text,
  add column if not exists cardio_mins  integer,
  add column if not exists distance_km  numeric;

create table if not exists public.workout_sets (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  activity_id uuid not null references public.activities (id) on delete cascade,
  exercise    text not null,
  set_index   integer not null,
  reps        integer not null check (reps > 0),
  weight_kg   numeric not null default 0 check (weight_kg >= 0),
  created_at  timestamptz not null default now()
);
create index if not exists workout_sets_activity_idx on public.workout_sets (activity_id);
create index if not exists workout_sets_user_exercise_idx on public.workout_sets (user_id, exercise);

create table if not exists public.workout_templates (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name       text not null,
  position   integer not null default 0,
  exercises  jsonb not null default '[]'::jsonb, -- [{ "name": "Bench press", "sets": 3, "reps": 8 }]
  created_at timestamptz not null default now()
);

alter table public.workout_sets enable row level security;
alter table public.workout_templates enable row level security;

create policy "workout_sets: own rows" on public.workout_sets
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "workout_templates: own rows" on public.workout_templates
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
