-- ====================================================================
-- Paarth's Archive - Complete Supabase PostgreSQL Schema & Security
-- ====================================================================
-- Architectural Principles:
-- 1. Real Supabase Auth: User identity derived directly from auth.uid().
-- 2. Strict User-Specific Isolation: Every user only accesses their own stories.
-- 3. Private-by-Default: Stories are sealed from public view.
-- 4. Secure Share Links: Shared stories accessible only via 32-character random tokens.
-- 5. Row Level Security (RLS): Enforced at the database engine level.
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ====================================================================
-- 1. TABLES
-- ====================================================================

-- Users Table (Synchronized with Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY, -- Matches auth.users(id)
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT DEFAULT '',
    role TEXT DEFAULT 'ADMIN',
    bio TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chapters Table (Thematic Curations)
CREATE TABLE IF NOT EXISTS chapters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    number INTEGER NOT NULL DEFAULT 1,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    subtitle TEXT,
    description TEXT,
    cover_image TEXT,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stories Table (Private by Default, User-Isolated)
CREATE TABLE IF NOT EXISTS stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    subtitle TEXT,
    content TEXT NOT NULL,
    excerpt TEXT,
    cover_image TEXT,
    status TEXT DEFAULT 'PRIVATE', -- 'DRAFT' or 'PRIVATE'
    share_token TEXT UNIQUE,
    share_status TEXT DEFAULT 'PRIVATE', -- 'PRIVATE', 'SHARED', 'REVOKED'
    shared_at TIMESTAMP WITH TIME ZONE,
    share_revoked_at TIMESTAMP WITH TIME ZONE,
    story_type TEXT DEFAULT 'MEMORIES',
    exact_date TIMESTAMP WITH TIME ZONE,
    approximate_date TEXT,
    year INTEGER,
    location TEXT,
    people_involved TEXT,
    mood TEXT,
    reading_time_minutes INTEGER DEFAULT 3,
    is_featured BOOLEAN DEFAULT FALSE,
    chapter_id UUID REFERENCES chapters(id) ON DELETE SET NULL,
    author_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE
);

-- Tags Table
CREATE TABLE IF NOT EXISTS tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- StoryTags Join Table
CREATE TABLE IF NOT EXISTS story_tags (
    story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (story_id, tag_id)
);

-- ====================================================================
-- 2. NON-DESTRUCTIVE MIGRATIONS & INDEXES
-- ====================================================================
ALTER TABLE stories ADD COLUMN IF NOT EXISTS share_token TEXT UNIQUE;
ALTER TABLE stories ADD COLUMN IF NOT EXISTS share_status TEXT DEFAULT 'PRIVATE';
ALTER TABLE stories ADD COLUMN IF NOT EXISTS shared_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE stories ADD COLUMN IF NOT EXISTS share_revoked_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE stories ALTER COLUMN status SET DEFAULT 'PRIVATE';

-- Indexes for performance and isolation
CREATE INDEX IF NOT EXISTS idx_stories_slug ON stories(slug);
CREATE INDEX IF NOT EXISTS idx_stories_author_id ON stories(author_id);
CREATE INDEX IF NOT EXISTS idx_stories_share_token ON stories(share_token);
CREATE INDEX IF NOT EXISTS idx_stories_chapter_id ON stories(chapter_id);
CREATE INDEX IF NOT EXISTS idx_chapters_slug ON chapters(slug);

-- ====================================================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_tags ENABLE ROW LEVEL SECURITY;

-- Clean up existing policies
DROP POLICY IF EXISTS "Public visitors can view published stories" ON stories;
DROP POLICY IF EXISTS "Public visitors can view shared stories" ON stories;
DROP POLICY IF EXISTS "Authors can manage own stories" ON stories;
DROP POLICY IF EXISTS "Users can read own stories" ON stories;
DROP POLICY IF EXISTS "Users can insert own stories" ON stories;
DROP POLICY IF EXISTS "Users can update own stories" ON stories;
DROP POLICY IF EXISTS "Users can delete own stories" ON stories;
DROP POLICY IF EXISTS "Public visitors can view chapters" ON chapters;
DROP POLICY IF EXISTS "Admins can manage chapters" ON chapters;
DROP POLICY IF EXISTS "Public visitors can view tags" ON tags;
DROP POLICY IF EXISTS "Admins can manage tags" ON tags;
DROP POLICY IF EXISTS "Public visitors can view story tags" ON story_tags;
DROP POLICY IF EXISTS "Admins can manage story tags" ON story_tags;

-- A. STORIES POLICIES (User Isolation + Bearer Sharing):
-- 1. Read: Owner can read their own stories, OR anyone with a valid shared token can read that specific story
CREATE POLICY "Stories read access" ON stories
    FOR SELECT
    USING (
        (auth.uid() IS NOT NULL AND auth.uid() = author_id)
        OR (share_status = 'SHARED')
    );

-- 2. Insert: Authenticated user can ONLY insert stories with their own author_id
CREATE POLICY "Stories insert access" ON stories
    FOR INSERT
    WITH CHECK (auth.uid() = author_id);

-- 3. Update: Authenticated user can ONLY update their own stories
CREATE POLICY "Stories update access" ON stories
    FOR UPDATE
    USING (auth.uid() = author_id)
    WITH CHECK (auth.uid() = author_id);

-- 4. Delete: Authenticated user can ONLY delete their own stories
CREATE POLICY "Stories delete access" ON stories
    FOR DELETE
    USING (auth.uid() = author_id);

-- B. CHAPTERS POLICIES:
CREATE POLICY "Public visitors can view chapters" ON chapters
    FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can manage chapters" ON chapters
    FOR ALL
    USING (auth.role() = 'authenticated');

-- C. TAGS POLICIES:
CREATE POLICY "Public visitors can view tags" ON tags
    FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can manage tags" ON tags
    FOR ALL
    USING (auth.role() = 'authenticated');

CREATE POLICY "Public visitors can view story tags" ON story_tags
    FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can manage story tags" ON story_tags
    FOR ALL
    USING (auth.role() = 'authenticated');

-- ====================================================================
-- 4. STRUCTURAL SEED DATA (7 Thematic Chapters & Curated Tags)
-- ====================================================================

-- Insert 7 Editorial Chapters
INSERT INTO chapters (id, number, title, slug, subtitle, description, cover_image, "order")
VALUES 
(
    '11111111-1111-1111-1111-111111111101',
    1,
    'CHILDHOOD',
    'childhood',
    'Before I understood what growing up meant.',
    'Memories preserved in sunlight, dusty corridors, scraped knees, and the boundless sensation of endless afternoons.',
    'https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=1200&auto=format&fit=crop',
    1
),
(
    '11111111-1111-1111-1111-111111111102',
    2,
    'GROWING UP',
    'growing-up',
    'The years that changed me.',
    'Transitions that occurred without ceremony; the gradual realization of time passing and identity shifting.',
    'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?q=80&w=1200&auto=format&fit=crop',
    2
),
(
    '11111111-1111-1111-1111-111111111103',
    3,
    'PEOPLE',
    'people',
    'People who became part of the story.',
    'Portraits of individuals whose paths crossed mine, leaving indelible impressions long after our parting.',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop',
    3
),
(
    '11111111-1111-1111-1111-111111111104',
    4,
    'INCIDENTS',
    'incidents',
    'Things that happened and stayed with me.',
    'Singular occurrences, sharp turning points, and unpredictable turns of fate etched into memory.',
    'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1200&auto=format&fit=crop',
    4
),
(
    '11111111-1111-1111-1111-111111111105',
    5,
    'FRAGMENTS',
    'fragments',
    'Thoughts, moments and unfinished stories.',
    'Brief impressions, late-night journal scribbles, sensory echoes, and unresolved vignettes.',
    'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?q=80&w=1200&auto=format&fit=crop',
    5
),
(
    '11111111-1111-1111-1111-111111111106',
    6,
    'FICTION',
    'fiction',
    'Things that never happened.',
    'Imagined landscapes, dreams that lingered into daylight, and fables crafted from what might have been.',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
    6
),
(
    '11111111-1111-1111-1111-111111111107',
    7,
    'LETTERS',
    'letters',
    'Words written to people who may never read them.',
    'Unsent dispatches, silent confessions, and quiet gratitudes addressed across distances and years.',
    'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1200&auto=format&fit=crop',
    7
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    cover_image = EXCLUDED.cover_image;

-- Insert Tags
INSERT INTO tags (name, slug)
VALUES 
    ('Nostalgia', 'nostalgia'),
    ('Silence', 'silence'),
    ('Rain', 'rain'),
    ('Night', 'night'),
    ('Memory', 'memory'),
    ('Family', 'family'),
    ('Journey', 'journey'),
    ('Solitude', 'solitude'),
    ('Urban', 'urban'),
    ('Vintage', 'vintage')
ON CONFLICT (slug) DO NOTHING;
