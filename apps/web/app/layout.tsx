import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "余生电量",
  description: "用 calm 的方式看见余生时间"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
