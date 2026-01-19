-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create journal_entries table
CREATE TABLE IF NOT EXISTS public.journal_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create trackers table
CREATE TABLE IF NOT EXISTS public.trackers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('habit', 'mood', 'custom')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create tracker_entries table
CREATE TABLE IF NOT EXISTS public.tracker_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tracker_id UUID REFERENCES public.trackers(id) ON DELETE CASCADE NOT NULL,
  value TEXT NOT NULL,
  note TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trackers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracker_entries ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Journal entries policies
CREATE POLICY "Users can view their own journal entries"
  ON public.journal_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own journal entries"
  ON public.journal_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journal entries"
  ON public.journal_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journal entries"
  ON public.journal_entries FOR DELETE
  USING (auth.uid() = user_id);

-- Trackers policies
CREATE POLICY "Users can view their own trackers"
  ON public.trackers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own trackers"
  ON public.trackers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trackers"
  ON public.trackers FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trackers"
  ON public.trackers FOR DELETE
  USING (auth.uid() = user_id);

-- Tracker entries policies
CREATE POLICY "Users can view entries for their trackers"
  ON public.tracker_entries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.trackers
      WHERE trackers.id = tracker_entries.tracker_id
      AND trackers.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create entries for their trackers"
  ON public.tracker_entries FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.trackers
      WHERE trackers.id = tracker_entries.tracker_id
      AND trackers.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update entries for their trackers"
  ON public.tracker_entries FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.trackers
      WHERE trackers.id = tracker_entries.tracker_id
      AND trackers.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete entries for their trackers"
  ON public.tracker_entries FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.trackers
      WHERE trackers.id = tracker_entries.tracker_id
      AND trackers.user_id = auth.uid()
    )
  );

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_journal_entries_updated_at
  BEFORE UPDATE ON public.journal_entries
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
