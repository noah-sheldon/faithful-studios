"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { LayoutDashboard, Video, ImageIcon, Package } from "lucide-react";

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link
          href="/"
          className="flex items-center justify-center px-4 py-3 group-data-[state=collapsed]:justify-center"
        >
          <Image
            src="/logo.png"
            alt="Faithful Studios Logo"
            width={28}
            height={28}
            className="min-w-[28px] min-h-[28px]"
          />
          <span className="ml-2 font-semibold text-lg text-sidebar-foreground group-data-[state=collapsed]:hidden">
            Faithful Studios
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[state=collapsed]:hidden">
            Content
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Dashboard Item */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/" className="flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    <span className="group-data-[state=collapsed]:hidden">
                      Content Studio
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Short Form */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/short-form" className="flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    <span className="group-data-[state=collapsed]:hidden">
                      Create Short Form Content
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Posters */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/posters" className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    <span className="group-data-[state=collapsed]:hidden">
                      Create Posters
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Product Showcase */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href="/product-showcase"
                    className="flex items-center gap-2"
                  >
                    <Package className="w-4 h-4" />
                    <span className="group-data-[state=collapsed]:hidden">
                      Create Product Showcase
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
