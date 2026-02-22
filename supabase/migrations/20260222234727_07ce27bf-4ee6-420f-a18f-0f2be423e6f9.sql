
-- Add validation constraints to leads table
ALTER TABLE public.leads ADD CONSTRAINT phone_format CHECK (phone ~ '^[\d\s\-\+\(\)]+$' AND length(phone) BETWEEN 8 AND 30);
ALTER TABLE public.leads ADD CONSTRAINT name_length CHECK (length(name) BETWEEN 2 AND 100);

-- Replace permissive INSERT policy with a rate-limited one using a function
DROP POLICY "Allow anonymous inserts" ON public.leads;

CREATE OR REPLACE FUNCTION public.check_lead_rate_limit()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT (
    SELECT count(*) FROM public.leads
    WHERE created_at > now() - interval '1 hour'
    AND phone = current_setting('request.headers', true)::json->>'x-forwarded-for'
  ) < 5;
$$;

-- Simple rate limit: max 10 leads per minute globally (prevents mass spam)
CREATE POLICY "Rate limited anonymous inserts"
ON public.leads FOR INSERT
WITH CHECK (
  (SELECT count(*) FROM public.leads WHERE created_at > now() - interval '1 minute') < 10
);
