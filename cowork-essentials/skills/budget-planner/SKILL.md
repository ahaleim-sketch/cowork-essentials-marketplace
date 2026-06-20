---
name: budget-planner
description: Create a personal or business budget with income, expenses, savings targets, and projections. Use this skill when the user says "create a budget", "budget planner", "help me budget", "where's my money going", "financial plan", "monthly budget", "business budget", "expense plan", "savings plan", or any variation of wanting to plan how they spend or save money.
triggers:
  - create a budget
  - budget planner
  - help me budget
  - where's my money going
  - financial plan
  - monthly budget
  - business budget
  - savings plan
---

# Budget Planner

Build a clear, realistic budget that shows exactly where your money is going and where it should be going. Works for personal finances or business budgets. No financial jargon. Just a straightforward plan you can actually stick to.

## Instructions

### Step 1: Determine Budget Type

From the user's request, identify:

- **Personal or business** — Different categories and structure
- **Time period** — Monthly (most common), weekly, quarterly, annual?
- **Current situation** — Do they have income/expense numbers, or are they estimating?
- **Goal** — Save more? Cut spending? Plan for a purchase? Get out of debt? Forecast business expenses?
- **Complexity** — Simple overview or detailed category breakdown?

### Step 2: Gather the Numbers

Ask for (or help estimate):

**For Personal:**
- Total monthly income (after tax)
- Fixed expenses (rent, utilities, insurance, subscriptions, loan payments)
- Variable expenses (food, gas, entertainment, shopping)
- Current savings rate
- Any debt payments
- Financial goals (emergency fund, vacation, house down payment, etc.)

**For Business:**
- Monthly revenue (or projected revenue)
- Fixed costs (rent, software, salaries, insurance)
- Variable costs (marketing, contractors, supplies, travel)
- Growth investments (hiring, tools, advertising)
- Tax set-aside percentage
- Profit targets

### Step 3: Build the Budget

```markdown
# [Monthly/Annual] Budget Plan

**Period:** [Month Year or Date Range]
**Type:** [Personal / Business]
**Last Updated:** [Date]

---

## Income Summary

| Source | Amount |
|--------|--------|
| [Income source 1] | $[X,XXX] |
| [Income source 2] | $[X,XXX] |
| **Total Income** | **$[X,XXX]** |

---

## Fixed Expenses (Non-Negotiable)

| Category | Amount | % of Income | Notes |
|----------|--------|-------------|-------|
| [Rent/Mortgage] | $[X,XXX] | [X]% | |
| [Utilities] | $[XXX] | [X]% | |
| [Insurance] | $[XXX] | [X]% | |
| [Subscriptions] | $[XXX] | [X]% | |
| [Loan Payments] | $[XXX] | [X]% | |
| **Total Fixed** | **$[X,XXX]** | **[X]%** | |

## Variable Expenses (Flexible)

| Category | Budgeted | % of Income | Notes |
|----------|----------|-------------|-------|
| [Food/Groceries] | $[XXX] | [X]% | |
| [Transportation] | $[XXX] | [X]% | |
| [Entertainment] | $[XXX] | [X]% | |
| [Shopping] | $[XXX] | [X]% | |
| [Dining Out] | $[XXX] | [X]% | |
| **Total Variable** | **$[X,XXX]** | **[X]%** | |

## Savings & Goals

| Goal | Monthly Amount | Target Total | Timeline |
|------|---------------|-------------|----------|
| [Emergency Fund] | $[XXX] | $[X,XXX] | [X months] |
| [Goal 2] | $[XXX] | $[X,XXX] | [X months] |
| **Total Savings** | **$[XXX]** | | |

---

## The Bottom Line

| | Amount |
|--|--------|
| Total Income | $[X,XXX] |
| Total Expenses | -$[X,XXX] |
| Total Savings | -$[XXX] |
| **Remaining** | **$[XXX]** |

[If remaining is negative: "You're $[X] over budget. Here's where to cut..."]
[If remaining is positive: "You have $[X] unallocated. Consider adding it to [highest-priority goal]."]

---

## Recommendations

### Where You're Doing Well
- [Positive observation about their budget]

### Where to Tighten Up
- [Specific suggestion with dollar amount: "Cutting dining out from $400 to $250 frees up $150/month for your emergency fund."]
- [Another suggestion]

### Quick Wins
- [Subscription to cancel or negotiate]
- [Easy swap that saves money]
- [Automation to set up]

---

## Benchmarks

How your budget compares to common guidelines:

| Category | Your % | Guideline | Status |
|----------|--------|-----------|--------|
| Housing | [X]% | 25-30% | [On track / Over / Under] |
| Savings | [X]% | 20% | [Status] |
| Debt | [X]% | <15% | [Status] |
| Wants | [X]% | 30% | [Status] |
```

### Step 4: Writing Rules

- **Be honest about the math.** If they're spending more than they earn, say so clearly. Don't sugarcoat it.
- **Recommendations must be specific.** Not "spend less on food." Instead: "Your grocery budget of $800 is high for one person. Meal prepping Sundays could bring this to $500, freeing up $300/month."
- **Include percentages.** Dollar amounts mean nothing without context. Showing what percentage of income goes where is what creates the "aha" moment.
- **Benchmarks help.** Compare their allocations to standard guidelines (50/30/20 rule, etc.) so they can see where they're off.
- **Keep it judgment-free.** People are sensitive about money. Present data and options, not lectures.

### Step 5: Save and Deliver

Save as: `Budget - [Month Year].md`

Or if the user wants a spreadsheet, generate a .xlsx with formulas using the xlsx skill.

Offer: "Want me to turn this into a spreadsheet with formulas, project this out 6 months, or help you find subscriptions to cut?"

## Rules

- Never give specific investment advice. Budget planning is fine. "Put your money in X stock" is not.
- Include a disclaimer that this is a planning tool, not professional financial advice.
- Always double-check the math. Budget totals must add up correctly.
- If the user shares sensitive financial details, handle them with care and don't store them in memory.
- Round to whole dollars unless dealing with exact amounts. Nobody budgets in cents.
