"use client"

import * as React from "react"
import { useUser } from "@clerk/nextjs"
import {
  Home,
  Calendar,
  Megaphone,
  Users,
  GraduationCap,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@club-website/ui/components/sidebar"

import { NavUser } from "./nav-user"
import { useNavigation } from "./navigation/NavigationContext"

// CS Club navigation data
const navItems = [
  {
    title: "Dashboard",
    view: "dashboard" as const,
    icon: Home,
  },
  {
    title: "Events",
    view: "events" as const,
    icon: Calendar,
  },
  {
    title: "Announcements",
    view: "announcements" as const,
    icon: Megaphone,
  },
  {
    title: "Officers",
    view: "officers" as const,
    icon: Users,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser()
  const { currentView, setView } = useNavigation()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
            <div className="flex items-center gap-2 px-2 py-1">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg mr-3">
                  <img
                    src="/logo.png"
                    alt="CS Club Hub"
                    width={32}
                    height={32}
                    className="rounded-lg"
                  />
              </div>
              <span className="font-semibold">CS Club Hub</span>
            </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.view}>
                <SidebarMenuButton 
                  onClick={() => setView(item.view)}
                  isActive={currentView.main === item.view}
                  tooltip={item.title}
                >
                  <item.icon />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <NavUser/>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
