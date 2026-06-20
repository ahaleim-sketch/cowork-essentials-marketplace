---
name: habit-tracker
description: Build and track daily habits with streaks, accountability, and check-ins. Use this skill when the user says "track my habits", "habit tracker", "daily habits", "build a habit", "streak tracker", "routine tracker", "morning routine", "I want to start doing [X] every day", "accountability", or any variation of wanting to build or track consistent daily practices.
triggers:
  - track my habits
  - habit tracker
  - daily habits
  - build a habit
  - streak tracker
  - routine tracker
  - morning routine
  - accountability
---

# Habit Tracker

Set up daily habits, track your streaks, and get honest check-ins that keep you consistent. Not another app you'll abandon in a week. A simple system that lives right where you work.

## Instructions

### Step 1: Determine the Mode

This skill has three modes:

1. **Setup** — Define new habits to track
2. **Check-In** — Log today's habits and update streaks
3. **Review** — Look at the past week or month and assess progress

If a `habits.md` file exists in the workspace, read it first. If not, start in Setup mode.

### Step 2A: Setup New Habits

Ask or identify:

- **What habits** — What do they want to do consistently?
- **Frequency** — Daily? Weekdays only? 3x per week?
- **Time of day** — Morning, afternoon, evening, anytime?
- **Minimum viable version** — What's the smallest version that still counts? (This is key for building consistency)
- **Why** — What's the motivation? (Helps when discipline fades)

**Important: Start with 3-5 habits max.** More than that and nothing sticks. You can always add more once these are locked in.

For each habit, define:

```markdown
# Habit Tracker

*Last updated: [Date]*

---

## Active Habits

### 1. [Habit Name]
- **What:** [Clear description of the habit]
- **Minimum version:** [The bare minimum that counts — "1 pushup" not "full workout"]
- **Frequency:** [Daily / Weekdays / X times per week]
- **Best time:** [When in the day]
- **Why:** [1 sentence motivation]
- **Current streak:** 0 days
- **Best streak:** 0 days
- **Total completions:** 0

### 2. [Habit Name]
[Same structure...]

### 3. [Habit Name]
[Same structure...]

---

## Daily Log

| Date | [Habit 1] | [Habit 2] | [Habit 3] | Score | Notes |
|------|-----------|-----------|-----------|-------|-------|
| | | | | | |
```

### Step 2B: Daily Check-In

When the user checks in:

1. Read the current `habits.md` file
2. Ask: "How did today go?" or accept their update
3. For each habit, mark complete or missed
4. Update streaks (consecutive days completed)
5. Calculate daily score (habits completed / total habits)
6. Add encouraging or honest feedback

Present the check-in:

```markdown
## Check-In: [Date]

| Habit | Status | Streak |
|-------|--------|--------|
| [Habit 1] | Done | [X] days |
| [Habit 2] | Done | [X] days |
| [Habit 3] | Missed | 0 (was [X]) |

**Today's Score:** [X]/[Y] ([XX]%)

[Feedback — be real:]
- If perfect: "Clean sweep. [X]-day streak on [habit] is solid. Keep the momentum."
- If mixed: "[Habit 1] streak is going strong at [X] days. [Habit 3] broke today. What got in the way?"
- If rough: "Tough day. It happens. The move now is to show up tomorrow, even if it's the minimum version."
```

Update the `habits.md` file with today's log entry and new streak counts.

### Step 2C: Weekly/Monthly Review

Pull data from the habit log and analyze:

```markdown
## Habit Review: [Date Range]

### Overall Consistency

| Habit | Days Hit | Days Possible | Rate | Trend |
|-------|----------|--------------|------|-------|
| [Habit 1] | [X] | [Y] | [XX]% | Up / Down / Steady |
| [Habit 2] | [X] | [Y] | [XX]% | Trend |
| [Habit 3] | [X] | [Y] | [XX]% | Trend |

**Overall Score:** [XX]%

### Wins
- [Best streak achieved]
- [Most consistent habit]
- [Improvement from last period]

### Patterns
- [When do you miss most? (Day of week, time)]
- [Which habit is easiest to maintain?]
- [Which one needs a different approach?]

### Adjustments
- [Suggestion based on the data: "Your evening habits drop off on Fridays. Consider moving them to morning on Fridays."]
- [Another suggestion]

### Next Period Focus
[1 specific focus for the coming week based on what the data shows]
```

### Step 3: Streak Rules

- A streak counts consecutive completions at the habit's frequency
- Missing one day resets the streak to 0
- "Minimum version" counts as a full completion (the point is showing up)
- Rest days (if frequency is "weekdays only") don't break streaks
- If someone misses but does double the next day, it still counts as a broken streak (no retroactive completions)

### Step 4: Save and Deliver

Create or update: `habits.md` in the workspace root

After setup, offer: "Want me to check in with you every day, or do you want to come to me when you're ready to log?"

After a check-in, offer: "Anything you want to adjust about your habits, or are we good for tomorrow?"

## Rules

- 3-5 habits max to start. Push back if someone wants to track 10 things. Consistency on 3 beats inconsistency on 10.
- The "minimum version" is the most important field. "Read for 30 minutes" becomes "read 1 page." The point is not breaking the chain.
- Be honest in check-ins. Don't celebrate a 40% day. But don't be harsh either. Acknowledge the miss and focus forward.
- Never guilt-trip. Missed days happen. The skill's job is to help them get back on track, not make them feel bad.
- Streaks are motivating but shouldn't be the only metric. Overall consistency rate matters more than one long streak.
- Suggest habit stacking when appropriate: "Do [new habit] right after [existing habit] to make it automatic."
