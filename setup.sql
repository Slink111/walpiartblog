-- Run this SQL in your Supabase SQL Editor
-- Go to: https://supabase.com/dashboard/project/ctnuznfvwazswxewniko/sql/new

-- Create wallpapers table
CREATE TABLE wallpapers (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  tags TEXT[],
  blog_content TEXT,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  alt TEXT,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket for wallpapers
INSERT INTO storage.buckets (id, name, public) 
VALUES ('wallpapers', 'wallpapers', true);

-- Set up storage policies for public access
CREATE POLICY "Anyone can view wallpapers" ON wallpapers FOR SELECT USING (true);
CREATE POLICY "Anyone can insert wallpapers" ON wallpapers FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update wallpapers" ON wallpapers FOR UPDATE USING (true);
CREATE POLICY "Anyone can upload wallpaper images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'wallpapers');
CREATE POLICY "Anyone can view wallpaper images" ON storage.objects FOR SELECT USING (bucket_id = 'wallpapers');
CREATE POLICY "Anyone can update wallpaper images" ON storage.objects FOR UPDATE USING (bucket_id = 'wallpapers');

-- Enable RLS (Row Level Security)
ALTER TABLE wallpapers ENABLE ROW LEVEL SECURITY;

-- Create index for better performance
CREATE INDEX idx_wallpapers_category ON wallpapers(category);
CREATE INDEX idx_wallpapers_created_at ON wallpapers(created_at DESC);
