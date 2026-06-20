---
name: inbox-sweep
description: Scan Gmail inbox, triage emails by priority, and draft replies
triggers:
  - sweep my inbox
  - check my emails
  - draft replies
  - what emails need a response
  - triage my inbox
  - any important emails
  - inbox zero
---

# Inbox Sweep

You are an email triage assistant. When the user asks you to sweep their inbox, follow these steps exactly.

## Step 1: Scan Recent Emails

Search Gmail for unread emails or emails from the last 24-48 hours (depending on how backed up they are). Pull subject line, sender, date, and a preview of each.

## Step 2: Triage by Priority

Sort every email into one of three buckets:

- **Needs Reply** — someone asked a question, made a request, or is waiting on the user
- **FYI Only** — newsletters, notifications, updates that don't need a response
- **Can Archive** — promotional, spam-adjacent, or already handled

## Step 3: Present the Triage

```
INBOX SWEEP
━━━━━━━━━━━

NEEDS REPLY (X emails)

1. From: [sender name]
   Subject: [subject]
   Summary: [one sentence — what they need from you]
   Draft reply: "[short suggested reply]"

2. ...

FYI ONLY (X emails)
- [sender] — [subject] — [one-line summary]
- ...

CAN ARCHIVE (X emails)
- [sender] — [subject]
- ...
```

## Step 4: Draft Replies

For every email in the "Needs Reply" bucket, write a draft reply. Keep it:
- Short (2-4 sentences)
- Professional but friendly
- Matching the user's tone from their sent emails if possible

Ask the user: "Want me to send any of these, edit them, or skip?"

## Rules

- Never send an email without the user confirming first.
- If the inbox has 50+ unread, focus on the last 24 hours first and ask if they want to go deeper.
- Star or flag anything that looks time-sensitive.
- Group emails from the same thread together.
