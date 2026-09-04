-- TILL multi-tenant till schema (additive)
-- Roles for tenant membership
DO $$ BEGIN
  CREATE TYPE public.tenant_role AS ENUM ('owner', 'admin', 'operator', 'viewer');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.till_job_status AS ENUM (
    'pending', 'awaiting_signature', 'submitting', 'confirmed', 'failed', 'rejected'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.till_asset AS ENUM ('cNGN', 'USDC', 'USDT', 'USAT', 'OTHER');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.tenants TO authenticated;
GRANT ALL ON public.tenants TO service_role;
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.tenant_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.tenant_role NOT NULL DEFAULT 'operator',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, user_id)
);
GRANT SELECT ON public.tenant_members TO authenticated;
GRANT ALL ON public.tenant_members TO service_role;
ALTER TABLE public.tenant_members ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_tenant_member(_tenant_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.tenant_members
    WHERE tenant_id = _tenant_id AND user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.has_tenant_role(_tenant_id uuid, _role public.tenant_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.tenant_members
    WHERE tenant_id = _tenant_id AND user_id = auth.uid() AND role = _role
  );
$$;

REVOKE ALL ON FUNCTION public.is_tenant_member(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.has_tenant_role(uuid, public.tenant_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_tenant_member(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.has_tenant_role(uuid, public.tenant_role) TO authenticated, service_role;

CREATE POLICY "members read tenants"
  ON public.tenants FOR SELECT TO authenticated
  USING (public.is_tenant_member(id));

CREATE POLICY "members read membership"
  ON public.tenant_members FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_tenant_member(tenant_id));

CREATE TABLE IF NOT EXISTS public.agent_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL UNIQUE REFERENCES public.tenants(id) ON DELETE CASCADE,
  attribution_tag text,
  agent_wallet text,
  erc8004_url text,
  erc8004_agent_id text,
  telegram_bot_username text,
  primary_track text NOT NULL DEFAULT 'real-world-adoption',
  other_wallets jsonb NOT NULL DEFAULT '[]'::jsonb,
  own_contracts jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.agent_config TO authenticated;
GRANT ALL ON public.agent_config TO service_role;
ALTER TABLE public.agent_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members read agent_config"
  ON public.agent_config FOR SELECT TO authenticated
  USING (public.is_tenant_member(tenant_id));
CREATE POLICY "owners update agent_config"
  ON public.agent_config FOR UPDATE TO authenticated
  USING (public.has_tenant_role(tenant_id, 'owner') OR public.has_tenant_role(tenant_id, 'admin'))
  WITH CHECK (public.has_tenant_role(tenant_id, 'owner') OR public.has_tenant_role(tenant_id, 'admin'));

CREATE TABLE IF NOT EXISTS public.counterparties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  wallet_address text NOT NULL,
  label text,
  telegram_user_id text,
  independence_status text NOT NULL DEFAULT 'unknown',
  first_seen_on_celo timestamptz,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, wallet_address)
);
GRANT SELECT, INSERT, UPDATE ON public.counterparties TO authenticated;
GRANT ALL ON public.counterparties TO service_role;
ALTER TABLE public.counterparties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members rw counterparties"
  ON public.counterparties FOR ALL TO authenticated
  USING (public.is_tenant_member(tenant_id))
  WITH CHECK (public.is_tenant_member(tenant_id));

CREATE TABLE IF NOT EXISTS public.till_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  telegram_chat_id text,
  telegram_user_id text,
  payer_wallet text,
  counterparty_id uuid REFERENCES public.counterparties(id),
  counterparty_wallet text NOT NULL,
  asset public.till_asset NOT NULL,
  amount_atomic text NOT NULL,
  amount_display text,
  status public.till_job_status NOT NULL DEFAULT 'pending',
  intent_raw text,
  authorization_payload jsonb,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.till_jobs TO authenticated;
GRANT ALL ON public.till_jobs TO service_role;
ALTER TABLE public.till_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members read till_jobs"
  ON public.till_jobs FOR SELECT TO authenticated
  USING (public.is_tenant_member(tenant_id));
CREATE TRIGGER till_jobs_updated BEFORE UPDATE ON public.till_jobs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.till_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  job_id uuid REFERENCES public.till_jobs(id) ON DELETE SET NULL,
  tx_hash text NOT NULL,
  asset public.till_asset NOT NULL,
  amount_atomic text NOT NULL,
  amount_display text,
  from_wallet text NOT NULL,
  to_wallet text NOT NULL,
  path text NOT NULL DEFAULT 'eip3009',
  attribution_tag text,
  attribution_verified boolean NOT NULL DEFAULT false,
  fee_currency text,
  celoscan_url text,
  block_number bigint,
  confirmed_at timestamptz,
  raw jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, tx_hash)
);
GRANT SELECT ON public.till_transactions TO authenticated;
GRANT ALL ON public.till_transactions TO service_role;
ALTER TABLE public.till_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members read till_transactions"
  ON public.till_transactions FOR SELECT TO authenticated
  USING (public.is_tenant_member(tenant_id));

CREATE TABLE IF NOT EXISTS public.attribution_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  tx_hash text NOT NULL,
  codes jsonb NOT NULL DEFAULT '[]'::jsonb,
  schema_id integer,
  verified boolean NOT NULL DEFAULT false,
  verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.attribution_events TO authenticated;
GRANT ALL ON public.attribution_events TO service_role;
ALTER TABLE public.attribution_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members read attribution_events"
  ON public.attribution_events FOR SELECT TO authenticated
  USING (public.is_tenant_member(tenant_id));

-- Bootstrap default tenant helper (service role / first admin)
CREATE OR REPLACE FUNCTION public.ensure_default_till_tenant(_user_id uuid, _slug text DEFAULT 'till', _name text DEFAULT 'TILL')
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  tid uuid;
BEGIN
  SELECT id INTO tid FROM public.tenants WHERE slug = _slug;
  IF tid IS NULL THEN
    INSERT INTO public.tenants (slug, name) VALUES (_slug, _name) RETURNING id INTO tid;
    INSERT INTO public.agent_config (tenant_id) VALUES (tid);
  END IF;
  INSERT INTO public.tenant_members (tenant_id, user_id, role)
  VALUES (tid, _user_id, 'owner')
  ON CONFLICT (tenant_id, user_id) DO NOTHING;
  RETURN tid;
END;
$$;
REVOKE ALL ON FUNCTION public.ensure_default_till_tenant(uuid, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.ensure_default_till_tenant(uuid, text, text) TO authenticated, service_role;

CREATE TRIGGER tenants_updated BEFORE UPDATE ON public.tenants
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER agent_config_updated BEFORE UPDATE ON public.agent_config
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
