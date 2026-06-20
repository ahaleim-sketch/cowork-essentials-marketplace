---
name: teleprompter
description: Reformat any script for easy on-camera teleprompter reading
triggers:
  - reformat for teleprompter
  - teleprompter format
  - make this teleprompter ready
  - format for reading on camera
---

# Teleprompter Formatter

Reformat any video script so it is effortless to read on camera. The output follows strict line-break rules so the creator never loses their place or stumbles over long sentences.

## Instructions

When the user provides a script (pasted text, a file, or bullet points), reformat it using every rule below. Do not change the words unless the user asks for edits. Your job is formatting only.

### Formatting Rules

1. **3-5 words per line.** Every line must contain 3 to 5 words. Never exceed 5 words on a single line. If a thought is longer, split it across multiple lines.

2. **ALL CAPS for emphasis.** Any word the creator should punch or stress gets written in ALL CAPS. Limit this to 1-2 words per thought. Do not capitalize entire sentences.

3. **// for pause markers.** Insert `//` on its own line wherever the creator should pause. Use pauses:
   - Between major topic shifts
   - After a hook or surprising statement (let it land)
   - Before a call to action
   - Between sections of the script

4. **Blank lines between thoughts.** Every distinct idea, sentence, or beat gets separated by a blank line. If two sentences are about different things, they get a blank line between them.

5. **Strip all stage directions.** Remove anything in brackets like `[cut to screen]`, `[show product]`, `[B-roll]`, `(pause)`, etc. The teleprompter shows only spoken words.

6. **One thought, one breath.** Never combine two sentences on one line. If the original script says "It's free and it works on any device" — that becomes two separate thought blocks.

7. **No punctuation clutter.** Remove semicolons, parentheses, and em dashes. Keep periods, commas, and question marks only. Replace ellipses (...) with a `//` pause marker.

8. **Numbers stay as digits.** Write "5" not "five", "100" not "one hundred". Digits are faster to read on camera.

### Step 1: Receive the Script

Accept the user's script in any format — pasted text, bullet points, a paragraph, or a file path. If the input is not clearly a script (e.g., just a topic), ask: "Can you paste the full script you want reformatted?"

### Step 2: Reformat

Apply all formatting rules above. Preserve the original word choices. Do not rewrite, improve, or edit the content unless explicitly asked.

### Step 3: Output

Present the reformatted script in a clean code block so the user can copy-paste it directly.

### Before/After Example

**BEFORE (raw script):**
```
So I found this tool that basically does all of your editing for you. It's called CapCut and it's completely free. You just upload your video, and it automatically cuts out the silences, adds captions, and even suggests background music. I've been using it for two weeks now and it's saved me hours.
```

**AFTER (teleprompter format):**
```
So I found this tool
that does ALL your editing
for you.

//

It's called CAPCUT.

And it's completely free.

//

You just upload your video.

It automatically cuts out
the silences.

Adds captions.

And even suggests
background music.

//

I've been using it
for 2 weeks now.

And it's saved me HOURS.
```

### Step 4: Offer Options

After reformatting, ask:
> "Here's your teleprompter-ready script. Want me to adjust the pacing, add more pauses, or change which words are emphasized?"

## Rules Recap

| Rule | What to Do |
|---|---|
| Line length | 3-5 words per line, never more |
| Emphasis | ALL CAPS on 1-2 key words per thought |
| Pauses | `//` on its own line between sections |
| Spacing | Blank line between every thought |
| Stage directions | Remove all brackets and instructions |
| Sentences | One thought per block, never combine |
| Punctuation | Periods, commas, question marks only |
| Numbers | Always digits, never spelled out |
