import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Paarth's Archive database...");

  // Clean existing records
  await prisma.storyTag.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.story.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.user.deleteMany();

  // Create Primary User / Author
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("archive2026", salt);

  const author = await prisma.user.create({
    data: {
      name: "Paarth",
      email: "paarth@archive.local",
      password: hashedPassword,
      role: "ADMIN",
      bio: "Archivist of fading moments, quiet reflections, and unwritten letters.",
    },
  });

  console.log(`Created author: ${author.name} (${author.email})`);

  // Chapters
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
      coverImage: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop",
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

  const createdChapters: Record<string, any> = {};
  for (const c of chaptersData) {
    const chapter = await prisma.chapter.create({ data: c });
    createdChapters[c.slug] = chapter;
  }
  console.log(`Created ${chaptersData.length} chapters.`);

  // Tags
  const tagNames = ["Nostalgia", "Silence", "Rain", "Night", "Memory", "Family", "Journey", "Solitude", "Urban", "Vintage"];
  const createdTags: Record<string, any> = {};
  for (const name of tagNames) {
    const slug = name.toLowerCase();
    const tag = await prisma.tag.create({
      data: { name, slug },
    });
    createdTags[slug] = tag;
  }

  // Realistic Stories
  const storiesData = [
    {
      title: "The House With The Blue Gate",
      slug: "the-house-with-the-blue-gate",
      subtitle: "We measured our entire world by how far past the iron fence we were allowed to run.",
      chapterId: createdChapters["childhood"].id,
      storyType: "CHILDHOOD",
      status: "PRIVATE",
      shareStatus: "PRIVATE",
      year: 2007,
      approximateDate: "Summer, 2007",
      location: "Old Cantonment Road",
      peopleInvolved: "My grandfather, childhood neighbors",
      mood: "Warm, Nostalgic, Distant",
      readingTimeMinutes: 4,
      isFeatured: true,
      coverImage: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=1400&auto=format&fit=crop",
      excerpt: "The iron hinges made a high, singing moan whenever the wind pushed against them. In my memory, the gate was twice as tall as it actually was.",
      content: `### The Threshold of the Known

The iron hinges made a high, singing moan whenever the wind pushed against them. In my memory, the gate was twice as tall as it actually was—an impenetrable threshold painted in chipped cerulean blue that had begun to rust around the bolt.

To a seven-year-old, the gate wasn't merely a boundary between our front gravel courtyard and the unpaved municipal road; it was the edge of the known universe. Everything inside smelled of wet clay pots, hibiscus leaves, and the woodsmoke from the neighbor's evening kettle. Everything outside was rumor, distant horn blasts, and the mystery of bicycle bells.

My grandfather used to sit on a low cane stool just under the guava shade. He held a brass pocketknife in one hand and peeled sweet limes in one continuous spiral without ever severing the rind.

> *"If you hurry the peel, you bruise the juice,"* he told me once without looking up. *"Things that are rushed always carry an unnecessary bitterness."*

### The Afternoon the Latch Slipped

It happened on a Tuesday in mid-May. A dry northern squall blew through the valley, rattling the corrugated iron shed behind the kitchen. The latch on the blue gate, worn smooth by thirty years of hands, clattered and slipped free.

For three breathless seconds, the gate stood ajar by four inches. 

I stopped spinning my tin top on the porch. The road outside looked entirely different when unhindered by vertical iron bars. A stray calf wandered past; dust curled in small golden eddies under the midday glare. I walked down the stone steps, my sneakers crunching on dry guava twigs.

I reached the blue gate and laid my palm flat against the cool metal. For the first time, I pushed it outward.

I did not run into the street. I didn't have the audacity for escape. I simply stood on the small stone ramp that connected our driveway to the dirt road and looked down both directions. To the left, the road curved toward the railway crossing where freight engines groaned in the night. To the right, it disappeared into the eucalyptus grove.

When my grandfather's hand rested gently on my shoulder, he didn't pull me back. He didn't raise his voice. He simply stood beside me, looking out at the road as well.

*"Big world,"* he murmured softly. 

*"Does the road ever stop?"* I asked.

He smiled into his white mustache. *"It never stops. But remember what this side of the gate looks like, because one day you'll spend years trying to find your way back."*`,
      tags: ["nostalgia", "memory", "family"],
    },
    {
      title: "The Day I Got Lost",
      slug: "the-day-i-got-lost",
      subtitle: "I don't remember the exact date. I remember the feeling.",
      chapterId: createdChapters["incidents"].id,
      storyType: "INCIDENT",
      status: "PRIVATE",
      shareStatus: "PRIVATE",
      year: 2014,
      approximateDate: "Autumn, Circa 2014",
      location: "Central Railway Junction, Platform 4",
      peopleInvolved: "A stranger in an olive jacket",
      mood: "Quiet Panic, Awakening",
      readingTimeMinutes: 5,
      isFeatured: true,
      coverImage: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1400&auto=format&fit=crop",
      excerpt: "The train had eighteen carriages and none of them belonged to anyone I knew.",
      content: `### The Crowd and the Sudden Silence

The train had eighteen carriages, and within ninety seconds of its arrival, none of them belonged to anyone I knew.

It was the peak festival transit season. Smoke from peanut roasters drifted through the overhead sodium lights, tinting everything a dull amber. One moment I was holding onto the frayed strap of my mother's canvas travel bag, feeling the rhythmic sway of her walking stride; the next, an avalanche of passengers disembarking from the sleeper coach sheared us apart like water parting around a boulder.

When you are twelve years old, being lost does not announce itself with terror. It begins with curiosity, progresses into disorientation, and then crystallizes into a sharp, freezing emptiness in the chest.

> *I stood beside a cast-iron support column painted with faded colonial stencils. The noise of a thousand footsteps reverberated off the arched zinc ceiling, yet inside my ears there was only the hum of blood.*

### The Man with the Pocket Watch

Ten minutes passed. To a child, ten minutes in a sea of unknown faces is an entire epoch. I had memorized our home telephone number, but the public call booth near the tea stall was occupied by an elderly man shouting into the receiver about invoice numbers.

Then someone stopped. 

He wore a faded olive windbreaker with frayed cuffs. He didn't tower over me aggressively; he knelt down so his eyes were level with mine. He smelled faintly of cardamom and old books.

*"You haven't moved an inch in six minutes,"* he said plainly. Not 'Where are your parents?' or 'Are you okay?' Just an observational truth.

*"I was told to stay where I last saw them,"* I replied, my voice shaking slightly despite my best effort at composure.

The man nodded, pulling a silver pocket watch from his waistcoat and checking the hands. *"That is the wisest rule. When everything around you is moving at frantic speed, the only rational thing to do is become anchor."*

He stood a few paces back, leaning his back against the pillar, reading a folded newspaper under the dim platform lamp. He didn't touch me or usher me anywhere. He simply stood sentry.

Four minutes later, my mother's frantic voice tore through the crowd. When I turned to point out the man who had stood guard over my silence, Platform 4 was empty behind the pillar.`,
      tags: ["memory", "night", "solitude"],
    },
    {
      title: "The Summer That Felt Longer",
      slug: "the-summer-that-felt-longer",
      subtitle: "The ceiling fan rotated with a hypnotic three-beat wobble that counted down the days.",
      chapterId: createdChapters["growing-up"].id,
      storyType: "GROWING_UP",
      status: "PRIVATE",
      shareStatus: "PRIVATE",
      year: 2012,
      approximateDate: "June, 2012",
      location: "Attic Room, Old House",
      peopleInvolved: "Kiran, Dev, Myself",
      mood: "Languid, Bittersweet, Hazy",
      readingTimeMinutes: 4,
      isFeatured: true,
      coverImage: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1400&auto=format&fit=crop",
      excerpt: "That was the summer the electricity cut out every afternoon at three. We had nowhere to be, and all the time in the world to become whoever we were supposed to be.",
      content: `### The Three O'Clock Blackout

The ceiling fan rotated with a hypnotic three-beat wobble: *tick... tick... shhh.* It counted down the hours of the hottest summer on record.

At three o'clock sharp, the transformer at the end of our lane would emit a loud, dull pop like a cork from a bottle of cheap sparkling cider. Instantly, the hum of refrigerators died. The oscillating fans coasted to a quiet halt. The house plunged into a heavy, breathless stillness.

Instead of complaining, we welcomed it. We climbed the steep wooden ladder into the unfinished attic where the cedar roof shingles radiated warmth like an earthenware oven.

We lay on woven straw mats with our shirts unbuttoned, staring through the dormer window at the heat shimmers rising off the asphalt.

### Cassette Tapes and Stolen Books

Kiran had an old battery-operated tape recorder he had salvaged from his uncle's workshop. The play button had to be wedged in place with half a broken matchstick, or the tape head would disengage.

We played the same two cassette tapes on repeat:
1. An unlabelled bootleg recording of acoustic guitar instrumentals
2. A recording of rain falling on tin roofs that someone had made during the monsoon of '98

> *"Do you think we will still be sitting in this attic when we are twenty-five?"* Dev asked, tracing a circle on the dusty floorboards.
>
> *"Twenty-five is a century away,"* Kiran replied, flipping a page of an old paperbound novel. *"By twenty-five, we'll probably have forgotten how hot this room was."*

He was wrong. Twelve years have passed, and I have forgotten almost all the names of my college professors, the passwords to my first email accounts, and the registration numbers of our old scooters. But I still remember the exact pitch of the matchstick wedged into that cassette player, and the scent of heated cedar dust.`,
      tags: ["nostalgia", "journey", "silence"],
    },
    {
      title: "Someone I Still Remember",
      slug: "someone-i-still-remember",
      subtitle: "He repaired mechanical watches in a shop no wider than an open doorway.",
      chapterId: createdChapters["people"].id,
      storyType: "PEOPLE",
      status: "PRIVATE",
      shareStatus: "PRIVATE",
      year: 2016,
      approximateDate: "Winter, 2016",
      location: "Nawabs Bazaar Alleyway",
      peopleInvolved: "Master Ismail",
      mood: "Reverent, Melancholic",
      readingTimeMinutes: 4,
      isFeatured: true,
      coverImage: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1400&auto=format&fit=crop",
      excerpt: "Master Ismail held time in the palm of his hand with a pair of nickel-plated tweezers.",
      content: `### The Sanctuary of Gears

The shop was barely six feet deep. If two customers stood inside together, one of their shoulders had to brush against the glass cabinet of vintage escapement wheels.

Master Ismail wore a jeweler's loupe permanently strapped to his right temple with a cracked rubber band. Even when speaking to you, his right eye appeared magnified to three times its normal size, examining your expressions with the same microscopic scrutiny he applied to balance springs.

I brought him my father's 1968 mechanical wristwatch. The mainspring was seized; two other watchmakers in the city had dismissed it as beyond economic repair.

Ismail took the watch in his calloused fingertips. He did not open it immediately. He held the stainless steel case to his ear and tapped the rim with a fingernail, listening to the acoustic resonance of the chamber.

*"The steel is honest,"* he said simply. *"Leave it with me for three days."*

### The Philosophy of Escapement

When I returned, the watch was ticking with a clean, rhythmic heartbeat on his green velvet pad. 

He gave me the receipt written in purple fountain pen ink on cheap ledger paper. I asked him what had been wrong with the movement.

> *"People think a watch is made of gears and springs,"* he said, carefully cleaning the acrylic crystal with a piece of chamois leather. *"It isn't. A watch is made of resistance. If the spring unloaded all its power at once, it would spin itself to destruction in half a second. It is only because the escapement catches it, holds it back, and releases it drop by drop, that we have what we call seconds, minutes, hours."*

He looked up through his loupe. *"Human beings are identical. If nothing resists us, we burn out before we even learn our own names."*

I still wear that watch every autumn. The alleyway where his shop stood has since been demolished to make way for an underground parking ramp, but his lesson remains wound tight inside the casing.`,
      tags: ["solitude", "memory", "vintage"],
    },
    {
      title: "Things I Never Said",
      slug: "things-i-never-said",
      subtitle: "Unfinished fragments collected between late-night train compartments.",
      chapterId: createdChapters["fragments"].id,
      storyType: "FRAGMENT",
      status: "PRIVATE",
      shareStatus: "PRIVATE",
      year: 2021,
      approximateDate: "Late November, 2021",
      location: "Overnight Express to Coastal Town",
      peopleInvolved: "The ghost of a conversation",
      mood: "Intimate, Quiet, Lingering",
      readingTimeMinutes: 3,
      isFeatured: false,
      coverImage: "https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?q=80&w=1400&auto=format&fit=crop",
      excerpt: "We save the most important sentences for the moments when the person we want to tell is already on the other side of an irrevocable decision.",
      content: `### Fragment I: The Distance of Five Inches

On the night before you packed the blue suitcase, we sat on the stone balcony while the city turned off its neon signs one by one.

There was a space of approximately five inches between your left shoulder and my right. That five inches contained twenty-seven sentences that I had drafted in my notebook during the taxi ride over.

Not one of them crossed the divide.

Why do we treat words as though they are finite resources? As though saying *"Stay another week"* would somehow bankrupt our dignity?

### Fragment II: The Telegram Mentality

We live in an age of infinite messages, yet we communicate with the emotional scarcity of people paying by the syllable for a transatlantic telegraph.

*"Take care."*
*"Safe travels."*
*"Keep in touch."*

These are not wishes; they are euphemisms for surrender.

### Fragment III: Rain on the Windowpane

The overnight train is moving at seventy miles an hour through fields of dark sugarcane. The glass vibrates against my forehead. 

If memory were a physical substance, this carriage would be too heavy to climb the grade into the hills. Every passenger in these berths is carrying a suitcase filled with clothes, and an invisible trunk filled with things they should have whispered before the platform whistle blew.`,
      tags: ["silence", "night", "solitude"],
    },
    {
      title: "Somewhere Beyond Midnight",
      slug: "somewhere-beyond-midnight",
      subtitle: "A story about a coastal lighthouse that kept running after the sea dried up.",
      chapterId: createdChapters["fiction"].id,
      storyType: "FICTION",
      status: "PRIVATE",
      shareStatus: "PRIVATE",
      year: 2023,
      approximateDate: "Winter, 2023",
      location: "Cape Nowhere",
      peopleInvolved: "The Last Keeper",
      mood: "Surreal, Cinematic, Dreamlike",
      readingTimeMinutes: 5,
      isFeatured: false,
      coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1400&auto=format&fit=crop",
      excerpt: "The ocean had receded ninety miles to the west, but Keeper Thorne still climbed the spiral staircase every evening at dusk to ignite the mercury-bath prism.",
      content: `### The Dry Sea

The ocean had receded ninety miles to the west during the great tectonic shudder of the previous century, leaving behind an undulating expanse of cracked salt plains, petrified coral reefs, and the ribcages of nineteenth-century clipper ships stranded like beached leviathans.

Yet every evening at 17:42, Keeper Thorne climbed the ninety-six cast-iron spiral steps to the lantern room.

He trimmed the wicks. He polished the sixteen Fresnel prisms with denatured alcohol. And with a single stroke of a brass match, he ignited the kerosene mantle.

The white beam of light shot out across the vast desert of salt, illuminating dust storms instead of waves.

> *"Why do you light it, Thorne?"* the salt-harvesters would ask when they brought up supplies of dried mutton and paraffin. *"There hasn't been a ship in these waters since your grandfather had teeth."*
>
> *"I do not light it for ships,"* Thorne would answer, his hand resting on the polished brass counterweight of the clockwork rotation drive.

### What the Light Finds

*"Then for what?"*

*"For the ones who are walking,"* he said.

In the dead center of the night, when the salt flats cooled to freezing temperatures and the stars hung so close to the earth they looked like low lanterns, shapes could be seen moving through the desert.

Travelers who had lost their bearings in the infinite monochrome terrain. Nomads following ancient compass bearings. People who had walked away from cities that no longer had names.

They did not steer by satellite or road markers. They looked up at the horizon, found the single sweeping rhythm of Cape Nowhere's beam cutting through the dust every fourteen seconds, and knew which way was home.`,
      tags: ["night", "journey", "solitude"],
    },
    {
      title: "A Letter to 2015",
      slug: "a-letter-to-2015",
      subtitle: "To the person sitting in the corner of that cafe on Brigade Road.",
      chapterId: createdChapters["letters"].id,
      storyType: "LETTER",
      status: "PRIVATE",
      shareStatus: "PRIVATE",
      year: 2015,
      approximateDate: "October 14, 2015",
      location: "Corner Cafe, Brigade Road",
      peopleInvolved: "My younger self",
      mood: "Gentle, Forgiving, Timeless",
      readingTimeMinutes: 3,
      isFeatured: false,
      coverImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1400&auto=format&fit=crop",
      excerpt: "You are worrying about the wrong things. The crisis you think will ruin your life will be completely forgotten in three years.",
      content: `### To the Boy in the Brown Jacket

I see you sitting by the frosted cafe window, chewing on the end of a black ballpoint pen, staring at a spiral notebook filled with crossed-out plans.

You believe that the trajectory of your next twenty years depends entirely on the email you are about to send tonight. You believe that failure at this juncture is catastrophic and irreversible.

I am writing to you from eleven years into the future to deliver an urgent dispatch:

**You are worrying about the entirely wrong things.**

The project you are obsessing over will fall apart by next February, and when it does, it will feel like the sky has collapsed. But by July, you will have met three people who will change the course of your thinking forever, and you will barely remember what the original panic was about.

### What You Should Actually Pay Attention To

Instead of fretting over your resume, look across the table. 

Your friend is about to take a job in another continent. This is one of the last four evenings you will ever spend together in this cafe, laughing until your ribs ache over jokes that make no sense to anyone else. Put down the pen. Close the notebook. Order another pot of mint tea and listen to the story he is telling about his bicycle.

The things you think are monumental are merely weather. 

The things you dismiss as casual everyday background noise are the architecture of your soul.`,
      tags: ["memory", "silence", "family"],
    },
    // DRAFTS to showcase private writing workflow
    {
      title: "The Unfinished Manuscript in the Drawer",
      slug: "the-unfinished-manuscript-in-the-drawer",
      subtitle: "A story I started in the winter of 2018 and never had the courage to finish.",
      chapterId: createdChapters["fragments"].id,
      storyType: "FRAGMENT",
      status: "DRAFT",
      year: 2018,
      approximateDate: "Winter, 2018",
      location: "Basement Study",
      peopleInvolved: "Unspoken memories",
      mood: "Raw, Unfinished",
      readingTimeMinutes: 2,
      isFeatured: false,
      coverImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1400&auto=format&fit=crop",
      excerpt: "This is a private draft. Only accessible to the authenticated author.",
      content: `### Notes for Chapter Revisions

This story needs a different opening. The first draft felt too guarded.

* Key memory: The sound of rain beating against the basement glass well.
* The smell of paraffin heater.
* Need to rewrite the dialogue between the brothers.

[DRAFT IN PROGRESS - TO BE EXPANDED]`,
      tags: ["silence", "solitude"],
    },
    {
      title: "The Last Train from Howrah",
      slug: "the-last-train-from-howrah",
      subtitle: "A night journey across the misty river.",
      chapterId: createdChapters["incidents"].id,
      storyType: "INCIDENT",
      status: "DRAFT",
      year: 2020,
      approximateDate: "February, 2020",
      location: "Howrah Station",
      peopleInvolved: "Stranger with a violin case",
      mood: "Atmospheric, Noir",
      readingTimeMinutes: 3,
      isFeatured: false,
      coverImage: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?q=80&w=1400&auto=format&fit=crop",
      excerpt: "Draft exploring the pre-pandemic silence of the terminal.",
      content: `The fog hung low over the Hooghly. You couldn't see the opposite bank, only the iron rivets of the bridge fading into white vapor.

[DRAFT: Waiting for final edit before publishing to archive.]`,
      tags: ["night", "journey"],
    },
  ];

  for (const s of storiesData) {
    const { tags: storyTags, ...storyData } = s;
    const story = await prisma.story.create({
      data: {
        ...storyData,
        authorId: author.id,
        publishedAt: storyData.status === "PUBLISHED" ? new Date() : null,
      },
    });

    if (storyTags && storyTags.length > 0) {
      for (const tagSlug of storyTags) {
        if (createdTags[tagSlug]) {
          await prisma.storyTag.create({
            data: {
              storyId: story.id,
              tagId: createdTags[tagSlug].id,
            },
          });
        }
      }
    }
  }

  console.log(`Created ${storiesData.length} stories (including 2 private drafts).`);
  console.log("Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
