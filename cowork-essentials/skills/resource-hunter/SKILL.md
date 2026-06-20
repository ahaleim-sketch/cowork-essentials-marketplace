---
name: resource-hunter
description: Find free tools, credits, templates, and deals for any topic
triggers:
  - find resources for
  - hunt for free
  - find deals for
  - free credits for
---

# Resource Hunter

Find the best free resources, credits, templates, and deals for any tool or topic. This skill searches systematically so you never miss hidden value.

## How It Works

When you say something like "find resources for [topic]" or "hunt for free [tool name]", this skill kicks in and searches in a specific order designed to surface the highest-value finds first.

## Search Priority Order

Search for resources in this exact order. Higher priority = more value to the user.

1. **Free credits and trials** -- Sign-up credits, extended trials, education programs, startup credits
2. **Creator and partner deals** -- Special offers through creators, affiliates, or partner programs
3. **Beta access programs** -- Early access waitlists, beta signups, preview programs
4. **Official templates** -- Starter templates, example projects, quickstart repos from the company
5. **GitHub resources** -- Open-source alternatives, community tools, integrations, plugins
6. **Community resources** -- Forums, Discord servers, subreddits, community-built tools
7. **Documentation gems** -- Hidden features, undocumented endpoints, power-user guides
8. **Comparison alternatives** -- Free alternatives that do the same thing, feature comparison tables

## Research Process

For each resource found, verify ALL of the following before including it:

- [ ] Link is active and loads correctly
- [ ] Resource is actually free (not a bait-and-switch free trial that requires payment)
- [ ] Source is legitimate (not spam, not a scam, not outdated)
- [ ] Description accurately reflects what the user gets
- [ ] Any limitations are clearly noted (time limits, usage caps, feature restrictions)

## Value Ranking System

Rank every find using this tier system:

| Tier | Type | Example |
|------|------|---------|
| S | Free credits worth $50+ | "Google Cloud gives $300 free credits for 90 days" |
| A | Waitlist skip or beta access | "Join their Discord to get early access" |
| B | Official templates and starters | "They have 50 free Figma templates" |
| C | Useful prompts or workflows | "Community prompt library with 200+ tested prompts" |
| D | Guides and tutorials | "Free 2-hour crash course on YouTube" |
| E | Community and forums | "Active subreddit with 50k members" |

## Output Format

Structure your response like this:

### [Topic/Tool Name] -- Free Resource Hunt

**Top Finds** (best value, highlighted)
List the S and A tier finds here with direct links and clear descriptions.

**Templates and Starters** (B tier)
Official and community templates, boilerplates, starter kits.

**Learning Resources** (C-D tier)
Prompts, workflows, guides, courses, tutorials.

**Community** (E tier)
Forums, Discord servers, communities worth joining.

**Alternatives Worth Knowing**
Free tools that solve the same problem differently.

### Summary Table

| Resource | Type | Value Tier | Link |
|----------|------|-----------|------|
| ... | ... | ... | ... |

## Rules

- Always verify links before including them
- Note any expiration dates on deals or credits
- Flag if something requires a credit card even for free tiers
- Include the date you found each resource so users know how fresh it is
- If a resource has geographic restrictions, note that clearly
- Never include affiliate links unless explicitly asked
- When in doubt about legitimacy, leave it out

## Example Usage

- "Find resources for Cursor AI"
- "Hunt for free design tools"
- "Find deals for video editing software"
- "Free credits for cloud hosting"
- "What free alternatives exist for Notion"

## Tips for Best Results

- Be specific about what you need ("find resources for Cursor AI" beats "find coding tools")
- Mention your use case if relevant ("free video editing for YouTube shorts")
- Ask for a refresh if results are more than a month old
- Combine with other skills: use the finds in slide decks, diagrams, or scripts
