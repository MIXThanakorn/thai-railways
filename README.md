# 🚆 ThaiTransit — Bangkok Mass Transit Route Visualizer & Planner

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Static Ready](https://img.shields.io/badge/Deployment-100%25_Static-success?style=flat-square)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

**ThaiTransit** คือเว็บแอปพลิเคชันแบบ Interactive สำหรับค้นหาเส้นทาง คำนวณเวลาเดินทาง และจำลองการเคลื่อนที่ของขบวนรถไฟฟ้าในเขตกรุงเทพมหานครและปริมณฑล (Bangkok Mass Rapid Transit Network) ครอบคลุมทั้ง 10 เส้นทาง 180+ สถานีอย่างครบถ้วน ออกแบบตามแผนผังมาตรฐานทางการ (Official Octolinear Schematic Map) พร้อมฟังก์ชันการทำงานแบบ **100% Client-Side Static Frontend**

</div>

---

## ✨ ฟีเจอร์เด่น (Key Features)

### 1. 🗺️ Official Standard Schematic Map (แผนที่เวกเตอร์มาตรฐานสากล)
- โครงสร้างแผนที่เรขาคณิตแบบ **45° / 90° Octolinear Grid** ตรงตามผังทางการของรถไฟฟ้ากรุงเทพฯ
- แสดงจุดเชื่อมต่อสถานี (Interchange Capsules) และสถานีร่วมอย่างแม่นยำ เช่น สยาม, อโศก/สุขุมวิท, ศาลาแดง/สีลม, เตาปูน, บางซ่อน, บางซื่อ/สถานีกลางกรุงเทพอภิวัฒน์, ห้าแยกลาดพร้าว/พหลโยธิน, หมอชิต/สวนจตุจักร, ลาดพร้าว, หัวหมาก, สำโรง, บางหว้า, ท่าพระ
- รองรับการลากเลื่อน (Pan), ซูมด้วยเมาส์/สัมผัส (Zoom), และโหมดขยายเต็มจอ

### 2. 🎯 Focus Route (โฟกัสเส้นทางอัตโนมัติ)
- ซูมและจัดกึ่งกลางมุมมองแผนที่เข้าหากรอบสถานีต้นทาง-ปลายทาง (Bounding Box with 20% Margin) อัตโนมัติเมื่อค้นหาหรือเลือกเส้นทาง
- มีปุ่ม **Focus Route (เป้าเล็ง)** บนแถบควบคุมแผนที่ เพื่อให้กลับมาโฟกัสเส้นทางที่เลือกได้ทุกเมื่อ

### 3. ⚡ Route Preference (ตัวเลือกจัดลำดับเส้นทาง)
- เลือกลำดับความสำคัญในการเดินทางได้ 3 รูปแบบ:
  - ⚡ **เร็วที่สุด (Fastest)**: จัดอันดับตามเวลาเดินทางโดยประมาณ
  - 🔄 **เปลี่ยนสายน้อย (Fewest Transfers)**: จัดอันดับตามจำนวนการต่อสาย
  - 🚉 **สถานีน้อยที่สุด (Fewest Stations)**: จัดอันดับตามจำนวนสถานีที่ผ่าน
- จัดเรียงผลลัพธ์แบบเรียลไทม์ทันทีโดยไม่ต้องโหลดหน้าใหม่

### 4. 📊 Route Comparison (การ์ดเปรียบเทียบตัวเลือกเส้นทาง)
- แสดงการ์ดเปรียบเทียบเส้นทางแนะนำ (Recommended) และเส้นทางทางเลือก (Alternatives)
- แสดงเวลาเดินทาง, จำนวนสถานี, จุดเปลี่ยนสาย, ป้ายสีของสายรถไฟฟ้าที่ใช้ และ **ค่าโดยสารประมาณการ (Estimated Fare ฿)**
- คลิกสลับเส้นทางแล้วแผนที่, ไทม์ไลน์ และสถานะการจำลองจะซิงค์ตามทันที

### 5. 🎛️ Line Filter (ฟิลเตอร์กรองระบบรถไฟฟ้า)
- ปุ่มฟิลเตอร์บนแผนที่: `[ ทั้งหมด ]` `[ BTS ]` `[ MRT ]` `[ ARL ]` `[ SRT สายสีแดง ]`
- ช่วยให้เลือกสำรวจระบบรถไฟฟ้าที่สนใจ โดยสายที่ไม่ถูกเลือกจะลดความเด่นลง แต่เส้นทางที่ค้นหาอยู่จะสว่างเด่นชัดเสมอ

### 6. 🚉 Enhanced Station Interaction (การโต้ตอบสถานี)
- คลิกสถานีใดๆ บนแผนที่เพื่อเปิดหน้าต่างข้อมูลสถานี:
  - ปุ่ม **[ เดินทางจากที่นี่ (From here) ]** เพื่อตั้งเป็นต้นทาง
  - ปุ่ม **[ ไปที่นี่ (To here) ]** เพื่อตั้งเป็นปลายทาง
  - แสดงสิ่งอำนวยความสะดวก (ลิฟต์โดยสาร 🛗, ทางลาดคนพิการ ♿, อาคารจอดแล้วจร 🚗, สกายวอล์ก 🚶)
  - คลิกที่สายรถไฟฟ้าเพื่อดูรายละเอียดสายนั้นๆ ได้ทันที
  - ระบบตรวจสอบป้องกันการเลือกสถานีเดียวกันเป็นทั้งต้นทางและปลายทาง

### 7. 🚆 Live Journey Simulation (จำลองการเดินทางเสมือนจริง)
- จำลองการเคลื่อนที่ของขบวนรถไฟทีละสถานี พร้อมตัวบอกสถานะ
- ควบคุมการเล่นได้: Play / Pause / Restart และปรับความเร็วได้ `0.5x`, `1x`, `2x`, `4x`
- แจ้งเตือนจุดเปลี่ยนสาย (Transfer Alert Modal) อัตโนมัติเมื่อขบวนรถถึงสถานีเชื่อมต่อ

### 8. 📱 Mobile-First Full Map & Bottom Sheet
- บนมือถือ แผนที่จะแสดงผล **เต็มจอ (Edge-to-Edge 100dvh)**
- แผงควบคุมลอยด้านล่าง (**Interactive Bottom Sheet**) ยุบเก็บเป็นแถบสรุปสั้นๆ และรูดขึ้นมาดูรายละเอียด/เลือกสถานีได้อย่างสะดวกสบาย

### 9. 🚀 100% Static Client-Side Architecture
- ไม่มีการใช้ Backend, Database, Authentication หรือ API ภายนอก
- ไม่มีการเก็บข้อมูลผู้ใช้ลง LocalStorage หรือ Cookies (Session-only State) ปลอดภัยและโหลดรวดเร็ว

---

## 🚇 สายรถไฟฟ้าที่รองรับ (10 Lines · 180+ Stations)

| สายรถไฟฟ้า | ชื่อระบบ | ผู้ให้บริการ | สีประจำสาย | จำนวนสถานี |
|---|---|---|:---:|:---:|
| **สายสุขุมวิท (Light Green)** | BTS Sukhumvit Line | BTS | `#75B832` | 47 |
| **สายสีลม (Dark Green)** | BTS Silom Line | BTS | `#007B5F` | 14 |
| **สายสีทอง (Gold Line)** | BTS Gold Line | BTS | `#C9920E` | 3 |
| **สายเฉลิมรัชมงคล (Blue Line)** | MRT Blue Line | BEM / MRT | `#193E94` | 38 |
| **สายฉลองรัชธรรม (Purple Line)** | MRT Purple Line | BEM / MRT | `#6F2C91` | 16 |
| **สายสีเหลือง (Yellow Line)** | MRT Yellow Line | EBM / MRT | `#FDB813` | 23 |
| **สายสีชมพู (Pink Line)** | MRT Pink Line | NBM / MRT | `#EC6B9E` | 30 |
| **แอร์พอร์ต เรล ลิงก์ (Airport Rail Link)** | ARL | SRTET | `#7E1E2C` | 8 |
| **สายสีแดงเข้ม (Dark Red Line)** | SRT Dark Red Line | SRT | `#C8102E` | 10 |
| **สายสีแดงอ่อน (Light Red Line)** | SRT Light Red Line | SRT | `#D6334D` | 4 |

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Static Export Ready)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **UI & Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Effects**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Map Rendering**: SVG Native Vector with Dynamic ViewBox

---

## 🚀 การติดตั้งและรันโปรเจกต์ (Getting Started)

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. รันโหมด Development
```bash
npm run dev
```
เปิดเบราว์เซอร์ไปที่ `http://localhost:3000` (หรือพอร์ตที่ระบบกำหนด เช่น `http://localhost:3001`)

### 3. Build สำหรับ Production / Static Deploy
```bash
npm run build
```

---

## 📁 โครงสร้างโปรเจกต์ (Project Structure)

```text
thai-railways/
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root Layout & Metadata
│   │   ├── page.tsx           # หน้าเว็บหลักและการจัดการ State
│   │   ├── not-found.tsx      # หน้า 404 Not Found
│   │   └── globals.css        # สไตล์และ Design Tokens
│   ├── components/
│   │   ├── Header.tsx         # เมนูด้านบน
│   │   ├── map/
│   │   │   ├── RailwayMap.tsx # แผนที่ SVG Interactive Vector
│   │   │   ├── TrainMarker.tsx# ตัวรถไฟจำลองการเคลื่อนที่
│   │   │   ├── MapControls.tsx# ปุ่มควบคุม Zoom/Reset/Focus/Fullscreen
│   │   │   └── MapLineFilter.tsx # แถบฟิลเตอร์กรองสายรถไฟฟ้า
│   │   ├── mobile/
│   │   │   └── MobileBottomSheet.tsx # แผงควบคุมลอยสำหรับจอมือถือ
│   │   ├── planner/
│   │   │   ├── StationSelector.tsx    # กล่องเลือกต้นทาง-ปลายทาง
│   │   │   ├── RoutePreference.tsx    # ตัวเลือกจัดลำดับ (Fastest/Transfers/Stations)
│   │   │   ├── RouteComparison.tsx    # การ์ดเปรียบเทียบตัวเลือกเส้นทาง
│   │   │   ├── RouteSummary.tsx       # กล่องสรุปผลการเดินทาง
│   │   │   ├── RouteTimeline.tsx      # ไทม์ไลน์ลำดับสถานี
│   │   │   ├── JourneyControls.tsx    # แผงควบคุมการจำลองรถไฟ
│   │   │   ├── StationSearchModal.tsx # หน้าต่างค้นหาสถานี
│   │   │   └── TransferAlertModal.tsx # แจ้งเตือนจุดเปลี่ยนสาย
│   │   └── details/
│   │       ├── StationDetailsModal.tsx# รายละเอียดสถานี พร้อมปุ่ม From/To here
│   │       ├── LinesDrawer.tsx        # รายชื่อสายรถไฟฟ้าทั้งหมด
│   │       └── AboutModal.tsx         # ข้อมูลระบบ
│   ├── data/
│   │   ├── stations.ts        # ฐานข้อมูลสถานี พิกัดกริด และสิ่งอำนวยความสะดวก
│   │   ├── lines.ts           # ฐานข้อมูลสายรถไฟฟ้าและสีประจำสาย
│   │   ├── network.ts         # เส้นทางตัวอย่างยอดนิยม
│   │   └── river.ts           # เวกเตอร์แม่น้ำเจ้าพระยาและคลอง
│   ├── types/
│   │   └── railway.ts         # Type Definitions
│   └── utils/
│       ├── calculateRoute.ts      # Dijkstra Graph Router Engine
│       ├── rankRoutes.ts          # การจัดอันดับตาม Route Preference
│       ├── calculateRouteBounds.ts# การคำนวณ Bounding Box สำหรับ Focus Route
│       ├── filterRailwayLines.ts  # ตัวช่วยกรองระบบรถไฟฟ้า
│       └── calculateTravelTime.ts # การคำนวณเวลาและค่าโดยสาร
├── docs/
│   └── ThaiTransit_Static_Feature_Expansion.md # Specification
├── package.json
└── tailwind.config.ts
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
