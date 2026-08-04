-- MasterBuild owner isolation migration.
-- Apply after masterbuild_schema.sql and masterbuild_schema_v2.sql.
-- Existing rows are intentionally left with NULL owner_id and are invisible to
-- browser sessions until an explicit, reviewed backfill assigns ownership.

ALTER TABLE public.missions
  ADD COLUMN IF NOT EXISTS owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS missions_owner_id_created_at_idx
  ON public.missions (owner_id, created_at DESC);

CREATE OR REPLACE FUNCTION public.masterbuild_mission_owned(mission_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.missions
    WHERE id = mission_uuid
      AND owner_id = (SELECT auth.uid())
  );
$$;

REVOKE ALL ON FUNCTION public.masterbuild_mission_owned(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.masterbuild_mission_owned(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.prevent_masterbuild_owner_change()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.owner_id IS DISTINCT FROM OLD.owner_id THEN
    RAISE EXCEPTION 'mission owner_id cannot be changed';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS missions_prevent_owner_change ON public.missions;
CREATE TRIGGER missions_prevent_owner_change
BEFORE UPDATE ON public.missions
FOR EACH ROW
EXECUTE FUNCTION public.prevent_masterbuild_owner_change();

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON
  public.missions,
  public.agents,
  public.discoveries,
  public.logs,
  public.signals,
  public.control_commands,
  public.agent_memory,
  public.agent_thoughts,
  public.business_plans,
  public.builder_outputs
TO authenticated;

ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discoveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.control_commands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_thoughts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.builder_outputs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS missions_select_authenticated ON public.missions;
CREATE POLICY missions_select_authenticated ON public.missions
  FOR SELECT TO authenticated USING (owner_id = (SELECT auth.uid()));
DROP POLICY IF EXISTS missions_insert_service ON public.missions;
CREATE POLICY missions_insert_service ON public.missions
  FOR INSERT TO authenticated WITH CHECK (owner_id = (SELECT auth.uid()));
DROP POLICY IF EXISTS missions_update_service ON public.missions;
CREATE POLICY missions_update_service ON public.missions
  FOR UPDATE TO authenticated
  USING (owner_id = (SELECT auth.uid()))
  WITH CHECK (owner_id = (SELECT auth.uid()));
DROP POLICY IF EXISTS missions_delete_service ON public.missions;
CREATE POLICY missions_delete_service ON public.missions
  FOR DELETE TO authenticated USING (owner_id = (SELECT auth.uid()));

DO $$
DECLARE
  table_name text;
  policy_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'agents', 'discoveries', 'logs', 'signals', 'control_commands',
    'agent_memory', 'agent_thoughts', 'business_plans', 'builder_outputs'
  ] LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);

    policy_name := table_name || '_select_all';
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', policy_name, table_name);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR SELECT TO authenticated USING (public.masterbuild_mission_owned(mission_id))',
      policy_name, table_name
    );

    policy_name := table_name || '_insert_all';
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', policy_name, table_name);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR INSERT TO authenticated WITH CHECK (public.masterbuild_mission_owned(mission_id))',
      policy_name, table_name
    );

    policy_name := table_name || '_delete_all';
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', policy_name, table_name);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR DELETE TO authenticated USING (public.masterbuild_mission_owned(mission_id))',
      policy_name, table_name
    );
  END LOOP;

  FOREACH table_name IN ARRAY ARRAY['agents', 'control_commands', 'agent_memory', 'builder_outputs'] LOOP
    policy_name := table_name || '_update_all';
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', policy_name, table_name);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR UPDATE TO authenticated USING (public.masterbuild_mission_owned(mission_id)) WITH CHECK (public.masterbuild_mission_owned(mission_id))',
      policy_name, table_name
    );
  END LOOP;
END;
$$;

CREATE OR REPLACE FUNCTION public.reset_masterbuild()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
DECLARE
  v_owner_id uuid := auth.uid();
BEGIN
  IF v_owner_id IS NULL THEN
    RAISE EXCEPTION 'An authenticated owner is required to reset MasterBuild data';
  END IF;

  DELETE FROM public.builder_outputs WHERE mission_id IN (SELECT id FROM public.missions WHERE owner_id = v_owner_id);
  DELETE FROM public.business_plans WHERE mission_id IN (SELECT id FROM public.missions WHERE owner_id = v_owner_id);
  DELETE FROM public.agent_thoughts WHERE mission_id IN (SELECT id FROM public.missions WHERE owner_id = v_owner_id);
  DELETE FROM public.agent_memory WHERE mission_id IN (SELECT id FROM public.missions WHERE owner_id = v_owner_id);
  DELETE FROM public.control_commands WHERE mission_id IN (SELECT id FROM public.missions WHERE owner_id = v_owner_id);
  DELETE FROM public.signals WHERE mission_id IN (SELECT id FROM public.missions WHERE owner_id = v_owner_id);
  DELETE FROM public.logs WHERE mission_id IN (SELECT id FROM public.missions WHERE owner_id = v_owner_id);
  DELETE FROM public.discoveries WHERE mission_id IN (SELECT id FROM public.missions WHERE owner_id = v_owner_id);
  DELETE FROM public.agents WHERE mission_id IN (SELECT id FROM public.missions WHERE owner_id = v_owner_id);
  DELETE FROM public.missions WHERE owner_id = v_owner_id;
END;
$$;

REVOKE ALL ON FUNCTION public.reset_masterbuild() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.reset_masterbuild() TO authenticated;

CREATE OR REPLACE FUNCTION public.start_masterbuild_mission(mission_prompt text)
RETURNS TABLE (mission_id uuid, prompt text, status text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
DECLARE
  v_mission_id uuid := gen_random_uuid();
  v_now timestamptz := timezone('utc', now());
  v_owner_id uuid := auth.uid();
BEGIN
  IF v_owner_id IS NULL THEN
    RAISE EXCEPTION 'An authenticated owner is required to start a MasterBuild mission';
  END IF;

  PERFORM public.reset_masterbuild();

  INSERT INTO public.missions (
    id, owner_id, prompt, status,
    live_url_1, live_url_2, live_url_3, live_url_4, live_url_5,
    created_at, updated_at
  ) VALUES (
    v_mission_id, v_owner_id, mission_prompt, 'queued',
    '/agent-stream/1', '/agent-stream/2', '/agent-stream/3', '/agent-stream/4', '/agent-stream/5',
    v_now, v_now
  );

  INSERT INTO public.agents (
    mission_id, agent_id, name, platform, role, status, preview_url,
    assignment, energy, status_detail, failure_reason, retry_count,
    confidence, created_at, updated_at, last_heartbeat
  ) VALUES
    (v_mission_id, 1, 'Echo', 'youtube', 'Shorts Scan', 'queued', '/agent-stream/1', mission_prompt, 100, 'Queued for worker pickup.', '', 0, null, v_now, v_now, v_now),
    (v_mission_id, 2, 'Pulse', 'x', 'Conversation Scan', 'queued', '/agent-stream/2', mission_prompt, 100, 'Queued for worker pickup.', '', 0, null, v_now, v_now, v_now),
    (v_mission_id, 3, 'Thread', 'reddit', 'Community Scan', 'queued', '/agent-stream/3', mission_prompt, 100, 'Queued for worker pickup.', '', 0, null, v_now, v_now, v_now),
    (v_mission_id, 4, 'Ledger', 'substack', 'Narrative Scan', 'queued', '/agent-stream/4', mission_prompt, 100, 'Queued for worker pickup.', '', 0, null, v_now, v_now, v_now),
    (v_mission_id, 5, 'Atlas', 'market_research', 'Market Research', 'queued', '/agent-stream/5', mission_prompt, 100, 'Queued for worker pickup.', '', 0, null, v_now, v_now, v_now);

  INSERT INTO public.logs (mission_id, agent_id, type, message, metadata, created_at)
  VALUES (v_mission_id, null, 'status', 'Mission queued and awaiting worker pickup.', jsonb_build_object('prompt', mission_prompt), v_now);

  RETURN QUERY SELECT v_mission_id, mission_prompt, 'queued'::text;
END;
$$;

REVOKE ALL ON FUNCTION public.start_masterbuild_mission(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.start_masterbuild_mission(text) TO authenticated;
