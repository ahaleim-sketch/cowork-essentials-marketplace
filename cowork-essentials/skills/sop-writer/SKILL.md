---
name: sop-writer
description: Document any process step-by-step so anyone can follow it. Use this skill when the user says "write an SOP", "standard operating procedure", "document this process", "process documentation", "how-to guide", "write up how we do", "create a procedure for", "operations manual", or any variation of wanting a repeatable process documented clearly.
triggers:
  - write an SOP
  - standard operating procedure
  - document this process
  - process documentation
  - how-to guide
  - write up how we do
  - create a procedure for
  - operations manual
---

# SOP Writer

Turn any process into a clear, step-by-step document that anyone can follow without hand-holding. Perfect for delegating, training new hires, building an operations manual, or just getting what's in your head into a format someone else can execute.

## Instructions

### Step 1: Understand the Process

From the user's request, identify:

- **What process** — What are they documenting?
- **Who will follow it** — New hire? VA? Team member? Client? The user themselves?
- **Current state** — Do they have a loose description, or are they starting from scratch?
- **Frequency** — Is this done daily, weekly, monthly, or on-demand?
- **Tools involved** — What software, platforms, or physical tools are needed?
- **Decision points** — Are there any "if this, then that" moments in the process?

If the user gives a rough description of the process, structure it. If they just name the process, ask: "Walk me through how you do it right now, even loosely. I'll clean it up."

### Step 2: Build the SOP

```markdown
# SOP: [Process Name]

**Version:** 1.0
**Last Updated:** [Date]
**Owner:** [Who maintains this SOP]
**Frequency:** [How often this is performed]

---

## Purpose

[1-2 sentences. Why does this process exist? What does it accomplish?]

## Scope

**Who uses this:** [Role or person]
**When to use this:** [Trigger that kicks off this process]

---

## Prerequisites

Before starting, make sure you have:

- [ ] [Access, tool, account, or resource needed]
- [ ] [Another prerequisite]
- [ ] [Another prerequisite]

## Tools Required

| Tool | Purpose | Access Link |
|------|---------|-------------|
| [Tool 1] | [What it's used for in this process] | [URL if applicable] |
| [Tool 2] | [Purpose] | [URL] |

---

## Procedure

### Step 1: [Action]

[Clear instruction. Write it so someone with zero context can follow it.]

[If there's a specific place to click, setting to change, or value to enter, call it out explicitly.]

> **Note:** [Any gotcha, common mistake, or important detail for this step]

### Step 2: [Action]

[Instruction]

### Step 3: [Action]

[Instruction]

**Decision Point:**
- **If [condition A]:** [Do this — skip to Step X]
- **If [condition B]:** [Do this instead]

### Step 4: [Action]

[Instruction]

[Continue for all steps...]

### Final Step: [Verification]

[How to confirm the process was completed correctly. What should the end result look like?]

---

## Troubleshooting

| Problem | Likely Cause | Fix |
|---------|-------------|-----|
| [Common issue 1] | [Why it happens] | [How to fix it] |
| [Common issue 2] | [Cause] | [Fix] |

## FAQ

**Q: [Common question about the process]**
A: [Answer]

**Q: [Another question]**
A: [Answer]

---

## Revision History

| Version | Date | Changes | Updated By |
|---------|------|---------|------------|
| 1.0 | [Date] | Initial version | [Name] |
```

### Step 3: Writing Rules

- **Write for the dumbest possible day.** Even the person who created the process will forget details in 6 months. Be explicit.
- **One action per step.** Not "Log in, navigate to settings, and update the field." That's three steps.
- **Include screenshots or describe exact locations.** "Click the gear icon in the top-right corner" not "go to settings."
- **Decision points need both paths.** If there's an "if/then," document BOTH outcomes.
- **The verification step is mandatory.** Every SOP ends with "here's how you know it worked."
- **Troubleshooting is not optional.** If people are going to hit snags, document the top 2-3 and how to fix them.

### Step 4: Save and Deliver

Save as: `SOP - [Process Name].md`

Offer: "Want me to create a checklist version you can print out, or add more detail to any step?"

## Rules

- Never assume knowledge. If a step requires logging into a specific tool, say which tool and where to find the login.
- Keep language simple and direct. Imperative mood: "Click," "Enter," "Select," "Verify." Not "You should consider clicking."
- Decision points must cover all realistic paths. Don't leave someone stuck at a fork with no instructions.
- If the user describes a messy process, clean it up but flag what you changed. "I reorganized steps 3-5 because the original order had a dependency issue."
- Include a revision history table. SOPs that don't get updated become dangerous.
