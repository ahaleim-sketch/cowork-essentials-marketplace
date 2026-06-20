---
name: diagram-generator
description: Create professional Excalidraw diagrams from any concept
triggers:
  - create a diagram
  - make a flowchart
  - diagram this
  - visualize this system
---

# Diagram Generator

Create professional, color-coded Excalidraw diagrams from any concept, system, or workflow. Outputs valid `.excalidraw` JSON files you can open and edit in Excalidraw.

## How It Works

When you say "create a diagram of [concept]" or "visualize this system", this skill chooses the right diagram type, applies a proven color system, and generates a complete Excalidraw file.

## Step 1: Choose Diagram Type

Analyze the concept and select the best diagram type:

| Type | Structure | Best For |
|------|-----------|----------|
| **Flow** | Left-to-right or top-to-bottom steps with arrows | Processes, pipelines, user journeys |
| **Architecture** | Layered blocks with connections | System design, tech stacks, infrastructure |
| **Comparison** | Side-by-side panels | Versus breakdowns, old way vs new way |
| **Mind Map** | Central node with branching topics | Brainstorms, topic exploration, overviews |
| **Timeline** | Horizontal progression with milestones | History, roadmaps, project phases |
| **Hierarchy** | Tree structure, parent to children | Org charts, taxonomies, folder structures |

## Step 2: Apply the Color System

Use these colors consistently across every diagram. Each color zone has a meaning:

### Color Zones

| Zone | Background | Border | Purpose |
|------|-----------|--------|---------|
| **Title** | `#fff5f5` | `#FF3B30` | Title bar at the top of the diagram |
| **Primary / Steps** | `#dbeafe` | `#2563eb` | Main flow steps, core process blocks |
| **Categories / Groups** | `#fef3c7` | `#d97706` | Departments, plugins, grouped items |
| **Connectors / Links** | `#dcfce7` | `#16a34a` | Integration points, API calls, bridges |
| **Output / Results** | `#fff5f5` | `#FF3B30` | Final output, end state, deliverables |

### Text Colors

| Element | Color |
|---------|-------|
| Primary text (titles, labels) | `#1c1c1e` |
| Secondary text (descriptions) | `#6e6e73` |
| Divider lines | `#c7c7cc` |
| Section header text on amber bg | `#92400e` |

### Canvas

- Background: `#ffffff` (white)
- Font family: 3 (monospace / Cascadia)

## Step 3: Build the Diagram

### Layout Rules

1. **Generous whitespace** -- elements should breathe. Minimum 40px gap between elements
2. **Alignment matters** -- use a grid. Center-align within columns, top-align within rows
3. **Consistent sizing** -- all cards in the same zone should be the same width and height
4. **Clear flow direction** -- the eye should naturally follow left-to-right or top-to-bottom

### Visual Elements

**Step numbers:** Use circled numbers that match the zone border color
- Step 1 in blue zone: circled-1 in `#2563eb`
- Step 2 in amber zone: circled-2 in `#d97706`
- Step 3 in green zone: circled-3 in `#16a34a`
- Step 4 in red zone: circled-4 in `#FF3B30`

**Icons:** Use large emoji (fontSize 32-36) as visual anchors on each card. Pick emoji that instantly communicate the card's purpose.

**Arrows:** Use text elements with arrow emoji to show flow direction. Keep arrows simple and straight where possible.

**Section headers:** Colored bar matching the zone, with darker text. Example: amber bar (`#fef3c7`) with `#92400e` text.

**Card content:** Keep it short and punchy.
- Title: 1-3 words max
- Description: one line max
- Every card gets an emoji icon

## Step 4: Generate Excalidraw JSON

Output a valid `.excalidraw` JSON file with `type: "excalidraw"`, `version: 2`, white `viewBackgroundColor`, and an `elements` array.

**Element types:** rectangle (cards, headers), text (labels, emoji, arrows), line (connections).

**Required properties per element:** unique `id`, `type`, `x`/`y` position, `width`/`height`, `strokeColor` and `backgroundColor` from the color system, `fillStyle: "solid"`, `fontFamily: 3`, `fontSize` (20 labels, 16 descriptions, 32-36 emoji), `textAlign`.

Save as `[descriptive-name].excalidraw` to open in Excalidraw or VS Code.

## Rules

- White background always. No dark mode diagrams
- Every card must have an emoji icon -- no text-only cards
- Max 15 elements in a single diagram. If the concept needs more, split into multiple diagrams
- Short text only. If you need a paragraph, you need a document, not a diagram
- Color zones must be used consistently. Never use blue for an output or red for a mid-step
- Font family 3 (monospace) for everything. No exceptions
- Every diagram must have a title bar in the red/pink zone at the top

## Example Usage

- "Create a diagram of how a REST API works"
- "Make a flowchart for my morning routine"
- "Diagram the CI/CD pipeline"
- "Visualize this system: user signs up, gets email, completes onboarding, sees dashboard"

## Tips for Best Results

- Describe your concept in plain language and let the skill choose the diagram type
- Mention how many steps or components are involved so the layout is right-sized
- If you want to edit afterward, open the `.excalidraw` file at app.excalidraw.com
- Combine with the explainer-graphic skill if you need analogy-based visuals instead
