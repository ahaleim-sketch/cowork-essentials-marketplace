---
name: proposal-generator
description: Generate a professional client proposal from a project description or conversation
triggers:
  - write a proposal
  - generate a proposal
  - client proposal for
  - create a proposal
  - draft a proposal
---

# Proposal Generator

Generate a professional, ready-to-send client proposal from a project description, conversation summary, or brief.

## Instructions

### Step 1: Gather Project Details

If the user hasn't provided enough detail, ask these questions (only the ones you need — skip any already answered):

1. **Who is the client?** — Company name, contact person, industry
2. **What's the project?** — What are you building, delivering, or providing?
3. **What problem does it solve?** — Why does the client need this?
4. **What's the scope?** — Key deliverables, phases, milestones
5. **What's the timeline?** — Start date, end date, key deadlines
6. **What's the budget?** — Fixed price, hourly rate, retainer, or "suggest a range"
7. **Any special terms?** — Revisions, payment schedule, exclusions

If the user says "just make it up" or gives vague details, use reasonable defaults for their industry and note assumptions clearly.

### Step 2: Build the Proposal

Generate a complete proposal with these sections:

```
# [Project Name] — Proposal

**Prepared for:** [Client Name / Company]
**Prepared by:** [User's name from CLAUDE.md, or ask]
**Date:** [Today's date]

---

## Executive Summary
[2-3 sentences: what you're proposing, the key benefit, and why you're the right fit. Written in confident but not salesy tone.]

## The Challenge
[What problem the client faces. Show you understand their situation. 3-5 sentences max.]

## Proposed Solution
[What you'll do to solve it. Be specific about approach, not just outcomes. Break into clear paragraphs if needed.]

## Scope of Work

### Phase 1: [Phase Name] — [Timeline]
- [Deliverable 1]
- [Deliverable 2]
- [Deliverable 3]

### Phase 2: [Phase Name] — [Timeline]
- [Deliverable 1]
- [Deliverable 2]

[Continue phases as needed]

## Timeline

| Milestone | Date | Deliverable |
|-----------|------|-------------|
| Kickoff | [Date] | [What happens] |
| [Milestone] | [Date] | [What's delivered] |
| Final Delivery | [Date] | [What's delivered] |

## Investment

| Item | Price |
|------|-------|
| [Phase/deliverable 1] | $X,XXX |
| [Phase/deliverable 2] | $X,XXX |
| **Total** | **$XX,XXX** |

[Payment terms: e.g., 50% upfront, 50% on completion]

## What's Included
- [Included item 1]
- [Included item 2]
- [Included item 3]

## What's Not Included
- [Exclusion 1 — and what it would cost to add]
- [Exclusion 2]

## Next Steps
1. Review this proposal
2. [Schedule a call / Sign and return / etc.]
3. [First action after agreement]

---

*This proposal is valid for 30 days from the date above.*
```

### Step 3: Tone and Quality Rules

| Rule | Why |
|------|-----|
| Confident but not arrogant | "We'll deliver X" not "We're the best at X" |
| Specific deliverables, not vague promises | "3 landing page designs" not "design work" |
| Client's problem first, your solution second | Show you understand before you prescribe |
| No jargon the client wouldn't know | Match their language level |
| Round numbers for pricing | $5,000 not $4,847 |
| Include exclusions | Prevents scope creep and awkward conversations |

### Step 4: Present and Refine

Show the complete proposal and ask:
- "Want me to adjust the pricing, timeline, or scope?"
- "Should I make the tone more formal or more casual?"
- "Want me to add a case study or social proof section?"

Revise based on feedback until the user approves.

## Output

A complete, copy-paste-ready proposal in clean markdown. The user can paste it into Google Docs, Notion, or any document tool.
