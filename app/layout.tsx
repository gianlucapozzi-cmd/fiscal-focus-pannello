import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Meta Ads Dashboard",
  description: "Monitoraggio campagne pubblicitarie",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
