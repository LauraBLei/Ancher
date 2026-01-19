-- Add user_layouts table for customizable dashboard
CREATE TABLE IF NOT EXISTS public.user_layouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  widgets JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.user_layouts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_layouts
CREATE POLICY "Users can view their own layout"
  ON public.user_layouts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own layout"
  ON public.user_layouts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own layout"
  ON public.user_layouts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own layout"
  ON public.user_layouts FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER handle_user_layouts_updated_at
  BEFORE UPDATE ON public.user_layouts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create index for faster lookups
CREATE INDEX idx_user_layouts_user_id ON public.user_layouts(user_id);
