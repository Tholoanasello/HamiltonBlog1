-- Create enum for main blog categories
CREATE TYPE blog_category AS ENUM ('valuation_reports', 'corporate_finance', 'investment_insights');

-- Create blog_posts table
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  category blog_category NOT NULL,
  subcategory TEXT,
  industry TEXT,
  pdf_url TEXT,
  author TEXT NOT NULL DEFAULT 'Hamilton Investment',
  published_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create custom_categories table for additional categories
CREATE TABLE public.custom_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create admin_users table for blog management access
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for blog_posts (public read, admin write)
CREATE POLICY "Anyone can view published blog posts"
  ON public.blog_posts
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert blog posts"
  ON public.blog_posts
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can update blog posts"
  ON public.blog_posts
  FOR UPDATE
  USING (true);

CREATE POLICY "Admins can delete blog posts"
  ON public.blog_posts
  FOR DELETE
  USING (true);

-- RLS Policies for custom_categories
CREATE POLICY "Anyone can view custom categories"
  ON public.custom_categories
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage custom categories"
  ON public.custom_categories
  FOR ALL
  USING (true);

-- RLS Policies for admin_users (only admins can view)
CREATE POLICY "Admins can view admin users"
  ON public.admin_users
  FOR SELECT
  USING (true);

-- Create storage bucket for PDF reports
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-pdfs', 'blog-pdfs', true);

-- Storage policies for PDF uploads
CREATE POLICY "Anyone can view PDFs"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'blog-pdfs');

CREATE POLICY "Admins can upload PDFs"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'blog-pdfs');

CREATE POLICY "Admins can update PDFs"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'blog-pdfs');

CREATE POLICY "Admins can delete PDFs"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'blog-pdfs');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default admin user (password: admin123 - should be changed after first login)
-- Using bcrypt hash for 'admin123'
INSERT INTO public.admin_users (username, password_hash)
VALUES ('admin', '$2a$10$8K1p/a0dL3LKzOWR4qLwBOWZMvfJN.JjHVMqN8HvPfPxRqVZJHFPu');