import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Pulseboard Dashboard",
  description: "Clean finance analytics dashboard with drag-and-drop widgets and live insights.",
  icons: {
    icon: "/branding/pulseboard.svg",
    apple: "/branding/pulseboard.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
