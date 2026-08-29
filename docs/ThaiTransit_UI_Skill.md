# ThaiTransit UI Design Skill

## 1. Purpose

This skill defines the visual and interaction direction for the
ThaiTransit / BMR Metro transit journey-planning interface.

The goal is to move away from generic "AI Vibe UI" patterns such as: -
excessive rounded cards - excessive pill-shaped badges - gradients used
on primary actions - every section being placed inside a card -
decorative shadows everywhere - too many competing colors -
dashboard-like layouts that make a transit map feel secondary

The interface should instead feel like a **real public-transit
navigation product**: precise, calm, information-dense, highly
scannable, and map-first.

Primary design principle:

> **The map is the product. The UI explains the map.**

------------------------------------------------------------------------

## 2. Recommended Design Direction

### Recommended: "Transit Command Center"

Use a modern transit-control / navigation aesthetic inspired by real
railway information systems, wayfinding signage, and contemporary map
applications.

Characteristics: - map-first composition - strong information
hierarchy - compact controls - restrained corner radii - minimal
shadows - flat surfaces - typography-led hierarchy - transit line colors
used semantically - clear station / interchange / transfer states -
dense information without visual clutter

The product should feel closer to:

**Google Maps Transit + modern railway control panel + Bangkok
wayfinding signage**

and less like:

**generic SaaS dashboard / AI-generated glassmorphism dashboard**

------------------------------------------------------------------------

# 3. Layout Philosophy

## Desktop

Use a 3-zone composition:

``` text
┌──────────────────────────────────────────────────────────────┐
│  ThaiTransit                         Search / Help / Status │
├───────────────┬──────────────────────────────────────────────┤
│               │                                              │
│  JOURNEY      │                                              │
│  PANEL        │                    MAP                       │
│               │                                              │
│  Origin       │                                              │
│  Destination  │                                              │
│  Route        │                                              │
│  Summary      │                                              │
│               │                                              │
│               │                                              │
├───────────────┴──────────────────────────────────────────────┤
│ Optional compact journey / route information                 │
└──────────────────────────────────────────────────────────────┘
```

### Important

Do not make the entire left side a stack of equally prominent cards.

Instead: - one primary journey panel - compact route result - expandable
details - map receives the majority of visual space

Recommended desktop proportions:

-   Header: 56--64px
-   Left journey panel: 360--420px
-   Map: remaining width
-   Avoid unnecessarily wide navigation bars.

------------------------------------------------------------------------

# 4. Header

The header should be quiet and functional.

### Recommended

-   white or near-white background
-   1px bottom border
-   no large shadow
-   logo on the left
-   small product/version indicator
-   utility actions on the right

Example:

``` text
[▣] ThaiTransit  BMR METRO

                         เส้นทางตัวอย่าง   สาระรถไฟฟ้า   คู่มือ
```

### Avoid

-   oversized logo
-   glowing header
-   gradient background
-   excessive navigation buttons
-   multiple floating pills

------------------------------------------------------------------------

# 5. Journey Planner

The journey planner is the most important UI element after the map.

Instead of two large "cards", use a **single route input module**.

Example:

``` text
วางแผนการเดินทาง

FROM
Siam
CEN

        ↕
TO
Phrom Phong
E5

[ ค้นหาเส้นทาง ]
```

### Visual treatment

Origin: - green semantic accent

Destination: - red semantic accent

Connection: - a thin vertical transit line connecting the two fields

This should visually resemble a transit route rather than two
independent forms.

### Input behavior

Each location field should: - have a clear station icon - show station
name prominently - show line code / interchange metadata secondarily -
support editing - support autocomplete - expose swap action between
origin and destination

------------------------------------------------------------------------

# 6. Suggested Routes

Do not use many pill buttons.

Instead, show 2--4 route suggestions as compact selectable rows.

Example:

``` text
เส้นทางแนะนำ

┌────────────────────────────────────────────┐
│ FASTEST                                    │
│ Siam → Asok → Phrom Phong                 │
│ ● CEN   →   ● E4                          │
│ 13 min   ·   0 transfers          ฿30     │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ FEWER TRANSFERS                            │
│ Siam → Phrom Phong                        │
│ 17 min   ·   1 transfer            ฿30    │
└────────────────────────────────────────────┘
```

Use a selected state rather than putting everything into colored pills.

------------------------------------------------------------------------

# 7. Route Summary

The current four-stat card layout feels like a generic analytics
dashboard.

Replace:

``` text
[ เวลา ] [ สถานี ] [ เปลี่ยนสาย ] [ ค่าโดยสาร ]
```

with a compact route summary.

Recommended:

``` text
13 นาที
6 สถานี
0 ครั้งเปลี่ยนสาย
ประมาณ ฿30
```

Use typography to establish hierarchy.

### Priority

1.  Travel time
2.  Number of transfers
3.  Station count
4.  Fare

Travel time should be the largest number.

------------------------------------------------------------------------

# 8. Route Visualization

A transit journey should have its own visual language.

Example:

``` text
SIAM
  │
  ● CEN
  │
  ● E1
  │
  ● E2
  │
  ● E3
  │
  ● E4
  │
PHROM PHONG
```

Use: - thick line for the active route - small station nodes - larger
nodes for origin / destination - transfer nodes with clear interchange
indicators - muted background routes

The visual language should match the map.

------------------------------------------------------------------------

# 9. Map Design

The map should NOT look washed out.

Current issue: - background map is too pale - active route competes with
many faded routes - labels are difficult to scan - UI panels visually
overpower the map

### Recommended map hierarchy

1.  Active route --- strongest
2.  Origin / destination --- strongest nodes
3.  Transfer stations --- medium emphasis
4.  Other transit lines --- muted
5.  Street / geographic context --- very subtle
6.  Non-essential labels --- hidden or reduced

The user should immediately understand:

> "Where am I going, what line am I taking, and where do I transfer?"

------------------------------------------------------------------------

# 10. Transit Line Colors

Color must have meaning.

Do not use random colors for decorative purposes.

Suggested semantic system:

``` text
Active route       = official transit line color
Origin             = green
Destination        = red
Transfer           = amber
Selected station   = dark / high-contrast
Inactive route     = muted
Background         = neutral
```

If official Bangkok transit line colors are used, preserve their meaning
consistently.

Do not change line colors merely to match a UI theme.

------------------------------------------------------------------------

# 11. Buttons

Use flat, strong actions.

### Primary

``` text
[ ค้นหาเส้นทาง ]
```

Recommended: - solid color - 8--10px radius - medium shadow or no
shadow - clear hover / pressed state

### Secondary

Use: - outline - neutral background - text button

Avoid: - gradient buttons - oversized rounded buttons - glowing effects

------------------------------------------------------------------------

# 12. Border Radius

Reduce the "AI-generated rounded everything" appearance.

Recommended:

  Element            Radius
  -------------- ----------
  Main panel       12--16px
  Input             8--10px
  Button            8--10px
  Route row         8--12px
  Small badge        4--6px
  Map controls      8--10px

Do not use 24--32px radius for every component.

------------------------------------------------------------------------

# 13. Shadows

Use shadows sparingly.

Preferred:

``` text
border: 1px solid neutral-200
box-shadow: subtle
```

A panel should still look good if the shadow is removed.

Avoid: - glowing shadows - blue outer glows - multiple nested shadows -
heavy floating-card effects

------------------------------------------------------------------------

# 14. Color System

Use a mostly neutral interface.

### Base

``` text
Background        #F5F7F9
Surface           #FFFFFF
Border            #DDE2E7
Text              #17202A
Secondary text    #66717D
Muted text        #8A949E
```

### Functional colors

``` text
Primary           #3155D9
Success           #2E9B68
Warning           #D99A24
Danger            #D94A55
```

Transit line colors should come from the actual transit system rather
than this palette.

### Rule

Approximately: - 80% neutral - 15% functional / transit colors - 5%
strong emphasis

------------------------------------------------------------------------

# 15. Typography

Typography should create hierarchy instead of containers.

Recommended:

### Page / section title

-   18--22px
-   semibold

### Station name

-   15--17px
-   semibold

### Large route metric

-   24--32px
-   bold

### Metadata

-   12--13px
-   regular

### Station code

-   11--12px
-   semibold

Avoid making every label bold.

------------------------------------------------------------------------

# 16. Information Density

Transit interfaces require more information than normal marketing
websites.

Do not simplify everything into oversized cards.

Prefer:

``` text
13 min · 6 stations · 0 transfers · ฿30
```

over four independent dashboard cards.

Use compact separators:

``` text
·
│
→
```

to communicate relationships.

------------------------------------------------------------------------

# 17. Journey Simulation

The simulation feature should feel like a transit playback system.

Instead of a giant green CTA, use:

``` text
Journey Simulation

[ ▶ Start simulation ]
```

During simulation:

``` text
● Siam
│
│  1 min
│
● Chit Lom
│
│  2 min
│
◉ Phloen Chit
```

Map should animate the current train position.

The current station should always be visually obvious.

------------------------------------------------------------------------

# 18. Map Controls

Keep controls compact and vertically aligned.

Recommended:

``` text
┌────┐
│  + │
├────┤
│  − │
├────┤
│ ◎  │
├────┤
│ ↻  │
└────┘
```

Do not use oversized floating toolbars.

------------------------------------------------------------------------

# 19. Cards

Cards are allowed, but they should represent meaningful objects.

Good card: - route option - station information - journey alert

Bad card: - every heading - every statistic - every section - every
button

A useful rule:

> **If removing the border does not reduce understanding, the section
> probably does not need a card.**

------------------------------------------------------------------------

# 20. Responsive Design

## Desktop

Map-first.

``` text
40% information
60% map
```

## Tablet

``` text
35% information
65% map
```

## Mobile

Do not squeeze the desktop layout.

Use:

``` text
┌─────────────────────┐
│ ThaiTransit         │
├─────────────────────┤
│ From                │
│ Siam                │
│                     │
│ To                  │
│ Phrom Phong         │
│                     │
│ [ Find route ]      │
├─────────────────────┤
│ MAP                 │
│                     │
├─────────────────────┤
│ 13 min · 0 transfer │
└─────────────────────┘
```

The route result can become a bottom sheet.

------------------------------------------------------------------------

# 21. Interaction Principles

Every interaction should communicate transit state.

### Hover

-   subtle surface change
-   no dramatic animation

### Selected

-   strong border
-   clear active route indicator

### Loading

-   use compact skeleton / progress state
-   avoid excessive spinners

### Error

-   explain what happened
-   provide an action

Example:

``` text
ไม่พบเส้นทางที่เหมาะสม
ลองเปลี่ยนสถานีต้นทางหรือปลายทาง
```

------------------------------------------------------------------------

# 22. Motion

Motion should explain movement.

Good: - route line drawing - train position movement - station selection
transition - bottom sheet transition

Avoid: - floating cards - bouncing buttons - excessive scale
animations - decorative particles - gradients moving across buttons

Recommended duration: - micro interaction: 120--180ms - panel
transition: 200--300ms - route animation: based on journey state

------------------------------------------------------------------------

# 23. Accessibility

Minimum requirements:

-   WCAG AA contrast where practical
-   never rely on color alone
-   station states should also use icons / labels
-   buttons should have clear text
-   keyboard navigation should work
-   focus states must be visible
-   touch targets should be at least \~44px

Example:

Do not communicate transfer only with yellow.

Use:

``` text
↔ TRANSFER
```

plus the color.

------------------------------------------------------------------------

# 24. Anti-Patterns

The AI agent MUST avoid these patterns unless explicitly requested:

### ❌ Card stacking

``` text
[ Card ]
[ Card ]
[ Card ]
[ Card ]
[ Card ]
```

### ❌ Excessive pills

``` text
(FASTEST) (6 STATIONS) (0 TRANSFER) (฿30)
```

### ❌ Gradient everything

``` text
purple → blue button
blue → purple panel
glowing borders
```

### ❌ Excessive rounded corners

Every element should not look like a floating bubble.

### ❌ Dashboard statistics

Avoid making transit information resemble a business analytics
dashboard.

### ❌ Decorative glassmorphism

Avoid: - blur panels - transparent cards - glow - excessive backdrop
filters

unless specifically requested.

------------------------------------------------------------------------

# 25. Component Architecture

Suggested component hierarchy:

``` text
ThaiTransitApp
├── Header
├── JourneyPlanner
│   ├── LocationInput
│   ├── SwapButton
│   └── FindRouteButton
├── RouteResults
│   ├── RouteOption
│   └── RouteOption
├── JourneySummary
├── TransitMap
│   ├── MapControls
│   ├── TransitLines
│   ├── Stations
│   └── TrainMarker
└── JourneyTimeline
```

Keep components semantic.

Do not create components merely because a visual block exists.

------------------------------------------------------------------------

# 26. Design Tokens

Use tokens rather than hard-coded styling.

``` css
--color-bg: #F5F7F9;
--color-surface: #FFFFFF;
--color-border: #DDE2E7;
--color-text: #17202A;
--color-text-secondary: #66717D;
--color-primary: #3155D9;

--radius-panel: 14px;
--radius-control: 9px;
--radius-small: 6px;

--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;

--shadow-panel: 0 2px 8px rgba(0,0,0,.08);
```

Adjust tokens to match the project's existing design system when one
exists.

------------------------------------------------------------------------

# 27. AI Implementation Rules

When generating or modifying UI, the AI MUST:

1.  Prioritize the transit map.
2.  Use one coherent visual language.
3.  Reduce unnecessary cards.
4.  Reduce unnecessary pills.
5.  Avoid decorative gradients.
6.  Use transit colors semantically.
7.  Keep route information compact and scannable.
8.  Make origin, destination, transfer, and current station immediately
    distinguishable.
9.  Prefer borders and spacing over heavy shadows.
10. Use typography for hierarchy.
11. Preserve functional information even when simplifying the visual
    design.
12. Never invent decorative UI elements just to fill space.
13. Keep desktop and mobile layouts intentionally different.
14. Make interactions feel like navigation / wayfinding, not a generic
    SaaS dashboard.

------------------------------------------------------------------------

# 28. Visual Target

The final UI should communicate:

**Precise · Fast · Trustworthy · Urban · Transit-focused · Modern**

It should NOT communicate:

**AI-generated · Generic SaaS · Over-designed · Glassmorphism ·
Dashboard template**

------------------------------------------------------------------------

# 29. Suggested First Redesign

For the current ThaiTransit screen, redesign in this order:

### Step 1

Remove the large stacked statistic cards.

### Step 2

Turn Origin + Destination into one connected route input.

### Step 3

Turn Suggested Routes into selectable route rows.

### Step 4

Make the map darker / clearer and mute unrelated transit lines.

### Step 5

Reduce the number of rounded containers.

### Step 6

Move Journey Timeline into an expandable bottom/side section.

### Step 7

Make the selected route visually connect the left panel and map.

### Step 8

Use typography and spacing instead of cards to create hierarchy.

### Step 9

Simplify header and map controls.

### Step 10

Test the interface at desktop, tablet, and mobile widths.

------------------------------------------------------------------------

# 30. Final Design Rule

When uncertain between a decorative solution and a functional transit
solution:

> **Choose the solution that helps the user understand the journey
> faster.**

ThaiTransit is a navigation product, not a dashboard showcase.
