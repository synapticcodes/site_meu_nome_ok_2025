alter table services drop constraint if exists services_contrato_template_id_fkey;
alter table services add constraint services_contrato_template_id_fkey foreign key (contrato_template_id) references contract_templates (id) on delete set null;;
