---
name: sow-generator
description: Generate a professional Statement of Work document from a project description. Use this skill when the user says "create a SOW", "statement of work", "scope of work", "project scope document", "write a SOW for", "scope this project", or any variation of wanting a formal project scope document.
triggers:
  - create a SOW
  - statement of work
  - scope of work
  - project scope
  - write a SOW
  - scope this project
---

# SOW Generator

Create a clear, professional Statement of Work that defines exactly what you're delivering, when, and for how much. Prevents scope creep, sets expectations, and protects both sides.

## Instructions

### Step 1: Gather Project Details

From the user's request or conversation, identify:

- **Client name** — Who is this for?
- **Project name** — What are we calling this engagement?
- **Your business name** — Pull from CLAUDE.md if available
- **Project overview** — What is the work at a high level?
- **Deliverables** — What specific things will be delivered?
- **Timeline** — Start date, milestones, end date
- **Budget / Pricing** — Fixed fee, hourly, milestone-based?
- **Out of scope** — What is explicitly NOT included?

If the user gives you a loose description like "I'm building a website for a client," extract what you can and fill in reasonable defaults. Flag anything you assumed so they can adjust.

### Step 2: Build the SOW

Use this structure:

```markdown
# Statement of Work

**Project:** [Project Name]
**Client:** [Client Name]
**Provider:** [Your Business Name]
**Date:** [Today's Date]
**Valid Until:** [30 days from today]

---

## 1. Project Overview

[2-3 paragraphs describing the project, its goals, and the context. Written in plain English, not legalese.]

## 2. Scope of Work

The following deliverables are included in this engagement:

### Phase 1: [Phase Name]
- [Deliverable 1 — specific and measurable]
- [Deliverable 2]
- [Deliverable 3]
- **Timeline:** [X weeks from project start]

### Phase 2: [Phase Name]
- [Deliverable 1]
- [Deliverable 2]
- **Timeline:** [X weeks from Phase 1 completion]

[Add phases as needed]

## 3. Out of Scope

The following are explicitly NOT included in this engagement:

- [Item 1]
- [Item 2]
- [Item 3]

Any work outside the scope defined above will require a separate agreement or change order.

## 4. Timeline

| Milestone | Target Date | Deliverable |
|-----------|------------|-------------|
| Project Kickoff | [Date] | Kickoff call, access sharing |
| [Milestone 2] | [Date] | [What's delivered] |
| [Milestone 3] | [Date] | [What's delivered] |
| Final Delivery | [Date] | All deliverables complete |

## 5. Investment

**Total Project Fee:** $[Amount]

**Payment Schedule:**
- [X]% due upon signing ($[Amount])
- [X]% due at [milestone] ($[Amount])
- [X]% due upon completion ($[Amount])

## 6. Assumptions

- [Client will provide access to X by Y date]
- [Feedback will be provided within X business days]
- [Up to X rounds of revisions are included]

## 7. Acceptance

This SOW is valid for 30 days from the date above. Work begins upon signed acceptance and receipt of the first payment.
```

### Step 3: Writing Rules

- **Plain English, not legalese.** This is a working document, not a contract. Write it so both sides can read it without a lawyer.
- **Deliverables must be specific.** Not "design work" but "Homepage design (desktop + mobile), delivered as Figma file."
- **Out of scope matters as much as in scope.** This is what prevents "can you also just quickly..." conversations later.
- **Timelines should be realistic.** Pad by 20% if you're unsure.
- **Never fabricate pricing.** If the user hasn't specified, leave placeholders with [AMOUNT] and flag it.

### Step 4: Save and Deliver

Save as a markdown file: `SOW - [Client Name] - [Project Name].md`

Or if the user wants a Word doc, generate a .docx using the docx skill format.

Offer: "Want me to adjust the scope, add more phases, or convert this to a Word doc you can send?"

## Rules

- Never invent project details. If something is ambiguous, flag it with [TBD] and tell the user.
- Keep the out-of-scope section. Even if the user doesn't mention it, add reasonable boundaries based on the project type.
- Default payment structure is 50/50 (50% upfront, 50% on completion) unless the user specifies otherwise.
