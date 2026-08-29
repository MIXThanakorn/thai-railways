# 🚆 ThaiTransit — Thailand Railway Route Visualizer

<div align="center">

<!-- 📷 วางรูปภาพแบนเนอร์หลักของโปรเจกต์ที่นี่ -->
<img src="https://via.placeholder.com/1200x600/17202A/FFFFFF?text=ThaiTransit+Railway+Route+Visualizer" alt="ThaiTransit Banner" width="100%" />

<br/>
<br/>

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Static Ready](https://img.shields.io/badge/Deployment-100%25_Static-success?style=flat-square)]()

**ThaiTransit** คือเว็บแอปพลิเคชันแบบ Interactive สำหรับค้นหาเส้นทาง คำนวณเวลาเดินทาง และจำลองการเคลื่อนที่ของขบวนรถไฟฟ้าในเขตกรุงเทพมหานครและปริมณฑล (BMR Mass Transit Network) ครอบคลุมทั้ง 10 เส้นทางอย่างครบถ้วน

</div>

---

## 📸 ภาพตัวอย่างการใช้งาน (Screenshots)

<div align="center">
  <table>
    <tr>
      <td width="50%" align="center">
        <!-- 📷 วางรูปภาพหน้าจอ Desktop / แผนที่หลักที่นี่ -->
        <img src="https://via.placeholder.com/600x400/F5F7F9/17202A?text=Desktop+Route+Planner+%26+Map" alt="Desktop Interface" width="100%" />
        <br />
        <em>🖥️ หน้าจอหลัก: ค้นหาเส้นทางและแผนที่แบบ Interactive</em>
      </td>
      <td width="50%" align="center">
        <!-- 📷 วางรูปภาพหน้าจอจำลองการเดินทาง / Animation ที่นี่ -->
        <img src="https://via.placeholder.com/600x400/17202A/FFFFFF?text=Journey+Simulation+%26+Train+Marker" alt="Journey Simulation" width="100%" />
        <br />
        <em>🚆 ระบบจำลองการเคลื่อนที่ของขบวนรถไฟทีละสถานี</em>
      </td>
    </tr>
    <tr>
      <td width="50%" align="center">
        <!-- 📷 วางรูปภาพหน้าจอแจ้งเตือนเปลี่ยนสาย (Transfer Modal) ที่นี่ -->
        <img src="https://via.placeholder.com/600x400/FFFBEB/92400E?text=Transfer+Alert+Modal" alt="Transfer Alert" width="100%" />
        <br />
        <em>🔄 การแจ้งเตือนจุดเปลี่ยนสาย (Transfer Point)</em>
      </td>
      <td width="50%" align="center">
        <!-- 📷 วางรูปภาพหน้าจอมือถือ (Mobile View) ที่นี่ -->
        <img src="https://via.placeholder.com/300x500/FFFFFF/17202A?text=Mobile+Responsive+View" alt="Mobile Responsive View" width="50%" />
        <br />
        <em>📱 การแสดงผลสมบูรณ์แบบบนสมาร์ตโฟน</em>
      </td>
    </tr>
  </table>
</div>

---

## ✨ ฟีเจอร์เด่น (Key Features)

- 🗺️ **Interactive Vector Schematic Map**: แผนที่เวกเตอร์ SVG ความละเอียดสูง ครอบคลุมแม่น้ำเจ้าพระยาและเส้นทางรถไฟฟ้า 10 สาย รองรับการลากเลื่อน (Pan), ซูม (Zoom), ย่อ-ขยายอัตโนมัติ (Dynamic Auto-Fit) และโหมดเต็มจอ
- 🧭 **Intelligent Route Finder**: คำนวณเส้นทางด้วย **Dijkstra Algorithm** พร้อมคำนวณเวลาเดินเปลี่ยนสาย ค้นหาได้ทั้งชื่อไทย ภาษาอังกฤษ หรือรหัสสถานี (เช่น *Siam, CEN, อโศก, ดอนเมือง, สุวรรณภูมิ*)
- ⚡ **Fastest & Alternative Routes**: เปรียบเทียบเส้นทางที่เร็วที่สุด (Fastest) กับเส้นทางทางเลือก (Alternative Routes) พร้อมแสดงจำนวนสถานี, เวลาเดินทางโดยประมาณ และค่าโดยสาร
- 🚆 **Live Journey Simulation**: จำลองการวิ่งของรถไฟทีละสถานี มีปุ่ม Play / Pause / Restart และปรับสปีดได้ตั้งแต่ `0.5x`, `1x`, `2x`, ถึง `4x`
- 🔄 **Transfer Navigation**: รถไฟจะหยุดพักและแสดงกล่องแนะนำการเปลี่ยนสายอัตโนมัติเมื่อถึงสถานีเชื่อมต่อ
- 📋 **Station & Line Details**: ดูข้อมูลสถานี สิ่งอำนวยความสะดวก (ลิฟต์, ทางเชื่อม, จุดจอดแล้วจร) และสำรวจสายรถไฟฟ้าทั้งหมด
- 📱 **Mobile-First Responsive**: ปรับการแสดงผลให้เข้ากับทุกขนาดหน้าจอ ทั้ง Desktop, Tablet และ Mobile
- 🚀 **100% Static Client-Side**: ทำงานได้ทันทีโดยไม่ต้องพึ่งพา Backend หรือ Database รองรับการ Deploy บน GitHub Pages, Vercel, Netlify

---

## 🚇 สายรถไฟฟ้าที่รองรับ (Supported Transit Lines)

| สายรถไฟฟ้า | ชื่อภาษาอังกฤษ | ผู้ให้บริการ | สีประจำสาย | จำนวนสถานี |
|---|---|---|:---:|:---:|
| **สายสุขุมวิท** | BTS Sukhumvit Line | BTS | `#75B832` | 47 |
| **สายสีลม** | BTS Silom Line | BTS | `#007B5F` | 14 |
| **สายสีทอง** | BTS Gold Line | BTS | `#C9920E` | 3 |
| **สายเฉลิมรัชมงคล (สายสีน้ำเงิน)** | MRT Blue Line | BEM / MRT | `#193E94` | 38 |
| **สายฉลองรัชธรรม (สายสีม่วง)** | MRT Purple Line | BEM / MRT | `#6F2C91` | 16 |
| **สายสีเหลือง** | MRT Yellow Line | EBM / MRT | `#FDB813` | 23 |
| **สายสีชมพู** | MRT Pink Line | NBM / MRT | `#EC6B9E` | 30 |
| **รถไฟฟ้าแอร์พอร์ต เรล ลิงก์** | Airport Rail Link (ARL) | SRTET | `#7E1E2C` | 8 |
| **สายสีแดงเข้ม** | SRT Dark Red Line | SRT | `#C8102E` | 10 |
| **สายสีแดงอ่อน** | SRT Light Red Line | SRT | `#D6334D` | 4 |

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Static Export)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI & Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Effects**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Map Rendering**: Native SVG with ViewBox coordinate projection

---

## 🚀 เริ่มต้นใช้งาน (Getting Started)

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. รันในโหมด Development
```bash
npm run dev
```
เปิดเบราว์เซอร์แล้วเข้าไปที่ `http://localhost:3000`

### 3. Build สำหรับการ Deploy แบบ Static
```bash
npm run build
```
ไฟล์ Static ทั้งหมดจะถูกสร้างไว้ในโฟลเดอร์ `out/` พร้อมสำหรับนำไป Deploy ได้ทันที

---

## 📁 โครงสร้างโปรเจกต์ (Project Structure)

```text
thai-railways/
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root Layout & Metadata
│   │   ├── page.tsx           # หน้าเว็บหลักและการจัดการ State
│   │   └── globals.css        # สไตล์และ Design Tokens
│   ├── components/
│   │   ├── Header.tsx         # เมนูด้านบน
│   │   ├── map/
│   │   │   ├── RailwayMap.tsx # แผนที่ SVG Interactive
│   │   │   ├── TrainMarker.tsx# ตัวรถไฟจำลองการเคลื่อนที่
│   │   │   └── MapControls.tsx# ปุ่มควบคุม Zoom/Reset/Fullscreen
│   │   ├── planner/
│   │   │   ├── StationSelector.tsx    # กล่องเลือกต้นทาง-ปลายทาง
│   │   │   ├── StationSearchModal.tsx # หน้าต่างค้นหาสถานี
│   │   │   ├── RouteSummary.tsx       # กล่องสรุปผลการเดินทาง
│   │   │   ├── RouteTimeline.tsx      # ลำดับสถานีและการเดินทาง
│   │   │   ├── JourneyControls.tsx    # แผงควบคุมการจำลองรถไฟ
│   │   │   └── TransferAlertModal.tsx # แจ้งเตือนจุดเปลี่ยนสาย
│   │   └── details/
│   │       ├── StationDetailsModal.tsx# รายละเอียดสถานี
│   │       ├── LinesDrawer.tsx        # รายชื่อสายรถไฟฟ้าทั้งหมด
│   │       └── AboutModal.tsx         # คู่มือและข้อมูลระบบ
│   ├── data/
│   │   ├── stations.ts        # ฐานข้อมูลสถานี พิกัด และสิ่งอำนวยความสะดวก
│   │   ├── lines.ts           # ฐานข้อมูลสายรถไฟฟ้าและสีประจำสาย
│   │   ├── network.ts         # เส้นทางยอดนิยมและฟังก์ชันช่วยเหลือ
│   │   └── river.ts           # เวกเตอร์แม่น้ำเจ้าพระยา
│   ├── types/
│   │   └── railway.ts         # Type Definitions
│   └── utils/
│       ├── calculateRoute.ts  # Dijkstra Graph Router Engine
│       └── calculateTravelTime.ts # การคำนวณเวลาและค่าโดยสาร
├── package.json
└── tailwind.config.ts
```

---

## 📄 License

This project is licensed under the MIT License.
