"use client";

import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Calendar, 
  Megaphone, 
  Users,
  LogOut
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { useClerk } from "@clerk/nextjs";

const navigationItems = [
  {
    title: "Dashboard",
    href: "/officers-hub",
    icon: Home,
  },
  {
    title: "Events",
    href: "/officers-hub/events",
    icon: Calendar,
  },
  {
    title: "Announcements",
    href: "/officers-hub/announcements",
    icon: Megaphone,
  },
  {
    title: "Officers",
    href: "/officers-hub/officers",
    icon: Users,
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { signOut } = useClerk();

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className={cn("flex h-full w-64 flex-col bg-muted/20", className)}>
      <div className="flex h-16 items-center border-b px-6">
        <h2 className="text-lg font-semibold">Officers Hub</h2>
      </div>
      
      <nav className="flex-1 space-y-1 px-4 py-6">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                isActive 
                  ? "bg-accent text-accent-foreground" 
                  : "text-muted-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
} 