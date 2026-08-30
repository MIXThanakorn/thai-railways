# ThaiTransit --- Static Feature Expansion

## Purpose

Specification สำหรับเพิ่มฟีเจอร์ให้ ThaiTransit โดยรักษาเงื่อนไขว่าเป็น **Static
Frontend 100%**: ไม่มี Backend, Database, Authentication, API ที่จำเป็น, User
Account, LocalStorage, Session Storage หรือการบันทึกข้อมูลผู้ใช้

ฟีเจอร์ทั้งหมดต้องทำงานจาก Static Railway Data + Client-side React State +
Route Algorithm + SVG Map

------------------------------------------------------------------------

# 1. Feature Scope

## MUST HAVE

1.  Focus Route
2.  Route Preference
3.  Route Comparison Enhancement
4.  Line Filter

## SHOULD HAVE

5.  Enhanced Station Interaction

## OPTIONAL

6.  Estimated Fare
7.  Station Facilities
8.  Accessibility Information

Optional features ต้องแสดงเฉพาะเมื่อมีข้อมูลใน Static Data เท่านั้น
ห้ามสร้างข้อมูลเฉพาะเจาะจงขึ้นมาเอง

------------------------------------------------------------------------

# 2. Focus Route

## คืออะไร

ทำให้ Map โฟกัสเฉพาะ Route ที่ User เลือก โดย:

-   Center Map ไปยัง Route
-   Zoom ให้เห็น Origin → Destination
-   Highlight Route
-   Dim เส้นทางอื่น
-   เน้น Origin / Destination / Transfer
-   ไม่เปลี่ยน Route Result หรือ Timeline

UI:

``` text
[ + ]
[ - ]
[ Reset ]
[ Focus Route ]
```

## วิธีทำ

สร้าง:

``` ts
focusRoute(route: RouteResult): void
```

รวบรวมตำแหน่ง Station ใน Route แล้วคำนวณ:

``` text
minX
maxX
minY
maxY
centerX = (minX + maxX) / 2
centerY = (minY + maxY) / 2
```

คำนวณ Zoom จากขนาด Route และ Viewport โดยเว้น Margin ประมาณ 10--15%

Flow:

``` text
Selected Route
      ↓
Calculate Route Bounds
      ↓
Calculate Center + Zoom
      ↓
Animate Map View
      ↓
Show Complete Route
```

แนะนำ Animation 200--400ms

## Acceptance Criteria

-   [ ] Focus Route ทำงานจริง
-   [ ] Route อยู่ใน Viewport
-   [ ] Origin / Destination / Transfer มองเห็นได้
-   [ ] ไม่เปลี่ยน Route Data
-   [ ] ใช้ได้บน Desktop และ Mobile
-   [ ] ไม่ใช้ Backend

------------------------------------------------------------------------

# 3. Route Preference

## คืออะไร

ให้ User เลือกวิธีจัดอันดับ Route:

``` text
⚡ Fastest
🔄 Fewest Transfers
🚉 Fewest Stations
```

ไม่ต้องบันทึก Preference และเมื่อ Refresh ให้กลับ Default

## Data Model

``` ts
type RoutePreference =
  | "fastest"
  | "fewest-transfers"
  | "fewest-stations"

const DEFAULT_ROUTE_PREFERENCE: RoutePreference = "fastest"
```

## วิธีทำ

แยกการสร้าง Route ออกจากการจัดอันดับ:

``` text
calculateRoutes(origin, destination)
        ↓
Candidate Routes
        ↓
rankRoutes(routes, preference)
        ↓
Sorted Routes
```

### Fastest

``` text
estimatedMinutes
↓
transfers
↓
stationCount
```

### Fewest Transfers

``` text
transfers
↓
estimatedMinutes
↓
stationCount
```

### Fewest Stations

``` text
stationCount
↓
transfers
↓
estimatedMinutes
```

Preference เป็นเพียงการจัดลำดับ Candidate Routes ไม่ใช่การสร้าง Network ใหม่

## Acceptance Criteria

-   [ ] เปลี่ยน Preference ได้
-   [ ] Route List เรียงใหม่ทันที
-   [ ] Map Sync กับ Route ที่เลือก
-   [ ] Timeline Sync
-   [ ] Animation ใช้ Route ใหม่
-   [ ] ไม่ Persist Preference
-   [ ] ไม่มี LocalStorage
-   [ ] ไม่มี Backend

------------------------------------------------------------------------

# 4. Route Comparison Enhancement

โปรเจกต์มี Alternative Routes อยู่แล้ว ฟีเจอร์นี้เป็นการปรับให้เปรียบเทียบได้ง่ายขึ้น
ไม่ใช่ระบบใหม่

ตัวอย่าง:

``` text
Routes

┌────────────────────────────────┐
│ ⚡ FASTEST                     │
│                                │
│ 13 min                         │
│ 6 stations · 0 transfers       │
│ ฿30 estimated                  │
│                                │
│ [ Select Route ]               │
└────────────────────────────────┘

┌────────────────────────────────┐
│ 🔄 FEWER TRANSFERS              │
│                                │
│ 17 min                         │
│ 8 stations · 0 transfers       │
│ ฿30 estimated                  │
└────────────────────────────────┘
```

แต่ละ Route ควรแสดง:

-   Route label
-   Estimated time
-   Station count
-   Transfer count
-   Railway lines
-   Fare เมื่อมีข้อมูล
-   Station sequence แบบย่อ

เมื่อเลือก Route ใหม่:

``` text
Select Route
     ↓
Map Update
     ↓
Summary Update
     ↓
Timeline Update
     ↓
Animation Reset
```

ห้ามสร้าง Alternative Route แบบสุ่มหรือเดาข้อมูล

## Acceptance Criteria

-   [ ] แสดงหลาย Route เมื่อมีจริง
-   [ ] เลือก Route อื่นได้
-   [ ] Map Update
-   [ ] Timeline Update
-   [ ] Summary Update
-   [ ] Animation Reset
-   [ ] ไม่มีข้อมูลปลอม

------------------------------------------------------------------------

# 5. Line Filter

## คืออะไร

ให้ User เลือก Railway System / Line ที่ต้องการดูบน Map

ตัวอย่าง:

``` text
LINES

[ All ]

BTS
MRT
ARL
SRT
```

หรือ Desktop:

``` text
[ All ] [ BTS ] [ MRT ] [ ARL ] [ SRT ]
```

## วิธีทำ

ใช้ข้อมูลจาก:

``` text
/data/lines.ts
```

ไม่สร้าง Dataset ใหม่

เมื่อเลือก Line:

``` text
Selected Line
opacity: 1

Other Lines
opacity: 0.15–0.30
```

Station ที่เกี่ยวข้องกับ Line คงความชัดเจน ส่วน Station อื่นลดความเด่นได้

## สำคัญ

ถ้ามี Active Route ห้าม Filter ทำให้ Route หาย

``` text
Active Route
████████████

Other Lines
░░░░░░░░░░
```

เมื่อไม่มี Active Route จึงสามารถใช้ Filter เป็นโหมดสำรวจ Network ได้เต็มที่

## Acceptance Criteria

-   [ ] All แสดง Network
-   [ ] เลือก Line ได้
-   [ ] Selected Line เด่น
-   [ ] Other Lines ลด Opacity
-   [ ] Active Route ไม่หาย
-   [ ] Station Interaction ยังทำงาน
-   [ ] Zoom/Pan ยังทำงาน
-   [ ] Mobile ใช้งานได้

------------------------------------------------------------------------

# 6. Enhanced Station Interaction

## คืออะไร

ทำให้ Station เป็นจุดเริ่มต้นของการค้นหา Route ได้ ไม่ใช่เพียงข้อมูลประกอบ

เมื่อ Click / Tap Station:

``` text
Station
   ↓
Station Details
   ↓
From Here / To Here / View Line
```

ตัวอย่าง:

``` text
┌────────────────────────────┐
│ SIAM                       │
│ สยาม                       │
│ CEN                        │
│                            │
│ Interchange Station        │
│                            │
│ ● Sukhumvit Line           │
│ ● Silom Line               │
│                            │
│ [ From here ]              │
│ [ To here ]                │
└────────────────────────────┘
```

## From Here

``` text
Click From Here
      ↓
origin = selectedStation
      ↓
Close Station Panel
      ↓
Focus Destination Input
```

## To Here

``` text
Click To Here
      ↓
destination = selectedStation
      ↓
Close Station Panel
      ↓
Focus Origin Input
```

## Same Station

ถ้า Origin และ Destination เป็นสถานีเดียวกัน:

``` text
Please select different stations.
```

ห้ามคำนวณ Route

## Station → Line

ถ้า Station อยู่หลาย Line:

``` text
Siam

● Sukhumvit Line
● Silom Line
```

Click Line → เปิด Line Details

Navigation จึงเชื่อมกัน:

``` text
Map
 ↓
Station
 ↓
Line
 ↓
Station
```

------------------------------------------------------------------------

# 7. Optional: Estimated Fare

แสดงค่าโดยสารเมื่อมีข้อมูล Static ที่เชื่อถือได้

``` text
Estimated fare
฿30
```

หากไม่มีข้อมูลจริง ให้ไม่แสดง

ต้องใช้คำว่า:

> Estimated

ห้ามเดาราคาเพื่อให้ UI ดูสมจริง

สามารถสร้าง:

``` ts
calculateEstimatedFare(route)
```

แต่ต้องมี Fare Data รองรับก่อน

------------------------------------------------------------------------

# 8. Optional: Station Facilities

ใช้ข้อมูล `facilities` ที่มีอยู่ใน Station Data Model

ตัวอย่าง:

``` text
Facilities

♿ Accessibility
🛗 Elevator
🚻 Restroom
🏧 ATM
```

ถ้าไม่มีข้อมูล:

``` ts
facilities: undefined
```

UI ต้องไม่สร้างรายการขึ้นมาเอง

------------------------------------------------------------------------

# 9. Optional: Accessibility Information

แสดงข้อมูล Accessibility เมื่อมีข้อมูลจริง เช่น:

``` text
Accessibility

♿ Step-free access
🛗 Elevator
```

ยังไม่ควรทำ Accessibility Route Optimization จนกว่าจะมีข้อมูล Accessibility
ของสถานีที่ครบเพียงพอ

------------------------------------------------------------------------

# 10. State Management

ใช้ Client-side State เท่านั้น

ตัวอย่าง:

``` ts
type TransitUIState = {
  origin: string | null
  destination: string | null
  selectedRoute: RouteResult | null
  routePreference: RoutePreference
  selectedLineId: string | null
  selectedStationId: string | null
  isJourneyRunning: boolean
}
```

ใช้ React State, Context หรือ Zustand ได้หากโปรเจกต์ใช้อยู่แล้ว

แต่ State ต้องไม่ถูก Persist

------------------------------------------------------------------------

# 11. No Persistence Rule

Behavior ต้องเป็น Session-only:

``` text
Open Website
    ↓
Select Stations
    ↓
Choose Preference
    ↓
Filter Line
    ↓
Refresh
    ↓
Return to Default State
```

ห้ามเพิ่ม:

``` text
localStorage
sessionStorage
IndexedDB
User Cookies สำหรับ State
Cloud Database
User Account
```

------------------------------------------------------------------------

# 12. Component Structure

เพิ่ม Component:

``` text
/components

├── RoutePreference.tsx
├── RouteOption.tsx
├── RouteComparison.tsx
├── MapLineFilter.tsx
├── StationDetails.tsx
├── MapControls.tsx
└── MobileBottomSheet.tsx
```

------------------------------------------------------------------------

# 13. Utility Structure

``` text
/utils

├── calculateRoute.ts
├── rankRoutes.ts
├── calculateTravelTime.ts
├── calculateRouteBounds.ts
├── calculateMapViewport.ts
└── filterRailwayLines.ts
```

หน้าที่:

-   `calculateRoute.ts` --- สร้าง Candidate Routes
-   `rankRoutes.ts` --- จัดอันดับตาม Preference
-   `calculateTravelTime.ts` --- Estimated Travel Time
-   `calculateRouteBounds.ts` --- หา Bounding Box
-   `calculateMapViewport.ts` --- Center + Zoom
-   `filterRailwayLines.ts` --- จัดการ Line Filter

------------------------------------------------------------------------

# 14. Implementation Order

## Phase 1 --- Route UX

1.  Route Preference
2.  Route Comparison Enhancement
3.  Route Selection Synchronization

## Phase 2 --- Map UX

4.  Focus Route
5.  Line Filter
6.  Map State Synchronization

## Phase 3 --- Station UX

7.  Enhanced Station Details
8.  From Here
9.  To Here
10. Station → Line Navigation

## Phase 4 --- Optional Data

11. Estimated Fare
12. Station Facilities
13. Accessibility Information

------------------------------------------------------------------------

# 15. Testing Checklist

## Station

-   [ ] Thai Search
-   [ ] English Search
-   [ ] Station Code Search
-   [ ] Click / Tap Station
-   [ ] From Here
-   [ ] To Here
-   [ ] Same Station Validation

## Route

-   [ ] Calculate Route
-   [ ] Recommended Route
-   [ ] Alternative Routes
-   [ ] Select Alternative
-   [ ] Route Preference
-   [ ] Correct Ranking

## Map

-   [ ] Zoom
-   [ ] Pan
-   [ ] Reset
-   [ ] Focus Route
-   [ ] Line Filter
-   [ ] Station Click
-   [ ] Route Highlight

## Journey

-   [ ] Start
-   [ ] Pause
-   [ ] Resume
-   [ ] Restart
-   [ ] Speed
-   [ ] Timeline Sync
-   [ ] Transfer State
-   [ ] Arrival State

## Responsive

Test:

``` text
1920x1080
1440x900
1366x768
1024x1366
768x1024
430x932
390x844
375x812
```

ตรวจสอบ:

-   [ ] ไม่มี Horizontal Overflow
-   [ ] ไม่มี Console Errors
-   [ ] ไม่มี Broken Interaction
-   [ ] Map Smooth
-   [ ] Mobile Controls ใช้งานได้

------------------------------------------------------------------------

# 16. Explicitly Do NOT Add

เพื่อรักษา Static Architecture ห้ามเพิ่มโดยอัตโนมัติ:

``` text
❌ Login
❌ Register
❌ User Account
❌ Database
❌ Backend
❌ API Server
❌ Cloud Sync
❌ Favorites
❌ Route History
❌ Saved Preferences
❌ Notifications
❌ User Profiles
❌ Reviews
❌ Community Features
❌ Real-time Train Tracking
❌ Live Train ETA
❌ Live Service Alerts
❌ Live Timetable
```

ถ้าจะเพิ่มสิ่งเหล่านี้ต้องเป็น Requirement ใหม่โดยเฉพาะ

------------------------------------------------------------------------

# 17. Final Product Architecture

ระบบสุดท้ายควรเป็น:

``` text
                    THAITRANSIT
                         │
          ┌──────────────┼──────────────┐
          │              │              │
      Station         Route          Railway
       Search        Planner           Map
          │              │              │
          │        ┌─────┴─────┐        │
          │        │           │        │
          │     Preference  Comparison  │
          │        │           │        │
          └────────┴─────┬─────┴────────┘
                         │
                  Route Visualization
                         │
              ┌──────────┼──────────┐
              │          │          │
           Timeline   Transfer   Animation
              │          │          │
              └──────────┼──────────┘
                         │
                    Destination
```

------------------------------------------------------------------------

# 18. Final Principle

> **เพิ่มฟีเจอร์เฉพาะที่ช่วยให้ User เข้าใจหรือใช้งานเครือข่ายรถไฟได้เร็วขึ้น**

อย่าเพิ่ม Feature เพียงเพื่อให้โปรเจกต์ดูใหญ่

ThaiTransit ควรเป็น:

``` text
Static
+
Interactive
+
Data-driven
+
Map-first
+
Easy to understand
```

ไม่ใช่:

``` text
Dashboard
+
Account System
+
Backend
+
User Data
```

เป้าหมายสุดท้ายคือ:

> **A polished static railway navigation and journey visualization
> tool.**
