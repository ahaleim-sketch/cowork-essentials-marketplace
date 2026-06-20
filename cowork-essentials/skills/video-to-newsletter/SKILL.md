---
name: video-to-newsletter
description: Turn a video transcript into a polished email newsletter. Use this skill when the user says "turn this into a newsletter", "video to newsletter", "newsletter from this video", "email version of this video", "repurpose to email", "make this a newsletter", or any variation of wanting a video turned into an email newsletter format.
triggers:
  - turn this into a newsletter
  - video to newsletter
  - newsletter from this video
  - email version
  - repurpose to email
  - make this a newsletter
---

# Video to Newsletter

Turn any video transcript into a polished, ready-to-send email newsletter. Not a summary of the video. A standalone piece of content that delivers value on its own and drives traffic back to the video.

## Instructions

### Step 1: Get the Transcript

Accept any of these:
- A full video transcript (pasted or as a file)
- A YouTube URL (use WebSearch to find transcript or summary)
- A video script or outline

Also check CLAUDE.md for the user's newsletter style, audience, and any sign-off preferences.

### Step 2: Extract the Core Value

Read the full transcript and identify:

- **The #1 insight** — What's the single most valuable thing in this video?
- **3-5 key points** — What are the main takeaways?
- **A story or example** — What's the most compelling anecdote or demonstration?
- **The hook angle** — What framing would make someone open this email?

Important: The newsletter should NOT be a play-by-play of the video. Pick the best angle and go deep on it.

### Step 3: Write the Newsletter

```markdown
**Subject:** [Short, curiosity-driven — under 50 characters]
**Preview text:** [The line that shows next to the subject in the inbox — under 90 characters]

---

Hey [first name / there],

[Opening hook — 1-2 sentences. Reference something timely, relatable, or surprising. Pull the reader in immediately. No "I hope this finds you well."]

[The Setup — 1-2 short paragraphs. Frame the problem or context. Why does this matter to the reader RIGHT NOW?]

[The Meat — 2-4 short paragraphs. The key insights from the video, rewritten for email. More personal than the video. More direct. Use "you" language. Break up dense ideas into digestible chunks.]

[Key Takeaway — bold or call it out. The one thing they should remember if they skim everything else.]

[CTA — ONE clear action. Either:]
- [Watch the full video: link]
- [Try this one thing today: specific action]
- [Reply and tell me: specific question]

[Sign-off]
[Name]

[P.S. — Optional but effective. Use for a secondary CTA, a personal note, or a teaser for next week's content.]
```

### Step 4: Writing Rules

- **Subject line is 80% of the battle.** If they don't open it, nothing else matters. Test curiosity gaps, numbers, and pattern interrupts. Never be generic.
- **Write like you're emailing one person.** Not "Dear subscribers" but "Hey." Not "we" but "I." Not formal but conversational.
- **One CTA only.** Don't ask them to watch the video AND follow you AND join your community AND reply. Pick one.
- **Keep it under 400 words.** People skim email. Respect their time. If the video was 20 minutes, the newsletter should be a 2-minute read that makes them want to watch the full thing.
- **Different angle than the video.** Don't just condense the video. Take one slice and go deeper or more personal with it. The newsletter should feel like bonus content, not a recap.
- **The P.S. gets read.** Studies show people read the P.S. even if they skim the body. Use it strategically.

### Step 5: Save and Deliver

Save as: `Newsletter - [Topic].md`

Offer: "Want me to write 3 subject line options for A/B testing, or create a social media teaser to promote this email?"

## Rules

- Never start with "In my latest video..." The newsletter must stand on its own.
- The video link should feel like a bonus, not the point. The email delivers value. The video is for people who want more.
- Match the user's voice. Check CLAUDE.md and any writing style memories.
- Never fabricate claims or statistics from the video. Use only what the transcript contains.
