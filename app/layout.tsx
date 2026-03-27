import type { Metadata } from "next";
import { Oxanium, Noto_Sans_Khmer } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const oxanium = Oxanium({
  subsets: ["latin"],
  variable: "--font-oxanium",
  weight: ["300", "400", "500", "600", "700"],
});

const notoSansKhmer = Noto_Sans_Khmer({
  subsets: ["khmer"],
  variable: "--font-khmer",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ARIA Dashboard — AngkorGreen",
  description: "Angkor Green AI Assistant Admin Dashboard",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${oxanium.variable} ${notoSansKhmer.variable}`}>
      <body className="bg-[#F0F4F8] font-oxanium antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
