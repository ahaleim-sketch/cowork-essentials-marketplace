---
name: title-generator
description: Generate click-worthy YouTube title ideas from video content
triggers:
  - generate titles
  - title ideas
  - youtube titles
  - come up with titles
---

# YouTube Title Generator

Generate 10 click-worthy YouTube title ideas from a video topic, transcript, or script. Titles are ranked with reasoning and paired with thumbnail concepts.

## Instructions

### Step 1: Understand the Content

Accept any of the following as input:
- A video topic or idea
- A full transcript or script
- A rough outline or bullet points
- An existing title the user wants to improve

If the input is too vague (just a single word), ask: "Can you tell me a bit more about what the video covers or who it is for?"

If a CLAUDE.md file exists, check it for context about the user's niche, audience, and channel style. Adapt titles to match their brand.

### Step 2: Review Proven Formulas

Use this formula table as a starting point. Every title set should pull from at least 5 different formulas.

| Formula | Example |
|---|---|
| I [Action] [Thing] | "I Built an AI Employee in 30 Minutes" |
| I Was Wrong About [Thing] | "I Was Wrong About Notion AI" |
| [Number] [Things] That [Result] | "5 AI Tools That Replaced My Entire Team" |
| How to [Result] Without [Barrier] | "How to Edit Videos Without Touching a Timeline" |
| [Thing] Changed Everything | "This Free AI Tool Changed Everything" |
| Stop [Doing Thing] | "Stop Using ChatGPT Like This" |
| The [Adjective] Guide to [Thing] | "The Complete Guide to Claude Cowork" |
| [Thing] vs [Thing] | "Notion AI vs Claude — Which One Wins?" |
| Why [Surprising Claim] | "Why I Quit Using Canva" |
| [Result] in [Timeframe] | "Build a Website in 60 Seconds" |
| What Nobody Tells You About [Thing] | "What Nobody Tells You About AI Automation" |
| [Audience], You Need to See This | "Content Creators, You Need to See This" |
| I Tested [Thing] for [Time] | "I Tested Every AI Tool for 30 Days" |
| [Number] Mistakes [Audience] Make | "5 Mistakes New YouTubers Make" |

### Step 3: Generate 10 Titles

Write exactly 10 title options. For each title, follow these rules:

**Title Rules:**
- Under 60 characters (YouTube truncates beyond this on most devices)
- Lead with intrigue, not information — make people NEED to click
- No clickbait — every title must be deliverable by the actual video content
- No ALL CAPS words (YouTube penalizes this in some cases)
- Use numbers when possible (numbers outperform in CTR)
- Avoid generic filler words ("amazing", "incredible", "insane")
- Front-load the most interesting word or concept
- Each title must use a DIFFERENT formula — no repeats

For each title, include:
1. **The title** (with character count)
2. **Formula used**
3. **Why it could work** — one sentence on the psychological trigger

### Step 4: Rank the Top 3

After all 10 titles, pick your top 3 and explain why. Consider:
- Curiosity factor (does it create an open loop?)
- Clarity (does the viewer know what they will get?)
- Specificity (is it concrete or vague?)
- Scroll-stopping power (would this stand out in a feed?)
- SEO potential (does it contain a searchable phrase?)

### Step 5: Thumbnail Pairing Ideas

For each of your top 3 titles, suggest a thumbnail concept that complements it. The title and thumbnail should tell DIFFERENT parts of the same story — never repeat the same words on both.

```
## Top 3 Picks

### #1: "[Title]" (XX chars)
Formula: [name]
Why it wins: [reasoning]
Thumbnail idea: [concept that complements without repeating the title]

### #2: "[Title]" (XX chars)
Formula: [name]
Why it wins: [reasoning]
Thumbnail idea: [concept]

### #3: "[Title]" (XX chars)
Formula: [name]
Why it wins: [reasoning]
Thumbnail idea: [concept]
```

### Step 6: Offer Refinement

After presenting, ask:
> "Want me to riff on any of these, combine two ideas, or generate 10 more in a different direction?"

## Output Format

```
## 10 Title Ideas for: [Topic]

1. "[Title]" — XX chars
   Formula: [name] | [Why it works]

2. "[Title]" — XX chars
   Formula: [name] | [Why it works]

[...continue through 10]

---

## Top 3 Picks
[Ranked with reasoning and thumbnail pairing ideas]
```

## Common Mistakes to Avoid

- Titles that are too long (over 60 chars get cut off on mobile)
- Titles that describe the video instead of selling it
- Using the exact same words on the title AND the thumbnail
- Being vague when you could be specific ("This AI Tool" vs "This Free AI Editor")
- Burying the hook at the end of the title instead of the beginning
