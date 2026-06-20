---
name: weekly-audit
description: Full health check on your Cowork setup with actionable recommendations
triggers:
  - run a weekly audit
  - check my cowork setup
  - audit my system
  - health check
---

# Weekly Audit

A full health check on your Claude Cowork setup. Reviews your CLAUDE.md, skills, commands, and scheduled tasks, then gives you a health score and specific actions to improve.

## Audit Sections

Run all 5 sections in order. Present findings after each section before moving on.

---

### Section 1: CLAUDE.md Review

Read the user's `CLAUDE.md` file (project root) and ask these 3 questions **one at a time**:

1. "I read your CLAUDE.md. **Is all the information still accurate?** Anything outdated -- old goals, tools you dropped, roles that changed?"
2. "**Have your goals shifted** since this was written? Any new priorities or targets?"
3. "**Any new pet peeves or preferences** Claude should know about? Things that have been annoying you?"

After all 3 answers, make direct edits to the CLAUDE.md:
- Remove outdated information
- Update goals and priorities
- Add new rules or preferences
- Report exactly what changed

If no CLAUDE.md exists, flag this as a critical issue and offer to build one (suggest the `context-builder` skill).

---

### Section 2: Skills Check

Scan the `.claude/skills/` directory recursively. For each `SKILL.md` found:

| Check | What to look for |
|-------|-----------------|
| **Exists and readable** | File is valid markdown with frontmatter |
| **Has triggers** | At least 2 trigger phrases in frontmatter |
| **References valid** | Any file paths or commands mentioned actually exist |
| **Not stale** | Last modified within 60 days |
| **Not duplicate** | No two skills do the same thing |

Report findings as a table:

```
| Skill | Status | Issues |
|-------|--------|--------|
| context-builder | OK | -- |
| weekly-audit | WARN | No triggers defined |
| old-skill | STALE | Not modified in 90 days |
```

If `.claude/skills/` does not exist or is empty, note this and suggest 2-3 starter skills based on what the CLAUDE.md says the user does.

---

### Section 3: Commands Check

Scan the `.claude/commands/` directory. For each `.md` file:

| Check | What to look for |
|-------|-----------------|
| **Valid markdown** | File parses without errors |
| **Has description** | First line or frontmatter explains what it does |
| **References valid** | Any file paths, data files, or scripts mentioned exist |
| **Reasonable size** | Under 300 lines (commands should be focused) |

Report findings as a table, same format as Section 2.

If no commands directory exists, note this and explain what commands are for.

---

### Section 4: Scheduled Tasks

Check if the user has any scheduled tasks configured:
- Look for `.claude/schedules/` directory
- Look for cron jobs or launchd plists related to Claude
- Look for any automation scripts in the project

**If tasks exist:** Review each one for relevance. Ask the user if they are still useful.

**If no tasks exist:** Suggest 2-3 scheduled tasks based on the user's CLAUDE.md and workflow:

| Suggested Task | Frequency | What It Does |
|---------------|-----------|-------------|
| Morning briefing | Daily, 8am | Summarize calendar, todos, and priorities |
| Weekly cleanup | Weekly, Friday 5pm | Archive old outputs, flag stale files |
| Goal check-in | Weekly, Monday 9am | Review progress on 3-6 month goals |

Tailor suggestions to the user's actual work. A developer gets different suggestions than a marketer.

---

### Section 5: Recommendations

Based on everything found in Sections 1-4, provide **3-5 specific, actionable recommendations** ranked by impact.

Format each recommendation as:

```
### [Priority: HIGH/MEDIUM/LOW] -- [One-line summary]
**What:** [Specific action to take]
**Why:** [What improves]
**How:** [Exact steps or offer to do it now]
```

---

## Health Score

After all sections, present a final summary:

```
## Cowork Health Score

| Area | Score | Notes |
|------|-------|-------|
| CLAUDE.md | [green/yellow/red] | [one-line summary] |
| Skills | [green/yellow/red] | [one-line summary] |
| Commands | [green/yellow/red] | [one-line summary] |
| Scheduled Tasks | [green/yellow/red] | [one-line summary] |
| **Overall** | **[green/yellow/red]** | **[one-line summary]** |
```

Scoring:
- **Green** = Solid, no action needed
- **Yellow** = Works but has room for improvement
- **Red** = Needs attention, missing or broken

## Rules

- Always read files before judging them. Never assume a file is broken without opening it.
- Be specific in recommendations. "Improve your CLAUDE.md" is useless. "Add your Q2 revenue target of $X to the goals section" is useful.
- If the user's setup is genuinely good, say so. Do not invent problems.
- Offer to fix issues on the spot rather than just listing them.
- The whole audit should take 5-10 minutes of the user's time (mostly answering the 3 CLAUDE.md questions).
- Do not create files without asking. Only modify CLAUDE.md after getting answers to the 3 questions.
