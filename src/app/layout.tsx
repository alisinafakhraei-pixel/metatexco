import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const vazirmatn = Vazirmatn({
  variable: "--font-sans",
  subsets: ["arabic", "latin"],
});

export const metadata: Metadata = {
  title: "متاتکسکو",
  description: "بازار مستقیم صنعت نساجی ایران",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0b6b74",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable} h-full`}>
      <body className="min-h-full bg-neutral-200 antialiased">
        <div className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col bg-background shadow-sm">
          {children}
        </div>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
