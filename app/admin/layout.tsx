import type { Metadata } from "next";
import { Familjen_Grotesk } from "next/font/google";
import "../globals.css";

const familjenGrotesk = Familjen_Grotesk({ variable: "--font-familjen", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "أتيليه خاريتا — لوحة التحكم",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${familjenGrotesk.variable} h-full antialiased`}>
      <body className="min-h-full bg-neutral-50 font-body text-neutral-900">{children}</body>
    </html>
  );
}
