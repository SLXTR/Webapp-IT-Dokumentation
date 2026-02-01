import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "IT-Dokumentation",
  description: "Notion-like IT documentation workspace"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
