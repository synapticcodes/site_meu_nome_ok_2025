-- Adds RLS policies for deal-related storage buckets
drop policy if exists "deal_files_select_policy" on storage.objects;
drop policy if exists "deal_files_insert_policy" on storage.objects;
drop policy if exists "deal_files_update_policy" on storage.objects;
drop policy if exists "deal_files_delete_policy" on storage.objects;
create policy "deal_files_select_policy" on storage.objects
for select to public
using (
  bucket_id in ('arquivos_deals', 'audios_deals')
  and (
    is_admin()
    or owner = auth.uid()
    or exists (
      select 1
      from public.deals d
      where d.id::text = split_part(name, '/', 1)
        and d.vendedor_responsavel = auth.uid()
    )
  )
);
create policy "deal_files_insert_policy" on storage.objects
for insert to public
with check (
  bucket_id in ('arquivos_deals', 'audios_deals')
  and (
    is_admin()
    or exists (
      select 1
      from public.deals d
      where d.id::text = split_part(name, '/', 1)
        and d.vendedor_responsavel = auth.uid()
    )
  )
);
create policy "deal_files_update_policy" on storage.objects
for update to public
using (
  bucket_id in ('arquivos_deals', 'audios_deals')
  and (
    is_admin()
    or owner = auth.uid()
    or exists (
      select 1
      from public.deals d
      where d.id::text = split_part(name, '/', 1)
        and d.vendedor_responsavel = auth.uid()
    )
  )
)
with check (
  bucket_id in ('arquivos_deals', 'audios_deals')
  and (
    is_admin()
    or exists (
      select 1
      from public.deals d
      where d.id::text = split_part(name, '/', 1)
        and d.vendedor_responsavel = auth.uid()
    )
  )
);
create policy "deal_files_delete_policy" on storage.objects
for delete to public
using (
  bucket_id in ('arquivos_deals', 'audios_deals')
  and (
    is_admin()
    or owner = auth.uid()
    or exists (
      select 1
      from public.deals d
      where d.id::text = split_part(name, '/', 1)
        and d.vendedor_responsavel = auth.uid()
    )
  )
);
