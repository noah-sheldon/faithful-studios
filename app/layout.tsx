import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "@/app/components/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "sonner";
import { Providers } from "./providers"; // ✅ Import

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Faithful Studios",
  description: "Create and share your content with Faithful Studios",
  icons: {
    icon: "/favicon.ico",
  },
};

function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Floating Sidebar Trigger */}
        <SidebarTrigger className="absolute top-4 left-2 z-40 bg-white rounded-md shadow p-2" />

        {/* Main scrollable content */}
        <main className="flex-1 overflow-y-auto px-6 py-6">{children}</main>
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <SidebarLayout>{children}</SidebarLayout>
          <Toaster richColors position="top-right" closeButton />
        </Providers>
      </body>
    </html>
  );
}
