---
name: video-to-course-module
description: Turn a video or series of videos into a structured course module with lessons, exercises, and quizzes. Use this skill when the user says "turn this into a course", "course module", "make this a lesson", "create a course from", "video to course", "online course", "learning module", or any variation of wanting video content restructured as educational course material.
triggers:
  - turn this into a course
  - course module
  - make this a lesson
  - create a course from
  - video to course
  - online course
  - learning module
---

# Video to Course Module

Transform video content into a structured, self-paced course module. Takes a transcript (or series of transcripts) and creates lessons with learning objectives, key concepts, exercises, and knowledge checks. Perfect for community courses, Skool modules, Teachable, or any learning platform.

## Instructions

### Step 1: Analyze the Source Material

Accept any of these:
- One or more video transcripts
- YouTube URLs
- Video scripts or outlines
- A topic description for a new module

From the content, identify:
- **Core topic** — What is this module about?
- **Subtopics** — What distinct concepts or skills are covered?
- **Skill level** — Beginner, intermediate, advanced?
- **Target audience** — Who is learning this?
- **Practical applications** — What should learners be able to DO after completing this?

### Step 2: Structure the Module

Break the content into 3-7 lessons. Each lesson should cover one complete concept.

```markdown
# Course Module: [Module Title]

**Topic:** [Core topic]
**Level:** [Beginner / Intermediate / Advanced]
**Estimated Time:** [X hours total]
**Prerequisites:** [What learners should know before starting, or "None"]

## Module Overview

[2-3 sentences describing what this module covers and what the learner will be able to do after completing it.]

**Learning Outcomes:**
By the end of this module, you will be able to:
1. [Specific, measurable outcome — "Set up and configure X"]
2. [Outcome — "Create a X using Y"]
3. [Outcome — "Evaluate and choose between X and Y"]

---

## Lesson 1: [Lesson Title]

**Duration:** [X minutes]
**Video:** [Link to video if applicable, with timestamp range]

### What You'll Learn
[1-2 sentences framing this lesson]

### Key Concepts

**[Concept 1]**
[Clear explanation in 2-3 paragraphs. Use simple language. Include examples.]

**[Concept 2]**
[Explanation with examples]

### Action Step
[One specific thing the learner should do right now to apply what they learned. Not optional. This is how the knowledge sticks.]

### Knowledge Check
1. [Question — multiple choice, fill-in, or short answer]
   - A) [Option]
   - B) [Option]
   - C) [Option]
   - **Answer: [Letter]** — [Brief explanation of why]

2. [Question]
   - **Answer:** [Answer with explanation]

---

## Lesson 2: [Lesson Title]

[Same structure...]

---

[Continue for each lesson...]

---

## Module Exercise

[A hands-on project that combines everything from the module. This should be substantial enough to prove the learner understands the material, but achievable in 30-60 minutes.]

**The Assignment:**
[Clear description of what to build, create, or do]

**Requirements:**
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

**Bonus Challenge:**
[An optional stretch goal for advanced learners]

---

## Module Summary

**What You Learned:**
- [Key takeaway 1]
- [Key takeaway 2]
- [Key takeaway 3]

**Next Steps:**
[What module or topic comes next in the learning journey]

**Resources:**
- [Resource 1 — link or reference]
- [Resource 2]
```

### Step 3: Writing Rules

- **One concept per lesson.** If a lesson covers two distinct ideas, split it into two lessons.
- **Action steps are mandatory.** Every lesson ends with something the learner DOES. Passive learning doesn't stick.
- **Knowledge checks test understanding, not memory.** Don't ask "What did we cover in section 2?" Ask "If you needed to [apply concept], which approach would you use and why?"
- **Write for the learner, not the expert.** Explain jargon. Use analogies. Assume nothing.
- **The module exercise is the proof.** It should require combining multiple lessons. If someone can complete the exercise, they've learned the material.

### Step 4: Platform Adaptation

If the user mentions a specific platform, adapt the format:

- **Skool** — Structure as community course posts, one lesson per post. Include discussion prompts.
- **Teachable/Kajabi** — Structure as individual lesson pages with clear video + text sections.
- **Notion** — Use Notion-friendly formatting with toggle blocks and callouts.
- **General** — Default to clean markdown that works anywhere.

### Step 5: Save and Deliver

Save as: `Course Module - [Title].md`

Offer: "Want me to create the next module in the series, add more exercises, or adapt this for a specific platform like Skool?"

## Rules

- Learning outcomes must be specific and measurable. Not "understand X" but "be able to set up, configure, and use X."
- Never pad lessons with filler. If a concept takes 5 minutes to teach, the lesson is 5 minutes. Short lessons are fine.
- Exercises must be achievable with the tools and knowledge covered in the module. Don't require anything outside the scope.
- Always include at least 2 knowledge check questions per lesson.
- The module exercise should be something the learner is genuinely proud to complete.
