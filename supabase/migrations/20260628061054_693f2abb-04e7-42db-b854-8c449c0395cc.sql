
-- Restrict has_role: only allow checking your own role to prevent probing other users
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
      AND _user_id = auth.uid()
  )
$$;

-- Replace permissive contact_messages INSERT policy with field validation
DROP POLICY IF EXISTS "Anyone can submit contact" ON public.contact_messages;
CREATE POLICY "Anyone can submit contact"
  ON public.contact_messages
  FOR INSERT
  WITH CHECK (
    length(btrim(name)) > 0
    AND length(btrim(email)) > 0
    AND position('@' in email) > 1
    AND length(btrim(message)) > 0
    AND length(message) <= 5000
  );
