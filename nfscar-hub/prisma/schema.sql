-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "moddatetime";

-- Businesses table
create table if not exists public.businesses (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  description text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Locations table
create table if not exists public.locations (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  address text,
  google_review_url text not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- NFC Cards table
create table if not exists public.nfc_cards (
  id uuid primary key default uuid_generate_v4(),
  location_id uuid not null references public.locations(id) on delete cascade,
  short_code text not null unique,
  destination_url text not null,
  is_active boolean default true not null,
  tap_count integer default 0 not null,
  last_tap_at timestamp with time zone,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Indexes for performance
create index if not exists idx_locations_business_id on public.locations(business_id);
create index if not exists idx_nfc_cards_location_id on public.nfc_cards(location_id);
create index if not exists idx_nfc_cards_short_code on public.nfc_cards(short_code);
create index if not exists idx_nfc_cards_is_active on public.nfc_cards(is_active);

-- Enable RLS (Row Level Security)
alter table public.businesses enable row level security;
alter table public.locations enable row level security;
alter table public.nfc_cards enable row level security;

-- Create policies for anonymous access (can be restricted later based on auth)
create policy "Allow anonymous read on businesses" on public.businesses
  for select using (true);

create policy "Allow anonymous read on locations" on public.locations
  for select using (true);

create policy "Allow anonymous read on nfc_cards" on public.nfc_cards
  for select using (true);

create policy "Allow anonymous update tap_count on nfc_cards" on public.nfc_cards
  for update using (true);

-- Add updated_at triggers
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_businesses_updated_at
  before update on public.businesses
  for each row execute function update_updated_at();

create trigger update_locations_updated_at
  before update on public.locations
  for each row execute function update_updated_at();

create trigger update_nfc_cards_updated_at
  before update on public.nfc_cards
  for each row execute function update_updated_at();

-- Grant permissions
grant all privileges on public.businesses to public;
grant all privileges on public.locations to public;
grant all privileges on public.nfc_cards to public;
