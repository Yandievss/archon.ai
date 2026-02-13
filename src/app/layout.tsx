import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ArchonPro - Business Suite Dashboard",
  description: "ArchonPro is een krachtige business suite voor het beheren van bedrijven, contacten, deals, offertes en projecten met AI-integratie.",
  keywords: ["ArchonPro", "Business Suite", "CRM", "Project Management", "Deals", "Offertes", "AI Assistant", "Dashboard"],
  authors: [{ name: "ArchonPro Team" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "ArchonPro - Business Suite Dashboard",
    description: "Krachtige business suite voor bedrijfsbeheer met AI-integratie",
    url: "https://archonpro.app",
    siteName: "ArchonPro",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ArchonPro - Business Suite Dashboard",
    description: "Krachtige business suite voor bedrijfsbeheer met AI-integratie",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl-NL" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <a href="#main-content" className="skip-to-content">Ga naar inhoud</a>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <main id="main-content" tabIndex={-1} className="focus:outline-none">
            {children}
          </main>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
