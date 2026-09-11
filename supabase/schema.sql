-- ====================================================================
-- Paarth's Archive - Complete Supabase PostgreSQL Schema & Security
-- ====================================================================
-- Architectural Principles:
-- 1. Private-by-Default: Stories are strictly private unless explicitly shared via secure token.
-- 2. Row Level Security (RLS): Public visitors can NEVER select private or draft stories.
-- 3. High Performance: Indexes on slugs, share tokens, and chapter foreign keys.
-- 4. Idempotent: Can be safely re-run without dropping existing data.
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ====================================================================
-- 1. TABLES
-- ====================================================================

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
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

-- Stories Table (Private by Default)
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
-- 2. NON-DESTRUCTIVE MIGRATIONS (For existing databases)
-- ====================================================================
ALTER TABLE stories ADD COLUMN IF NOT EXISTS share_token TEXT UNIQUE;
ALTER TABLE stories ADD COLUMN IF NOT EXISTS share_status TEXT DEFAULT 'PRIVATE';
ALTER TABLE stories ADD COLUMN IF NOT EXISTS shared_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE stories ADD COLUMN IF NOT EXISTS share_revoked_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE stories ALTER COLUMN status SET DEFAULT 'PRIVATE';

-- Indexes for lightning fast queries
CREATE INDEX IF NOT EXISTS idx_stories_slug ON stories(slug);
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

-- Clean up existing legacy policies
DROP POLICY IF EXISTS "Public visitors can view published stories" ON stories;
DROP POLICY IF EXISTS "Public visitors can view shared stories" ON stories;
DROP POLICY IF EXISTS "Authors can manage own stories" ON stories;
DROP POLICY IF EXISTS "Public visitors can view chapters" ON chapters;
DROP POLICY IF EXISTS "Admins can manage chapters" ON chapters;
DROP POLICY IF EXISTS "Public visitors can view tags" ON tags;
DROP POLICY IF EXISTS "Admins can manage tags" ON tags;
DROP POLICY IF EXISTS "Public visitors can view story tags" ON story_tags;
DROP POLICY IF EXISTS "Admins can manage story tags" ON story_tags;

-- A. STORIES POLICIES:
-- 1. Public visitors can ONLY view stories that have been explicitly shared (share_status = 'SHARED')
CREATE POLICY "Public visitors can view shared stories" ON stories
    FOR SELECT
    USING (share_status = 'SHARED');

-- 2. Authenticated authors have full CRUD access to their own stories
CREATE POLICY "Authors can manage own stories" ON stories
    FOR ALL
    USING (auth.uid() = author_id)
    WITH CHECK (auth.uid() = author_id);

-- B. CHAPTERS POLICIES:
-- Chapters serve as the editorial structure of the archive and are readable by all visitors
CREATE POLICY "Public visitors can view chapters" ON chapters
    FOR SELECT
    USING (true);

CREATE POLICY "Admins can manage chapters" ON chapters
    FOR ALL
    USING (auth.role() = 'authenticated');

-- C. TAGS POLICIES:
CREATE POLICY "Public visitors can view tags" ON tags
    FOR SELECT
    USING (true);

CREATE POLICY "Admins can manage tags" ON tags
    FOR ALL
    USING (auth.role() = 'authenticated');

CREATE POLICY "Public visitors can view story tags" ON story_tags
    FOR SELECT
    USING (true);

CREATE POLICY "Admins can manage story tags" ON story_tags
    FOR ALL
    USING (auth.role() = 'authenticated');

-- ====================================================================
-- 4. SEED DATA (Default author, chapters, tags, and realistic stories)
-- ====================================================================

-- Insert Primary Author (Paarth, password: archive2026)
INSERT INTO users (id, name, email, password, role, bio)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Paarth',
    'paarth@archive.local',
    crypt('archive2026', gen_salt('bf', 10)),
    'ADMIN',
    'Archivist of fading moments, quiet reflections, and unwritten letters.'
) ON CONFLICT (email) DO NOTHING;

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

-- Insert Representative Story (Private by Default)
INSERT INTO stories (
    title, slug, subtitle, content, excerpt, cover_image, status, share_status,
    story_type, year, approximate_date, location, people_involved, mood,
    reading_time_minutes, is_featured, chapter_id, author_id
)
VALUES (
    'The House With The Blue Gate',
    'the-house-with-the-blue-gate',
    'We measured our entire world by how far past the iron fence we were allowed to run.',
    '### The Threshold of the Known

The iron hinges made a high, singing moan whenever the wind pushed against them. In my memory, the gate was twice as tall as it actually was—an impenetrable threshold painted in chipped cerulean blue that had begun to rust around the bolt.

To a seven-year-old, the gate wasn''t merely a boundary between our front gravel courtyard and the unpaved municipal road; it was the edge of the known universe. Everything inside smelled of wet clay pots, hibiscus leaves, and the woodsmoke from the neighbor''s evening kettle. Everything outside was rumor, distant horn blasts, and the mystery of bicycle bells.

My grandfather used to sit on a low cane stool just under the guava shade. He held a brass pocketknife in one hand and peeled sweet limes in one continuous spiral without ever severing the rind.

> *"If you hurry the peel, you bruise the juice,"* he told me once without looking up. *"Things that are rushed always carry an unnecessary bitterness."*

### The Afternoon the Latch Slipped

It happened on a Tuesday in mid-May. A dry northern squall blew through the valley, rattling the corrugated iron shed behind the kitchen. The latch on the blue gate, worn smooth by thirty years of hands, clattered and slipped free.

For three breathless seconds, the gate stood ajar by four inches. 

I stopped spinning my tin top on the porch. The road outside looked entirely different when unhindered by vertical iron bars. A stray calf wandered past; dust curled in small golden eddies under the midday glare. I walked down the stone steps, my sneakers crunching on dry guava twigs.

I reached the blue gate and laid my palm flat against the cool metal. For the first time, I pushed it outward.

I did not run into the street. I didn''t have the audacity for escape. I simply stood on the small stone ramp that connected our driveway to the dirt road and looked down both directions. To the left, the road curved toward the railway crossing where freight engines groaned in the night. To the right, it disappeared into the eucalyptus grove.

When my grandfather''s hand rested gently on my shoulder, he didn''t pull me back. He didn''t raise his voice. He simply stood beside me, looking out at the road as well.

*"Big world,"* he murmured softly. 

*"Does the road ever stop?"* I asked.

He smiled into his white mustache. *"It never stops. But remember what this side of the gate looks like, because one day you''ll spend years trying to find your way back."*',
    'The iron hinges made a high, singing moan whenever the wind pushed against them. In my memory, the gate was twice as tall as it actually was.',
    'https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=1400&auto=format&fit=crop',
    'PRIVATE',
    'PRIVATE',
    'CHILDHOOD',
    2007,
    'Summer, 2007',
    'Old Cantonment Road',
    'My grandfather, childhood neighbors',
    'Warm, Nostalgic, Distant',
    4,
    true,
    '11111111-1111-1111-1111-111111111101',
    '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (slug) DO NOTHING;
