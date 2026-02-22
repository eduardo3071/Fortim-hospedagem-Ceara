
-- Add restrictive policies for UPDATE and DELETE on leads table
CREATE POLICY "No public updates" ON public.leads FOR UPDATE USING (false);
CREATE POLICY "No public deletes" ON public.leads FOR DELETE USING (false);
