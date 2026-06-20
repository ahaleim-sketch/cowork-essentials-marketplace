---
name: skill-creator
description: Build custom Claude Cowork skills from scratch with templates and testing
triggers:
  - create a skill
  - build a skill
  - make a new skill
  - turn this into a skill
---

# Skill Creator

Build a custom Claude Cowork skill from a plain-English description. Walks you through defining the task, generates a proper SKILL.md file, installs it, and tests it.

## Workflow

### Step 1: Understand the Task

Ask the user:

> "Describe the task you want to turn into a skill. **Explain it like you're training a new employee who has never done it before.** What do they need to know? What do they produce? What mistakes should they avoid?"

Then extract these components from their answer:

| Component | Question to clarify if missing |
|-----------|-------------------------------|
| **Trigger** | "What would you say to start this task?" |
| **Inputs** | "What information does it need from you each time?" |
| **Steps** | "Walk me through the process, step by step." |
| **Output** | "What does the finished product look like?" |
| **Quality rules** | "What separates a good result from a bad one?" |

Ask follow-up questions for any component that is vague or missing. Do not proceed until all 5 components are clear.

### Step 2: Draft the SKILL.md

Generate a complete SKILL.md file with this structure:

```markdown
---
name: [kebab-case-name]
description: [One sentence, under 80 characters]
triggers:
  - [natural phrase 1]
  - [natural phrase 2]
  - [natural phrase 3]
---

# [Skill Name]

[One paragraph explaining what this skill does and when to use it.]

## Inputs

- **[Input 1]:** [Description and format]
- **[Input 2]:** [Description and format]

## Workflow

### Step 1: [Action]
[What to do, with specifics]

### Step 2: [Action]
[What to do, with specifics]

[...more steps as needed]

## Output Format

[Exact description of what gets produced: file type, structure, where it is saved]

## Rules

- [Quality rule 1]
- [Quality rule 2]
- [...]
```

Present the draft to the user in a code block.

### Step 3: Review and Revise

Ask: "How does this look? Want me to change anything -- add steps, tighten the rules, adjust the triggers?"

Iterate until the user approves. Common revision requests:
- Adding edge cases or error handling
- Making instructions more specific
- Adding examples of good vs bad output
- Adjusting the tone or level of detail

### Step 4: Install the Skill

After approval, save the file to:
```
.claude/skills/[skill-name]/SKILL.md
```

Create the directory if it does not exist. Confirm the installation:

> "Installed to `.claude/skills/[skill-name]/SKILL.md`. You can now trigger it by saying: **[trigger phrase]**"

### Step 5: Test Run

Offer to test the skill immediately:

> "Want to do a quick test run? Give me a sample input and I'll run through the skill to make sure it works."

If the user provides a test input, execute the skill end-to-end and ask for feedback. Fix any issues found during testing.

## Best Practices

Share this table with the user if they ask for tips:

| Practice | Why it matters |
|----------|---------------|
| **Be specific** | "Write a blog post" fails. "Write a 600-word blog post with H2 headers, one CTA, and a meta description" works. |
| **Include examples** | Show what good output looks like. One example is worth 10 rules. |
| **Add rules** | Rules prevent the most common mistakes. 5-8 rules is the sweet spot. |
| **Keep it under 200 lines** | Long skills get ignored. If it is over 200 lines, split it into two skills. |
| **One task per skill** | A skill that does 3 things does none of them well. |
| **Use natural triggers** | Triggers should be what you would actually say, not robotic commands. |
| **Define the output** | Specify file type, format, save location, and naming convention. |
| **Handle errors** | Tell the skill what to do when inputs are missing or ambiguous. |

## Packaging for Sharing

If the user wants to share their skill with others:

1. **Create a .zip file** containing the skill folder:
   ```bash
   cd .claude/skills/
   zip -r [skill-name].zip [skill-name]/
   ```

2. **Rename to .skill** (optional, for easy identification):
   ```bash
   mv [skill-name].zip [skill-name].skill
   ```

3. **To install a shared skill**, the recipient drops the folder into their `.claude/skills/` directory. No configuration, no setup, no dependencies.

Remind users: skills should be self-contained. If a skill references external files, data, or APIs, document those requirements clearly in the skill's Requirements section.

## Rules

- Never generate a skill without understanding the task first. Step 1 is mandatory.
- Keep generated skills focused. If the user describes a multi-part workflow, suggest splitting into separate skills.
- Triggers must be natural phrases a human would actually say. Never use slash-command syntax in triggers.
- Always test-offer after installation. Untested skills have hidden bugs.
- Do not overwrite existing skills without asking. If a skill with the same name exists, show the diff and confirm.
- The description field must be a single sentence under 80 characters. This shows up in skill listings and must be scannable.
