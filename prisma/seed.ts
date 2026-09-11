import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL,
    },
  },
});

async function main() {
  console.log("Seeding Paarth's Archive structural volumes (chapters and tags)...");

  // Thematic Chapters
  const chaptersData = [
    {
      number: 1,
      title: "CHILDHOOD",
      slug: "childhood",
      subtitle: "Before I understood what growing up meant.",
      description: "Memories preserved in sunlight, dusty corridors, scraped knees, and the boundless sensation of endless afternoons.",
      coverImage: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=1200&auto=format&fit=crop",
      order: 1,
    },
    {
      number: 2,
      title: "GROWING UP",
      slug: "growing-up",
      subtitle: "The years that changed me.",
      description: "Transitions that occurred without ceremony; the gradual realization of time passing and identity shifting.",
      coverImage: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?q=80&w=1200&auto=format&fit=crop",
      order: 2,
    },
    {
      number: 3,
      title: "PEOPLE",
      slug: "people",
      subtitle: "People who became part of the story.",
      description: "Portraits of individuals whose paths crossed mine, leaving indelible impressions long after our parting.",
      coverImage: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop",
      order: 3,
    },
    {
      number: 4,
      title: "INCIDENTS",
      slug: "incidents",
      subtitle: "Things that happened and stayed with me.",
      description: "Singular occurrences, sharp turning points, and unpredictable turns of fate etched into memory.",
      coverImage: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1200&auto=format&fit=crop",
      order: 4,
    },
    {
      number: 5,
      title: "FRAGMENTS",
      slug: "fragments",
      subtitle: "Thoughts, moments and unfinished stories.",
      description: "Brief impressions, late-night journal scribbles, sensory echoes, and unresolved vignettes.",
      coverImage: "https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?q=80&w=1200&auto=format&fit=crop",
      order: 5,
    },
    {
      number: 6,
      title: "FICTION",
      slug: "fiction",
      subtitle: "Things that never happened.",
      description: "Imagined landscapes, dreams that lingered into daylight, and fables crafted from what might have been.",
      coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
      order: 6,
    },
    {
      number: 7,
      title: "LETTERS",
      slug: "letters",
      subtitle: "Words written to people who may never read them.",
      description: "Unsent dispatches, silent confessions, and quiet gratitudes addressed across distances and years.",
      coverImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1200&auto=format&fit=crop",
      order: 7,
    },
  ];

  for (const c of chaptersData) {
    await prisma.chapter.upsert({
      where: { slug: c.slug },
      update: c,
      create: c,
    });
  }
  console.log(`Synchronized ${chaptersData.length} chapters.`);

  // Tags
  const tagNames = ["Nostalgia", "Silence", "Rain", "Night", "Memory", "Family", "Journey", "Solitude", "Urban", "Vintage"];
  for (const name of tagNames) {
    const slug = name.toLowerCase();
    await prisma.tag.upsert({
      where: { slug },
      update: { name },
      create: { name, slug },
    });
  }
  console.log(`Synchronized ${tagNames.length} tags.`);

  console.log("Structural seeding completed successfully. User authentication is managed via Supabase Auth.");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
