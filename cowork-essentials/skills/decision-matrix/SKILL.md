---
name: decision-matrix
description: Make better decisions by scoring options against weighted criteria. Use this skill when the user says "help me decide", "decision matrix", "compare options", "which should I choose", "pros and cons", "weigh my options", "decision framework", or any variation of needing to choose between multiple options.
triggers:
  - help me decide
  - decision matrix
  - compare options
  - which should I choose
  - pros and cons
  - weigh my options
---

# Decision Matrix

Stop going back and forth. Score your options against the criteria that actually matter, weighted by importance, and get a clear winner backed by logic instead of gut feeling.

## Instructions

### Step 1: Identify the Decision

From the user's request, identify:

- **The decision** — What are they choosing between?
- **The options** — What are the 2-5 choices on the table?
- **The criteria** — What factors matter most? (cost, speed, quality, risk, ease, etc.)
- **The stakes** — Is this reversible or permanent? Big investment or low risk?

If the user says something vague like "should I go with A or B?", ask one question: "What are the 3-4 things that matter most to you in this decision?"

### Step 2: Set Up the Matrix

Define 4-7 criteria and assign weights based on importance:

| Criteria | Weight (1-5) | Why This Weight |
|----------|-------------|-----------------|
| [Criteria 1] | [X] | [Brief reason] |
| [Criteria 2] | [X] | [Brief reason] |
| [Criteria 3] | [X] | [Brief reason] |

**Weight guide:**
- 5 = Dealbreaker. This alone could decide it.
- 4 = Very important. Heavily influences the decision.
- 3 = Important. Matters but won't make or break it.
- 2 = Nice to have. Would be a bonus.
- 1 = Minor consideration.

### Step 3: Score Each Option

Rate every option against every criteria on a 1-10 scale:

| Criteria (Weight) | Option A | Option B | Option C |
|-------------------|----------|----------|----------|
| [Criteria 1] (5) | [Score] | [Score] | [Score] |
| [Criteria 2] (4) | [Score] | [Score] | [Score] |
| [Criteria 3] (3) | [Score] | [Score] | [Score] |

Then calculate weighted scores:
- Weighted Score = Score x Weight
- Total = Sum of all weighted scores

### Step 4: Present the Results

```
## Decision Matrix Results

### The Scores

| Option | Weighted Score | Rank |
|--------|---------------|------|
| [Option A] | [Total] | [#] |
| [Option B] | [Total] | [#] |
| [Option C] | [Total] | [#] |

### The Winner: [Option Name]

[2-3 sentences explaining WHY this option won. What criteria pushed it ahead? Where did the others fall short?]

### Where the Winner Is Weakest

[1-2 sentences on the winning option's lowest scores. What trade-off are you accepting?]

### The Close Second

[1-2 sentences on what would need to change for the runner-up to win instead. Helps the user gut-check the result.]
```

### Step 5: Gut Check

After presenting the matrix, ask:

"When you saw [Winner] come out on top, did that feel right or did your gut resist it? If it felt wrong, that's data too. We might need to adjust the weights."

This is important. Sometimes the matrix reveals that the user's real priorities are different from what they said.

## Rules

- Be opinionated. After showing the data, tell the user what YOU would do and why.
- Never have more than 7 criteria. More than that dilutes the signal.
- If two options score within 5% of each other, call it a toss-up and recommend based on the single highest-weighted criteria.
- Show your math. The user should be able to verify every score.
- Never fabricate information about the options. If you need specs, prices, or details you don't have, ask.
