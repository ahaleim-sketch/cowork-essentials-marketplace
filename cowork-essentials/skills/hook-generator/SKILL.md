---
name: hook-generator
description: Generate 5 hook variations for A/B testing any video topic
triggers:
  - generate hooks for
  - give me hooks
  - hook variations
  - write hooks for
  - 5 hooks for
---

# Hook Generator

Generate 5 unique hook variations for any video topic so you can A/B test and find the strongest opener.

## Instructions

When the user provides a video topic or script idea, generate exactly 5 hooks. Each hook MUST use a different style from the Hook Style Library below. Never repeat a style within the same set.

### Step 1: Understand the Topic

- Read the user's topic, title, or script summary.
- If the topic is vague, ask one clarifying question: "Who is the audience for this video?"
- Identify the core promise, transformation, or value the video delivers.

### Step 2: Select 5 Hook Styles

Pick the 5 styles that best fit the topic from this library. Prioritize variety — never cluster similar styles together.

**Hook Style Library:**

| Style | Pattern | Example |
|---|---|---|
| Authority Drop | Lead with a credible source or insider knowledge | "Google just quietly released something nobody is talking about." |
| Free Value | Promise something valuable at zero cost | "I'm going to give you the exact template I used to land 10 clients." |
| Transformation | Show a before/after result | "I went from 200 to 50,000 subscribers using one strategy." |
| Pattern Interrupt | Say something unexpected that breaks the scroll | "Stop using ChatGPT. Seriously." |
| Question Hook | Ask a question the viewer desperately wants answered | "What if you could build a website in 60 seconds?" |
| Story Hook | Open with a mini-narrative or personal moment | "Last Tuesday I accidentally deleted my entire project. What happened next changed everything." |
| Stat Hook | Lead with a surprising number or data point | "97% of people use this tool wrong." |
| Controversy | Challenge a popular belief or common practice | "Notion is actually making you less productive." |
| Scarcity | Create urgency around timing or availability | "This free tool is about to go paid. Here's how to lock it in." |
| Social Proof | Reference what others are doing or achieving | "Every creator I know switched to this last month." |
| Curiosity Gap | Tease information without revealing it | "There's a setting buried in Claude that changes everything." |

### Step 3: Write the Hooks

For each hook, provide:

1. **Style label** (e.g., "Pattern Interrupt")
2. **The hook** — 1-2 sentences max. Written at a 5th grade reading level. Short words, short sentences.
3. **Why it works** — One sentence explaining the psychological trigger.

Rules for writing hooks:
- Maximum 15 words per sentence.
- No jargon or technical terms in the hook itself.
- The hook must work as the FIRST thing a viewer hears. No setup needed.
- Every hook must create an open loop — the viewer needs to keep watching to close it.
- Do NOT start two hooks the same way (e.g., don't start two with "I").

### Step 4: Rank and Recommend

After presenting all 5 hooks, run this quality checklist on each one:

**Hook Quality Checklist:**
- [ ] Would this make someone stop scrolling in under 1 second?
- [ ] Does it create an open loop or unanswered question?
- [ ] Is it under 15 words per sentence?
- [ ] Does it promise a clear benefit or spark curiosity?
- [ ] Would it work WITHOUT the video — just as audio or text?
- [ ] Is it specific (not generic)?

Score each hook out of 6 based on the checklist. Then rank all 5 from strongest to weakest.

Present your recommendation like this:

```
## Rankings

1. 🥇 [Style] — Score: X/6 — "The hook text..."
   → Best because: [one sentence reason]

2. 🥈 [Style] — Score: X/6 — "The hook text..."
3. 🥉 [Style] — Score: X/6 — "The hook text..."
4. [Style] — Score: X/6 — "The hook text..."
5. [Style] — Score: X/6 — "The hook text..."
```

### Step 5: Offer Next Steps

After ranking, ask:
> "Want me to expand any of these into a full script, or generate 5 more in different styles?"

## Output Format

```
## Hook Variations for: [Topic]

### 1. [Style Name]
"[Hook text]"
↳ Why it works: [explanation]

### 2. [Style Name]
"[Hook text]"
↳ Why it works: [explanation]

### 3. [Style Name]
"[Hook text]"
↳ Why it works: [explanation]

### 4. [Style Name]
"[Hook text]"
↳ Why it works: [explanation]

### 5. [Style Name]
"[Hook text]"
↳ Why it works: [explanation]

## Rankings
[Ranked list with scores and reasoning]
```
