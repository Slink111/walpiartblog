# Walpi - Wallpaper Discovery Platform

A modern, responsive wallpaper discovery and download platform with admin panel and Supabase integration.

## Features

### 🔍 Core Functionality
- **Search**: Real-time keyword filtering across titles, descriptions, and tags
- **Category Filters**: Nature, Anime, Minimal, Abstract
- **Wallpaper Detail View**: Split-screen layout matching the design sketch
- **Download**: Working download functionality with visual feedback
- **Like/Favorite System**: Persistent storage using localStorage
- **Share**: Native share API with clipboard fallback

### 👤 User Management
- **Username System**: Users can set their username
- **Admin Access**: Username "tojowalpiuser" unlocks admin panel
- **Session Persistence**: User sessions saved in localStorage

### 🛠 Admin Panel
- **Upload Wallpapers**: Add new wallpapers with image upload
- **Edit Blog Content**: Modify blog content for any wallpaper
- **Image Upload**: Direct image upload with preview
- **Alt Text Support**: Accessibility features for images
- **Dynamic Blog Content**: Fully editable and expandable blog sections

### 🎨 Design Features
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Mobile-first approach with desktop enhancements
- **Modern UI**: Clean, minimal design with smooth animations
- **Split Screen Layout**: Matches the provided sketch design

### 🔧 Technical Features
- **Supabase Integration**: Full backend support for data persistence
- **Image Storage**: Cloud storage via Supabase Storage
- **Real-time Updates**: Immediate UI updates after admin changes
- **Progressive Enhancement**: Works without Supabase (falls back to local data)

## Setup Instructions

### 1. Supabase Configuration

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the following SQL in your Supabase SQL Editor:

```sql
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

-- Set up storage policies
CREATE POLICY "Anyone can view wallpapers" ON wallpapers FOR SELECT USING (true);
CREATE POLICY "Anyone can upload wallpapers" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'wallpapers');
CREATE POLICY "Anyone can view wallpaper images" ON storage.objects FOR SELECT USING (bucket_id = 'wallpapers');
```

3. Update `config.js` with your Supabase credentials:

```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

### 2. Local Development

1. Install dependencies:
```bash
npm install -g http-server
```

2. Start the development server:
```bash
http-server -p 3000
```

3. Open your browser and navigate to `http://localhost:3000`

## Usage

### For Regular Users
1. Enter any username to access the platform
2. Browse wallpapers using search and category filters
3. Click on wallpapers to view details and download
4. Like wallpapers to save favorites

### For Admin Users
1. Enter username: `tojowalpiuser`
2. Click "Admin Panel" button that appears
3. **Upload Tab**: Add new wallpapers with images and blog content
4. **Edit Tab**: Modify existing wallpaper blog content
5. All changes are saved to Supabase and reflected immediately

## Project Structure

```
walpi2/
├── index.html          # Main HTML structure
├── styles.css          # Complete styling with dark mode
├── script.js           # All JavaScript functionality
├── config.js           # Supabase configuration
└── README.md           # This file
```

## Key Features Explained

### Admin Panel Access
- Username: `tojowalpiuser`
- Unlocks wallpaper upload and blog editing capabilities
- Full CRUD operations on wallpaper data

### Dynamic Blog Content
- Blog sections are fully editable through admin panel
- Content expands based on text length (no height restrictions)
- Real-time updates when content is modified

### Image Upload System
- Direct upload to Supabase Storage
- Automatic public URL generation
- Preview functionality before upload
- Alt text support for accessibility

### Responsive Design
- **Desktop**: Split-screen layout as shown in sketch
- **Mobile**: Stacked layout with sticky download button
- **Tablet**: Adaptive layout for medium screens

## Browser Support

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.
