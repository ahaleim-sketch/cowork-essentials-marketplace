---
name: weekly-planner
description: Plan your week with priorities, time blocks, deadlines, and focus areas
triggers:
  - plan my week
  - weekly plan
  - what should I focus on this week
  - help me plan the week
  - week ahead
---

# Weekly Planner

Plan your entire week in one conversation. Review what happened last week, set priorities for this week, identify deadlines, and create a day-by-day plan with focus areas and time blocks.

## Instructions

### Step 1: Gather Context

Check CLAUDE.md for the user's role, goals, and typical workflow.

Then ask these questions (skip any you can answer from context):

1. **"What are the 2-3 most important things you need to accomplish this week?"**
2. **"Any hard deadlines this week?"** (meetings, launches, submissions, events)
3. **"Anything from last week that carried over?"** (unfinished tasks, pending decisions)
4. **"Any days with unusual schedules?"** (travel, appointments, half-days, days off)

Keep it quick — the user should be able to answer all of this in under 2 minutes.

### Step 2: Identify Weekly Priorities

From the user's answers, categorize everything:

| Priority | Type | Description |
|----------|------|-------------|
| 🔴 Must Do | Non-negotiable | Deadlines, commitments, blockers |
| 🟡 Should Do | Important but flexible | Projects, goals, growth work |
| 🟢 Could Do | Nice to have | Maintenance, exploration, learning |

**Rules:**
- Maximum 3 "Must Do" items for the week. More than that = everything is urgent = nothing is urgent.
- Each priority must be specific and completable. "Work on the project" is not a priority. "Finish the landing page copy" is.

### Step 3: Build the Day-by-Day Plan

Create a plan for each working day:

```
## Week of [Date Range]

### 🎯 This Week's Priorities
1. 🔴 [Must do #1]
2. 🔴 [Must do #2]
3. 🟡 [Should do #1]
4. 🟡 [Should do #2]
5. 🟢 [Could do #1]

---

### Monday — [Focus Theme]
**Deep work:** [1-2 main tasks for focused time]
**Meetings/calls:** [Any scheduled commitments]
**Quick wins:** [Small tasks that can be knocked out fast]
**End-of-day goal:** [What does "done" look like today?]

### Tuesday — [Focus Theme]
[Same structure]

### Wednesday — [Focus Theme]
[Same structure]

### Thursday — [Focus Theme]
[Same structure]

### Friday — [Focus Theme]
[Same structure]

---

### ⚡ Quick Reference
- **Biggest deadline:** [What and when]
- **Biggest risk:** [What could derail the week]
- **Reward:** [What you'll do/feel when priorities are done]
```

### Step 4: Planning Principles

| Principle | How to Apply |
|-----------|-------------|
| Front-load hard work | Put the hardest tasks Monday-Tuesday, not Thursday-Friday |
| Theme your days | Give each day a focus area to reduce context-switching |
| Protect deep work | Block 2-3 hour chunks for focused work, ideally morning |
| Buffer for the unexpected | Don't schedule 100% of every day. Leave 20% buffer. |
| One MIT per day | Each day has one "Most Important Task" that moves the needle |
| Friday = close loops | Use Friday for wrapping up, reviewing, and prepping next week |

### Step 5: Present and Adjust

Show the complete weekly plan and ask:
- "Does this distribution feel right across the week?"
- "Any days I should shift things around?"
- "Want me to add time estimates to each task?"

Adjust based on feedback.

## Output

A complete weekly plan in clean markdown. Scannable, actionable, and realistic — not an aspirational fantasy schedule.
