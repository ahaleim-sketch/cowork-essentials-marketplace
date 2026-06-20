---
name: twitter-thread-writer
description: Write a viral-worthy Twitter/X thread from any idea, topic, or content. Use this skill when the user says "write a thread", "Twitter thread", "X thread", "tweet storm", "thread about", "turn this into a thread", or any variation of wanting content formatted as a Twitter/X thread.
triggers:
  - write a thread
  - Twitter thread
  - X thread
  - tweet storm
  - thread about
  - turn this into a thread
---

# Twitter/X Thread Writer

Turn any idea, experience, or piece of content into a scroll-stopping Twitter/X thread. One input, one ready-to-post thread with a hook tweet that works standalone and a structure that keeps people reading.

## Instructions

### Step 1: Understand the Thread

From the user's request, identify:

- **Topic** — What is the thread about?
- **Source material** — Are they working from an idea, a blog post, a video transcript, personal experience?
- **Goal** — Educate, entertain, share a story, promote something, build authority?
- **Audience** — Who follows them? Business owners, developers, marketers, general audience?
- **Thread length** — Short (5-7 tweets) or long (8-12 tweets)?

Check CLAUDE.md for the user's voice and audience.

### Step 2: Write the Thread

**Tweet 1: The Hook**

This is everything. Most people see ONLY this tweet in their feed. It must work completely on its own.

Hook formulas that work:
- **Bold claim:** "Most people waste 3 hours a day on email. Here's how I got it down to 20 minutes:"
- **Story opener:** "Last week I lost a $50K client. Here's what happened and what I learned:"
- **Curiosity gap:** "The best advice I ever got about money was something no one talks about."
- **Contrarian take:** "Hustle culture is a scam. Here's what actually works:"
- **List promise:** "7 free tools that replaced $500/month in software for my business:"

Rules for Tweet 1:
- Under 200 characters (so it displays fully without truncation)
- No hashtags
- No "Thread:" or "1/" prefix
- Must create urgency to read the next tweet

**Tweets 2-N: The Body**

Each tweet should:
- Make one clear point
- Be readable on its own AND flow from the previous tweet
- Use line breaks for scannability
- Be under 280 characters

Structure options:
- **Listicle:** Each tweet is one item (tool, tip, lesson, mistake)
- **Story:** Chronological narrative, each tweet advances the plot
- **Framework:** Each tweet is one step in a process
- **Lessons:** Each tweet is one thing you learned

**Final Tweet: The CTA**

End with one of these:
- **Engagement driver:** "Which of these was most useful? Reply and let me know."
- **Follow CTA:** "If you found this useful, follow me @[handle] for more like this."
- **Retweet ask:** "Retweet the first tweet if this helped someone you know."
- **Link:** "Full breakdown with examples: [link]" (only if they have something to link to)

### Step 3: Format the Output

Present the thread clearly:

```
TWEET 1 (HOOK):
[Tweet text]

---

TWEET 2:
[Tweet text]

---

TWEET 3:
[Tweet text]

---

[Continue...]

---

TWEET [N] (CTA):
[Tweet text]
```

Include character count next to each tweet so the user can verify they're under 280.

### Step 4: Quality Check

Before delivering, verify:
- Tweet 1 hooks without context
- Every tweet is under 280 characters
- No hashtags in the thread body (save them for a reply if the user wants them)
- Each tweet flows naturally from the one before it
- The thread delivers on the promise made in Tweet 1
- The CTA is specific, not generic

## Rules

- Never use "Thread:" or "1/N" prefixes. They look dated.
- No hashtags in the thread itself. If the user wants hashtags, put them in a separate reply tweet.
- Short sentences hit harder. If a tweet feels dense, split it.
- One idea per tweet. If you're making two points, use two tweets.
- The hook tweet must work if someone never reads the rest.
- Never fabricate statistics, quotes, or claims. If the user provides data, use it. If not, teach from experience and frameworks.
