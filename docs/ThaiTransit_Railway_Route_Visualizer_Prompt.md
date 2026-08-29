# Project: Thailand Railway Route Visualizer

## Project Name

**ThaiTransit — Thailand Railway Route Visualizer**

Create a complete modern, premium, responsive static web application for exploring and simulating routes across Thailand's urban railway network.

The attached image is a Thailand railway network map. Use this image as the **primary visual and structural reference** for the railway network.

The application should feel like a real-world railway navigation application rather than a simple static railway map.

---

## 1. Project Objective

Build a static frontend web application that allows users to:

1. Select an origin station.
2. Select a destination station.
3. Search stations by Thai name, English name, or station code.
4. Calculate a route between the selected stations.
5. Display the recommended route.
6. Display alternative routes when appropriate.
7. Show every station along the route.
8. Clearly show railway line changes and transfer stations.
9. Animate the journey from station to station.
10. Animate a train moving along the selected route.
11. Allow users to pause, resume, restart, and change animation speed.
12. Display detailed station information.
13. Display detailed railway line information.
14. Display journey information such as estimated travel time, number of stations, and number of transfers.
15. Provide an interactive schematic railway map.
16. Work entirely as a static frontend application.
17. Work smoothly on desktop, tablet, and mobile devices.

The primary user experience should be:

```text
Select Origin
      ↓
Select Destination
      ↓
Find Route
      ↓
View Route
      ↓
Start Journey
      ↓
Train moves through stations
      ↓
Transfer if necessary
      ↓
Continue on new line
      ↓
Arrive at Destination
```

---

## 2. Important Reference Image Requirement

The attached Thailand railway map **MUST** be used as the main visual and structural reference.

Analyze the image before implementing the railway network.

Use it to understand:

- Railway lines
- Station names
- Station order
- Station relationships
- Interchange stations
- Railway line colors
- Terminal stations
- General railway network topology
- Overall visual hierarchy

### Important

Do **NOT** simply place the uploaded image on the website and put clickable elements on top of it.

Do **NOT** make the uploaded image the actual interactive map.

Instead, recreate the railway network as structured frontend data and render it using SVG/React.

The uploaded image should be treated as a reference/source for the network structure.

The actual application map must be interactive and data-driven.

If the image does not provide enough information to confidently determine a specific detail, do not fabricate highly specific information. Make the information easy to update later through local data files.

---

## 3. Technology Stack

Use the following preferred technology stack:

- Next.js
- TypeScript
- React
- Tailwind CSS
- Framer Motion
- Lucide React
- SVG for the railway map

Use a modern React architecture.

The application must **NOT** require a backend.

Do not require:

- Database
- Authentication
- API server
- Server-side route calculation

All railway information must be stored locally in structured TypeScript or JSON data.

Suggested project structure:

```text
/app
/components
/data
/routes
/types
/utils
/public
```

Suggested files:

```text
/data
  stations.ts
  lines.ts
  network.ts
  routes.ts

/types
  railway.ts

/utils
  calculateRoute.ts
  calculateTravelTime.ts
```

The application should be deployable as a static website.

---

## 4. Static Website Requirement

This project must be completely static.

All route calculations must run on the client.

All railway data must be bundled with the frontend.

The application should work without a backend server.

The project should be able to run with:

```bash
npm install
npm run dev
```

Do not introduce unnecessary server-side dependencies.

---

## 5. Overall UX Concept

The visual style should be inspired by:

- Google Maps
- Apple Maps
- Modern transit applications
- Railway navigation systems
- Transportation control interfaces

However, do **NOT** copy their UI directly.

Create an original visual identity.

The design should be:

- Modern
- Minimal
- Premium
- Clean
- Professional
- Easy to understand
- Highly readable
- Spacious
- Mobile-friendly

Recommended visual direction:

- White or very light background
- Dark navy primary text
- Railway line colors used as functional accents
- Rounded cards
- 16–24px border radius
- Soft shadows
- Subtle borders
- Clean typography
- Large station names
- Strong visual hierarchy

Avoid:

- Excessive gradients
- Excessive glassmorphism
- Excessive animation
- Generic AI-generated dashboard aesthetics
- Unnecessary charts
- Unnecessary cards
- Excessive decorative elements
- Tiny text
- Visually confusing layouts

The railway network should remain the visual focus.

---

## 6. Premium UI Direction

The application should look like a commercial transportation product.

Use a:

> **Transit Control + Modern Navigation**

design language.

Important visual elements:

- Floating route cards
- Smooth micro-interactions
- Large station typography
- Rounded cards
- Soft shadows
- Clean icons
- Spacious layouts
- Subtle transitions
- Railway colors as functional UI accents

The railway map should feel alive.

When a route is selected, visually guide the user's eyes through:

```text
Origin
  ↓
Train movement
  ↓
Stations
  ↓
Transfer
  ↓
New railway line
  ↓
Destination
```

The user should understand the journey without reading excessive text.

---

## 7. Main Page

Create a primary application page.

Desktop layout should generally follow:

```text
┌─────────────────────────────────────────────────────────┐
│ ThaiTransit                         Navigation / Menu   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────┐   ┌──────────────────────────┐ │
│  │ Plan Your Journey│   │                          │ │
│  │                  │   │                          │ │
│  │ From             │   │    Interactive Railway   │ │
│  │ [Search Station] │   │          Map             │ │
│  │                  │   │                          │ │
│  │ To               │   │                          │ │
│  │ [Search Station] │   │                          │ │
│  │                  │   │                          │ │
│  │ [ Find Route ]   │   │                          │ │
│  └──────────────────┘   └──────────────────────────┘ │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ Route Result / Journey Timeline                       │
└─────────────────────────────────────────────────────────┘
```

The exact layout may be improved if needed for better UX.

The map should receive significant visual space.

---

## 8. Mobile Layout

The application MUST be fully responsive.

Target mobile sizes:

- 430x932
- 390x844
- 375x812

Tablet:

- 1024x1366
- 768x1024

Desktop:

- 1920x1080
- 1440x900
- 1366x768

On mobile, use a layout similar to:

```text
┌──────────────────────────────┐
│ ThaiTransit             ☰   │
├──────────────────────────────┤
│ From                         │
│ [ Search station ]           │
│                              │
│ To                           │
│ [ Search station ]           │
│                              │
│ [ Find Route ]               │
├──────────────────────────────┤
│                              │
│      Interactive Map         │
│                              │
│           🚆                 │
│                              │
├──────────────────────────────┤
│ Journey                      │
│                              │
│ ● Station                    │
│ │                            │
│ ● Station                    │
│ │                            │
│ 🔄 Transfer                  │
│ │                            │
│ ● Destination                │
└──────────────────────────────┘
```

Mobile requirements:

- Search panel must be compact.
- Map must have enough screen space.
- Station information should use a bottom sheet or modal.
- Route timeline should be vertically scrollable.
- Buttons must be touch-friendly.
- No horizontal overflow.
- No content should become unusably small.

---

## 9. Header

Create a clean professional header.

Brand:

**ThaiTransit**

Subtitle:

**Thailand Railway Route Visualizer**

Navigation:

- Map
- Lines
- Stations
- About

On mobile, collapse navigation into a menu.

The header should remain simple and should not visually compete with the railway map.

---

## 10. Station Search

Users must be able to select:

```text
FROM:
[ Search station... ]

TO:
[ Search station... ]
```

The search must support:

- Thai station name
- English station name
- Station code
- Autocomplete
- Recent selections
- Railway line identification
- Interchange identification

Example:

```text
Search station...

┌─────────────────────────────┐
│ Siam                        │
│ สยาม                        │
│ BTS Sukhumvit / Silom Line │
├─────────────────────────────┤
│ Asok                        │
│ อโศก                        │
│ BTS Sukhumvit Line          │
└─────────────────────────────┘
```

Search results should update instantly.

Interchange stations must be visually distinguishable.

---

## 11. Station Data Model

Create a structured station model.

Example:

```ts
type Station = {
  id: string
  nameTh: string
  nameEn: string
  code?: string
  lines: string[]
  type: "normal" | "interchange" | "terminal"
  latitude?: number
  longitude?: number
  description?: string
  facilities?: string[]
}
```

Example:

```ts
{
  id: "siam",
  nameTh: "สยาม",
  nameEn: "Siam",
  code: "CEN",
  lines: [
    "bts-sukhumvit",
    "bts-silom"
  ],
  type: "interchange",
  description: "...",
  facilities: [...]
}
```

Keep station data separate from UI components.

The data architecture must make it easy to add, remove, or modify stations later.

---

## 12. Railway Line Data

Create a structured railway line model.

Example:

```ts
type RailwayLine = {
  id: string
  name: string
  nameTh: string
  color: string
  stations: string[]
}
```

Each line must contain stations in correct travel order.

Example:

```ts
{
  id: "bts-sukhumvit",
  name: "Sukhumvit Line",
  nameTh: "สายสุขุมวิท",
  color: "#...",
  stations: [
    "mo-chit",
    "saphan-khway",
    "ari",
    "sanam-pao",
    "...",
    "siam",
    "..."
  ]
}
```

Preserve railway line colors from the attached map as closely as practical.

---

## 13. Railway Network Graph

Represent the railway network as a graph.

The graph must understand:

- Stations
- Adjacent stations
- Railway lines
- Interchange stations
- Transfers
- Multiple possible routes

Conceptually:

```text
Station A
   ↓
Station B
   ↓
Station C
   ↓
Interchange Station
   ↓
Transfer
   ↓
Station D
   ↓
Station E
```

Do NOT hard-code route logic inside UI components.

Use data-driven routing.

---

## 14. Route Calculation

When the user selects:

```text
From: Station A
To: Station B
```

calculate the route through the railway network.

Possible algorithms:

- BFS
- Dijkstra
- A*

Use the simplest appropriate algorithm for the network.

Recommended route priority:

1. Fewest transfers
2. Reasonable number of stations
3. Short estimated travel time
4. Short distance where reliable distance data exists

The algorithm should return structured route information.

Example:

```ts
type RouteResult = {
  stations: string[]
  segments: RouteSegment[]
  transfers: Transfer[]
  estimatedMinutes: number
  stationCount: number
}
```

The routing system must understand when the user needs to change railway lines.

---

## 15. Route Segments

Divide each journey into route segments.

Example:

```text
Segment 1
BTS Sukhumvit Line

Siam
↓
Chit Lom
↓
Phloen Chit
↓
Nana
↓
Asok

TRANSFER

Segment 2
MRT

Sukhumvit
↓
...
↓
Destination
```

Each route segment should contain:

- Railway line
- Start station
- End station
- Station sequence
- Number of stops
- Estimated duration

---

## 16. Route Result

After pressing "Find Route", display a route summary.

Example:

```text
Recommended Route

Siam → Phrom Phong

🚆 BTS Sukhumvit Line

4 stations

⏱ Estimated time: 12 min
🔄 Transfers: 0
```

If transfers are required:

```text
Recommended Route

A → B → C

🚆 Line 1

A
↓
B
↓
C

🔄 Transfer at C

🚆 Line 2

C
↓
D
↓
E
```

Clearly distinguish:

- Train journey
- Transfer
- Station stop
- Destination

---

## 17. Alternative Routes

If multiple reasonable routes are available, show alternatives.

Example:

```text
Recommended
────────────────
🚆 1 transfer
⏱ ~25 min

Alternative
────────────────
🚆 2 transfers
⏱ ~27 min
```

Users should be able to select another route.

When a different route is selected:

- Update map
- Update route summary
- Update timeline
- Update animation
- Update travel information

---

## 18. Interactive Railway Map

Create the railway network using SVG and React.

The map must contain:

- Railway lines
- Station nodes
- Interchange nodes
- Origin marker
- Destination marker
- Selected route
- Train marker

The uploaded image MUST NOT be used as the interactive map.

The actual map should be recreated using structured data.

The visual map should resemble a clean schematic transit map rather than a geographic map.

Use:

- SVG paths for railway lines
- Circles for stations
- Larger/different nodes for interchange stations
- Labels for major stations
- Railway colors matching the reference image

---

## 19. Map Interaction

Users should be able to:

- Zoom in
- Zoom out
- Reset view
- Pan
- Click stations
- Hover stations on desktop
- Tap stations on mobile

Clicking a station should open a station information panel.

Example:

```text
┌────────────────────────────┐
│ Siam                       │
│ สยาม                       │
│                            │
│ Interchange Station        │
│                            │
│ Lines                      │
│ • Sukhumvit Line           │
│ • Silom Line               │
│                            │
│ [ View Details ]            │
└────────────────────────────┘
```

Provide map controls:

```text
[ + ]
[ - ]
[ Reset ]
```

Optionally provide:

```text
[ Focus Route ]
```

which centers the selected route.

---

## 20. Route Highlighting

When a route is selected:

1. Dim unrelated railway lines.
2. Highlight selected railway segments.
3. Highlight origin.
4. Highlight destination.
5. Highlight transfer stations.
6. Place train marker at origin.

Example:

Normal network:
All lines visible.

Selected route:
- Selected route = bright / prominent
- Other routes = reduced opacity

This should make the journey visually obvious.

---

## 21. Journey Animation

This is one of the MOST IMPORTANT features.

After calculating a route, provide:

```text
[ ▶ Start Journey ]
```

When clicked, animate the journey from station to station.

The train marker should visibly move along the selected railway route.

Example:

```text
Station A
   ●
   │
   │ 🚆
   │
   ● Station B
   │
   ● Station C
   │
   ◎ Transfer
```

The animation must NOT simply jump instantly from one station to another.

Use:

- Framer Motion
- SVG animation
- CSS animation

The train should smoothly travel along the route.

---

## 22. Journey Animation Behavior

When the journey begins:

1. Start at origin.
2. Highlight current station.
3. Move train toward next station.
4. Mark visited stations as completed.
5. Highlight upcoming station.
6. Update current station information.
7. Continue through every station.
8. If a transfer is required, stop at the interchange.
9. Show transfer animation.
10. Change railway line.
11. Continue train animation on the new line.
12. Arrive at destination.
13. Show arrival state.

Example:

```text
[Station A]
      ↓
🚆 Moving...
      ↓
[Station B]
      ↓
[Station C]
      ↓
🔄 Transfer
      ↓
🚆 New Line
      ↓
[Station D]
      ↓
[Destination]
```

---

## 23. Journey Controls

Provide:

```text
[ ▶ Start ]

[ ⏸ Pause ]

[ ↻ Restart ]

[ ⏩ Speed ]
```

Animation speed options:

- 0.5x
- 1x
- 2x
- 4x

Also allow the user to click a station in the route timeline and jump to that point in the journey.

Animation controls should be accessible on both desktop and mobile.

---

## 24. Transfer Animation

Transfers must be visually obvious.

When reaching an interchange station, pause the train animation.

Show:

```text
┌────────────────────────────┐
│ 🔄 Transfer                │
│                            │
│ Siam                       │
│                            │
│ Change from                │
│ BTS Sukhumvit Line         │
│                            │
│ to                         │
│ BTS Silom Line             │
│                            │
│ Estimated transfer: 5 min  │
└────────────────────────────┘
```

Then animate the train onto the new railway line.

The transfer should feel like an actual journey transition rather than an instant data change.

---

## 25. Route Timeline

Under or beside the map, create a visual journey timeline.

Example:

```text
START

● Siam
│
│ 🚆 BTS Sukhumvit Line
│
● Chit Lom
│
● Phloen Chit
│
● Nana
│
◎ Asok
│
🔄 Transfer
│
🚆 MRT
│
● Sukhumvit
│
● ...
│
◎ Destination
```

Each station should have a state:

- Completed
- Current
- Upcoming
- Transfer
- Destination

Animate state transitions.

The current station should be visually prominent.

---

## 26. Station Details

Create a station details panel or modal.

Display:

- Thai name
- English name
- Station code
- Railway lines
- Station type
- Interchange information
- Nearby stations
- Facilities if available
- General description

Example:

```text
Siam
สยาม

Station Code:
CEN

Lines:
● Sukhumvit Line
● Silom Line

Type:
Interchange

[ Find Route From Here ]
[ Find Route To Here ]
```

Buttons should automatically populate the route search fields when appropriate.

---

## 27. Railway Line Details

Users should be able to view railway line information.

Display:

- Line name
- Thai name
- Railway line color
- Number of stations
- First station
- Last station
- Station list
- Interchange stations

Example:

```text
BTS Sukhumvit Line

● Mo Chit
● Saphan Khwai
● Ari
● Sanam Pao
...
● Siam
...
● Kheha
```

Clicking a station should open its station details.

---

## 28. Travel Information

For every route, display:

- Origin
- Destination
- Number of stations
- Number of transfers
- Railway lines used
- Estimated travel time

Example:

```text
Journey Summary

🚆 2 Lines
📍 8 Stations
🔄 1 Transfer
⏱ ~24 minutes
```

Since the application is static, travel time may initially be estimated using configurable values.

Example:

```ts
const DEFAULT_TRAVEL_TIME_PER_STATION = 2.5
const DEFAULT_TRANSFER_TIME = 5
```

Make these values easy to modify.

Clearly label these values as:

**Estimated**

---

## 29. Empty State

Before selecting stations, show a useful empty state.

Example:

```text
Plan your journey

Select an origin and destination to see your railway route.
```

Display a subtle railway/train illustration or abstract network graphic.

Do not make the empty state overly decorative.

---

## 30. Error States

If origin and destination are the same:

```text
Please select different stations.
```

If no route exists:

```text
No route found between these stations.
```

If station data is incomplete:

```text
Some route information is currently unavailable.
```

The application must not crash because of invalid user input.

---

## 31. Accessibility

Follow accessibility best practices.

Requirements:

- Semantic HTML
- Keyboard navigation
- Visible focus states
- ARIA labels
- Accessible buttons
- Good color contrast
- Touch-friendly controls
- Screen-reader-friendly labels

Do NOT rely only on railway line colors to communicate information.

For example, an interchange station should communicate its state through:

- Icon
- Text
- Shape
- Color

rather than color alone.

---

## 32. Performance

Because this is a static application:

- Keep JavaScript lightweight.
- Avoid unnecessary dependencies.
- Avoid unnecessary re-renders.
- Optimize SVG rendering.
- Optimize animations.
- Use lazy loading where appropriate.
- Keep map interactions smooth.
- Target smooth 60fps animation where possible.

Do not introduce heavy libraries unless genuinely necessary.

---

## 33. Component Architecture

Use reusable React components.

Suggested components:

```text
/components

  Header.tsx

  StationSelector.tsx

  StationSearch.tsx

  RailwayMap.tsx

  RailwayLine.tsx

  StationNode.tsx

  TrainMarker.tsx

  RoutePanel.tsx

  RouteSummary.tsx

  RouteTimeline.tsx

  JourneyControls.tsx

  StationDetails.tsx

  LineDetails.tsx

  MapControls.tsx

  MobileBottomSheet.tsx
```

---

## 34. Data Architecture

Suggested:

```text
/data

  stations.ts
  lines.ts
  network.ts
  routes.ts

/types

  railway.ts

/utils

  calculateRoute.ts
  calculateTravelTime.ts
```

The UI must consume this data rather than having railway information hard-coded in components.

Example:

```ts
lines.map(line => ...)
```

and:

```ts
station.lines.map(lineId => ...)
```

The architecture should allow additional railway systems to be added easily.

---

## 35. Railway System Extensibility

Design the application so that additional railway systems can be added later.

Examples:

- BTS
- MRT
- Airport Rail Link
- SRT Red Line
- Other Thailand urban railway systems

Do not hard-code the application around only one railway system.

The data model should support:

- Multiple operators
- Multiple railway lines
- Shared/interchange stations
- Different line colors
- Different station types

---

## 36. Railway Map SVG Implementation

Use SVG paths for railway lines.

Example concept:

```tsx
<svg>
  <path
    d="..."
    stroke={line.color}
    strokeWidth="6"
    fill="none"
  />

  <circle
    cx="..."
    cy="..."
    r="8"
  />
</svg>
```

Stations should be positioned according to the general topology of the provided reference map.

The map does NOT need geographically accurate GPS positioning for the first version.

Visual topology and station relationships are more important.

Major/interchange stations should receive more visual emphasis.

---

## 37. Train Marker

Create a clear animated train marker.

The train marker should:

- Move along the selected route
- Rotate or orient naturally when appropriate
- Remain visible against railway lines
- Have a subtle animation
- Show current railway line context

The train marker should not visually overwhelm the map.

Use an icon or custom SVG rather than an emoji if possible.

---

## 38. Map Zoom and Pan

The map should support:

- Zoom in
- Zoom out
- Pan
- Reset
- Fit route

When a route is calculated, optionally provide:

```text
[ Focus Route ]
```

which automatically centers the selected route in the map.

On mobile, pinch zoom should be supported where practical.

---

## 39. Initial Demo

The application must work immediately after startup.

Provide a working example route such as:

```text
From:
Siam

To:
Phrom Phong
```

After selecting or loading the demo route, show:

- Route
- Railway line
- Station sequence
- Estimated travel time
- Interactive map
- Train marker
- Journey timeline
- Animation controls

The user must be able to change the stations afterward.

---

## 40. Micro-interactions

Add subtle animations for:

- Station hover
- Station selection
- Search dropdown
- Route card appearance
- Route drawing
- Train movement
- Transfer transition
- Timeline state changes
- Bottom sheet opening
- Modal opening
- Button interactions

Use Framer Motion where appropriate.

Animations should be fast and smooth.

Do not over-animate the interface.

---

## 41. Responsive Requirements

The website MUST be responsive.

### Desktop

- Two-column or flexible layout
- Search panel and map visible together
- Large interactive map
- Timeline below or beside the map

### Tablet

- Flexible layout
- Maintain readable controls
- Adjust map dimensions

### Mobile

- Stack the interface vertically
- Search panel at top
- Map below
- Route result below map
- Station details as bottom sheet
- Timeline vertically scrollable
- Touch-friendly controls

There must be:

- NO horizontal scrolling
- NO broken components
- NO clipped text
- NO unusably small buttons

---

## 42. Navigation / Pages

The main experience can be centered around the map page.

If useful, provide lightweight sections/pages for:

- Map
- Lines
- Stations
- About

However, do not overcomplicate the project.

The primary focus must remain:

**Route Planning + Interactive Railway Map + Journey Animation**

---

## 43. Code Quality

Write clean, maintainable TypeScript.

Requirements:

- Strong typing
- Reusable components
- Clear naming
- No unnecessary duplication
- Avoid massive components
- Separate data from presentation
- Separate routing logic from UI
- Avoid hard-coded magic values where possible
- Add comments only where they improve understanding

Do not create unnecessary abstractions.

---

## 44. Important Implementation Rule

Do not stop after creating a visual mockup.

This must be a **FUNCTIONAL application**.

The following must actually work:

- [x] Station search
- [x] Thai station search
- [x] English station search
- [x] Station selection
- [x] Origin selection
- [x] Destination selection
- [x] Route calculation
- [x] Railway line detection
- [x] Transfer detection
- [x] Route visualization
- [x] Route highlighting
- [x] Interactive station nodes
- [x] Station details
- [x] Railway line details
- [x] Journey timeline
- [x] Train animation
- [x] Pause
- [x] Resume
- [x] Restart
- [x] Animation speed
- [x] Transfer animation
- [x] Destination arrival state
- [x] Responsive layout
- [x] Mobile interface
- [x] Desktop interface
- [x] No backend
- [x] Static deployment support

---

## 45. Development Process

Before implementing the UI:

1. Analyze the attached Thailand railway map.
2. Identify railway systems and lines shown.
3. Identify stations.
4. Identify station ordering.
5. Identify interchange stations.
6. Identify line colors.
7. Build the structured railway data.
8. Build the railway graph.
9. Implement route calculation.
10. Implement the SVG railway map.
11. Implement route highlighting.
12. Implement train animation.
13. Implement station and line details.
14. Implement responsive UI.
15. Test the complete application.

Do not build only the frontend appearance first and leave the main functionality as placeholders.

---

## 46. Data Accuracy

The attached map is the primary visual reference.

Do not blindly invent station names, line relationships, or transfer points.

If information can be clearly determined from the provided map, use it.

If information is unclear, structure the application so it can easily be corrected later.

Keep railway data centralized in the data files.

Do not duplicate station information throughout multiple components.

---

## 47. Final Visual Experience

The final website should feel like:

> "A modern digital control panel for navigating Thailand's railway network."

It should combine:

```text
Interactive railway map
        +
Route planner
        +
Transit information
        +
Journey timeline
        +
Train animation
        +
Transfer visualization
```

The user should be able to open the website and immediately understand:

- Where am I going?
- Which train do I take?
- Where do I change lines?
- How many stations are left?
- How long will the journey take?
- Where is the train currently?

The map should feel alive while remaining clean and easy to understand.

---

## 48. Final Deliverable

Deliver a fully functional static web application.

Do not provide only screenshots or a design mockup.

The final project should contain:

- Complete Next.js application
- TypeScript
- Tailwind CSS
- Responsive UI
- Structured railway data
- SVG railway map
- Station search
- Route calculation
- Route visualization
- Transfer detection
- Station details
- Railway line details
- Journey timeline
- Train animation
- Animation controls
- Mobile UI
- Desktop UI
- Accessibility support
- Static deployment compatibility

Before considering the project complete, test the application at:

```text
1920x1080
1440x900
1366x768
1024x1366
768x1024
430x932
390x844
375x812
```

Ensure:

- No horizontal overflow
- No broken layouts
- No console errors
- No broken interactions
- Route calculation works
- Station search works
- Animation works
- Transfer animation works
- Mobile interactions work
- Desktop interactions work

Most importantly, the final result must feel like a **REAL railway navigation product** and not a generic AI-generated dashboard.

Use the attached Thailand railway map as the primary reference for the network structure and visual topology, but recreate the interactive railway network using **structured data + SVG/React**.
