# ThaiTransit — UX Enhancement Specification

## Purpose

เอกสารนี้เป็น Specification สำหรับยกระดับ UX ของ **ThaiTransit — Thailand Railway Route Visualizer**

เป้าหมายหลักไม่ใช่การเพิ่มจำนวน Feature ให้มากขึ้น แต่คือการทำให้ Feature ที่มีอยู่แล้ว:

- เข้าใจง่ายขึ้น
- ใช้งานเร็วขึ้น
- มีลำดับการใช้งานที่ชัดเจน
- ลดความรู้สึกว่าเป็น Dashboard
- ทำให้ Railway Map เป็นพระเอกของเว็บไซต์
- ทำให้ Route Planning และ Journey Simulation รู้สึกเป็นระบบเดียวกัน
- รองรับ Desktop และ Mobile ได้ดี
- ยังคงเป็น Static Frontend

---

# 1. UX Design Principles

## 1.1 Map-first

Railway Map เป็น Visual Focus หลัก

ไม่ควรมี Card หรือ Panel จำนวนมากที่แย่งความสนใจจาก Map

โครงสร้างหลักควรเป็น:

```text
Journey Planning
      ↓
Route Selection
      ↓
Railway Map
      ↓
Journey Timeline
```

ไม่ใช่:

```text
Card
Card
Card
Card
Map
Card
Card
```

## 1.2 Clear Next Action

ทุก UI State ควรตอบ User ได้ว่า:

> "ตอนนี้ฉันต้องทำอะไรต่อ?"

ตัวอย่าง:

```text
ยังไม่ได้เลือกสถานี
→ Select origin and destination

เลือกสถานีครบ
→ Find Route

หา Route แล้ว
→ Select Route

เลือก Route แล้ว
→ Start Journey

กำลัง Journey
→ Follow next stop

ถึงแล้ว
→ Plan another journey
```

## 1.3 Progressive Disclosure

ไม่ควรแสดงข้อมูลทั้งหมดพร้อมกัน

แสดงข้อมูลสำคัญก่อน:

```text
13 min
6 stations
0 transfers
```

จากนั้นให้ User เปิดรายละเอียดเพิ่มเติมเมื่อจำเป็น:

```text
View details
```

## 1.4 No Unnecessary Persistence

เว็บไซต์ยังคงเป็น Static

ห้ามเพิ่ม:

```text
Backend
Database
Authentication
User Account
LocalStorage
Session Storage
Cloud Sync
```

State ทั้งหมดเป็น Client-side และสามารถหายเมื่อ Refresh ได้

---

# 2. Priority

## MUST HAVE

1. Clear / New Journey
2. Swap Origin / Destination
3. Improved Search UX
4. Keyboard Navigation
5. Better Empty / Error States
6. Progressive Route Card
7. Clear Transfer Instructions
8. Next Stop Highlight

## SHOULD HAVE

9. Timeline ↔ Map Synchronization
10. Click Timeline → Focus Map
11. Mobile Bottom Sheet
12. Reduced Motion Support
13. Better Animation Controls
14. Context-aware Map

## OPTIONAL

15. URL State / Shareable Journey

---

# 3. Clear / New Journey

## 3.1 คืออะไร

ให้ User สามารถล้าง Journey ปัจจุบันและเริ่มการค้นหาใหม่ได้ในครั้งเดียว

ใช้คำว่า:

```text
New Journey
```

มากกว่า:

```text
Reset
```

เพราะสื่อถึงการเริ่มการเดินทางใหม่ได้ชัดกว่า

## 3.2 Behavior

เมื่อกด:

```text
[ New Journey ]
```

ให้ Reset:

```text
Origin
Destination
Selected Route
Route Preference
Map Focus
Timeline
Train Position
Journey Progress
Animation State
```

กลับสู่ Default State

## 3.3 UI

Desktop:

```text
[ New Journey ]
```

Mobile:

```text
↻ New Journey
```

สามารถวางไว้ใกล้ Route Planner หรือ Journey Header

## 3.4 Acceptance Criteria

- [ ] ล้าง Origin
- [ ] ล้าง Destination
- [ ] ล้าง Selected Route
- [ ] Reset Map View
- [ ] Reset Timeline
- [ ] Reset Animation
- [ ] ไม่ล้าง Static Railway Data
- [ ] ไม่ใช้ Storage

---

# 4. Swap Origin / Destination

## 4.1 คืออะไร

เพิ่มปุ่มสำหรับสลับสถานีต้นทางและปลายทาง

```text
From
[ Siam ]

      ⇅

To
[ Phrom Phong ]
```

กด:

```text
⇅
```

กลายเป็น:

```text
From
[ Phrom Phong ]

      ⇅

To
[ Siam ]
```

## 4.2 Behavior

```text
origin = destination
destination = origin
```

ควรทำงานทันที

ถ้าทั้งสองช่องว่าง:

```text
Swap
disabled
```

ถ้ามีเพียง Origin:

```text
Swap
disabled
```

## 4.3 Acceptance Criteria

- [ ] สลับสถานีถูกต้อง
- [ ] Route State ถูก invalidate เมื่อจำเป็น
- [ ] UI Update ทันที
- [ ] ปุ่ม Disabled เมื่อไม่มีข้อมูลเพียงพอ
- [ ] ไม่สร้างข้อมูลใหม่
- [ ] ไม่ใช้ Backend

---

# 5. Improved Search UX

## 5.1 Search Result Structure

Autocomplete ควรแสดงข้อมูลมากกว่าเพียงชื่อ:

```text
Siam
สยาม
CEN

BTS Sukhumvit Line
```

หรือ:

```text
Phrom Phong
พร้อมพงษ์
E5

BTS Sukhumvit Line
```

## 5.2 Search Support

ต้องรองรับ:

```text
Thai
English
Station Code
```

ตัวอย่าง:

```text
สยาม
Siam
CEN
```

## 5.3 Clear Input

เมื่อเลือกแล้ว:

```text
[ Siam                    × ]
```

กด `×`:

```text
[ Search station... ]
```

ล้างเฉพาะ Field นั้น

ไม่ล้างอีก Field

## 5.4 Search States

### Empty

```text
Search station...
```

### Typing

```text
Search station...

Siam
สยาม
CEN

Chit Lom
ชิดลม
E1
```

### No Result

```text
No stations found.

Try another station name or code.
```

---

# 6. Keyboard UX

สำหรับ Desktop ควรรองรับ Keyboard Navigation

## Shortcut

```text
/
```

Focus Search

```text
Esc
```

Close Search Dropdown

```text
↑ ↓
```

Navigate Search Results

```text
Enter
```

Select Result

## Example

```text
Search station

> Siam
  Chit Lom
  Phloen Chit
```

กด:

```text
↓
↓
Enter
```

เลือก:

```text
Phloen Chit
```

## Accessibility

ทุก Interactive Element ต้องสามารถเข้าถึงผ่าน Keyboard ได้

ใช้:

```tsx
<button>
```

แทน Clickable `<div>`

และต้องมี:

```text
aria-label
aria-expanded
aria-selected
```

เมื่อเหมาะสม

---

# 7. Better Empty States

ทุก State ที่ยังไม่มีข้อมูลควรมีคำอธิบายและ Next Action

## Initial

```text
Plan your journey

Select an origin and destination
to find a railway route.
```

## Origin Selected

```text
From
Siam

Now choose your destination.
```

## No Route

```text
No route found

Try another pair of stations.
```

## Route Ready

```text
Your journey is ready.

Select a route to continue.
```

## Arrival

```text
You've arrived.

[ New Journey ]
```

---

# 8. Progressive Route Card

## 8.1 Problem

ไม่ควรทำ Route Card ให้กลายเป็น Dashboard ที่มีข้อมูลจำนวนมากตั้งแต่แรก

## 8.2 Primary Information

แสดงก่อน:

```text
┌─────────────────────────────┐
│ ⚡ Fastest                  │
│                             │
│ 13 min                      │
│ 6 stations · 0 transfers   │
│                             │
│ BTS Sukhumvit Line          │
│                             │
│ [ Select Route ]            │
└─────────────────────────────┘
```

## 8.3 Secondary Information

รายละเอียดเพิ่มเติม:

```text
[ View details ]
```

เมื่อเปิด:

```text
Station sequence
Transfer details
Estimated fare
Railway lines
```

## 8.4 Selected State

Route ที่เลือกต้องเด่นกว่า Route อื่น

Selected:

```text
━━━━━━━━━━━━━━━━━━━━
```

Unselected:

```text
────────────────────
```

ต้องไม่ใช้สีอย่างเดียวเพื่อบอก Selected State

สามารถใช้:

```text
✓ Selected
```

หรือ Border / Icon / Label ร่วมด้วย

---

# 9. Transfer Instruction

## 9.1 Problem

Transfer เป็นจุดที่ User มีโอกาสสับสนมากที่สุด

ไม่ควรแสดงเพียง:

```text
TRANSFER
```

## 9.2 Recommended UI

```text
┌────────────────────────────┐
│ 🔄 CHANGE LINE             │
│                            │
│ Asok                       │
│                            │
│ Get off BTS Sukhumvit Line │
│ ↓                          │
│ Transfer to MRT Blue Line  │
└────────────────────────────┘
```

## 9.3 Timeline

```text
● Siam
│
│
● Asok
│
│ 🔄 Transfer
│
● Sukhumvit
│
● Queen Sirikit Centre
```

## 9.4 Acceptance Criteria

- [ ] Transfer Station ชัดเจน
- [ ] Current Line ชัดเจน
- [ ] Next Line ชัดเจน
- [ ] Timeline แสดง Transfer
- [ ] Map Highlight Transfer
- [ ] Mobile อ่านง่าย

---

# 10. Next Stop Highlight

ระหว่าง Journey Simulation ต้องมีข้อมูลว่า User อยู่ตรงไหนและกำลังจะไปไหน

ตัวอย่าง:

```text
CURRENT

🚆 Asok

Next stop
Phrom Phong

2 stations remaining
```

## State

```text
Before Departure
Current Station
Between Stations
Arrived
```

## Map

Current Station:

```text
●
CURRENT
```

Next Station:

```text
◎
NEXT
```

## Acceptance Criteria

- [ ] Current Station Update
- [ ] Next Station Update
- [ ] Remaining Station Count Update
- [ ] Timeline Sync
- [ ] Map Sync
- [ ] Arrival State ถูกต้อง

---

# 11. Timeline ↔ Map Synchronization

## 11.1 คืออะไร

Timeline และ Map ต้องรู้ว่า User กำลังดู Station เดียวกัน

## 11.2 Timeline → Map

เมื่อ Hover / Focus:

```text
Phloen Chit
```

Map:

```text
Phloen Chit
     ↓
Highlight
```

## 11.3 Map → Timeline

เมื่อ Hover / Focus Station:

```text
◎ Phloen Chit
```

Timeline:

```text
● Siam
│
● Chit Lom
│
◎ Phloen Chit
│
● Nana
```

## 11.4 Click Timeline

เมื่อ Click:

```text
Phloen Chit
```

Map:

```text
Focus Station
```

ไม่จำเป็นต้องเปลี่ยน Route

---

# 12. Click Timeline → Focus Map

เมื่อ User เลือก Timeline Item:

```text
Timeline
    ↓
Station
    ↓
Map Focus
```

Map ควร:

- Center ไป Station
- Highlight Station
- แสดง Route Segment รอบ Station
- ไม่ Zoom ใกล้เกินไป

Animation ประมาณ:

```text
200–400ms
```

---

# 13. Mobile Bottom Sheet

## 13.1 Principle

บน Mobile ไม่ควรเรียงทุกอย่างเป็น Vertical Page ยาวมาก

Map ควรเป็นพื้นที่หลัก

```text
┌─────────────────────────┐
│                         │
│          MAP            │
│                         │
│                    + −  │
│                         │
├─────────────────────────┤
│ Phrom Phong             │
│ 13 min · 6 stations     │
│                         │
│ [ Start Journey ]       │
│                         │
│ ─────────────────────   │
│ Swipe for details       │
└─────────────────────────┘
```

## 13.2 Expanded

ลาก Bottom Sheet ขึ้น:

```text
┌─────────────────────────┐
│ ───────                 │
│ Journey                 │
│                         │
│ ● Siam                  │
│ │                       │
│ ● Chit Lom              │
│ │                       │
│ ● Asok                  │
│ │ 🔄 Transfer            │
│ ● Sukhumvit             │
│ │                       │
│ ◎ Phrom Phong           │
└─────────────────────────┘
```

## 13.3 Rules

Mobile:

- Route Planner → Bottom Sheet
- Station Details → Bottom Sheet
- Line Details → Bottom Sheet
- Journey Timeline → Bottom Sheet

ไม่ควรใช้ Modal สำหรับทุก Interaction

---

# 14. Reduced Motion

เพราะเว็บไซต์มี Train Animation และ Map Animation ควรรองรับ:

```css
@media (prefers-reduced-motion: reduce)
```

เมื่อเปิด Reduced Motion:

- ปิด Train Movement
- ลด Map Animation
- ลด Route Drawing Animation
- Panel เปิดทันที
- State เปลี่ยนโดยไม่ใช้ Transition ที่ไม่จำเป็น

---

# 15. Better Animation Controls

ไม่ควรทำ Control Panel ใหญ่

แนะนำ:

```text
[ ▶ ] [ 1× ] [ ↻ ]
```

และ:

```text
Journey Progress
██████████░░░░░
```

## Controls

### Play

```text
▶
```

### Pause

```text
⏸
```

### Speed

```text
1×
2×
4×
```

### Restart

```text
↻
```

## Important

Route Planning และ Journey Simulation ต้องแยกกัน

```text
Route Found
    ↓
Select Route
    ↓
Start Journey
    ↓
Animation
```

ไม่ควรเริ่ม Animation ทันทีหลัง Find Route

---

# 16. Context-aware Map

Map ควรมีอย่างน้อย 2 Context

## Explore Mode

```text
EXPLORE
```

แสดง:

- Railway Network
- Station
- Line Filter
- Station Details

## Journey Mode

```text
JOURNEY
```

เน้น:

- Selected Route
- Current Station
- Next Station
- Transfer
- Train
- Timeline

ไม่จำเป็นต้องสร้าง Tab ใหญ่เสมอไป สามารถจัดการเป็น State ภายในได้

---

# 17. Map Initial State

เมื่อเปิดเว็บไซต์ครั้งแรก ไม่ควรให้ User เจอ Map ที่เต็มไปด้วยเส้นโดยไม่รู้ว่าต้องทำอะไร

ควรมี Context Cue:

```text
Plan your journey

① Choose stations
② Select your route
③ Start your journey
```

และ Demo Route สามารถใช้เพื่อแสดงให้เห็นว่า Map ทำงานอย่างไร

---

# 18. Do Not Use Geolocation

ไม่ควรเพิ่ม:

```text
📍 Use my location
```

เพียงเพื่อให้เว็บดูมี Feature มากขึ้น

เหตุผล:

- ต้องขอ Browser Permission
- เพิ่ม Privacy UX
- เพิ่ม Edge Cases
- ไม่จำเป็นต่อ Core Journey Planning
- ไม่ได้ช่วย Static Concept อย่างมีนัยสำคัญ

User สามารถเลือก Origin เองได้

---

# 19. Do Not Overuse Modals

## Desktop

ใช้:

```text
Side Panel
```

สำหรับ:

- Station Details
- Line Details
- Route Details

## Mobile

ใช้:

```text
Bottom Sheet
```

## Modal

ควรสงวนไว้สำหรับ:

- About
- Help
- Keyboard Shortcuts
- Important Information

---

# 20. Interaction State Model

ควรออกแบบ State ให้ชัดเจน:

```text
IDLE
 ↓
ORIGIN_SELECTED
 ↓
DESTINATION_SELECTED
 ↓
ROUTE_FOUND
 ↓
ROUTE_SELECTED
 ↓
JOURNEY_READY
 ↓
JOURNEY_RUNNING
 ↓
TRANSFER
 ↓
ARRIVED
```

แต่ละ State ต้องมี UI Action ที่ชัดเจน

---

# 21. UX State Table

| State | Main Message | Primary Action |
|---|---|---|
| IDLE | Plan your journey | Select stations |
| ORIGIN_SELECTED | Choose destination | Select destination |
| DESTINATION_SELECTED | Ready to search | Find Route |
| ROUTE_FOUND | Choose your route | Select Route |
| ROUTE_SELECTED | Journey ready | Start Journey |
| JOURNEY_RUNNING | Next stop | Follow Journey |
| TRANSFER | Change line | Continue |
| ARRIVED | You've arrived | New Journey |

---

# 22. Error UX

## Same Station

```text
Origin and destination are the same.

Please choose a different destination.
```

## No Route

```text
No route found.

Try another pair of stations.
```

## Invalid Station

```text
Station not found.

Try searching by name or station code.
```

## Empty Search

ไม่ควรแสดง Error

แสดง:

```text
Search station...
```

---

# 23. Optional: URL State

Feature นี้เป็น Optional เท่านั้น

สามารถใช้ URL:

```text
/?from=siam&to=phrom-phong
```

เพื่อให้ User แชร์ Journey ได้

ข้อดี:

- Share Link
- Bookmark
- Refresh แล้วยังเปิด Route เดิม

แต่:

> ไม่ถือเป็น Persistent User Data

หากต้องการรักษาแนวคิด Static แบบเรียบที่สุด สามารถไม่ทำ Feature นี้ได้

---

# 24. Responsive UX

## Desktop

```text
┌──────────────┬───────────────────────┐
│ Journey      │                       │
│ Planner      │          MAP          │
│              │                       │
│ Routes       │                       │
│              │                       │
│ Timeline     │                       │
└──────────────┴───────────────────────┘
```

## Tablet

ลด Panel Width และเพิ่ม Map Space

## Mobile

```text
┌─────────────────────┐
│                     │
│        MAP          │
│                     │
├─────────────────────┤
│ Bottom Sheet        │
│ Route Summary       │
│ Primary Action      │
└─────────────────────┘
```

---

# 25. Recommended Component Updates

```text
/components

├── JourneyPlanner.tsx
├── StationSearch.tsx
├── SwapStationsButton.tsx
├── NewJourneyButton.tsx
│
├── RouteList.tsx
├── RouteOption.tsx
├── RouteDetails.tsx
│
├── RailwayMap.tsx
├── MapControls.tsx
├── MapLineFilter.tsx
├── StationNode.tsx
│
├── StationDetails.tsx
├── LineDetails.tsx
│
├── JourneyTimeline.tsx
├── JourneyProgress.tsx
├── TransferInstruction.tsx
├── NextStop.tsx
├── JourneyControls.tsx
│
└── MobileBottomSheet.tsx
```

---

# 26. Recommended UX Utility Functions

```text
/utils

├── getJourneyState.ts
├── getNextStation.ts
├── getRemainingStations.ts
├── getTransferInstruction.ts
├── focusStation.ts
├── focusRoute.ts
└── swapStations.ts
```

หน้าที่:

### `getJourneyState.ts`

กำหนด UI State ปัจจุบัน

### `getNextStation.ts`

หา Station ถัดไป

### `getRemainingStations.ts`

คำนวณจำนวน Station ที่เหลือ

### `getTransferInstruction.ts`

สร้างข้อมูล Transfer จาก Route

### `focusStation.ts`

Focus Map ไปยัง Station

### `focusRoute.ts`

Focus Map ไปยัง Route

### `swapStations.ts`

สลับ Origin / Destination

---

# 27. UX Testing Checklist

## First Visit

- [ ] User รู้ว่าต้องทำอะไรภายในไม่กี่วินาที
- [ ] Map ไม่ดูรกเกินไป
- [ ] Search หาได้ทันที
- [ ] Demo Route เข้าใจง่าย

## Search

- [ ] Thai Search
- [ ] English Search
- [ ] Code Search
- [ ] Keyboard Navigation
- [ ] Clear Search
- [ ] No Result State

## Route

- [ ] Route Summary เข้าใจภายใน 3 วินาที
- [ ] Route Options เปรียบเทียบง่าย
- [ ] Selected State ชัด
- [ ] Transfer ชัด
- [ ] New Journey ทำงาน

## Map

- [ ] Zoom
- [ ] Pan
- [ ] Focus Route
- [ ] Focus Station
- [ ] Line Filter
- [ ] Timeline ↔ Map Sync

## Journey

- [ ] Start
- [ ] Pause
- [ ] Resume
- [ ] Restart
- [ ] Speed
- [ ] Current Station
- [ ] Next Station
- [ ] Remaining Stations
- [ ] Transfer
- [ ] Arrival

## Mobile

- [ ] Bottom Sheet
- [ ] Swipe
- [ ] Touch Target เพียงพอ
- [ ] ไม่เกิด Horizontal Overflow
- [ ] Map ยังใช้งานได้
- [ ] Route Summary ยังอ่านง่าย

---

# 28. Visual Hierarchy Rules

กำหนดลำดับความสำคัญ:

```text
1. Current Journey / Primary Action
2. Route
3. Railway Map
4. Timeline
5. Supporting Information
6. Secondary Controls
```

ไม่ควรทำให้ทุก Card มี Visual Weight เท่ากัน

---

# 29. Avoid Generic AI Dashboard UI

ห้ามออกแบบโดยใช้ Pattern:

```text
Large Heading
↓
4 Statistic Cards
↓
2 Large Cards
↓
Another Card
↓
Another Card
```

เพียงเพราะเป็น Pattern ที่ AI UI Generator สร้างบ่อย

ThaiTransit ต้องมี Visual Hierarchy ตาม User Journey แทน:

```text
WHERE AM I GOING?
        ↓
HOW DO I GET THERE?
        ↓
SHOW ME THE ROUTE
        ↓
GUIDE ME THROUGH IT
```

---

# 30. Final UX Direction

ThaiTransit ควรให้ความรู้สึก:

```text
Navigation Tool
        +
Interactive Map
        +
Journey Simulator
```

ไม่ใช่:

```text
Dashboard
        +
Statistics
        +
Cards
```

User Journey ที่ต้องการ:

```text
Open Website
      ↓
Understand what to do
      ↓
Choose Origin
      ↓
Choose Destination
      ↓
Compare Routes
      ↓
Select Route
      ↓
See Route on Map
      ↓
Start Journey
      ↓
Follow Next Stop
      ↓
Handle Transfer
      ↓
Arrive
      ↓
New Journey
```

---

# 31. Final UX Acceptance Criteria

เว็บไซต์ถือว่า UX ผ่านเมื่อ:

## Discoverability

- [ ] User ใหม่รู้ว่าต้องเริ่มจากตรงไหน
- [ ] Primary Action ชัด
- [ ] ไม่มี UI ที่ไม่รู้ว่ากดทำอะไร

## Efficiency

- [ ] Search เร็ว
- [ ] Keyboard ใช้งานได้
- [ ] Swap Stations ได้
- [ ] Clear Journey ได้
- [ ] Route Comparison อ่านง่าย

## Understanding

- [ ] รู้เวลาเดินทาง
- [ ] รู้จำนวนสถานี
- [ ] รู้ Transfer
- [ ] รู้ Current Station
- [ ] รู้ Next Station

## Navigation

- [ ] Timeline Sync กับ Map
- [ ] Station Sync กับ Timeline
- [ ] Focus Route
- [ ] Focus Station

## Mobile

- [ ] Map เป็นพื้นที่หลัก
- [ ] Bottom Sheet ใช้งานได้
- [ ] Touch Target เหมาะสม
- [ ] ไม่มี Horizontal Overflow

## Accessibility

- [ ] Keyboard Navigation
- [ ] Focus State
- [ ] Screen Reader Labels
- [ ] Reduced Motion
- [ ] ไม่ใช้สีเพียงอย่างเดียวเพื่อสื่อ State

---

# 32. Final Principle

> **Do not add UI because there is empty space. Add UI only when it helps the user understand where they are, what they can do, or what they should do next.**

ThaiTransit ควรมีความรู้สึก:

```text
Simple
        +
Clear
        +
Interactive
        +
Map-first
        +
Journey-focused
```

เป้าหมายไม่ใช่ให้เว็บไซต์มี Feature เยอะที่สุด

เป้าหมายคือ:

> **ทำให้การวางแผนและการทำความเข้าใจ Journey รถไฟไทยเป็นเรื่องง่ายที่สุด โดยใช้ UI ให้น้อยที่สุดเท่าที่จำเป็น**