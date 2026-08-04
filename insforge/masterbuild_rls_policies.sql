-- MasterBuild RLS Policies -- production ownership boundary
-- Apply after masterbuild_schema.sql and masterbuild_schema_v2.sql.
-- The server runtime uses the service role; browser sessions are owner-scoped.

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

-- Missions are the ownership root. Existing rows with a NULL owner_id remain
-- inaccessible to browser sessions until an explicit, reviewed backfill.
DROP POLICY IF EXISTS missions_select_authenticated ON public.missions;
CREATE POLICY missions_select_authenticated ON public.missions
  FOR SELECT TO authenticated
  USING (owner_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS missions_insert_service ON public.missions;
CREATE POLICY missions_insert_service ON public.missions
  FOR INSERT TO authenticated
  WITH CHECK (owner_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS missions_update_service ON public.missions;
CREATE POLICY missions_update_service ON public.missions
  FOR UPDATE TO authenticated
  USING (owner_id = (SELECT auth.uid()))
  WITH CHECK (owner_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS missions_delete_service ON public.missions;
CREATE POLICY missions_delete_service ON public.missions
  FOR DELETE TO authenticated
  USING (owner_id = (SELECT auth.uid()));

-- Child records inherit access from their mission through a SECURITY DEFINER
-- helper, avoiding recursive RLS joins between the child and parent tables.
DROP POLICY IF EXISTS agents_select_all ON public.agents;
CREATE POLICY agents_select_all ON public.agents
  FOR SELECT TO authenticated USING (public.masterbuild_mission_owned(mission_id));
DROP POLICY IF EXISTS agents_insert_all ON public.agents;
CREATE POLICY agents_insert_all ON public.agents
  FOR INSERT TO authenticated WITH CHECK (public.masterbuild_mission_owned(mission_id));
DROP POLICY IF EXISTS agents_update_all ON public.agents;
CREATE POLICY agents_update_all ON public.agents
  FOR UPDATE TO authenticated
  USING (public.masterbuild_mission_owned(mission_id))
  WITH CHECK (public.masterbuild_mission_owned(mission_id));
DROP POLICY IF EXISTS agents_delete_all ON public.agents;
CREATE POLICY agents_delete_all ON public.agents
  FOR DELETE TO authenticated USING (public.masterbuild_mission_owned(mission_id));

DROP POLICY IF EXISTS discoveries_select_all ON public.discoveries;
CREATE POLICY discoveries_select_all ON public.discoveries
  FOR SELECT TO authenticated USING (public.masterbuild_mission_owned(mission_id));
DROP POLICY IF EXISTS discoveries_insert_all ON public.discoveries;
CREATE POLICY discoveries_insert_all ON public.discoveries
  FOR INSERT TO authenticated WITH CHECK (public.masterbuild_mission_owned(mission_id));
DROP POLICY IF EXISTS discoveries_delete_all ON public.discoveries;
CREATE POLICY discoveries_delete_all ON public.discoveries
  FOR DELETE TO authenticated USING (public.masterbuild_mission_owned(mission_id));

DROP POLICY IF EXISTS logs_select_all ON public.logs;
CREATE POLICY logs_select_all ON public.logs
  FOR SELECT TO authenticated USING (public.masterbuild_mission_owned(mission_id));
DROP POLICY IF EXISTS logs_insert_all ON public.logs;
CREATE POLICY logs_insert_all ON public.logs
  FOR INSERT TO authenticated WITH CHECK (public.masterbuild_mission_owned(mission_id));
DROP POLICY IF EXISTS logs_delete_all ON public.logs;
CREATE POLICY logs_delete_all ON public.logs
  FOR DELETE TO authenticated USING (public.masterbuild_mission_owned(mission_id));

DROP POLICY IF EXISTS signals_select_all ON public.signals;
CREATE POLICY signals_select_all ON public.signals
  FOR SELECT TO authenticated USING (public.masterbuild_mission_owned(mission_id));
DROP POLICY IF EXISTS signals_insert_all ON public.signals;
CREATE POLICY signals_insert_all ON public.signals
  FOR INSERT TO authenticated WITH CHECK (public.masterbuild_mission_owned(mission_id));
DROP POLICY IF EXISTS signals_delete_all ON public.signals;
CREATE POLICY signals_delete_all ON public.signals
  FOR DELETE TO authenticated USING (public.masterbuild_mission_owned(mission_id));

DROP POLICY IF EXISTS control_commands_select_all ON public.control_commands;
CREATE POLICY control_commands_select_all ON public.control_commands
  FOR SELECT TO authenticated USING (public.masterbuild_mission_owned(mission_id));
DROP POLICY IF EXISTS control_commands_insert_all ON public.control_commands;
CREATE POLICY control_commands_insert_all ON public.control_commands
  FOR INSERT TO authenticated WITH CHECK (public.masterbuild_mission_owned(mission_id));
DROP POLICY IF EXISTS control_commands_update_all ON public.control_commands;
CREATE POLICY control_commands_update_all ON public.control_commands
  FOR UPDATE TO authenticated
  USING (public.masterbuild_mission_owned(mission_id))
  WITH CHECK (public.masterbuild_mission_owned(mission_id));
DROP POLICY IF EXISTS control_commands_delete_all ON public.control_commands;
CREATE POLICY control_commands_delete_all ON public.control_commands
  FOR DELETE TO authenticated USING (public.masterbuild_mission_owned(mission_id));

DROP POLICY IF EXISTS agent_memory_select_all ON public.agent_memory;
CREATE POLICY agent_memory_select_all ON public.agent_memory
  FOR SELECT TO authenticated USING (public.masterbuild_mission_owned(mission_id));
DROP POLICY IF EXISTS agent_memory_insert_all ON public.agent_memory;
CREATE POLICY agent_memory_insert_all ON public.agent_memory
  FOR INSERT TO authenticated WITH CHECK (public.masterbuild_mission_owned(mission_id));
DROP POLICY IF EXISTS agent_memory_update_all ON public.agent_memory;
CREATE POLICY agent_memory_update_all ON public.agent_memory
  FOR UPDATE TO authenticated
  USING (public.masterbuild_mission_owned(mission_id))
  WITH CHECK (public.masterbuild_mission_owned(mission_id));
DROP POLICY IF EXISTS agent_memory_delete_all ON public.agent_memory;
CREATE POLICY agent_memory_delete_all ON public.agent_memory
  FOR DELETE TO authenticated USING (public.masterbuild_mission_owned(mission_id));

DROP POLICY IF EXISTS agent_thoughts_select_all ON public.agent_thoughts;
CREATE POLICY agent_thoughts_select_all ON public.agent_thoughts
  FOR SELECT TO authenticated USING (public.masterbuild_mission_owned(mission_id));
DROP POLICY IF EXISTS agent_thoughts_insert_all ON public.agent_thoughts;
CREATE POLICY agent_thoughts_insert_all ON public.agent_thoughts
  FOR INSERT TO authenticated WITH CHECK (public.masterbuild_mission_owned(mission_id));
DROP POLICY IF EXISTS agent_thoughts_delete_all ON public.agent_thoughts;
CREATE POLICY agent_thoughts_delete_all ON public.agent_thoughts
  FOR DELETE TO authenticated USING (public.masterbuild_mission_owned(mission_id));

DROP POLICY IF EXISTS business_plans_select_all ON public.business_plans;
CREATE POLICY business_plans_select_all ON public.business_plans
  FOR SELECT TO authenticated USING (public.masterbuild_mission_owned(mission_id));
DROP POLICY IF EXISTS business_plans_insert_all ON public.business_plans;
CREATE POLICY business_plans_insert_all ON public.business_plans
  FOR INSERT TO authenticated WITH CHECK (public.masterbuild_mission_owned(mission_id));
DROP POLICY IF EXISTS business_plans_delete_all ON public.business_plans;
CREATE POLICY business_plans_delete_all ON public.business_plans
  FOR DELETE TO authenticated USING (public.masterbuild_mission_owned(mission_id));

DROP POLICY IF EXISTS builder_outputs_select_all ON public.builder_outputs;
CREATE POLICY builder_outputs_select_all ON public.builder_outputs
  FOR SELECT TO authenticated USING (public.masterbuild_mission_owned(mission_id));
DROP POLICY IF EXISTS builder_outputs_insert_all ON public.builder_outputs;
CREATE POLICY builder_outputs_insert_all ON public.builder_outputs
  FOR INSERT TO authenticated WITH CHECK (public.masterbuild_mission_owned(mission_id));
DROP POLICY IF EXISTS builder_outputs_update_all ON public.builder_outputs;
CREATE POLICY builder_outputs_update_all ON public.builder_outputs
  FOR UPDATE TO authenticated
  USING (public.masterbuild_mission_owned(mission_id))
  WITH CHECK (public.masterbuild_mission_owned(mission_id));
DROP POLICY IF EXISTS builder_outputs_delete_all ON public.builder_outputs;
CREATE POLICY builder_outputs_delete_all ON public.builder_outputs
  FOR DELETE TO authenticated USING (public.masterbuild_mission_owned(mission_id));
