-- FiveM Copilot Platform Database Schema
-- This script creates all necessary tables for the platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  framework TEXT CHECK (framework IN ('qbcore', 'esx', 'standalone')),
  files JSONB DEFAULT '[]'::jsonb,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Projects policies
CREATE POLICY "projects_select_own" ON public.projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "projects_insert_own" ON public.projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "projects_update_own" ON public.projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "projects_delete_own" ON public.projects FOR DELETE USING (auth.uid() = user_id);

-- Chat sessions table
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'New Chat',
  messages JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on chat_sessions
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;

-- Chat sessions policies
CREATE POLICY "chat_sessions_select_own" ON public.chat_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "chat_sessions_insert_own" ON public.chat_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "chat_sessions_update_own" ON public.chat_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "chat_sessions_delete_own" ON public.chat_sessions FOR DELETE USING (auth.uid() = user_id);

-- Knowledge base documents table
CREATE TABLE IF NOT EXISTS public.knowledge_docs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  framework TEXT CHECK (framework IN ('qbcore', 'esx', 'standalone', 'fivem')),
  doc_type TEXT CHECK (doc_type IN ('api', 'tutorial', 'example', 'reference')),
  tags TEXT[] DEFAULT '{}',
  embedding VECTOR(1536), -- OpenAI embeddings dimension
  metadata JSONB DEFAULT '{}'::jsonb,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on knowledge_docs
ALTER TABLE public.knowledge_docs ENABLE ROW LEVEL SECURITY;

-- Knowledge docs policies (allow reading public docs, full access to own docs)
CREATE POLICY "knowledge_docs_select_public" ON public.knowledge_docs FOR SELECT USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY "knowledge_docs_insert_own" ON public.knowledge_docs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "knowledge_docs_update_own" ON public.knowledge_docs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "knowledge_docs_delete_own" ON public.knowledge_docs FOR DELETE USING (auth.uid() = user_id);

-- Code snippets table
CREATE TABLE IF NOT EXISTS public.code_snippets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  code TEXT NOT NULL,
  language TEXT DEFAULT 'lua',
  framework TEXT CHECK (framework IN ('qbcore', 'esx', 'standalone')),
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  is_public BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on code_snippets
ALTER TABLE public.code_snippets ENABLE ROW LEVEL SECURITY;

-- Code snippets policies
CREATE POLICY "code_snippets_select_public" ON public.code_snippets FOR SELECT USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY "code_snippets_insert_own" ON public.code_snippets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "code_snippets_update_own" ON public.code_snippets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "code_snippets_delete_own" ON public.code_snippets FOR DELETE USING (auth.uid() = user_id);

-- Auto-create profile trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.email)
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON public.chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_project_id ON public.chat_sessions(project_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_docs_framework ON public.knowledge_docs(framework);
CREATE INDEX IF NOT EXISTS idx_knowledge_docs_is_public ON public.knowledge_docs(is_public);
CREATE INDEX IF NOT EXISTS idx_code_snippets_user_id ON public.code_snippets(user_id);
CREATE INDEX IF NOT EXISTS idx_code_snippets_framework ON public.code_snippets(framework);
CREATE INDEX IF NOT EXISTS idx_code_snippets_is_public ON public.code_snippets(is_public);
