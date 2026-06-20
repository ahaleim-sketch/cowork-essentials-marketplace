---
name: book-summary-generator
description: Get the key ideas from any book in a structured summary you can actually use. Use this skill when the user says "summarize this book", "book summary", "key takeaways from", "what's the book about", "book notes", "give me the highlights of", "break down this book", or any variation of wanting the essential ideas from a book.
triggers:
  - summarize this book
  - book summary
  - key takeaways
  - book notes
  - break down this book
  - highlights of
---

# Book Summary Generator

Get the essential ideas from any book distilled into a structured summary you can reference, share, or act on. Not a book report. A cheat sheet of the ideas that actually matter.

## Instructions

### Step 1: Identify the Book

From the user's request, identify:

- **Book title** — What book?
- **Author** — Who wrote it?
- **Why they're reading it** — Business, personal growth, curiosity, someone recommended it?
- **What they want** — Full summary? Just the actionable parts? Key frameworks?

Use WebSearch to find detailed summaries, reviews, and discussions of the book to build a comprehensive understanding.

### Step 2: Build the Summary

Structure it for maximum usefulness:

```markdown
# Book Summary: [Title]

**Author:** [Author Name]
**Published:** [Year]
**Category:** [Business / Self-Help / Psychology / etc.]
**Read time for this summary:** [X] minutes

---

## The Big Idea

[2-3 sentences. What is this book REALLY about? Not the subtitle pitch. The core thesis in plain English.]

---

## Key Ideas

### 1. [Idea/Chapter Theme]

[2-3 paragraphs explaining the concept. Use the author's frameworks and terminology but explain them clearly. Include any memorable examples or stories from the book that make the idea stick.]

**Takeaway:** [One sentence you could act on today]

### 2. [Idea/Chapter Theme]

[Same structure...]

**Takeaway:** [Actionable sentence]

### 3. [Idea/Chapter Theme]

[Same structure...]

**Takeaway:** [Actionable sentence]

[Continue for 5-8 key ideas, depending on the book's density]

---

## Best Quotes

- "[Quote 1]" (Chapter X)
- "[Quote 2]" (Chapter X)
- "[Quote 3]" (Chapter X)

[3-5 quotes that capture the book's most powerful moments]

---

## Who Should Read This

- [Type of person 1 — and why this book matters for them]
- [Type of person 2]

## Who Should Skip This

- [Type of person — and why it's not for them]

---

## Action Items

If you only do three things from this book:

1. [Specific action — not vague, something you could start today]
2. [Specific action]
3. [Specific action]
```

### Step 3: Writing Rules

- **Ideas over chapters.** Don't just summarize chapter by chapter. Extract the IDEAS and group them by theme. Some chapters share an idea. Some ideas span multiple chapters.
- **Actionable takeaways are mandatory.** Every key idea ends with "what do I DO with this?" If an idea is purely theoretical, frame it as a mental model.
- **Use the author's language.** If the book introduces a framework (like "Deep Work" or "Circle of Competence"), name it and explain it. These are the hooks that make the ideas memorable.
- **Be honest about the book's weaknesses.** If the book is 300 pages but only has 50 pages of original ideas, say so. If it's repetitive, note what's worth reading vs skimming.
- **Keep it under 1500 words.** The whole point is saving time.

### Step 4: Save and Deliver

Save as: `Book Summary - [Title].md`

Offer: "Want me to go deeper on any of these ideas, create flashcards for review, or find similar books?"

## Rules

- Never fabricate quotes. If you're not confident in the exact wording, paraphrase and note it.
- Attribute ideas to the author, not yourself. "According to [Author]..." or "[Author] argues that..."
- If you haven't been able to find enough detail about the book to write a quality summary, say so. Don't pad with generic advice.
- Focus on IDEAS, not plot. Unless it's a narrative book where the story IS the point.
