import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "@/app/components/AppSidebar";
import { Toaster } from "sonner";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

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
};

// A wrapper to position trigger alongside sidebar and make it responsive to collapse
function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-100vh bg-gray-50 w-screen">
      <AppSidebar />

      {/* SidebarTrigger sits next to sidebar, shifts based on collapse */}
      <div className="relative">
        <SidebarTrigger className="absolute top-4 left-2 z-40 bg-white rounded-md shadow p-2" />
      </div>

      <main className="flex-1">{children}</main>
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
        <SidebarProvider>
          <SidebarLayout>{children}</SidebarLayout>
          <Toaster richColors position="top-right" closeButton />
        </SidebarProvider>
      </body>
    </html>
  );
}
