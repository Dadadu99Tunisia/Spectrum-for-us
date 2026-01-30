-- Function to automatically update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger set_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

create trigger set_updated_at
  before update on public.products
  for each row
  execute function public.handle_updated_at();

create trigger set_updated_at
  before update on public.services
  for each row
  execute function public.handle_updated_at();

create trigger set_updated_at
  before update on public.streaming_content
  for each row
  execute function public.handle_updated_at();

create trigger set_updated_at
  before update on public.events
  for each row
  execute function public.handle_updated_at();

create trigger set_updated_at
  before update on public.orders
  for each row
  execute function public.handle_updated_at();

create trigger set_updated_at
  before update on public.reviews
  for each row
  execute function public.handle_updated_at();

create trigger set_updated_at
  before update on public.blog_posts
  for each row
  execute function public.handle_updated_at();

-- Function to create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, new.raw_user_meta_data->>'name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
