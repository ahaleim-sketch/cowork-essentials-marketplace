---
name: travel-planner
description: Plan a trip with a day-by-day itinerary, hotel suggestions, budget estimate, and packing list. Use this skill when the user says "plan a trip", "travel itinerary", "plan my vacation", "I'm going to [city]", "help me plan my trip to", "travel planner", "what should I do in [city]", or any variation of wanting help planning travel.
triggers:
  - plan a trip
  - travel itinerary
  - plan my vacation
  - going to
  - help me plan my trip
  - travel planner
  - what should I do in
---

# Travel Planner

Plan a complete trip from scratch. Give it your destination and dates, and get a day-by-day itinerary with logistics, budget estimates, and a packing list. No more 47 open browser tabs.

## Instructions

### Step 1: Gather Trip Details

From the user's request, identify:

- **Destination** — Where are they going?
- **Dates** — When? How many days?
- **Travelers** — Solo, couple, family, group?
- **Budget** — Backpacker, mid-range, or luxury?
- **Interests** — Food, culture, outdoors, nightlife, history, relaxation?
- **Must-dos** — Anything they specifically want to see or do?
- **Base city** — Are they staying in one place or moving around?

If you have the destination and rough dates, start building. Only ask if you're missing the destination.

### Step 2: Research the Destination

Use WebSearch to find:

- Top-rated things to do (not just tourist traps)
- Neighborhood guides (where to stay, where to eat, where to avoid)
- Seasonal considerations (weather, events, crowds, closures)
- Local tips (transport, tipping, safety, customs)
- Current prices for accommodations and activities

### Step 3: Build the Itinerary

Structure it day by day:

```markdown
# [Destination] Trip Plan

**Dates:** [Start] to [End] ([X] days)
**Travelers:** [Who]
**Vibe:** [Budget level + interests]

---

## Day 1: [Theme — e.g., "Arrival + Neighborhood Exploration"]

**Morning:**
- [Activity or logistics — e.g., "Arrive at [airport], take [transport] to hotel"]
- [Check in at [area] — why this area is good for your trip]

**Afternoon:**
- [Activity 1 — what it is, why it's worth doing, estimated time]
- [Activity 2]

**Evening:**
- [Dinner recommendation — specific place or area, cuisine type, price range]
- [Evening activity if applicable]

**Logistics:** [Any transport, tickets to pre-book, or timing notes]

---

## Day 2: [Theme]

[Same structure...]

---

[Continue for each day...]
```

### Step 4: Add the Extras

After the itinerary, include these sections:

```markdown
## Where to Stay

| Option | Area | Price Range | Why |
|--------|------|-------------|-----|
| [Budget] | [Neighborhood] | $[X-X]/night | [Brief reason] |
| [Mid-range] | [Neighborhood] | $[X-X]/night | [Brief reason] |
| [Splurge] | [Neighborhood] | $[X-X]/night | [Brief reason] |

## Budget Estimate

| Category | Est. Cost |
|----------|-----------|
| Accommodation ([X] nights) | $[X] |
| Food & Drink | $[X] |
| Activities & Entry Fees | $[X] |
| Local Transport | $[X] |
| Flights (if applicable) | $[X] |
| **Total Estimate** | **$[X]** |

[Note: "Estimates based on [budget level] spending for [number] travelers."]

## Packing Essentials

- [Item 1 — why, if not obvious]
- [Item 2]
- [Item 3]
- [Weather-specific items]
- [Activity-specific items]

## Local Tips

- [Transport tip]
- [Money/tipping tip]
- [Safety or cultural tip]
- [Food tip — what to try, what to avoid]
```

### Step 5: Save and Deliver

Save as: `Trip Plan - [Destination] [Month Year].md`

Offer: "Want me to add more detail to any day, find specific restaurant recommendations, or create a Google Maps list of all the spots?"

## Rules

- Research everything. Don't guess at prices, hours, or whether something exists.
- Be specific with recommendations. Not "find a good restaurant" but "try [Place Name] in [Neighborhood] for [cuisine]."
- Include realistic timing. Don't pack 8 activities into one day.
- Note anything that needs to be booked in advance (tickets, reservations, tours).
- Always include a budget estimate, even if rough. People need to know what to expect.
- Flag seasonal issues (closures, monsoon season, peak crowds, etc.).
