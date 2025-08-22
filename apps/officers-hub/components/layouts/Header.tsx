"use client";

import { UserButton, useUser } from "@clerk/nextjs";

export function Header() {
  const { user } = useUser();
  
  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold">CS Club Management</h1>
      </div>
      
      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-muted-foreground capitalize">
                {(user.publicMetadata?.role as string) || "officer"}
              </p>
            </div>
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8"
                }
              }}
            />
          </div>
        )}
      </div>
    </header>
  );
} 