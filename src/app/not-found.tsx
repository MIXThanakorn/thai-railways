import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#F5F7F9] text-center">
      <h2 className="text-2xl font-bold text-slate-800 mb-2">ไม่พบหน้าที่ค้นหา (Page Not Found)</h2>
      <p className="text-slate-600 mb-4 text-sm">หน้าที่คุณต้องการไม่มีอยู่ในระบบ</p>
      <Link
        href="/"
        className="px-4 py-2 bg-[#17202A] text-white rounded-lg text-sm font-semibold hover:bg-slate-800"
      >
        กลับหน้าหลัก (Home)
      </Link>
    </div>
  );
}
