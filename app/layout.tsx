import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ModalProvider } from "../providers/Modalprovider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./components/layout/Sidebar";
import AppTopbar from "./components/layout/Topbar";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Life Tracker",
  description: "Track everything. Improve everything.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Life Tracker",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "contain",
  themeColor: "#000000",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // shadcn persists the open/closed state in a cookie
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full dark">
        <TooltipProvider>

        <ModalProvider>
          <SidebarProvider defaultOpen={defaultOpen} >
            <AppSidebar />
            <SidebarInset>
              <AppTopbar />
              {children}
            </SidebarInset>
          </SidebarProvider>
        </ModalProvider>
        </TooltipProvider>

      </body>
    </html>
  );
}