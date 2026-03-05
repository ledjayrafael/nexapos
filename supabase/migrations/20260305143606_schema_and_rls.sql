-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Create Tables
create type user_role as enum ('developer', 'cashier');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  store_id uuid not null,
  role user_role not null default 'cashier',
  email text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.products (
  id uuid primary key default uuid_generate_v4(),
  store_id uuid not null,
  name text not null,
  price numeric not null,
  stock int not null default 0,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.transactions (
  id uuid primary key default uuid_generate_v4(),
  store_id uuid not null,
  cashier_id uuid not null references public.profiles(id),
  total_price numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.order_items (
  id uuid primary key default uuid_generate_v4(),
  transaction_id uuid not null references public.transactions(id) on delete cascade,
  product_id uuid not null references public.products(id),
  quantity int not null,
  price_at_time numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Helper functions to avoid infinite recursion in RLS
create or replace function public.get_auth_store_id()
returns uuid
language sql
security definer
set search_path = public
as $$
  select store_id from public.profiles where id = auth.uid();
$$;

create or replace function public.get_auth_user_role()
returns user_role
language sql
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- 2. Row Level Security
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.transactions enable row level security;
alter table public.order_items enable row level security;

-- Policies for profiles
create policy "Users can view profiles in their store"
on public.profiles for select
using (store_id = public.get_auth_store_id());

create policy "Users can update their own profile"
on public.profiles for update
using (id = auth.uid());

create policy "Developer can insert profiles in their store"
on public.profiles for insert
with check (
  role = 'cashier' 
  and store_id = public.get_auth_store_id() 
  and public.get_auth_user_role() = 'developer'
);

create policy "Developer can update profiles in their store"
on public.profiles for update
using (
  store_id = public.get_auth_store_id() 
  and public.get_auth_user_role() = 'developer'
);

create policy "Developer can delete profiles in their store"
on public.profiles for delete
using (
  store_id = public.get_auth_store_id() 
  and public.get_auth_user_role() = 'developer'
);

-- Policies for products
create policy "Users can view products in their store"
on public.products for select
using (store_id = public.get_auth_store_id());

create policy "Users can insert products in their store"
on public.products for insert
with check (store_id = public.get_auth_store_id());

create policy "Users can update products in their store"
on public.products for update
using (store_id = public.get_auth_store_id());

create policy "Users can delete products in their store"
on public.products for delete
using (store_id = public.get_auth_store_id());

-- Policies for transactions
create policy "Users can view transactions in their store"
on public.transactions for select
using (store_id = public.get_auth_store_id());

create policy "Users can insert transactions in their store"
on public.transactions for insert
with check (store_id = public.get_auth_store_id());

-- Policies for order_items
create policy "Users can view order_items in their store"
on public.order_items for select
using (
  transaction_id in (
    select id from public.transactions where store_id = public.get_auth_store_id()
  )
);

create policy "Users can insert order_items in their store"
on public.order_items for insert
with check (
  transaction_id in (
    select id from public.transactions where store_id = public.get_auth_store_id()
  )
);

-- 3. Triggers for Stock Reduction
create or replace function public.reduce_product_stock()
returns trigger as $$
begin
  update public.products
  set stock = stock - NEW.quantity
  where id = NEW.product_id;
  return NEW;
end;
$$ language plpgsql security definer;

create trigger tr_reduce_product_stock
after insert on public.order_items
for each row execute function public.reduce_product_stock();

-- 4. Storage Bucket
insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true)
on conflict do nothing;

create policy "Anyone can view product images"
on storage.objects for select
using ( bucket_id = 'product-images' );

create policy "Authenticated users can upload product images"
on storage.objects for insert
with check ( bucket_id = 'product-images' and auth.role() = 'authenticated' );

create policy "Authenticated users can update product images"
on storage.objects for update
using ( bucket_id = 'product-images' and auth.role() = 'authenticated' );

create policy "Authenticated users can delete product images"
on storage.objects for delete
using ( bucket_id = 'product-images' and auth.role() = 'authenticated' );

-- Create trigger on auth.users to create profile (First user becomes developer)
create or replace function public.handle_new_user()
returns trigger as $$
declare
  is_first_user boolean;
  assigned_store_id uuid;
begin
  select count(*) = 0 into is_first_user from public.profiles;
  
  -- Prevent trigger from failing if profile is inserted manually before trigger logic
  if exists (select 1 from public.profiles where id = new.id) then
    return new;
  end if;

  if is_first_user then
    assigned_store_id := uuid_generate_v4();
    insert into public.profiles (id, store_id, role, email)
    values (new.id, assigned_store_id, 'developer', new.email);
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
