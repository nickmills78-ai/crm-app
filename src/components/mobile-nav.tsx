"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useState } from "react";

import { signOut } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type MobileNavProps = {
  items: Array<{
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }>;
  userEmail?: string | null;
};

export function MobileNav({ items, userEmail }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger
        render={
          <Button className="lg:hidden" size="icon" variant="outline">
            <Menu className="size-4" />
            <span className="sr-only">Open navigation</span>
          </Button>
        }
      />
      <SheetContent className="w-full max-w-xs" side="left">
        <SheetHeader>
          <SheetTitle>Studio CRM</SheetTitle>
          <SheetDescription>Navigate your workspace.</SheetDescription>
        </SheetHeader>
        <nav className="mt-6 flex flex-col gap-1">
          {items.map((item) => (
            <Link
              key={item.href}
              className="hover:bg-muted flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium"
              href={item.href}
              onClick={() => setOpen(false)}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto space-y-3 border-t pt-6">
          {userEmail ? (
            <p className="text-muted-foreground truncate text-sm">{userEmail}</p>
          ) : null}
          <form action={signOut}>
            <Button className="w-full" type="submit" variant="outline">
              Sign out
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
