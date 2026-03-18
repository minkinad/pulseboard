import type { Metadata } from "next";

import "./globals.css";

import { Providers } from "@/components/app/providers";

const themeScript = `
  (function () {
    try {
      var persisted = localStorage.getItem('pulseboard-dashboard');
      var theme = 'light';
      if (persisted) {
        var parsed = JSON.parse(persisted);
        theme = parsed && parsed.state && parsed.state.theme ? parsed.state.theme : theme;
      }
      document.documentElement.classList.toggle('dark', theme === 'dark');
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
    } catch (error) {
      document.documentElement.classList.remove('dark');
      document.documentElement.dataset.theme = 'light';
      document.documentElement.style.colorScheme = 'light';
    }
  })();
`;

export const metadata: Metadata = {
  title: "Pulseboard Dashboard",
  description: "Interactive analytics dashboard with drag-and-drop widgets and live financial insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
