
-- Recreate as SECURITY DEFINER in a private schema not exposed via the Data API
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA private TO postgres, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;

-- Update all policies to reference the private function
DROP POLICY IF EXISTS "Admins read contact" ON public.contact_messages;
CREATE POLICY "Admins read contact" ON public.contact_messages
  FOR SELECT USING (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Users view own profile" ON public.profiles;
CREATE POLICY "Users view own profile" ON public.profiles
  FOR SELECT USING ((auth.uid() = id) OR private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins manage shipments" ON public.shipments;
CREATE POLICY "Admins manage shipments" ON public.shipments
  FOR ALL USING (private.has_role(auth.uid(), 'admin'))
  WITH CHECK (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Clients view own shipments" ON public.shipments;
CREATE POLICY "Clients view own shipments" ON public.shipments
  FOR SELECT USING ((client_id = auth.uid()) OR private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins manage events" ON public.tracking_events;
CREATE POLICY "Admins manage events" ON public.tracking_events
  FOR ALL USING (private.has_role(auth.uid(), 'admin'))
  WITH CHECK (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Clients view own shipment events" ON public.tracking_events;
CREATE POLICY "Clients view own shipment events" ON public.tracking_events
  FOR SELECT USING (
    private.has_role(auth.uid(), 'admin')
    OR EXISTS (SELECT 1 FROM public.shipments s WHERE s.id = tracking_events.shipment_id AND s.client_id = auth.uid())
  );

DROP POLICY IF EXISTS "Admins manage roles" ON public.user_roles;
CREATE POLICY "Admins manage roles" ON public.user_roles
  FOR ALL USING (private.has_role(auth.uid(), 'admin'))
  WITH CHECK (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Users view own roles" ON public.user_roles;
CREATE POLICY "Users view own roles" ON public.user_roles
  FOR SELECT USING ((auth.uid() = user_id) OR private.has_role(auth.uid(), 'admin'));

-- Drop the public-schema version (was exposed via Data API)
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);
