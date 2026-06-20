---
name: goal-tracker
description: Set, track, and review progress on personal or professional goals. Use this skill when the user says "set a goal", "track my goals", "goal tracker", "what are my goals", "how am I doing on my goals", "quarterly goals", "new year goals", "OKRs", "goal check-in", or any variation of wanting to define, track, or review progress toward goals.
triggers:
  - set a goal
  - track my goals
  - goal tracker
  - what are my goals
  - how am I doing on my goals
  - quarterly goals
  - OKRs
  - goal check-in
---

# Goal Tracker

Set clear goals, break them into milestones, and track progress over time. Not a vague wishlist. A system that turns "I want to grow my business" into measurable targets with deadlines and check-ins that actually keep you accountable.

## Instructions

### Step 1: Determine the Mode

This skill has three modes. Identify which one the user needs:

1. **Set New Goals** — They want to define new goals
2. **Check In** — They want to review progress on existing goals
3. **Review & Reset** — End of quarter/month, time to evaluate and set new ones

If a `goals.md` file exists in the workspace, read it first. If not, start in Set New Goals mode.

### Step 2A: Set New Goals

Ask or identify:

- **What do they want to achieve?** — Get the raw goal
- **By when?** — Deadline or timeframe
- **Why does it matter?** — The motivation (helps when things get hard)
- **How will they measure it?** — What does "done" look like in numbers?

Then transform vague goals into SMART goals:

**Vague:** "Grow my YouTube channel"
**SMART:** "Reach 5,000 subscribers by June 30, 2026 by publishing 2 videos per week and increasing average CTR to 8%"

**Vague:** "Make more money"
**SMART:** "Generate $10,000/month in recurring revenue by September 2026 through 5 retainer clients at $2,000/month"

For each goal, create:

```markdown
# Goals

*Last updated: [Date]*

---

## Goal 1: [Clear, Measurable Goal Statement]

**Target:** [The specific number or outcome]
**Deadline:** [Date]
**Why:** [1 sentence on why this matters]
**Status:** Not Started | In Progress | On Track | Behind | Complete

### Milestones

| Milestone | Target Date | Status | Notes |
|-----------|------------|--------|-------|
| [First milestone] | [Date] | [ ] | |
| [Second milestone] | [Date] | [ ] | |
| [Third milestone] | [Date] | [ ] | |
| [Final target] | [Deadline] | [ ] | |

### Key Actions
- [ ] [Specific action that moves this forward]
- [ ] [Action 2]
- [ ] [Action 3]

### Progress Log
| Date | Update | Metric |
|------|--------|--------|
| [Start date] | Goal set | Starting point: [current number] |

---

## Goal 2: [Goal Statement]

[Same structure...]
```

### Step 2B: Check In

Read the existing `goals.md` file and for each goal:

1. Ask for a quick update: "Where are you at on [goal]?"
2. Compare current progress to the milestone timeline
3. Flag if they're ahead, on track, or behind
4. Update the progress log with today's numbers

Present a check-in summary:

```markdown
## Goal Check-In: [Date]

### [Goal 1]
**Status:** On Track / Behind / Ahead
**Progress:** [X]% toward target
**Current:** [number] → **Target:** [number] by [date]
**Next milestone:** [What's next] by [date]
**Action needed:** [What to focus on this week]

### [Goal 2]
[Same structure...]

---

**Overall:** [1-2 sentences. Honest assessment. Celebrate wins. Flag risks.]
```

Update the `goals.md` file with new progress entries.

### Step 2C: Review & Reset

For end-of-period reviews:

1. Read all goals and progress logs
2. Calculate final results vs targets
3. Identify what worked and what didn't
4. Help set new goals for the next period

```markdown
## Goal Review: [Period]

### Results

| Goal | Target | Actual | Hit? |
|------|--------|--------|------|
| [Goal 1] | [Target] | [Actual] | Yes / No / Partial |
| [Goal 2] | [Target] | [Actual] | Yes / No / Partial |

### What Worked
- [Thing that helped progress]
- [Thing that helped]

### What Didn't Work
- [Thing that held them back]
- [Obstacle or habit]

### Lessons for Next Quarter
- [Insight to carry forward]

### New Goals for [Next Period]
[Start the Set New Goals flow]
```

### Step 3: Save and Deliver

Save or update: `goals.md` in the workspace root

After setting goals, offer: "Want me to schedule a weekly or monthly check-in reminder?"

After a check-in, offer: "Want me to adjust any milestones or add new actions based on where you are?"

## Rules

- Goals must be measurable. If you can't put a number on it, push the user to define what "done" looks like.
- Be honest in check-ins. Don't sugarcoat being behind schedule. But also don't be discouraging. Focus on what they can control going forward.
- Keep it to 3-5 goals max. More than that and nothing gets real focus.
- Milestones should be evenly spaced. Don't put all the work in the last month.
- The progress log is the accountability mechanism. Every check-in gets an entry.
- Never fabricate progress. Only log what the user reports.
- If a goal no longer matters, it's OK to drop it. Better to focus than to carry dead weight.
