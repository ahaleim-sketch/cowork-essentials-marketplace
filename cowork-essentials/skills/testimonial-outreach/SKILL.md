---
name: testimonial-outreach
description: Draft a message asking a client for a testimonial. Use this skill when the user says "ask for a testimonial", "get a testimonial", "testimonial request", "ask them for a review", "client feedback request", "request a testimonial from", or any variation of wanting to ask a happy client for a quote or review.
triggers:
  - ask for a testimonial
  - get a testimonial
  - testimonial request
  - ask for a review
  - client feedback
  - request a testimonial
---

# Testimonial Outreach

Draft a natural, non-awkward message that asks a happy client for a testimonial. Most people never ask because they don't know how to phrase it. This skill makes it easy.

## Instructions

### Step 1: Understand the Context

From the user's request, identify:

- **Client name** — Who are you asking?
- **What you did for them** — What service or result are you referencing?
- **The result** — What outcome or win can you point to?
- **Channel** — Is this going via email, DM, text, or LinkedIn message?
- **Relationship vibe** — Formal? Casual? Friendly? Long-term?
- **Where the testimonial will be used** — Website, social media, proposal, case study?

Check CLAUDE.md for the user's name and communication style.

### Step 2: Draft the Message

The key to a good testimonial ask: make it easy and specific. Don't say "can you write me a testimonial?" That's vague and feels like homework. Instead, reference the specific result and give them a framework.

**Structure:**

```
[Casual greeting — "Hey [Name]," or "Hi [Name],"]

[Reference the result or positive moment — "I was looking back at the work we did on [project] and I'm really proud of how [specific result] turned out."]

[The ask — framed as easy and quick]

[Optional: give them 2-3 prompts to respond to so they don't stare at a blank page]

[Close — low pressure, grateful tone]

[Your name]
```

### Step 3: Three Versions

Always generate three variations:

**Version 1: The Quick Ask**
Short, casual, low-pressure. Best for clients you have a friendly relationship with. 3-4 sentences max.

**Version 2: The Guided Ask**
Includes 2-3 specific prompts the client can respond to. Best for clients who might not know what to write. Example prompts:
- "What was the biggest challenge before we started working together?"
- "What result or change stood out the most?"
- "Would you recommend this to someone in a similar situation? Why?"

**Version 3: The Permission Ask**
For when you already have something they said (in an email, on a call, in Slack) and you want to use it. Asks for permission to quote them rather than asking them to write something new.

### Step 4: Follow-Up Draft

Also generate a follow-up message to send if they don't respond in 7 days. Keep it short, friendly, zero guilt:

```
"Hey [Name], just bumping this up in case it got buried. No pressure at all — if you have 2 minutes to share a quick thought about our work together, it would mean a lot. If not, totally fine!"
```

### Step 5: Deliver

Present all three versions clearly labeled. Let the user pick which one fits.

Offer: "Want me to adjust the tone, make it shorter, or draft this for a different platform?"

## Rules

- Never sound desperate or pushy. The tone should be confident and grateful.
- Always reference a specific result or project. Generic asks get generic responses (or no response).
- Keep it short. The ask itself should be under 150 words.
- Never fabricate what the client said or experienced. Use only details the user provides.
- If the user wants to quote something the client already said, the Permission Ask version is the right move.
