-- Migration: Fix agent_id unique constraint to allow multiple missions
-- This allows each mission to have its own agents 1-5

-- Drop the old unique constraint on agent_id alone
alter table public.agents drop constraint if exists agents_agent_id_key;

-- Add composite unique constraint on (mission_id, agent_id)
alter table public.agents add constraint agents_mission_agent_unique unique (mission_id, agent_id);
