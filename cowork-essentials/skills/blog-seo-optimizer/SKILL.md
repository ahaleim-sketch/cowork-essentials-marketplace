---
name: blog-seo-optimizer
description: Optimize any blog post or article for search engines. Use this skill when the user says "optimize for SEO", "SEO this post", "improve my blog SEO", "keyword optimize", "make this rank", "SEO review", "blog optimization", or any variation of wanting to improve a blog post's search visibility.
triggers:
  - optimize for SEO
  - SEO this post
  - improve my blog SEO
  - keyword optimize
  - make this rank
  - SEO review
  - blog optimization
---

# Blog SEO Optimizer

Take any blog post and optimize it to actually rank on Google. Not keyword stuffing. Real optimization: better structure, strategic keyword placement, improved readability, and metadata that earns clicks.

## Instructions

### Step 1: Analyze the Content

From the user's input, identify:

- **The blog post** — Full text or URL
- **Target keyword** — What search term should this rank for? If not provided, suggest 3-5 based on the content.
- **Target audience** — Who is searching for this?
- **Competition level** — Use WebSearch to check what's currently ranking for the target keyword

If the user provides a post, analyze it. If they provide a topic, research first, then optimize.

### Step 2: Keyword Research

Use WebSearch to find:

- **Primary keyword** — The main search term (highest volume, achievable difficulty)
- **Secondary keywords** — 3-5 related terms to weave in naturally
- **Long-tail variations** — Specific phrases people actually search
- **Questions people ask** — "People Also Ask" type queries related to the topic

Present the keyword strategy:

```
## Keyword Strategy

**Primary keyword:** [keyword] — [estimated monthly searches if findable]
**Secondary keywords:** [keyword 1], [keyword 2], [keyword 3]
**Long-tail targets:** [phrase 1], [phrase 2]
**Questions to answer:** [question 1], [question 2], [question 3]
```

### Step 3: Optimize the Post

Apply these optimizations:

**Title Tag (H1)**
- Include the primary keyword naturally, ideally near the front
- Keep under 60 characters
- Make it click-worthy, not just keyword-stuffed
- Provide 3 title options

**Meta Description**
- 150-160 characters
- Include the primary keyword
- Write it as a compelling reason to click, not a summary
- Provide 2 options

**URL Slug**
- Short, descriptive, includes primary keyword
- No stop words, no dates unless time-sensitive

**Headings (H2s and H3s)**
- Every H2 should target a secondary keyword or answer a "People Also Ask" question
- Use clear, descriptive headings (not clever/vague ones)
- Follow a logical structure readers can scan

**Content Optimization**
- Primary keyword in the first 100 words
- Secondary keywords distributed naturally throughout
- Short paragraphs (2-3 sentences max for web)
- Include internal linking opportunities (flag where to add links)
- Add a FAQ section at the bottom answering 3-5 related questions (great for featured snippets)

**Readability**
- Aim for 6th-8th grade reading level
- Break up walls of text with subheadings every 200-300 words
- Use bullet points for scannable lists
- Bold key phrases (not for SEO, for reader experience)

### Step 4: Deliver the Audit

Present the optimization as a clear report:

```markdown
# SEO Optimization Report

**Post:** [Title]
**Target Keyword:** [Primary keyword]
**Current Issues:** [Brief list of what needs fixing]

---

## Recommended Title Options
1. [Title option 1] (XX characters)
2. [Title option 2] (XX characters)
3. [Title option 3] (XX characters)

## Meta Description Options
1. [Description 1] (XXX characters)
2. [Description 2] (XXX characters)

## URL Slug
`/[recommended-slug]`

## Content Changes

### Structure Changes
- [What to restructure and why]

### Keyword Placement
- [Where to add primary keyword]
- [Where to add secondary keywords]

### Missing Elements
- [FAQ section to add]
- [Internal links to add]
- [Images or media to add]

### Suggested H2 Headings
1. [H2 suggestion — targets: keyword]
2. [H2 suggestion — targets: keyword]
3. [H2 suggestion — targets: keyword]

## FAQ Section to Add

**Q: [Question]**
A: [2-3 sentence answer]

**Q: [Question]**
A: [2-3 sentence answer]

**Q: [Question]**
A: [2-3 sentence answer]
```

### Step 5: Offer Next Steps

"Want me to rewrite the full post with these optimizations applied, or should I just make the changes and save an updated version?"

## Rules

- Never keyword stuff. If a keyword feels forced, rewrite the sentence, don't shove it in.
- Optimize for humans first, search engines second. Google rewards content that people actually read and stay on.
- Always verify keyword suggestions with real search data. Don't guess at what people search for.
- Be specific with recommendations. Not "add more keywords" but "add [keyword] to the H2 in section 3 and the opening paragraph."
- If the content is thin (under 800 words), recommend expanding specific sections rather than padding with fluff.
