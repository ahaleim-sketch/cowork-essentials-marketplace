---
name: context-builder
description: Build a CLAUDE.md file by answering 7 guided questions
triggers:
  - build my claude.md
  - set up my cowork
  - create my context file
  - help me set up claude
---

# Context Builder

Build a complete, personalized CLAUDE.md file through a simple 7-question interview. This file tells Claude who you are, what you do, and how you work so every conversation starts with full context.

## What This Creates

A `CLAUDE.md` file saved to your project root with these sections:

| Section | What it covers |
|---------|---------------|
| **Universal Rules** | Always-do and never-do instructions |
| **About the User** | Role, business, audience, and goals |
| **Typical Workflow** | How a normal workday flows |
| **Tone & Style** | How Claude should write and communicate |
| **Tools & Integrations** | Software, platforms, and services you use |

## Interview Process

Ask these 7 questions **one at a time**. Wait for the user to answer each question before moving to the next. Give a short acknowledgment after each answer (one sentence max) before asking the next question.

### Question 1: What You Do
> "Let's build your CLAUDE.md. First question: **What do you do?** Give me your role, your business, and what you spend most of your time on."

*Looking for: job title, industry, business type, primary responsibilities*

### Question 2: Your Audience
> "Got it. **Who is your audience or customer?** Describe who you serve, what they care about, and how they find you."

*Looking for: target demographic, pain points, channels, relationship type (B2B, B2C, community, etc.)*

### Question 3: Your Tools
> "**What tools and platforms do you use regularly?** List everything: software, apps, services, APIs. Don't filter, just dump them all."

*Looking for: productivity tools, creative tools, platforms, communication tools, any integrations*

### Question 4: Current Goals
> "**What are your main goals for the next 3-6 months?** Be specific. Numbers, milestones, launches, targets."

*Looking for: measurable objectives, deadlines, priorities, growth targets*

### Question 5: Typical Workday
> "**Walk me through a typical workday.** What do you do first thing? What takes up most of your time? What do you wish you could automate?"

*Looking for: daily routine, time sinks, automation opportunities, recurring tasks*

### Question 6: Always Do
> "**What should Claude always do when working with you?** Think about tone, format, level of detail, or specific habits you want."

*Examples: always use bullet points, keep responses short, include sources, write casually, think step-by-step*

### Question 7: Never Do
> "Last one. **What should Claude never do?** What annoys you, wastes your time, or goes against how you work?"

*Examples: never use emojis, don't over-explain, don't make up data, never say "as an AI", avoid corporate jargon*

## Generating the CLAUDE.md

After all 7 answers are collected, generate the file using the user's **actual words and phrasing** wherever possible. Do not sanitize their language into corporate-speak.

### Template Structure

```markdown
# [User's Business/Role Name]

## UNIVERSAL RULES

### Always Do
- [Derived from Q6 answers, written as clear directives]
- [Each rule on its own line]

### Never Do
- [Derived from Q7 answers, written as clear directives]
- [Each rule on its own line]

## ABOUT THE USER

- **Role:** [From Q1]
- **Business:** [From Q1]
- **Audience:** [From Q2]
- **Goals (next 3-6 months):**
  - [From Q4, as bullet points]

## TYPICAL WORKFLOW

[From Q5, written as a natural narrative paragraph or time-blocked list]

### Automation Opportunities
- [Any tasks they mentioned wanting to automate]

## TONE & STYLE

[Derived from Q6/Q7. Describe how Claude should communicate.]

## TOOLS & INTEGRATIONS

| Tool | Used For |
|------|----------|
| [Tool name] | [Brief purpose, from Q3] |
```

## Delivery

1. Present the full generated CLAUDE.md to the user in a code block.
2. Ask: "Does this look right? Want me to change anything before I save it?"
3. After approval, save to `CLAUDE.md` in the project root.
4. If a CLAUDE.md already exists, ask before overwriting. Offer to merge instead.

## Rules

- **One question at a time.** Never ask two questions in the same message.
- **Short acknowledgments.** After each answer, respond with one brief sentence before the next question. No summaries, no recaps, no praise paragraphs.
- **Use their words.** If they say "I run a bakery," write "I run a bakery" not "Operates a culinary retail establishment."
- **No filler content.** Only include sections that have real information from the interview. If they skipped a question or gave a vague answer, leave that section minimal rather than padding it.
- **Ask for clarification** if an answer is too vague to be useful (e.g., "I do marketing" -- ask what kind).
- **Keep it under 80 lines.** A CLAUDE.md should be scannable, not a novel.
- If the user already has a CLAUDE.md, read it first and offer to improve it rather than starting from scratch.
